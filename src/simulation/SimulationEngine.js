// Simulation Engine - Manages train spawning and movement
import { MRT_LINES, getAllLineCodes } from '../data/mrt-routes.js';
import { SCHEDULE_CONFIG, getFrequency, isPeakHour } from '../data/schedule.js';
import { RouteInterpolator } from './RouteInterpolator.js';

export class SimulationEngine {
    constructor() {
        this.trains = [];
        this.routeInterpolators = {};
        this.lastSpawnTimes = {};

        // Initialize route interpolators for each line
        this.initializeRoutes();
    }

    initializeRoutes() {
        Object.entries(MRT_LINES).forEach(([lineCode, line]) => {
            const coordinates = line.stations.map(s => [s.lng, s.lat]);
            this.routeInterpolators[lineCode] = new RouteInterpolator(coordinates);

            // Track last spawn time for both directions
            this.lastSpawnTimes[lineCode] = {
                forward: SCHEDULE_CONFIG.startTime,
                reverse: SCHEDULE_CONFIG.startTime
            };
        });
    }

    // Calculate all train positions at a given time (in minutes from midnight)
    getTrainPositions(timeInMinutes) {
        // Outside operating hours
        if (timeInMinutes < SCHEDULE_CONFIG.startTime || timeInMinutes >= SCHEDULE_CONFIG.endTime) {
            return [];
        }

        const trains = [];
        const frequency = getFrequency(timeInMinutes);

        Object.entries(MRT_LINES).forEach(([lineCode, line]) => {
            const interpolator = this.routeInterpolators[lineCode];
            const routeLength = interpolator.getTotalLength();
            const stationCount = interpolator.getStationCount();

            // Calculate journey time for the entire route (in minutes)
            const journeyTime = (stationCount - 1) * SCHEDULE_CONFIG.avgStationTime;

            // Calculate how many trains should be on the line
            // One train every 'frequency' minutes, and they take 'journeyTime' minutes to traverse
            const trainsNeeded = Math.ceil(journeyTime / frequency) + 1;

            // Generate trains for forward direction
            for (let i = 0; i < trainsNeeded; i++) {
                const departureTime = SCHEDULE_CONFIG.startTime + (i * frequency);

                // Skip if train hasn't departed yet
                if (departureTime > timeInMinutes) continue;

                const elapsedTime = timeInMinutes - departureTime;

                // Skip if train has completed journey
                if (elapsedTime > journeyTime) continue;

                const fraction = elapsedTime / journeyTime;
                const position = interpolator.getPositionAtFraction(fraction);

                trains.push({
                    id: `${lineCode}-F-${i}`,
                    line: lineCode,
                    color: line.color,
                    lineName: line.name,
                    direction: 'forward',
                    ...position
                });
            }

            // Generate trains for reverse direction
            for (let i = 0; i < trainsNeeded; i++) {
                // Offset reverse trains by half the frequency
                const departureTime = SCHEDULE_CONFIG.startTime + (i * frequency) + (frequency / 2);

                if (departureTime > timeInMinutes) continue;

                const elapsedTime = timeInMinutes - departureTime;

                if (elapsedTime > journeyTime) continue;

                // Reverse direction: 1 - fraction
                const fraction = 1 - (elapsedTime / journeyTime);
                const position = interpolator.getPositionAtFraction(fraction);

                // Flip bearing for reverse direction
                position.bearing = (position.bearing + 180) % 360;

                trains.push({
                    id: `${lineCode}-R-${i}`,
                    line: lineCode,
                    color: line.color,
                    lineName: line.name,
                    direction: 'reverse',
                    ...position
                });
            }
        });

        return trains;
    }

    // Get statistics for the current simulation time
    getStatistics(timeInMinutes) {
        const trains = this.getTrainPositions(timeInMinutes);

        const trainsByLine = {};
        getAllLineCodes().forEach(code => {
            trainsByLine[code] = trains.filter(t => t.line === code).length;
        });

        return {
            totalTrains: trains.length,
            trainsByLine,
            isPeakHour: isPeakHour(timeInMinutes),
            frequency: getFrequency(timeInMinutes)
        };
    }
}

// Singleton instance
let engineInstance = null;

export function getSimulationEngine() {
    if (!engineInstance) {
        engineInstance = new SimulationEngine();
    }
    return engineInstance;
}
