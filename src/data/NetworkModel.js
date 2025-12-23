
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

            // Determine the sequence of stations to visit
            // If the line has a defined loopPath (like LRTs), use that sequence.
            let stationsForPath = lineConfig.stations;
            if (lineConfig.loopPath && Array.isArray(lineConfig.loopPath)) {
                stationsForPath = lineConfig.loopPath.map(code =>
                    lineConfig.stations.find(s => s.code === code)
                ).filter(s => s); // Filter out any missing codes
            }

            // 1. Get Path Geometry
            // Try to find high-res track data from GeoJSON
            // Support multiple features (e.g., SK has two loops as separate features)
            const features = MRT_GEOJSON.features.filter(f =>
                f.properties.line === lineCode || f.properties.name === lineConfig.name
            );

            let detailedPath = [];

            if (features.length > 0) {
                // Determine path by tracing station-to-station on the graph
                // This ensures we follow the logical order and ignore disconnected spurs (like Marina Bay on CC line if not in station list)
                detailedPath = this.generateDetailedPath(lineCode, stationsForPath, features);
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
    // -------------------------------------------------------------------------
    // Graph-Based Path Tracing Logic
    // -------------------------------------------------------------------------

    generateDetailedPath(lineCode, stations, features) {
        // 1. Build the graph from features
        const graph = this.buildGraph(features);

        // 2. Trace path between sequential stations
        let completePath = [];

        // Add start
        // We will refine this by snapping to graph
        // If graph is empty, return empty
        if (Object.keys(graph.nodes).length === 0) return [];

        for (let i = 0; i < stations.length - 1; i++) {
            const startStation = stations[i];
            const endStation = stations[i + 1];

            const startNode = this.findClosestNode(graph, [startStation.lng, startStation.lat]);
            const endNode = this.findClosestNode(graph, [endStation.lng, endStation.lat]);

            if (!startNode || !endNode) {
                console.warn(`Could not snap stations ${startStation.code} or ${endStation.code} to track graph.`);
                // Fallback: Straight line
                completePath.push([startStation.lng, startStation.lat]);
                completePath.push([endStation.lng, endStation.lat]);
                continue;
            }

            // Pathfind
            const path = this.findShortestPath(graph, startNode, endNode);

            if (path) {
                // If it's not the very first segment, we might duplicate the join point. 
                // Filter out the first point if it matches the last point of completePath
                if (completePath.length > 0) {
                    const last = completePath[completePath.length - 1];
                    const first = path[0];
                    if (this.isSamePoint(last, first)) {
                        path.shift();
                    }
                }
                completePath.push(...path);
            } else {
                console.warn(`No track connection found between ${startStation.code} and ${endStation.code}. Using straight line.`);
                // Fallback: Straight line
                completePath.push([startStation.lng, startStation.lat]);
                completePath.push([endStation.lng, endStation.lat]);
            }
        }

        return completePath;
    }

    buildGraph(features) {
        const nodes = {}; // Key -> Coords
        const nodesSpatial = []; // Array of { key, coords } for linear search (fast enough for small N)
        const edges = {}; // Adjacency list: key -> [{ to: key, dist: number, path: [] }]

        // Fuzzy Merging Threshold (~5 meters)
        // 1 degree lat approx 111km. 5m is 0.000045 deg.
        const MERGE_THRESHOLD = 0.00005;

        const findMergedNode = (coords) => {
            // Check if any existing node is close enough
            for (const n of nodesSpatial) {
                const distSq = Math.pow(n.coords[0] - coords[0], 2) + Math.pow(n.coords[1] - coords[1], 2);
                if (distSq < MERGE_THRESHOLD * MERGE_THRESHOLD) {
                    return n.key;
                }
            }
            return null;
        };

        const addNode = (coords) => {
            // Try to find existing close node first
            const existingKey = findMergedNode(coords);
            if (existingKey) return existingKey;

            // Else create new
            const key = coords.map(c => c.toFixed(6)).join(',');
            nodes[key] = coords;
            nodesSpatial.push({ key, coords });

            if (!edges[key]) edges[key] = [];
            return key;
        };

        const addEdge = (p1, p2) => {
            const k1 = addNode(p1);
            const k2 = addNode(p2);
            if (k1 === k2) return; // Self-loop after merge

            const dist = Math.hypot(p1[0] - p2[0], p1[1] - p2[1]);

            // Undirected graph
            edges[k1].push({ to: k2, dist: dist });
            edges[k2].push({ to: k1, dist: dist });
        };

        features.forEach(feature => {
            const processLineString = (coords) => {
                for (let i = 0; i < coords.length - 1; i++) {
                    addEdge(coords[i], coords[i + 1]);
                }
            };

            if (feature.geometry.type === 'LineString') {
                processLineString(feature.geometry.coordinates);
            } else if (feature.geometry.type === 'MultiLineString') {
                feature.geometry.coordinates.forEach(processLineString);
            }
        });

        return { nodes, edges };
    }

    findClosestNode(graph, coords) {
        let minD = Infinity;
        let closestKey = null;

        // Optimization: limit search? For MRT, exhaustive search on ~5000 nodes is fine (instant).
        for (const key in graph.nodes) {
            const node = graph.nodes[key];
            const d = Math.pow(node[0] - coords[0], 2) + Math.pow(node[1] - coords[1], 2);
            if (d < minD) {
                minD = d;
                closestKey = key;
            }
        }

        // Threshold check (approx 500m)
        if (minD > 0.000025) return null;

        return closestKey;
    }

    findShortestPath(graph, startKey, endKey) {
        if (startKey === endKey) return [graph.nodes[startKey]];

        // Dijkstra
        const distances = {};
        const previous = {};
        const pq = new Set(); // Simple priority queue substitute

        for (const key in graph.nodes) {
            distances[key] = Infinity;
            pq.add(key);
        }
        distances[startKey] = 0;

        while (pq.size > 0) {
            // Get min dist node
            let u = null;
            let minVal = Infinity;
            for (const node of pq) {
                if (distances[node] < minVal) {
                    minVal = distances[node];
                    u = node;
                }
            }

            if (u === endKey) break; // Found target
            if (minVal === Infinity) break; // unreachable

            pq.delete(u);

            const neighbors = graph.edges[u] || [];
            for (const edge of neighbors) {
                const alt = distances[u] + edge.dist;
                if (alt < distances[edge.to]) {
                    distances[edge.to] = alt;
                    previous[edge.to] = u;
                }
            }
        }

        // Reconstruct path
        if (distances[endKey] === Infinity) return null;

        const path = [];
        let curr = endKey;
        while (curr) {
            path.unshift(graph.nodes[curr]);
            curr = previous[curr];
        }
        return path;
    }

    isSamePoint(p1, p2) {
        return Math.abs(p1[0] - p2[0]) < 1e-9 && Math.abs(p1[1] - p2[1]) < 1e-9;
    }

    getDistSq(p1, p2) {
        return Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2);
    }
}

export const NetworkModel = new NetworkModelService();
