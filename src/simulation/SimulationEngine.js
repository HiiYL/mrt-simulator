// Simulation Engine - Manages train spawning and movement
import { MRT_LINES, getAllLineCodes } from '../data/mrt-routes.js';
import { LINE_SCHEDULES, getFrequency, isPeakHour } from '../data/schedule.js';
import { RouteInterpolator } from './RouteInterpolator.js';

export class SimulationEngine {
    constructor() {
        this.routeInterpolators = {};

        // Initialize route interpolators for each line
        this.initializeRoutes();
    }

    initializeRoutes() {
        Object.entries(MRT_LINES).forEach(([lineCode, line]) => {
            const coordinates = line.stations.map(s => [s.lng, s.lat]);
            this.routeInterpolators[lineCode] = new RouteInterpolator(coordinates);
        });
    }

    // Calculate all train positions at a given time (in minutes from midnight)
    getTrainPositions(timeInMinutes) {
        const trains = [];

        Object.entries(MRT_LINES).forEach(([lineCode, line]) => {
            const schedule = LINE_SCHEDULES[lineCode];
            if (!schedule) return;

            // Check if line is operating at this time
            if (timeInMinutes < schedule.startTime || timeInMinutes > schedule.endTime) {
                return;
            }

            const interpolator = this.routeInterpolators[lineCode];
            const stationCount = interpolator.getStationCount();

            // Calculate journey time for the entire route (in minutes)
            // Each segment takes avgStationTime minutes
            const journeyTime = (stationCount - 1) * 2.5; // 2.5 min per segment

            // Get frequency at current time
            const frequency = getFrequency(timeInMinutes);

            // Calculate how many trains should be on the line at any time
            // Trains depart every 'frequency' minutes and take 'journeyTime' to traverse
            const trainsOnLine = Math.ceil(journeyTime / frequency);

            // Generate trains for forward direction
            // Calculate based on which "wave" of trains we're on
            for (let i = 0; i < trainsOnLine; i++) {
                // Calculate when this train departed based on current position cycle
                // Each train is offset by 'frequency' minutes from the previous
                const timeOffset = i * frequency;

                // Calculate elapsed time since this train's departure in its current run
                const elapsedInCycle = (timeInMinutes - schedule.startTime + timeOffset) % journeyTime;

                // Position as fraction of journey (0 to 1)
                const fraction = elapsedInCycle / journeyTime;

                // Only add if the fraction is valid
                if (fraction >= 0 && fraction <= 1) {
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
            }

            // Generate trains for reverse direction
            // Offset by half frequency so they're interleaved with forward trains
            for (let i = 0; i < trainsOnLine; i++) {
                const timeOffset = i * frequency + (frequency / 2);
                const elapsedInCycle = (timeInMinutes - schedule.startTime + timeOffset) % journeyTime;
                const fraction = 1 - (elapsedInCycle / journeyTime);

                if (fraction >= 0 && fraction <= 1) {
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
