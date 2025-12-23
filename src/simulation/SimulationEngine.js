// Simulation Engine - Manages train spawning and movement with per-station travel times
import { MRT_LINES, getAllLineCodes } from '../data/mrt-routes.js';
import { LINE_SCHEDULES, getLineFrequency, getDwellTime, getOperatingStatus, getFrequency, isPeakHour } from '../data/schedule.js';
import { RouteInterpolator } from './RouteInterpolator.js';
import { INTER_STATION_TIMES } from '../data/travel-times.js';

// Singleton instance
let engineInstance = null;

export function getSimulationEngine() {
    if (!engineInstance) {
        engineInstance = new SimulationEngine();
    }
    return engineInstance;
}

// Reset singleton for testing
export function resetSimulationEngine() {
    engineInstance = null;
}

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

    // Trapezoidal motion profile for realistic MRT movement
    // This models: acceleration (20%), constant cruise speed (60%), deceleration (20%)
    // t: linear time progress (0 to 1)
    // Returns: position progress (0 to 1) with realistic motion curve
    trapezoidalMotion(t) {
        const accelPhase = 0.2;   // 20% of journey for acceleration
        const cruisePhase = 0.6;  // 60% of journey at constant speed
        const decelPhase = 0.2;   // 20% of journey for deceleration

        // Normalized time boundaries
        const t1 = accelPhase;
        const t2 = accelPhase + cruisePhase;

        if (t < t1) {
            // Acceleration phase: quadratic ease-in (constant acceleration)
            const localT = t / accelPhase;
            return 0.1 * localT * localT; // Position after accel = 0.1 (10% of distance)
        } else if (t < t2) {
            // Cruise phase: linear motion at constant velocity
            const localT = (t - t1) / cruisePhase;
            return 0.1 + 0.8 * localT; // Covers 80% of distance at constant speed
        } else {
            // Deceleration phase: quadratic ease-out (constant deceleration)
            const localT = (t - t2) / decelPhase;
            return 0.9 + 0.1 * (2 * localT - localT * localT); // Final 10% of distance
        }
    }

    // Get speed phase for display (0 = stopped/slow, 100 = full speed)
    getSpeedPhase(t) {
        if (t < 0.2) {
            // Accelerating: 0 -> 100
            return Math.round((t / 0.2) * 100);
        } else if (t < 0.8) {
            // Cruising at full speed
            return 100;
        } else {
            // Decelerating: 100 -> 0
            return Math.round(((1 - t) / 0.2) * 100);
        }
    }


    // Get per-segment travel times for a line (in minutes)
    getSegmentTravelTimes(lineCode) {
        // Map line codes to travel time keys (handle CG which is part of EW)
        const timeKey = lineCode === 'CG' ? 'CG' : lineCode;
        const times = INTER_STATION_TIMES[timeKey];

        if (!times) {
            // Fallback to 2 minutes per segment
            const stationCount = this.routeInterpolators[lineCode]?.getStationCount() || 10;
            return Array(stationCount - 1).fill(2);
        }

        return times;
    }

    // Calculate total journey time for a line (sum of all segments + dwell times)
    getTotalJourneyTime(lineCode, dwellTimeMinutes) {
        const times = this.getSegmentTravelTimes(lineCode);
        const totalTravel = times.reduce((sum, t) => sum + t, 0);
        const stationCount = times.length + 1;
        const totalDwell = stationCount * dwellTimeMinutes;
        return totalTravel + totalDwell;
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

            // Get line-specific timings
            const dwellTimeMinutes = getDwellTime(lineCode) / 60;
            const segmentTimes = this.getSegmentTravelTimes(lineCode);
            const frequency = getLineFrequency(lineCode, timeInMinutes);

            // Total journey time using per-segment times
            const journeyTime = this.getTotalJourneyTime(lineCode, dwellTimeMinutes);

            // Calculate how many trains should be on the line at any time
            // This is capped by the actual fleet size
            const neededTrains = Math.max(1, Math.ceil(journeyTime / frequency));
            const maxFleet = schedule.maxFleet || neededTrains; // Use official fleet cap if available
            const trainsOnLine = Math.min(neededTrains, Math.floor(maxFleet * 0.85)); // ~85% fleet in service

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
                    line,
                    elapsedInCycle,
                    stationCount,
                    segmentTimes,
                    dwellTimeMinutes,
                    false // forward direction
                );

                if (positionData) {
                    trains.push({
                        id: `${lineCode}-F-${i}`,
                        line: lineCode,
                        color: line.color,
                        lineName: line.name,
                        direction: 'forward',
                        isAtStation: positionData.isAtStation,
                        stationIndex: positionData.stationIndex,
                        stationName: positionData.stationName,
                        ...positionData.position
                    });
                }
            }

            // Generate trains for reverse direction (offset by half frequency)
            for (let i = 0; i < trainsOnLine; i++) {
                const trainOffset = i * frequency + (frequency / 2);
                const elapsedInCycle = (elapsedFromStart + trainOffset) % journeyTime;

                const positionData = this.calculatePositionWithDwell(
                    interpolator,
                    line,
                    elapsedInCycle,
                    stationCount,
                    segmentTimes,
                    dwellTimeMinutes,
                    true // reverse direction
                );

                if (positionData) {
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
                        stationName: positionData.stationName,
                        ...positionData.position
                    });
                }
            }
        });

        return trains;
    }

    // Calculate position with per-segment travel times and realistic movement
    calculatePositionWithDwell(interpolator, line, elapsed, stationCount, segmentTimes, dwellTime, reverse) {
        const segments = stationCount - 1;

        // State tracking
        let currentStation = 0;
        let isAtStation = false;
        let timeRemaining = elapsed;

        // For reverse direction, we traverse segments in reverse order
        const getSegmentTime = (segIndex) => {
            if (reverse) {
                // Reverse: segment 0 is the last segment in segmentTimes
                return segmentTimes[segments - 1 - segIndex] || 2;
            }
            return segmentTimes[segIndex] || 2;
        };

        // Start with dwell at first station
        if (timeRemaining < dwellTime) {
            isAtStation = true;
            currentStation = 0;
        } else {
            timeRemaining -= dwellTime;

            // Walk through each segment with its specific travel time
            for (let seg = 0; seg < segments; seg++) {
                const thisSegmentTime = getSegmentTime(seg);

                // Travel phase
                if (timeRemaining < thisSegmentTime) {
                    // Train is moving between stations
                    // Linear time progress (0 to 1)
                    const linearProgress = timeRemaining / thisSegmentTime;

                    // Apply trapezoidal motion profile for realistic MRT movement
                    // 20% acceleration, 60% cruise at constant speed, 20% deceleration
                    const easedProgress = this.trapezoidalMotion(linearProgress);

                    // Determine actual station indices based on direction
                    const fromStationIdx = reverse ? (stationCount - 1 - seg) : seg;
                    const toStationIdx = reverse ? (stationCount - 2 - seg) : (seg + 1);

                    // Use distance-based interpolation between actual station coordinates
                    const actualFrom = reverse ? toStationIdx : fromStationIdx;
                    const actualTo = reverse ? fromStationIdx : toStationIdx;

                    // Get position using proper geographic distance
                    const position = interpolator.getPositionBetweenStations(
                        Math.min(actualFrom, actualTo),
                        Math.max(actualFrom, actualTo),
                        reverse ? (1 - easedProgress) : easedProgress,
                        reverse
                    );

                    // Calculate current speed phase for display
                    const speedPhase = this.getSpeedPhase(linearProgress);

                    return {
                        position,
                        isAtStation: false,
                        stationIndex: fromStationIdx,
                        stationName: `${line.stations[fromStationIdx]?.code || ''} → ${line.stations[toStationIdx]?.code || ''}`,
                        speed: speedPhase
                    };
                }
                timeRemaining -= thisSegmentTime;

                // Dwell phase at next station
                if (timeRemaining < dwellTime) {
                    currentStation = seg + 1;
                    isAtStation = true;
                    break;
                }
                timeRemaining -= dwellTime;
            }

            // If we've exhausted all time, train is at final station
            if (!isAtStation && timeRemaining >= 0) {
                currentStation = segments;
                isAtStation = true;
            }
        }

        // Get exact station position for dwelling trains
        const actualStation = reverse ? (stationCount - 1 - currentStation) : currentStation;
        const station = line.stations[Math.min(actualStation, stationCount - 1)];

        if (!station) {
            return null;
        }

        if (isAtStation) {
            // Snap to exact station coordinates
            return {
                position: {
                    lng: station.lng,
                    lat: station.lat,
                    bearing: interpolator.getBearingAtStation(currentStation, reverse),
                    fraction: currentStation / Math.max(1, segments)
                },
                isAtStation: true,
                stationIndex: actualStation,
                stationName: station.name || station.code
            };
        }

        // Fallback (shouldn't reach here)
        return null;
    }

    // Get statistics about current simulation state
    getStatistics(timeInMinutes) {
        const trains = this.getTrainPositions(timeInMinutes);
        const trainsInMotion = trains.filter(t => !t.isAtStation).length;
        const trainsAtStations = trains.filter(t => t.isAtStation).length;
        const operatingStatus = getOperatingStatus(timeInMinutes);
        const frequency = getFrequency(timeInMinutes);

        // Count by line
        const byLine = {};
        trains.forEach(train => {
            byLine[train.line] = (byLine[train.line] || 0) + 1;
        });

        return {
            totalTrains: trains.length,
            trainsInMotion,
            trainsAtStations,
            trainsAtStation: trainsAtStations, // Alias for backwards compatibility
            byLine,
            trainsByLine: byLine, // Alias for test compatibility
            isPeakHour: isPeakHour(timeInMinutes),
            operatingStatus,
            frequency
        };
    }
}
