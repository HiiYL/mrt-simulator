// Route Interpolator - Calculates train positions along route polylines
import * as turf from '@turf/turf';

export class RouteInterpolator {
    constructor(coordinates) {
        // coordinates: [[lng, lat], [lng, lat], ...]
        this.coordinates = coordinates;
        this.lineString = turf.lineString(coordinates);
        this.totalLength = turf.length(this.lineString, { units: 'kilometers' });

        // Pre-calculate segment distances for faster lookup
        this.segmentDistances = this.calculateSegmentDistances();
    }

    calculateSegmentDistances() {
        const distances = [0];
        let cumulative = 0;

        for (let i = 1; i < this.coordinates.length; i++) {
            const from = turf.point(this.coordinates[i - 1]);
            const to = turf.point(this.coordinates[i]);
            const dist = turf.distance(from, to, { units: 'kilometers' });
            cumulative += dist;
            distances.push(cumulative);
        }

        return distances;
    }

    // Get position at a fraction along the route (0 to 1)
    getPositionAtFraction(fraction) {
        // Clamp fraction to valid range
        fraction = Math.max(0, Math.min(1, fraction));

        const targetDistance = fraction * this.totalLength;
        const point = turf.along(this.lineString, targetDistance, { units: 'kilometers' });

        // Calculate heading (bearing)
        const bearing = this.getBearingAtFraction(fraction);

        return {
            lng: point.geometry.coordinates[0],
            lat: point.geometry.coordinates[1],
            bearing,
            fraction
        };
    }

    // Get the bearing (heading) at a fraction along the route
    getBearingAtFraction(fraction) {
        const epsilon = 0.001; // Small offset for bearing calculation

        const pos1 = this.getPointAtFraction(Math.max(0, fraction - epsilon));
        const pos2 = this.getPointAtFraction(Math.min(1, fraction + epsilon));

        return turf.bearing(
            turf.point([pos1.lng, pos1.lat]),
            turf.point([pos2.lng, pos2.lat])
        );
    }

    // Helper to get just the point without bearing (avoids recursion)
    getPointAtFraction(fraction) {
        fraction = Math.max(0, Math.min(1, fraction));
        const targetDistance = fraction * this.totalLength;
        const point = turf.along(this.lineString, targetDistance, { units: 'kilometers' });
        return {
            lng: point.geometry.coordinates[0],
            lat: point.geometry.coordinates[1]
        };
    }

    // Get the station index for a given fraction
    getStationIndex(fraction) {
        const targetDistance = fraction * this.totalLength;

        for (let i = 0; i < this.segmentDistances.length - 1; i++) {
            if (targetDistance <= this.segmentDistances[i + 1]) {
                return i;
            }
        }

        return this.coordinates.length - 1;
    }

    // Get total route length in km
    getTotalLength() {
        return this.totalLength;
    }

    // Get number of stations
    getStationCount() {
        return this.coordinates.length;
    }
}
