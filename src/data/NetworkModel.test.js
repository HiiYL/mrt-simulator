
import { describe, it, expect } from 'vitest';
import { NetworkModel } from './NetworkModel';

describe('NetworkModel', () => {
    describe('generateDetailedPath (Graph Tracing)', () => {

        // Helper to mock stations
        const createStation = (code, lng, lat) => ({ code, lng, lat });

        // Helper to create line string feature
        const createFeature = (coords) => ({
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: coords
            },
            properties: {}
        });

        it('should return path between two connected stations', () => {
            const stations = [
                createStation('A', 0, 0),
                createStation('B', 10, 0)
            ];
            const features = [
                createFeature([[0, 0], [5, 0], [10, 0]])
            ];

            const path = NetworkModel.generateDetailedPath('TEST', stations, features);

            /* 
               Graph: (0,0) -- (5,0) -- (10,0)
               Path A->B: (0,0), (5,0), (10,0)
            */
            expect(path).toHaveLength(3);
            expect(path[0]).toEqual([0, 0]);
            expect(path[2]).toEqual([10, 0]);
        });

        it('should handle "Y" fork correctly (A->C vs A->B)', () => {
            //     B (5,5)
            //    /
            // A (0,0) -- C (5,0)

            const stations = [
                createStation('A', 0, 0),
                createStation('C', 5, 0) // We want to go to C, not B
            ];

            const features = [
                createFeature([[0, 0], [5, 5]]), // A -> B
                createFeature([[0, 0], [5, 0]])  // A -> C
            ];

            const path = NetworkModel.generateDetailedPath('TEST', stations, features);

            // Should strictly follow A -> C segment
            // Graph has nodes: 0,0; 5,5; 5,0.
            // A snaps to 0,0. C snaps to 5,0.
            // Shortest path is direct edge.

            expect(path).toHaveLength(2);
            expect(path[0]).toEqual([0, 0]);
            expect(path[1]).toEqual([5, 0]);
            // Should NOT contain 5,5
            expect(path).not.toContainEqual([5, 5]);
        });

        it('should handle Loop line logic (A->B->C->A)', () => {
            // A(0,0) -- B(5,0) -- C(5,5) -- A(0,0)
            const stations = [
                createStation('A', 0, 0),
                createStation('B', 5, 0),
                createStation('C', 5, 5), // Include C to force the full loop path
                createStation('A2', 0, 0) // Loop back
            ];

            const features = [
                createFeature([[0, 0], [5, 0]]), // A-B
                createFeature([[5, 0], [5, 5]]), // B-C
                createFeature([[5, 5], [0, 0]])  // C-A
            ];

            const path = NetworkModel.generateDetailedPath('LOOP', stations, features);

            // Path should be A->B->C->A
            // A->B: 0,0 - 5,0
            // B->C: 5,0 - 5,5
            // C->A: 5,5 - 0,0
            // Total should be at least 4 points (duplicates filtered?)

            expect(path.length).toBeGreaterThanOrEqual(4);
            expect(path[0]).toEqual([0, 0]);
            const last = path[path.length - 1];
            expect(last).toEqual([0, 0]);
        });

        it('should fallback to straight line if unconnected', () => {
            const stations = [
                createStation('A', 0, 0),
                createStation('B', 10, 0)
            ];
            // Connected graph doesn's reach valid target
            const features = [
                createFeature([[0, 0], [0, 5]]) // Only goes up from A
            ];
            // B is at 10,0. Too far to snap to 0,0 or 0,5.

            // Note: findClosestNode has threshold (0.005 deg ~ 500m).
            // 10 units is huge. So startNode=A_node, endNode=null.
            // Or both snap if 10 is considered close (it isn't).
            // Actually, A snaps to 0,0. B finds nothing.

            const path = NetworkModel.generateDetailedPath('broken', stations, features);

            // Should be straight line A->B
            expect(path).toHaveLength(2);
            expect(path[0]).toEqual([0, 0]);
            expect(path[1]).toEqual([10, 0]);
        });
        it('should fuzzy merge nodes within threshold', () => {
            // Gap of 0.00001 degrees (~1 meter) should be bridged
            const stations = [
                createStation('A', 0, 0),
                createStation('C', 0.0002, 0)
            ];

            const features = [
                createFeature([[0, 0], [0.0001, 0]]), // Seg 1 ends at 0.0001
                createFeature([[0.00011, 0], [0.0002, 0]]) // Seg 2 starts at 0.00011 (gap of 0.00001)
            ];

            const path = NetworkModel.generateDetailedPath('FUZZY', stations, features);

            // Path should be continuous despite the gap
            // The graph builder should have treated [0.0001, 0] and [0.00011, 0] as the SAME node.

            expect(path.length).toBeGreaterThanOrEqual(2);
            // It should be able to find a path. If not merged, path would be straight line fallback (2 points).
            // If merged, it follows the points: 0,0 -> 0.0001,0 -> (jump) -> 0.00011,0 -> 0.0002,0

            // Wait, if merged, the edge list is:
            // Node A (0,0) -- Node B (merged ~0.0001) -- Node C (0.0002)
            // Path: A -> B -> C
            // Coordinates depending on which "version" of the merged node is kept.

            // Let's just check that it didn't fallback to straight line (which would be len 2 for start/end only, 
            // OR if the straight line logic pushes just start/end).
            // The detailed path should include intermediate points.

            // With fallback: [0,0], [0.0002,0] -> Length 2.
            // With success: [0,0], [merged], [0.0002,0] -> Length 3.
            expect(path.length).toBeGreaterThan(2);
        });
    });
});
