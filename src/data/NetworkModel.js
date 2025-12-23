
import { MRT_LINES } from './mrt-routes.js';
import MRT_GEOJSON from './singapore-mrt-fixed.json';

// NetworkModel: Singleton handling data loading and geometry alignment
class NetworkModelService {
    constructor() {
        this.lines = {}; // Key: lineCode, Value: { ...params, detailedPath: [], alignedStations: [] }
        this.initialized = false;
    }

    initialize() {
        if (this.initialized) return;

        Object.entries(MRT_LINES).forEach(([lineCode, lineConfig]) => {
            // 1. Get raw geometry
            // Support multiple features (e.g., SK has two loops as separate features)
            const features = MRT_GEOJSON.features.filter(f => f.properties.code === lineCode);

            let detailedPath = [];

            if (features.length > 0) {
                // Collect and Stitch segments
                const rawSegments = [];
                features.forEach(feature => {
                    if (feature.geometry.type === 'LineString') {
                        rawSegments.push(feature.geometry.coordinates);
                    } else if (feature.geometry.type === 'MultiLineString') {
                        feature.geometry.coordinates.forEach(seg => rawSegments.push(seg));
                    }
                });

                detailedPath = this.stitchSegments(rawSegments);
            }

            // 2. Align Stations (Snap to Vertex)
            // Clone stations to avoid mutating original config permanently (optional, but safer)
            const alignedStations = lineConfig.stations.map(station => {
                const snapped = this.snapToVertex(station, detailedPath);
                return {
                    ...station,
                    lat: snapped[1],
                    lng: snapped[0],
                    originalLat: station.lat,
                    originalLng: station.lng
                };
            });

            this.lines[lineCode] = {
                ...lineConfig,
                stations: alignedStations, // Override with aligned
                detailedPath: detailedPath
            };
        });

        this.initialized = true;
        console.log('NetworkModel initialized. Stations aligned to track geometry.');
    }

    // Snap station (lat/lng obj) to closest vertex in path (array of [lng, lat])
    snapToVertex(station, path) {
        if (!path || path.length === 0) return [station.lng, station.lat];

        let minD = Infinity;
        let bestP = [station.lng, station.lat];

        // Simple Euclidean loop (fast enough for initialization)
        const sLng = station.lng;
        const sLat = station.lat;

        // Optimization: Use the snapping logic similar to RouteInterpolator/align-stations
        // Just find closest vertex.
        for (let i = 0; i < path.length; i++) {
            const p = path[i];
            const d = Math.pow(p[0] - sLng, 2) + Math.pow(p[1] - sLat, 2);
            if (d < minD) {
                minD = d;
                bestP = p;
            }
        }

        // Threshold check? 
        // If > 500m off, maybe don't snap? 
        // 0.005 deg squared.
        if (minD > 0.000025) { // Approx 500m
            console.warn(`Station ${station.code} is far from track (${Math.sqrt(minD).toFixed(5)} deg). Snapping anyway.`);
        }

        return bestP;
    }

    getLine(code) {
        if (!this.initialized) this.initialize();
        return this.lines[code];
    }

    getAllLines() {
        if (!this.initialized) this.initialize();
        return this.lines;
    }

    // Helper for MapView to get GeoJSON formatted data
    getRouteGeoJSON() {
        if (!this.initialized) this.initialize();
        // Return original or constructed?
        // Better to return constructed from detailedPath to match simulation exactly
        const features = Object.entries(this.lines).map(([code, line]) => {
            if (line.detailedPath && line.detailedPath.length > 0) {
                return {
                    type: 'Feature',
                    properties: { code: code, color: line.color, name: line.name },
                    geometry: {
                        type: 'LineString',
                        coordinates: line.detailedPath
                    }
                };
            }
            return null;
        }).filter(f => f);

        return {
            type: 'FeatureCollection',
            features: features
        };
    }
    // Intelligent Segment Stitching
    // Greedy approach: Start with a segment, find the closest endpoint of another segment, attach, repeat.
    stitchSegments(segments) {
        if (!segments || segments.length === 0) return [];
        if (segments.length === 1) return segments[0];

        const pool = [...segments]; // Copy of segments to consume
        const orderedPath = [];

        // Heuristic: Start with the longest segment? Or just the first one?
        // Let's start with the first one in the list as the 'anchor'.
        let currentSegment = pool.shift();
        orderedPath.push(...currentSegment);

        // Keep finding the next segment that connects to the LAST point of orderedPath
        while (pool.length > 0) {
            const tail = orderedPath[orderedPath.length - 1];

            let bestIdx = -1;
            let bestDist = Infinity;
            let shouldReverse = false;

            // Find closest candidate
            for (let i = 0; i < pool.length; i++) {
                const seg = pool[i];
                const start = seg[0];
                const end = seg[seg.length - 1];

                // Dist from tail to start
                const dStart = this.getDistSq(tail, start);
                // Dist from tail to end (maybe segment is reversed)
                const dEnd = this.getDistSq(tail, end);

                if (dStart < bestDist) {
                    bestDist = dStart;
                    bestIdx = i;
                    shouldReverse = false;
                }
                if (dEnd < bestDist) {
                    bestDist = dEnd;
                    bestIdx = i;
                    shouldReverse = true;
                }
            }

            // Connection Threshold (approx 50m?) 
            // If the best match is too far, it might be a disjoint section (like Changi Line vs EWL Main if they were one feature)
            // But here we just want to best-effort stitch.
            if (bestIdx !== -1) {
                const bestSeg = pool[bestIdx];
                // Remove from pool
                pool.splice(bestIdx, 1);

                // If shouldReverse, we reverse the segment before appending
                const segmentToAdd = shouldReverse ? [...bestSeg].reverse() : bestSeg;

                // If distance is > 0 but small, we just append.
                // If distance is huge, we might be "jumping" (teleporting). 
                // But for detailed path, we just push the points. 
                // Ideally we should insert a "gap" if they are disconnected, but our array is a single LineString.
                // We'll trust the pool logic to find neighbors.
                orderedPath.push(...segmentToAdd);
            } else {
                // Should not happen if pool > 0, unless logical error
                break;
            }
        }

        return orderedPath;
    }

    getDistSq(p1, p2) {
        return Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2);
    }
}

export const NetworkModel = new NetworkModelService();
