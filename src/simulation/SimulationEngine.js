
// Simulation Engine - Manages train spawning and movement with per-station travel times
import { LINE_SCHEDULES, getDwellTime, getLineFrequency, isPeakHour, getOperatingStatus } from '../data/schedule.js';
import { DEPOTS, getDepotsForLine } from '../data/depots.js';
import { RouteInterpolator } from './RouteInterpolator.js';
import { NetworkModel } from '../data/NetworkModel.js';
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

        // Stateful train tracking
        // Map<lineCode, Array<TrainObject>>
        this.activeTrains = new Map();
        this.lastUpdateTime = -1;
        this.lastInjectionTime = new Map(); // Track last spawn time per line

        // Initialize route interpolators for each line
        this.initializeRoutes();
    }

    initializeRoutes() {
        NetworkModel.initialize();
        const lines = NetworkModel.getAllLines();
        Object.entries(lines).forEach(([lineCode, line]) => {
            // Use loopPath if available to define the correct sequence of stations
            // forcing the simulation to follow the full loop (including repeated interchanges)
            let orderedStations;
            if (line.loopPath) {
                orderedStations = line.loopPath.map(code =>
                    line.stations.find(s => s.code === code)
                ).filter(s => s); // Filter out any missing
            } else {
                orderedStations = line.stations;
            }

            const coordinates = orderedStations.map(s => [s.lng, s.lat]);

            // Need detailed coords for path following
            let detailedCoords = null;
            if (line.detailedPath && line.detailedPath.length > 0) {
                detailedCoords = line.detailedPath;
            }

            this.routeInterpolators[lineCode] = new RouteInterpolator(coordinates, detailedCoords);
            this.activeTrains.set(lineCode, []); // Initialize active trains for the line
            this.lastInjectionTime.set(lineCode, -999); // Initialize last injection time
        });
    }

    // Trapezoidal motion profile
    trapezoidalMotion(t) {
        const accelPhase = 0.2;
        const cruisePhase = 0.6;
        const decelPhase = 0.2;

        const t1 = accelPhase;
        const t2 = accelPhase + cruisePhase;

        if (t < t1) {
            const localT = t / accelPhase;
            return 0.1 * localT * localT;
        } else if (t < t2) {
            const localT = (t - t1) / cruisePhase;
            return 0.1 + 0.8 * localT;
        } else {
            const localT = (t - t2) / decelPhase;
            return 0.9 + 0.1 * (2 * localT - localT * localT);
        }
    }

    getSpeedPhase(t) {
        if (t < 0.2) return Math.round((t / 0.2) * 100);
        else if (t < 0.8) return 100;
        else return Math.round(((1 - t) / 0.2) * 100);
    }

    getSegmentTravelTimes(lineCode) {
        const timeKey = lineCode === 'CG' ? 'CG' : lineCode;
        const times = INTER_STATION_TIMES[timeKey];
        if (!times) {
            const stationCount = this.routeInterpolators[lineCode]?.getStationCount() || 10;
            return Array(stationCount - 1).fill(2);
        }
        return times;
    }

    getTotalJourneyTime(lineCode, dwellTimeMinutes) {
        const times = this.getSegmentTravelTimes(lineCode);
        const totalTravel = times.reduce((sum, t) => sum + t, 0);
        const stationCount = times.length + 1;
        const totalDwell = stationCount * dwellTimeMinutes;
        return totalTravel + totalDwell;
    }

    getStationIndex(lineCode, stationCode) {
        const lines = NetworkModel.getAllLines();
        const line = lines[lineCode];
        return line.stations.findIndex(s => s.code === stationCode);
    }

    // Time from start of line to arrival at stationIndex
    getTimeToStation(lineCode, stationIndex, dwellTimeMinutes) {
        const segmentTimes = this.getSegmentTravelTimes(lineCode);
        let time = 0;
        for (let i = 0; i < stationIndex; i++) {
            // Dwell at station i
            if (i > 0) time += dwellTimeMinutes;
            // Travel i -> i+1
            time += (segmentTimes[i] || 2);
        }
        return time;
    }

    // --- Stateful Logic ---

    generateTrainId(lineCode, index) {
        return `${lineCode}-${Date.now()}-${index}`;
    }

    resetLineState(lineCode, timeInMinutes, schedule) {
        const trains = [];

        const dwellTimeMinutes = getDwellTime(lineCode) / 60;
        const journeyTime = this.getTotalJourneyTime(lineCode, dwellTimeMinutes);
        const frequency = getLineFrequency(lineCode, timeInMinutes);

        const neededTrains = Math.max(1, Math.ceil(journeyTime / frequency));
        const maxFleet = schedule.maxFleet || neededTrains;
        const targetCount = Math.min(neededTrains, Math.floor(maxFleet * 0.9));

        for (let i = 0; i < targetCount; i++) {
            trains.push({
                id: this.generateTrainId(lineCode, `F${i}`),
                line: lineCode,
                direction: 'forward',
                entryTime: timeInMinutes - (i * frequency),
                state: 'RUNNING',
                isAtStation: false,
                wantsToRetire: false
            });

            trains.push({
                id: this.generateTrainId(lineCode, `R${i}`),
                line: lineCode,
                direction: 'reverse',
                entryTime: timeInMinutes - (i * frequency) - (frequency / 2),
                state: 'RUNNING',
                isAtStation: false,
                wantsToRetire: false
            });
        }

        this.activeTrains.set(lineCode, trains);
        this.lastInjectionTime.set(lineCode, timeInMinutes);
    }

    updateTrains(timeInMinutes) {
        if (this.lastUpdateTime === -1 || Math.abs(timeInMinutes - this.lastUpdateTime) > 5) {
            const lines = NetworkModel.getAllLines();
            Object.keys(lines).forEach((lineCode) => {
                const schedule = LINE_SCHEDULES[lineCode];
                if (schedule && timeInMinutes >= schedule.startTime && timeInMinutes <= schedule.endTime) {
                    this.resetLineState(lineCode, timeInMinutes, schedule);
                } else {
                    this.activeTrains.set(lineCode, []);
                }
            });
            this.lastUpdateTime = timeInMinutes;
            return;
        }

        const lines = NetworkModel.getAllLines();
        Object.entries(lines).forEach(([lineCode, line]) => {
            const schedule = LINE_SCHEDULES[lineCode];
            if (!schedule) return;

            if (timeInMinutes < schedule.startTime || timeInMinutes > schedule.endTime) {
                this.activeTrains.set(lineCode, []);
                return;
            }

            let trains = this.activeTrains.get(lineCode) || [];

            const dwellTimeMinutes = getDwellTime(lineCode) / 60;
            const journeyTime = this.getTotalJourneyTime(lineCode, dwellTimeMinutes);
            const frequency = getLineFrequency(lineCode, timeInMinutes);

            const neededPerDir = Math.max(1, Math.ceil(journeyTime / frequency));
            const maxFleet = schedule.maxFleet || (neededPerDir * 2);
            const targetTotal = Math.min(neededPerDir * 2, Math.floor(maxFleet * 0.9));
            const targetPerDir = Math.floor(targetTotal / 2);

            // Active includes RUNNING and INJECTING and WITHDRAWING
            // But for counting "Service Capacity", we mostly care about RUNNING+INJECTING?
            // Actually, if we are withdrawing, we are removing capacity.
            // Target applies to Service trains.
            const fwdTrains = trains.filter(t => t.direction === 'forward' && (t.state === 'RUNNING' || t.state === 'INJECTING'));
            const revTrains = trains.filter(t => t.direction === 'reverse' && (t.state === 'RUNNING' || t.state === 'INJECTING'));

            const injectionCooldown = 2;
            const lastInj = this.lastInjectionTime.get(lineCode) || -999;
            const canInject = (timeInMinutes - lastInj) >= injectionCooldown;

            if (fwdTrains.length < targetPerDir && canInject) {
                this.injectRealTrain(lineCode, 'forward', timeInMinutes);
                this.lastInjectionTime.set(lineCode, timeInMinutes);
            }
            else if (revTrains.length < targetPerDir && canInject) {
                this.injectRealTrain(lineCode, 'reverse', timeInMinutes);
                this.lastInjectionTime.set(lineCode, timeInMinutes);
            }

            if (fwdTrains.length > targetPerDir) {
                this.retireTrain(fwdTrains);
            }
            if (revTrains.length > targetPerDir) {
                this.retireTrain(revTrains);
            }
        });

        this.lastUpdateTime = timeInMinutes;
    }

    injectRealTrain(lineCode, direction, currentTime) {
        const trains = this.activeTrains.get(lineCode);
        const depots = getDepotsForLine(lineCode);

        const depot = depots.length > 0 ? depots[Math.floor(Math.random() * depots.length)] : null;

        if (depot && depot.connection.lineCode === lineCode) {
            const idSuffix = Math.random().toString(36).substr(2, 5);
            trains.push({
                id: this.generateTrainId(lineCode, `${direction}-${idSuffix}`),
                line: lineCode,
                direction: direction,
                state: 'INJECTING',
                depotId: Object.keys(DEPOTS).find(key => DEPOTS[key] === depot),
                connectionStart: currentTime,
                connectionPath: depot.connection.path,
                targetStation: depot.connection.stationCode,
                isAtStation: false,
                wantsToRetire: false
            });
        } else {
            this.injectTrain(lineCode, direction, currentTime, null);
        }
    }

    injectTrain(lineCode, direction, currentTime) {
        const trains = this.activeTrains.get(lineCode);
        const idSuffix = Math.random().toString(36).substr(2, 5);
        trains.push({
            id: this.generateTrainId(lineCode, `${direction}-${idSuffix}`),
            line: lineCode,
            direction: direction,
            entryTime: currentTime,
            state: 'RUNNING',
            isAtStation: false,
            wantsToRetire: false
        });
    }

    retireTrain(candidateTrains) {
        // Find a running train that isn't already marked for retirement
        const target = candidateTrains.find(t => t.state === 'RUNNING' && !t.wantsToRetire);
        if (target) {
            target.wantsToRetire = true;
        }
    }

    getTrainPositions(timeInMinutes) {
        this.updateTrains(timeInMinutes);

        const allPositions = [];

        const lines = NetworkModel.getAllLines();
        Object.entries(lines).forEach(([lineCode, line]) => {
            const trains = this.activeTrains.get(lineCode);
            if (!trains) return;

            const schedule = LINE_SCHEDULES[lineCode];
            const dwellTimeMinutes = getDwellTime(lineCode) / 60;
            const journeyTime = this.getTotalJourneyTime(lineCode, dwellTimeMinutes);
            const interpolator = this.routeInterpolators[lineCode];
            const stationCount = interpolator.getStationCount();
            const segmentTimes = this.getSegmentTravelTimes(lineCode);

            const activeTrainList = [];

            trains.forEach(train => {
                // handle INJECTING state
                if (train.state === 'INJECTING') {
                    const injectDuration = 2; // 2 minutes to travel from depot
                    const progress = (timeInMinutes - train.connectionStart) / injectDuration;

                    if (progress >= 1) {
                        train.state = 'RUNNING';

                        const stationIndex = this.getStationIndex(lineCode, train.targetStation);
                        const isReverse = train.direction === 'reverse';
                        let timeOffset = 0;
                        if (!isReverse) {
                            timeOffset = this.getTimeToStation(lineCode, stationIndex, dwellTimeMinutes);
                        } else {
                            timeOffset = journeyTime - this.getTimeToStation(lineCode, stationIndex, dwellTimeMinutes);
                        }

                        train.entryTime = timeInMinutes - timeOffset;
                    } else {
                        const path = train.connectionPath;
                        const totalPoints = path.length - 1;
                        const floatIdx = progress * totalPoints;
                        const idx = Math.floor(floatIdx);
                        const subT = floatIdx - idx;

                        const p1 = path[idx];
                        const p2 = path[Math.min(idx + 1, totalPoints)];

                        const lng = p1[0] + (p2[0] - p1[0]) * subT;
                        const lat = p1[1] + (p2[1] - p1[1]) * subT;

                        allPositions.push({
                            id: train.id,
                            line: lineCode,
                            color: '#555',
                            lineName: line.name,
                            direction: train.direction,
                            isAtStation: false,
                            stationIndex: -1,
                            stationName: 'Leaving Depot',
                            speed: 40,
                            lng, lat, bearing: 0
                        });
                        activeTrainList.push(train);
                        return;
                    }
                }

                // handle WITHDRAWING state
                if (train.state === 'WITHDRAWING') {
                    const withdrawDuration = 2;
                    const progress = (timeInMinutes - train.withdrawalStart) / withdrawDuration;

                    if (progress >= 1) {
                        // Reached depot, remove from active list
                        return; // Despawn
                    } else {
                        const path = train.connectionPath;
                        const totalPoints = path.length - 1;

                        // Inverse progress
                        const pathProgress = 1.0 - progress;

                        const floatIdx = pathProgress * totalPoints;
                        // Clamp for safety
                        const safeFloat = Math.max(0, Math.min(totalPoints, floatIdx));
                        const idx = Math.floor(safeFloat);
                        const subT = safeFloat - idx;

                        const p1 = path[idx];
                        const p2 = path[Math.min(idx + 1, totalPoints)];

                        const lng = p1[0] + (p2[0] - p1[0]) * subT;
                        const lat = p1[1] + (p2[1] - p1[1]) * subT;

                        allPositions.push({
                            id: train.id,
                            line: lineCode,
                            color: '#555',
                            lineName: line.name,
                            direction: train.direction,
                            isAtStation: false,
                            stationIndex: -1,
                            stationName: 'Returning to Depot',
                            speed: 40,
                            lng, lat, bearing: 0
                        });
                        activeTrainList.push(train);
                        return;
                    }
                }

                if (train.state === 'RUNNING' || train.state === 'DESPAWNING') {
                    const elapsedTotal = timeInMinutes - train.entryTime;
                    if (elapsedTotal < 0) {
                        activeTrainList.push(train);
                        return;
                    }

                    const loopCount = Math.floor(elapsedTotal / journeyTime);
                    const elapsedInCycle = elapsedTotal % journeyTime;

                    if (train.state === 'DESPAWNING' && loopCount >= 1) {
                        return;
                    }

                    const isReverse = train.direction === 'reverse';
                    const positionData = this.calculatePositionWithDwell(
                        interpolator,
                        line,
                        elapsedInCycle,
                        stationCount,
                        segmentTimes,
                        dwellTimeMinutes,
                        isReverse
                    );

                    if (positionData) {
                        train.isAtStation = positionData.isAtStation;

                        // Check for Withdrawal Opportunity
                        if (train.wantsToRetire && positionData.isAtStation) {
                            const currentStationCode = line.stations[positionData.stationIndex]?.code;

                            const depot = Object.values(DEPOTS).find(d =>
                                d.servesLines.includes(lineCode) &&
                                d.connection.stationCode === currentStationCode &&
                                d.connection.lineCode === lineCode
                            );

                            if (depot) {
                                train.state = 'WITHDRAWING';
                                train.withdrawalStart = timeInMinutes;
                                train.connectionPath = depot.connection.path;
                                train.wantsToRetire = false;

                                activeTrainList.push(train);
                                return;
                            }
                        }

                        if (isReverse) {
                            positionData.position.bearing = (positionData.position.bearing + 180) % 360;
                        }

                        allPositions.push({
                            id: train.id,
                            line: lineCode,
                            color: line.color,
                            lineName: line.name,
                            direction: train.direction,
                            stationName: positionData.stationName,
                            ...positionData,
                            ...positionData.position
                        });
                        activeTrainList.push(train);
                    } else {
                        activeTrainList.push(train);
                    }
                }
            });

            this.activeTrains.set(lineCode, activeTrainList);
        });

        return allPositions;
    }

    getStatistics(timeInMinutes) {
        const activeLines = [];
        let totalTrains = 0;
        let trainsAtStation = 0;
        let trainsInMotion = 0;
        const trainsByLine = {};

        const lines = NetworkModel.getAllLines();
        Object.entries(lines).forEach(([lineCode, line]) => {
            const schedule = LINE_SCHEDULES[lineCode];
            if (!schedule) return;

            if (timeInMinutes >= schedule.startTime && timeInMinutes <= schedule.endTime) {
                activeLines.push(lineCode);

                const trains = this.activeTrains.get(lineCode) || [];
                const count = trains.length;

                trains.forEach(t => {
                    if (t.isAtStation) trainsAtStation++;
                    else trainsInMotion++;
                });

                trainsByLine[lineCode] = count;
                totalTrains += count;
            }
        });

        return {
            totalTrains: totalTrains,
            trainsAtStation: trainsAtStation,
            trainsInMotion: trainsInMotion,
            trainsByLine: trainsByLine,
            activeLines: activeLines.length,
            isPeakHour: isPeakHour(timeInMinutes),
            operatingStatus: getOperatingStatus(timeInMinutes),
            frequency: isPeakHour(timeInMinutes) ? 2 : 5
        };
    }

    calculatePositionWithDwell(interpolator, line, elapsed, stationCount, segmentTimes, dwellTime, reverse) {
        const segments = stationCount - 1;
        let currentStation = 0;
        let isAtStation = false;
        let timeRemaining = elapsed;

        const getSegmentTime = (segIndex) => {
            if (reverse) return segmentTimes[segments - 1 - segIndex] || 2;
            return segmentTimes[segIndex] || 2;
        };

        if (timeRemaining < dwellTime) {
            isAtStation = true;
            currentStation = 0;
        } else {
            timeRemaining -= dwellTime;
            for (let seg = 0; seg < segments; seg++) {
                const thisSegmentTime = getSegmentTime(seg);
                if (timeRemaining < thisSegmentTime) {
                    const linearProgress = timeRemaining / thisSegmentTime;
                    const easedProgress = this.trapezoidalMotion(linearProgress);
                    const fromStationIdx = reverse ? (stationCount - 1 - seg) : seg;
                    const toStationIdx = reverse ? (stationCount - 2 - seg) : (seg + 1);
                    const actualFrom = reverse ? toStationIdx : fromStationIdx;
                    const actualTo = reverse ? fromStationIdx : toStationIdx;

                    const position = interpolator.getPositionBetweenStations(Math.min(actualFrom, actualTo), Math.max(actualFrom, actualTo), reverse ? (1 - easedProgress) : easedProgress, reverse);
                    const speedPhase = this.getSpeedPhase(linearProgress);

                    return { position, isAtStation: false, stationIndex: fromStationIdx, stationName: `${line.stations[fromStationIdx]?.code || ''} → ${line.stations[toStationIdx]?.code || ''}`, speed: speedPhase };
                }
                timeRemaining -= thisSegmentTime;
                if (timeRemaining < dwellTime) {
                    currentStation = seg + 1;
                    isAtStation = true;
                    break;
                }
                timeRemaining -= dwellTime;
            }
            if (!isAtStation && timeRemaining >= 0) {
                currentStation = segments;
                isAtStation = true;
            }
        }
        const actualStation = reverse ? (stationCount - 1 - currentStation) : currentStation;
        const station = line.stations[Math.min(actualStation, stationCount - 1)];
        if (!station) return null;
        if (isAtStation) {
            // Use interpolator to get the ON-TRACK position for the station
            // This prevents jumping if the visual station marker is slightly offset from the track vertex
            const snappedPos = interpolator.getPositionBetweenStations(actualStation, actualStation, 0, reverse);
            return { position: snappedPos, isAtStation: true, stationIndex: actualStation, stationName: station.name, speed: 0 };
        }
        return null;
    }
}
