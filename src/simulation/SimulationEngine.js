// Simulation Engine - Manages train spawning and movement with dwell time
import { MRT_LINES, getAllLineCodes } from '../data/mrt-routes.js';
import { LINE_SCHEDULES, getFrequency, isPeakHour, getDwellTime, getOperatingStatus } from '../data/schedule.js';
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

            // Get line-specific dwell time (convert seconds to minutes)
            const dwellTimeMinutes = getDwellTime(lineCode) / 60;

            // Travel time between stations (minutes)
            const travelTimePerSegment = 2; // 2 minutes between stations

            // Time for one complete journey including stops
            // Total = (segments × travel time) + (stations × dwell time)
            const segments = stationCount - 1;
            const journeyTime = (segments * travelTimePerSegment) + (stationCount * dwellTimeMinutes);

            // Get frequency at current time
            const frequency = getFrequency(timeInMinutes);

            // Calculate how many trains should be on the line at any time
            const trainsOnLine = Math.ceil(journeyTime / frequency);

            // Time elapsed since line started operating
            const elapsedFromStart = timeInMinutes - schedule.startTime;

            // Generate trains for forward direction
            for (let i = 0; i < trainsOnLine; i++) {
                const trainOffset = i * frequency;

                // Calculate elapsed time in cycle for this train
                const elapsedInCycle = (elapsedFromStart + trainOffset) % journeyTime;

                // Calculate position and dwell state
                const positionData = this.calculatePositionWithDwell(
                    interpolator,
                    elapsedInCycle,
                    journeyTime,
                    stationCount,
                    travelTimePerSegment,
                    dwellTimeMinutes
                );

                trains.push({
                    id: `${lineCode}-F-${i}`,
                    line: lineCode,
                    color: line.color,
                    lineName: line.name,
                    direction: 'forward',
                    isAtStation: positionData.isAtStation,
                    stationIndex: positionData.stationIndex,
                    ...positionData.position
                });
            }

            // Generate trains for reverse direction (offset by half frequency)
            for (let i = 0; i < trainsOnLine; i++) {
                const trainOffset = i * frequency + (frequency / 2);
                const elapsedInCycle = (elapsedFromStart + trainOffset) % journeyTime;

                const positionData = this.calculatePositionWithDwell(
                    interpolator,
                    elapsedInCycle,
                    journeyTime,
                    stationCount,
                    travelTimePerSegment,
                    dwellTimeMinutes,
                    true // reverse direction
                );

                // Flip bearing for reverse direction
                positionData.position.bearing = (positionData.position.bearing + 180) % 360;

                trains.push({
                    id: `${lineCode}-R-${i}`,
                    line: lineCode,
                    color: line.color,
                    lineName: line.name,
                    direction: 'reverse',
                    isAtStation: positionData.isAtStation,
                    stationIndex: positionData.stationIndex,
                    ...positionData.position
                });
            }
        });

        return trains;
    }

    // Calculate position considering dwell time at stations
    calculatePositionWithDwell(interpolator, elapsed, journeyTime, stationCount, travelTime, dwellTime, reverse = false) {
        const segments = stationCount - 1;
        const timePerStation = travelTime + dwellTime; // Time to reach and stop at each station

        // Figure out which station/segment the train is at
        let accumulatedTime = 0;
        let currentSegment = 0;
        let isAtStation = false;
        let stationIndex = 0;
        let fraction = 0;

        // Initial dwell at first station
        if (elapsed < dwellTime) {
            isAtStation = true;
            stationIndex = 0;
            fraction = 0;
        } else {
            let remainingTime = elapsed - dwellTime; // Subtract initial dwell

            for (let seg = 0; seg < segments; seg++) {
                // Travel phase for this segment
                if (remainingTime < travelTime) {
                    // Train is traveling between stations
                    const segmentFraction = remainingTime / travelTime;
                    fraction = (seg + segmentFraction) / segments;
                    currentSegment = seg;
                    isAtStation = false;
                    stationIndex = seg;
                    break;
                }
                remainingTime -= travelTime;

                // Dwell phase at next station
                if (remainingTime < dwellTime) {
                    // Train is dwelling at station
                    fraction = (seg + 1) / segments;
                    isAtStation = true;
                    stationIndex = seg + 1;
                    break;
                }
                remainingTime -= dwellTime;

                // If we've gone through all segments
                if (seg === segments - 1) {
                    fraction = 1;
                    isAtStation = true;
                    stationIndex = stationCount - 1;
                }
            }
        }

        // Reverse the fraction for reverse direction
        if (reverse) {
            fraction = 1 - fraction;
            stationIndex = stationCount - 1 - stationIndex;
        }

        // Get actual position from interpolator
        const position = interpolator.getPositionAtFraction(Math.max(0, Math.min(1, fraction)));

        return {
            position,
            isAtStation,
            stationIndex
        };
    }

    // Get statistics for the current simulation time
    getStatistics(timeInMinutes) {
        const trains = this.getTrainPositions(timeInMinutes);

        const trainsByLine = {};
        getAllLineCodes().forEach(code => {
            trainsByLine[code] = trains.filter(t => t.line === code).length;
        });

        const trainsAtStation = trains.filter(t => t.isAtStation).length;
        const trainsInMotion = trains.length - trainsAtStation;

        return {
            totalTrains: trains.length,
            trainsAtStation,
            trainsInMotion,
            trainsByLine,
            isPeakHour: isPeakHour(timeInMinutes),
            operatingStatus: getOperatingStatus(timeInMinutes),
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

// Reset singleton (for testing)
export function resetSimulationEngine() {
    engineInstance = null;
}
