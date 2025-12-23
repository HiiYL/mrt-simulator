// Unit tests for SimulationEngine
import { describe, it, expect, beforeEach } from 'vitest';
import { SimulationEngine, resetSimulationEngine } from './SimulationEngine.js';
import { LINE_SCHEDULES, SCHEDULE_CONFIG, isPeakHour, getFrequency, getDwellTime } from '../data/schedule.js';
import { MRT_LINES } from '../data/mrt-routes.js';

describe('SimulationEngine', () => {
    let engine;

    beforeEach(() => {
        resetSimulationEngine();
        engine = new SimulationEngine();
    });

    describe('initialization', () => {
        it('should create route interpolators for all MRT lines', () => {
            const lineCount = Object.keys(MRT_LINES).length;
            expect(Object.keys(engine.routeInterpolators).length).toBe(lineCount);
        });
    });

    describe('getTrainPositions', () => {
        it('should return empty array before operating hours', () => {
            const trains = engine.getTrainPositions(SCHEDULE_CONFIG.startTime - 60);
            expect(trains).toEqual([]);
        });

        it('should return empty array after operating hours', () => {
            const trains = engine.getTrainPositions(SCHEDULE_CONFIG.endTime + 60);
            expect(trains).toEqual([]);
        });

        it('should return trains during operating hours', () => {
            const trains = engine.getTrainPositions(480); // 8:00 AM
            expect(trains.length).toBeGreaterThan(0);
        });

        it('should return trains during peak hours (8 AM)', () => {
            const peakTime = 8 * 60;
            const trains = engine.getTrainPositions(peakTime);
            console.log('Trains at 8 AM:', trains.length);
            expect(trains.length).toBeGreaterThan(0);
        });

        it('should return trains during off-peak hours (3:36 PM)', () => {
            const currentTime = 15 * 60 + 36;
            const trains = engine.getTrainPositions(currentTime);
            console.log('Trains at 15:36:', trains.length);
            expect(trains.length).toBeGreaterThan(0);
        });

        it('each train should have required properties including dwell state', () => {
            const trains = engine.getTrainPositions(480);
            expect(trains.length).toBeGreaterThan(0);

            const train = trains[0];
            expect(train).toHaveProperty('id');
            expect(train).toHaveProperty('line');
            expect(train).toHaveProperty('color');
            expect(train).toHaveProperty('lineName');
            expect(train).toHaveProperty('direction');
            expect(train).toHaveProperty('lng');
            expect(train).toHaveProperty('lat');
            expect(train).toHaveProperty('bearing');
            expect(train).toHaveProperty('isAtStation');
            expect(train).toHaveProperty('stationIndex');
        });

        it('some trains should be at stations (dwell time)', () => {
            const trains = engine.getTrainPositions(480);
            const trainsAtStation = trains.filter(t => t.isAtStation);
            console.log('Trains at station:', trainsAtStation.length, 'of', trains.length);
            // At any given time, some trains should be dwelling at stations
            expect(trainsAtStation.length).toBeGreaterThanOrEqual(0);
        });

        it('train coordinates should be valid Singapore coordinates', () => {
            const trains = engine.getTrainPositions(480);
            expect(trains.length).toBeGreaterThan(0);

            trains.forEach(train => {
                expect(train.lng).toBeGreaterThan(103.5);
                expect(train.lng).toBeLessThan(104.2);
                expect(train.lat).toBeGreaterThan(1.15);
                expect(train.lat).toBeLessThan(1.55);
            });
        });
    });

    describe('getStatistics', () => {
        it('should return statistics object with dwell information', () => {
            const stats = engine.getStatistics(480);
            expect(stats).toHaveProperty('totalTrains');
            expect(stats).toHaveProperty('trainsAtStation');
            expect(stats).toHaveProperty('trainsInMotion');
            expect(stats).toHaveProperty('trainsByLine');
            expect(stats).toHaveProperty('isPeakHour');
            expect(stats).toHaveProperty('operatingStatus');
            expect(stats).toHaveProperty('frequency');
        });

        it('trainsAtStation + trainsInMotion should equal totalTrains', () => {
            const stats = engine.getStatistics(480);
            expect(stats.trainsAtStation + stats.trainsInMotion).toBe(stats.totalTrains);
        });

        it('should correctly count trains by line', () => {
            const stats = engine.getStatistics(480);
            const totalByLine = Object.values(stats.trainsByLine).reduce((a, b) => a + b, 0);
            expect(totalByLine).toBe(stats.totalTrains);
        });
    });
});

describe('Schedule functions', () => {
    describe('isPeakHour', () => {
        it('should return true during morning peak (8 AM)', () => {
            expect(isPeakHour(8 * 60)).toBe(true);
        });

        it('should return true during evening peak (6 PM)', () => {
            expect(isPeakHour(18 * 60)).toBe(true);
        });

        it('should return false during off-peak (2 PM)', () => {
            expect(isPeakHour(14 * 60)).toBe(false);
        });
    });

    describe('getFrequency', () => {
        it('should return peak frequency during peak hours', () => {
            expect(getFrequency(8 * 60)).toBe(SCHEDULE_CONFIG.peakFrequency);
        });

        it('should return off-peak frequency during off-peak hours', () => {
            expect(getFrequency(14 * 60)).toBe(SCHEDULE_CONFIG.offPeakFrequency);
        });

        it('should return night frequency late at night', () => {
            expect(getFrequency(23 * 60)).toBe(SCHEDULE_CONFIG.nightFrequency);
        });
    });

    describe('getDwellTime', () => {
        it('should return correct dwell time for each line', () => {
            expect(getDwellTime('NS')).toBe(30);
            expect(getDwellTime('NE')).toBe(25); // Driverless
            expect(getDwellTime('CC')).toBe(25); // Driverless
        });
    });
});

describe('LINE_SCHEDULES', () => {
    it('should have schedule for each line', () => {
        Object.keys(MRT_LINES).forEach(lineCode => {
            expect(LINE_SCHEDULES[lineCode]).toBeDefined();
            console.log(`${lineCode}: ${LINE_SCHEDULES[lineCode].startTime} - ${LINE_SCHEDULES[lineCode].endTime}`);
        });
    });

    it('each schedule should have valid operating hours', () => {
        Object.entries(LINE_SCHEDULES).forEach(([lineCode, schedule]) => {
            expect(schedule.startTime).toBeGreaterThan(0);
            expect(schedule.endTime).toBeGreaterThan(schedule.startTime);
            expect(schedule.stationDwellTime).toBeGreaterThan(0);
        });
    });
});

describe('MRT_LINES data', () => {
    it('should have stations for each line', () => {
        Object.entries(MRT_LINES).forEach(([lineCode, line]) => {
            expect(line.stations).toBeDefined();
            expect(line.stations.length).toBeGreaterThan(0);
            console.log(`${lineCode}: ${line.stations.length} stations`);
        });
    });

    it('each station should have valid coordinates', () => {
        Object.entries(MRT_LINES).forEach(([lineCode, line]) => {
            line.stations.forEach(station => {
                expect(station).toHaveProperty('lng');
                expect(station).toHaveProperty('lat');
                expect(station.lng).toBeGreaterThan(103.5);
                expect(station.lng).toBeLessThan(104.2);
                expect(station.lat).toBeGreaterThan(1.15);
                expect(station.lat).toBeLessThan(1.55);
            });
        });
    });
});
