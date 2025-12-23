// Singapore MRT Depot Data
// Coordinates are approximate based on real-world locations
// Connections define the path from depot to the main line

export const DEPOTS = {
    // North-South Line Depots
    'BSD': {
        name: 'Bishan Depot',
        coordinates: [103.8520, 1.3530], // North of Bishan Stn
        capacity: 50,
        servesLines: ['NS', 'CC'], // Main depot for NS, maintenance for CC
        connection: {
            lineCode: 'NS',
            stationCode: 'NS17', // Bishan
            path: [
                [103.8520, 1.3530], // Depot Center
                [103.8500, 1.3520], // Exit
                [103.8485, 1.3511]  // Bishan Station
            ]
        }
    },
    'UPD': {
        name: 'Ulu Pandan Depot',
        coordinates: [103.7560, 1.3260], // South-East of Jurong East
        capacity: 40,
        servesLines: ['NS', 'EW'],
        connection: {
            lineCode: 'NS', // Techncially connects to both, we'll model it as NS injection
            stationCode: 'NS1', // Jurong East
            path: [
                [103.7560, 1.3260],
                [103.7500, 1.3290],
                [103.7422, 1.3329]  // Jurong East
            ]
        }
    },

    // East-West Line Depots
    'CHD': {
        name: 'Changi Depot',
        coordinates: [103.9560, 1.3380], // Near Koh Sek Lim Rd
        capacity: 35,
        servesLines: ['EW'],
        connection: {
            lineCode: 'EW',
            stationCode: 'EW4', // Tanah Merah
            path: [
                [103.9560, 1.3380],
                [103.9500, 1.3320],
                [103.9463, 1.3272]  // Tanah Merah
            ]
        }
    },
    'TWD': {
        name: 'Tuas Depot',
        coordinates: [103.6270, 1.3200], // Near Tuas Link
        capacity: 60,
        servesLines: ['EW'],
        connection: {
            lineCode: 'EW',
            stationCode: 'EW33', // Tuas Link
            path: [
                [103.6270, 1.3200],
                [103.6320, 1.3300],
                [103.6368, 1.3403]  // Tuas Link
            ]
        }
    },

    // North-East Line Depot
    'SKD': {
        name: 'Sengkang Depot',
        coordinates: [103.8940, 1.3960], // North of Sengkang Stn
        capacity: 50,
        servesLines: ['NE', 'SK', 'PG'],
        connection: {
            lineCode: 'NE',
            stationCode: 'NE16', // Sengkang
            path: [
                [103.8940, 1.3960],
                [103.89549, 1.39178] // Sengkang Stn
            ]
        }
    },

    // Circle Line Depot
    'KCD': {
        name: 'Kim Chuan Depot',
        coordinates: [103.8870, 1.3410], // Near Tai Seng
        capacity: 70, // World's largest underground depot
        servesLines: ['CC', 'DT'],
        connection: {
            lineCode: 'CC',
            stationCode: 'CC11', // Tai Seng
            path: [
                [103.8870, 1.3410],
                [103.8878, 1.3360]  // Tai Seng
            ]
        }
        // Note: DTL also connects here, but we simplify 1 connection per depot object for now
        // or duplicate for DTL logic
    },

    // Downtown Line Depot
    'GBD': {
        name: 'Gali Batu Depot',
        coordinates: [103.7590, 1.3850], // North of BP
        capacity: 40,
        servesLines: ['DT'],
        connection: {
            lineCode: 'DT',
            stationCode: 'DT1', // Bukit Panjang
            path: [
                [103.7590, 1.3850],
                [103.7633, 1.3784]  // Bukit Panjang
            ]
        }
    },

    // Thomson-East Coast Line Depot
    'MDD': {
        name: 'Mandai Depot',
        coordinates: [103.7910, 1.4170], // Near Woodlands
        capacity: 90,
        servesLines: ['TE'],
        connection: {
            lineCode: 'TE',
            stationCode: 'TE3', // Woodlands South
            path: [
                [103.7910, 1.4170],
                [103.7935, 1.4270]  // Woodlands South
            ]
        }
    },

    // LRT Depots (Co-located usually, except Ten Mile Junction which is closed)
    // We already have SKD (Sengkang).
    // BP Depot is near Ten Mile Junction / BP14 site.
    'BPD': {
        name: 'Ten Mile Junction Depot',
        coordinates: [103.7600, 1.3800], // Approx
        capacity: 32,
        servesLines: ['BP'],
        connection: {
            lineCode: 'BP',
            stationCode: 'BP1', // CCK? Or BP14 site? Let's connect to BP6/DT1 for visual simplicity
            // Actually BP14 was the depot access. Now access is via BP6/BP14 spur.
            stationCode: 'BP6', // Bukit Panjang
            path: [
                [103.7600, 1.3800],
                [103.7633, 1.3784]
            ]
        }
    }
};

// Helper to get depots for a line
export function getDepotsForLine(lineCode) {
    return Object.values(DEPOTS).filter(d => d.servesLines.includes(lineCode));
}
