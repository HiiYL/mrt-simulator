
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
            const feature = MRT_GEOJSON.features.find(f => f.properties.code === lineCode);
            let detailedPath = [];

            if (feature) {
                if (feature.geometry.type === 'LineString') {
                    detailedPath = feature.geometry.coordinates;
                } else if (feature.geometry.type === 'MultiLineString') {
                    // Pick longest segment
                    detailedPath = feature.geometry.coordinates.reduce((prev, curr) => curr.length > prev.length ? curr : prev, []);
                }
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
}

export const NetworkModel = new NetworkModelService();
