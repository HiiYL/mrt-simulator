// Script to calculate inter-station travel times from raw LTA data
// Run with: node scripts/calculate-travel-times.mjs

import { readFileSync, writeFileSync } from 'fs';

// Load raw data
const rawData = JSON.parse(readFileSync('./scripts/lta-raw-timings.json', 'utf8'));

// Line station sequences (in order of travel)
const LINE_SEQUENCES = {
    EW: {
        // CG branch + main line from Pasir Ris to Tuas Link
        mainLine: ['EW1', 'EW2', 'EW3', 'EW4', 'EW5', 'EW6', 'EW7', 'EW8', 'EW9', 'EW10', 'EW11', 'EW12', 'EW13', 'EW14', 'EW15', 'EW16', 'EW17', 'EW18', 'EW19', 'EW20', 'EW21', 'EW22', 'EW23', 'EW24', 'EW25', 'EW26', 'EW27', 'EW28', 'EW29', 'EW30', 'EW31', 'EW32', 'EW33'],
        direction: 'Tuas Link' // Use "towards Tuas Link" direction
    },
    CG: {
        mainLine: ['EW4', 'CG1', 'CG2'], // Tanah Merah to Changi Airport
        direction: 'Changi Airport'
    },
    NS: {
        mainLine: ['NS1', 'NS2', 'NS3', 'NS4', 'NS5', 'NS7', 'NS8', 'NS9', 'NS10', 'NS11', 'NS12', 'NS13', 'NS14', 'NS15', 'NS16', 'NS17', 'NS18', 'NS19', 'NS20', 'NS21', 'NS22', 'NS23', 'NS24', 'NS25', 'NS26', 'NS27', 'NS28'],
        direction: 'Marina South Pier'
    },
    NE: {
        mainLine: ['NE1', 'NE3', 'NE4', 'NE5', 'NE6', 'NE7', 'NE8', 'NE9', 'NE10', 'NE11', 'NE12', 'NE13', 'NE14', 'NE15', 'NE16', 'NE17', 'NE18'],
        direction: 'Punggol' // Towards the northern terminus
    },
    CC: {
        mainLine: ['CC1', 'CC2', 'CC3', 'CC4', 'CC5', 'CC6', 'CC7', 'CC8', 'CC9', 'CC10', 'CC11', 'CC12', 'CC13', 'CC14', 'CC15', 'CC16', 'CC17', 'CC19', 'CC20', 'CC21', 'CC22', 'CC23', 'CC24', 'CC25', 'CC26', 'CC27', 'CC28', 'CC29'],
        direction: 'HarbourFront'
    },
    DT: {
        mainLine: ['DT1', 'DT2', 'DT3', 'DT5', 'DT6', 'DT7', 'DT8', 'DT9', 'DT10', 'DT11', 'DT12', 'DT13', 'DT14', 'DT15', 'DT16', 'DT17', 'DT18', 'DT19', 'DT20', 'DT21', 'DT22', 'DT23', 'DT24', 'DT25', 'DT26', 'DT27', 'DT28', 'DT29', 'DT30', 'DT31', 'DT32', 'DT33', 'DT34', 'DT35'],
        direction: 'Expo'
    },
    TE: {
        mainLine: ['TE1', 'TE2', 'TE3', 'TE4', 'TE5', 'TE6', 'TE7', 'TE8', 'TE9', 'TE11', 'TE12', 'TE13', 'TE14', 'TE15', 'TE16', 'TE17', 'TE18', 'TE19', 'TE20', 'TE22', 'TE23', 'TE24', 'TE25', 'TE26', 'TE27', 'TE28', 'TE29'],
        direction: 'Bayshore'
    },
    // LRT Systems
    BP: {
        // Bukit Panjang LRT loop
        mainLine: ['BP1', 'BP2', 'BP3', 'BP4', 'BP5', 'BP6', 'BP7', 'BP8', 'BP9', 'BP10', 'BP11', 'BP12', 'BP13', 'BP14'],
        direction: 'Choa Chu Kang'
    },
    SK: {
        // Sengkang LRT - West Loop + East Loop combined
        mainLine: ['SW1', 'SW2', 'SW3', 'SW4', 'SW5', 'SW6', 'SW7', 'SW8', 'SE1', 'SE2', 'SE3', 'SE4', 'SE5'],
        direction: 'Sengkang'
    },
    PG: {
        // Punggol LRT - West Loop + East Loop combined
        mainLine: ['PW1', 'PW2', 'PW3', 'PW4', 'PW5', 'PW6', 'PW7', 'PE1', 'PE2', 'PE3', 'PE4', 'PE5', 'PE6', 'PE7'],
        direction: 'Punggol'
    }
};

function timeToMinutes(timeStr) {
    const hours = parseInt(timeStr.substring(0, 2), 10);
    const minutes = parseInt(timeStr.substring(2, 4), 10);
    return hours * 60 + minutes;
}

function getFirstTrainTime(stationCode, towards) {
    const station = rawData[stationCode];
    if (!station) return null;

    // Find direction that matches (partial match)
    const dir = station.directions.find(d =>
        d.towards.toLowerCase().includes(towards.toLowerCase()) ||
        towards.toLowerCase().includes(d.towards.toLowerCase())
    );

    if (!dir) {
        // Try first available direction
        if (station.directions.length > 0) {
            return timeToMinutes(station.directions[0].firstTrain.weekday);
        }
        return null;
    }

    return timeToMinutes(dir.firstTrain.weekday);
}

function calculateLineTimings(lineCode, config) {
    const results = [];
    const stations = config.mainLine;

    console.log(`\n=== ${lineCode} Line (towards ${config.direction}) ===`);

    for (let i = 0; i < stations.length - 1; i++) {
        const from = stations[i];
        const to = stations[i + 1];

        const fromTime = getFirstTrainTime(from, config.direction);
        const toTime = getFirstTrainTime(to, config.direction);

        if (fromTime !== null && toTime !== null) {
            let travelTime = toTime - fromTime;

            // Handle edge cases
            if (travelTime < 0) travelTime += 24 * 60; // Wrap around midnight
            if (travelTime > 10) {
                console.log(`  [SKIP] ${from} -> ${to}: ${travelTime} min (too long, likely missing data)`);
                results.push({ from, to, time: 2, estimated: true }); // Default estimate
            } else if (travelTime === 0) {
                console.log(`  [SKIP] ${from} -> ${to}: 0 min (same time, using default)`);
                results.push({ from, to, time: 2, estimated: true });
            } else {
                console.log(`  ${from} -> ${to}: ${travelTime} min`);
                results.push({ from, to, time: travelTime, estimated: false });
            }
        } else {
            console.log(`  [MISSING] ${from} -> ${to}: No data (using 2 min default)`);
            results.push({ from, to, time: 2, estimated: true });
        }
    }

    return results;
}

// Calculate for all lines
const allTravelTimes = {};

for (const [lineCode, config] of Object.entries(LINE_SEQUENCES)) {
    allTravelTimes[lineCode] = calculateLineTimings(lineCode, config);
}

// Output as JavaScript export
console.log('\n\n=== GENERATING EXPORT ===\n');

// Create a simple array format per line
const exportData = {};
for (const [lineCode, segments] of Object.entries(allTravelTimes)) {
    exportData[lineCode] = segments.map(s => s.time);
}

console.log('// Inter-station travel times in minutes');
console.log('// Each array represents travel time FROM station[i] TO station[i+1]');
console.log('export const INTER_STATION_TIMES = ' + JSON.stringify(exportData, null, 2) + ';');

// Save to data file
const jsContent = `// Inter-station travel times in minutes (from LTA first train timings)
// Each array represents travel time FROM station[i] TO station[i+1]
// Generated: ${new Date().toISOString()}

export const INTER_STATION_TIMES = ${JSON.stringify(exportData, null, 2)};

// Station timing data for UI display
export const STATION_TIMINGS = ${JSON.stringify(rawData, null, 2)};
`;

writeFileSync('./src/data/travel-times.js', jsContent);
console.log('\nSaved to: ./src/data/travel-times.js');
