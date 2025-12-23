// Route Interpolator - Calculates train positions along route polylines
import * as turf from '@turf/turf';

export class RouteInterpolator {
    constructor(coordinates) {
        // coordinates: [[lng, lat], [lng, lat], ...] - these are station coordinates
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

    // Get bearing at a specific station index
    getBearingAtStation(stationIndex, reverse = false) {
        const stations = this.coordinates.length;

        // For first station, use bearing to next station
        if (stationIndex === 0) {
            const from = this.coordinates[0];
            const to = this.coordinates[1];
            const bearing = turf.bearing(turf.point(from), turf.point(to));
            return reverse ? (bearing + 180) % 360 : bearing;
        }

        // For last station, use bearing from previous station
        if (stationIndex >= stations - 1) {
            const from = this.coordinates[stations - 2];
            const to = this.coordinates[stations - 1];
            const bearing = turf.bearing(turf.point(from), turf.point(to));
            return reverse ? (bearing + 180) % 360 : bearing;
        }

        // For middle stations, average the approach and departure bearings
        const prev = this.coordinates[stationIndex - 1];
        const curr = this.coordinates[stationIndex];
        const next = this.coordinates[stationIndex + 1];

        const bearingIn = turf.bearing(turf.point(prev), turf.point(curr));
        const bearingOut = turf.bearing(turf.point(curr), turf.point(next));

        // Average the bearings (handling the circular nature of angles)
        let avgBearing = (bearingIn + bearingOut) / 2;

        // If the bearings are more than 180 apart, adjust
        if (Math.abs(bearingIn - bearingOut) > 180) {
            avgBearing = (avgBearing + 180) % 360;
        }

        return reverse ? (avgBearing + 180) % 360 : avgBearing;
    }

    // Get exact position at a station (snapped to station coordinates)
    getPositionAtStation(stationIndex, reverse = false) {
        const idx = Math.max(0, Math.min(stationIndex, this.coordinates.length - 1));
        const coord = this.coordinates[idx];

        return {
            lng: coord[0],
            lat: coord[1],
            bearing: this.getBearingAtStation(stationIndex, reverse),
            fraction: idx / (this.coordinates.length - 1)
        };
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

    // Calculate travel time for a specific segment based on line's total duration
    // totalDurationMinutes: Total time for the entire line (e.g. 70 mins)
    // segmentIndex: Index of the segment (0 to stationCount-2)
    getSegmentDuration(totalDurationMinutes, segmentIndex) {
        if (segmentIndex < 0 || segmentIndex >= this.segmentDistances.length - 1) {
            return 2; // Default fallback
        }

        const startDist = this.segmentDistances[segmentIndex];
        const endDist = this.segmentDistances[segmentIndex + 1];
        const segmentDist = endDist - startDist;

        // Proportion of total length
        const fraction = segmentDist / this.totalLength;

        // Time for this segment
        return fraction * totalDurationMinutes;
    }
}
