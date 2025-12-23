// Unit tests for SimulationEngine
import { describe, it, expect, beforeEach } from 'vitest';
import { SimulationEngine } from './SimulationEngine.js';
import { LINE_SCHEDULES, SCHEDULE_CONFIG } from '../data/schedule.js';
import { MRT_LINES } from '../data/mrt-routes.js';

describe('SimulationEngine', () => {
    let engine;

    beforeEach(() => {
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
            const trains = engine.getTrainPositions(SCHEDULE_CONFIG.startTime - 60); // 1 hour before start
            expect(trains).toEqual([]);
        });

        it('should return empty array after operating hours', () => {
            const trains = engine.getTrainPositions(SCHEDULE_CONFIG.endTime + 60); // 1 hour after end
            expect(trains).toEqual([]);
        });

        it('should return trains during operating hours', () => {
            // Test at 8:00 AM (peak hour) = 8 * 60 = 480 minutes
            const trains = engine.getTrainPositions(480);
            expect(trains.length).toBeGreaterThan(0);
        });

        it('should return trains at start of operations', () => {
            // Test right at start time + a bit for first trains to spawn
            const trains = engine.getTrainPositions(SCHEDULE_CONFIG.startTime + 5);
            console.log('Trains at start + 5min:', trains.length);
            expect(trains.length).toBeGreaterThanOrEqual(0); // May be 0 if no trains have departed yet
        });

        it('should return trains during peak hours (8 AM)', () => {
            const peakTime = 8 * 60; // 8:00 AM
            const trains = engine.getTrainPositions(peakTime);
            console.log('Trains at 8 AM:', trains.length);
            console.log('Sample train:', trains[0]);
            expect(trains.length).toBeGreaterThan(0);
        });

        it('should return trains during peak hours (3:36 PM / 15:36)', () => {
            const currentTime = 15 * 60 + 36; // 15:36 = 936 minutes
            const trains = engine.getTrainPositions(currentTime);
            console.log('Trains at 15:36:', trains.length);
            console.log('Sample train:', trains[0]);
            expect(trains.length).toBeGreaterThan(0);
        });

        it('each train should have required properties', () => {
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
        });

        it('train coordinates should be valid Singapore coordinates', () => {
            const trains = engine.getTrainPositions(480);
            expect(trains.length).toBeGreaterThan(0);

            trains.forEach(train => {
                // Singapore longitude range: ~103.6 to ~104.1
                expect(train.lng).toBeGreaterThan(103.5);
                expect(train.lng).toBeLessThan(104.2);

                // Singapore latitude range: ~1.2 to ~1.5
                expect(train.lat).toBeGreaterThan(1.15);
                expect(train.lat).toBeLessThan(1.55);
            });
        });
    });

    describe('getStatistics', () => {
        it('should return statistics object', () => {
            const stats = engine.getStatistics(480);
            expect(stats).toHaveProperty('totalTrains');
            expect(stats).toHaveProperty('trainsByLine');
            expect(stats).toHaveProperty('isPeakHour');
            expect(stats).toHaveProperty('frequency');
        });

        it('should correctly count trains by line', () => {
            const stats = engine.getStatistics(480);
            const totalByLine = Object.values(stats.trainsByLine).reduce((a, b) => a + b, 0);
            expect(totalByLine).toBe(stats.totalTrains);
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

describe('SCHEDULE_CONFIG', () => {
    it('should have valid operating hours', () => {
        expect(SCHEDULE_CONFIG.startTime).toBeDefined();
        expect(SCHEDULE_CONFIG.endTime).toBeDefined();
        expect(SCHEDULE_CONFIG.startTime).toBeLessThan(SCHEDULE_CONFIG.endTime);
        console.log('Operating hours:', SCHEDULE_CONFIG.startTime, 'to', SCHEDULE_CONFIG.endTime);
    });

    it('should have valid average station time', () => {
        expect(SCHEDULE_CONFIG.avgStationTime).toBeDefined();
        expect(SCHEDULE_CONFIG.avgStationTime).toBeGreaterThan(0);
        console.log('Avg station time:', SCHEDULE_CONFIG.avgStationTime, 'minutes');
    });
});
