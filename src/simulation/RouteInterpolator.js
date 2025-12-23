export class RouteInterpolator {
    constructor(stations, detailedPathCoords = null) {
        this.stations = stations;
        this.detailedPath = detailedPathCoords;
        // Store ARRAY of indices for each station (handling loops where station appears multiple times)
        // Structure: [ [ {index: 0, dist: 0}, {index: 242, dist: 0} ], ... ]
        this.stationIndices = [];

        if (this.detailedPath) {
            this.mapStationsToDetailedPath();
        }
    }

    getStationCount() {
        return this.stations.length;
    }

    // Map each station to ALL indices on the detailed path that are close
    mapStationsToDetailedPath() {
        // approx 200m radius threshold (lat/lng degrees)
        const SNAP_THRESHOLD_SQ = Math.pow(0.002, 2);

        this.stationIndices = this.stations.map(station => {
            const indices = [];
            // Find ALL indices within threshold
            for (let i = 0; i < this.detailedPath.length; i++) {
                const p = this.detailedPath[i];
                const d = Math.pow(p[0] - station[0], 2) + Math.pow(p[1] - station[1], 2);
                if (d < SNAP_THRESHOLD_SQ) {
                    indices.push({ index: i, dist: d });
                }
            }

            if (indices.length === 0) return [];

            // Filter to remove sequential duplicates (keep best of local cluster)
            const distinctIndices = [];
            if (indices.length > 0) {
                let currentGroup = [indices[0]];

                for (let k = 1; k < indices.length; k++) {
                    if (indices[k].index === indices[k - 1].index + 1) {
                        currentGroup.push(indices[k]);
                    } else {
                        // End of group
                        distinctIndices.push(this.getBestIndex(currentGroup));
                        currentGroup = [indices[k]];
                    }
                }
                distinctIndices.push(this.getBestIndex(currentGroup));
            }

            return distinctIndices.map(item => item.index); // Store just indices
        });
    }

    getBestIndex(group) {
        // Return item with min dist
        return group.reduce((prev, curr) => prev.dist < curr.dist ? prev : curr);
    }

    // Get position at a specific t (0 to 1) between station i and j
    getPositionBetweenStations(i, j, t, reverse = false) {
        // If no detailed path, fallback to straight line
        if (!this.detailedPath || !this.stationIndices[i] || !this.stationIndices[j] || this.stationIndices[i].length === 0) {
            return this.getStraightLinePosition(i, j, t);
        }

        const candidatesA = this.stationIndices[i]; // Array of indices
        const candidatesB = this.stationIndices[j]; // Array of indices

        if (candidatesA.length === 0 || candidatesB.length === 0) {
            return this.getStraightLinePosition(i, j, t);
        }

        // Find Best Pair (u, v)
        // Criteria: Minimize path distance |v - u|.
        // Tie-breaker: STRONGLY Prefer Forward (v > u) to follow loop geometry.

        let bestPair = null;
        let minScore = Infinity;

        for (const u of candidatesA) {
            for (const v of candidatesB) {
                const dist = Math.abs(v - u);
                // Score includes distance + bias
                // Lower score is better.
                // Penalty for Backward: +1000 units.
                // This ensures we always pick Forward if available, unless Backward is massively shorter.
                const isForward = v >= u;
                const score = dist + (isForward ? 0 : 1000);

                if (score < minScore) {
                    minScore = score;
                    bestPair = { u, v };
                }
            }
        }

        const { u: startIdx, v: endIdx } = bestPair;

        let path = [];

        // Extract subpath from LineString
        if (startIdx <= endIdx) {
            path = this.detailedPath.slice(startIdx, endIdx + 1);
        } else {
            // Traverse backwards through the geometry array
            path = this.detailedPath.slice(endIdx, startIdx + 1).reverse();
        }

        // Handle edge case: Start and End are same point (distance 0)
        if (path.length < 2) {
            const p = path[0] || this.stations[i];
            return { lng: p[0], lat: p[1], bearing: 0 };
        }

        // Interpolate
        return this.interpolateAlongPath(path, t);
    }

    getStraightLinePosition(i, j, t) {
        const p1 = this.stations[i];
        const p2 = this.stations[j];
        const lng = p1[0] + (p2[0] - p1[0]) * t;
        const lat = p1[1] + (p2[1] - p1[1]) * t;
        const bearing = this.getBearing(p1, p2);
        return { lng, lat, bearing };
    }

    interpolateAlongPath(path, t) {
        // 1. Calculate total length of this segment
        const dists = [];
        let totalDist = 0;
        for (let k = 0; k < path.length - 1; k++) {
            const d = this.getDistance(path[k], path[k + 1]);
            dists.push(d);
            totalDist += d;
        }

        if (totalDist === 0) return { lng: path[0][0], lat: path[0][1], bearing: 0 };

        // 2. Find target distance
        const targetDist = totalDist * t;

        // 3. Walk to find specific segment
        let currentDist = 0;
        for (let k = 0; k < dists.length; k++) {
            if (currentDist + dists[k] >= targetDist) {
                // Found segment k
                const segmentProgress = (targetDist - currentDist) / dists[k];
                const p1 = path[k];
                const p2 = path[k + 1];

                const lng = p1[0] + (p2[0] - p1[0]) * segmentProgress;
                const lat = p1[1] + (p2[1] - p1[1]) * segmentProgress;

                // Bearing of this micro-segment
                const bearing = this.getBearing(p1, p2);

                return { lng, lat, bearing };
            }
            currentDist += dists[k];
        }

        // Fallback (t=1)
        const end = path[path.length - 1];
        const lastP = path.length > 1 ? path[path.length - 2] : end;
        return { lng: end[0], lat: end[1], bearing: this.getBearing(lastP, end) };
    }

    getDistance(p1, p2) {
        return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
    }

    getBearing(p1, p2) {
        const toRad = degree => degree * Math.PI / 180;
        const toDeg = radian => radian * 180 / Math.PI;

        const lng1 = toRad(p1[0]);
        const lat1 = toRad(p1[1]);
        const lng2 = toRad(p2[0]);
        const lat2 = toRad(p2[1]);

        const y = Math.sin(lng2 - lng1) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);
        const bearing = toDeg(Math.atan2(y, x));
        return (bearing + 360) % 360;
    }

    getBearingAtStation(stationIndex, reverse) {
        return 0;
    }
}
