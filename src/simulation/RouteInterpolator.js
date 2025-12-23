export class RouteInterpolator {
    constructor(stations, detailedPathCoords = null) {
        this.stations = stations;
        this.detailedPath = detailedPathCoords;
        this.stationIndices = [];

        if (this.detailedPath) {
            this.mapStationsToDetailedPath();
        }
    }

    getStationCount() {
        return this.stations.length;
    }

    // Find the closest point on the detailed path for each station
    mapStationsToDetailedPath() {
        this.stationIndices = this.stations.map(station => {
            let minDist = Infinity;
            let closestIndex = -1;

            for (let i = 0; i < this.detailedPath.length; i++) {
                const p = this.detailedPath[i];
                // Simple Euclidean distance squared is enough for comparison
                const d = Math.pow(p[0] - station[0], 2) + Math.pow(p[1] - station[1], 2);
                if (d < minDist) {
                    minDist = d;
                    closestIndex = i;
                }
            }
            return closestIndex;
        });
    }

    // Get position at a specific t (0 to 1) between station i and j
    getPositionBetweenStations(i, j, t, reverse = false) {
        // If no detailed path, fallback to straight line
        if (!this.detailedPath || this.stationIndices.length === 0) {
            return this.getStraightLinePosition(i, j, t);
        }

        const idxA = this.stationIndices[i];
        const idxB = this.stationIndices[j];

        // Safety check
        if (idxA === -1 || idxB === -1) {
            return this.getStraightLinePosition(i, j, t);
        }

        let path = [];

        // Determine range and direction
        const startIdx = idxA;
        const endIdx = idxB;

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
        if (!this.detailedPath || this.stationIndices.length === 0) return 0;

        const idx = this.stationIndices[stationIndex];
        if (idx === -1) return 0;

        const cnt = this.detailedPath.length;

        // Determine local tangent on geometry
        let pPrev, pNext;

        if (idx > 0) pPrev = this.detailedPath[idx - 1];
        else pPrev = this.detailedPath[idx]; // Start point

        if (idx < cnt - 1) pNext = this.detailedPath[idx + 1];
        else pNext = this.detailedPath[idx]; // End point

        if (idx === 0) pNext = this.detailedPath[1];
        if (idx === cnt - 1) pPrev = this.detailedPath[cnt - 2];

        let bearing = this.getBearing(pPrev, pNext);

        // Check direction relative to stations
        const ascending = this.stationIndices[this.stationIndices.length - 1] > this.stationIndices[0];

        if (!ascending) {
            bearing = (bearing + 180) % 360;
        }

        if (reverse) {
            bearing = (bearing + 180) % 360;
        }

        return bearing;
    }
}
