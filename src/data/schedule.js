// Singapore MRT Schedule Configuration
// Official operating hours from SMRT and SBS Transit (December 2024)
// Travel times based on actual journey data

// Per-line operating hours and configuration
export const LINE_SCHEDULES = {
    NS: {
        name: 'North-South Line',
        operator: 'SMRT',
        startTime: 5 * 60,        // 5:00 AM
        endTime: 24 * 60 + 15,    // 12:15 AM next day
        stationDwellTime: 30,     // seconds at each station
        avgTravelTime: 2.5,       // minutes between stations (varies 2-4 min)
        peakFrequency: 2,         // minutes during peak
        offPeakFrequency: 5,      // minutes during off-peak
        maxFleet: 99,             // NS+EW share 198 trains, split evenly
        depots: ['NS1', 'NS7', 'NS17', 'NS28'], // Jurong East, Kranji, Bishan, Marina South Pier
    },
    EW: {
        name: 'East-West Line',
        operator: 'SMRT',
        startTime: 5 * 60,        // 5:00 AM
        endTime: 24 * 60 + 16,    // 12:16 AM next day
        stationDwellTime: 30,
        avgTravelTime: 2.5,       // minutes between stations
        peakFrequency: 2,
        offPeakFrequency: 5,
        maxFleet: 99,             // NS+EW share 198 trains, split evenly
        depots: ['EW1', 'EW12', 'EW24', 'EW33'], // Pasir Ris, Bugis, Jurong East, Tuas Link
    },
    NE: {
        name: 'North-East Line',
        operator: 'SBS Transit',
        startTime: 5 * 60 + 39,   // 5:39 AM
        endTime: 23 * 60 + 25,    // 11:25 PM
        stationDwellTime: 25,     // Driverless trains, slightly faster
        avgTravelTime: 2.5,
        peakFrequency: 2,
        offPeakFrequency: 5,
        maxFleet: 49,             // Official fleet: 49 trains
        depots: ['NE1', 'NE6', 'NE16', 'NE17'], // Harbourfront, Dhoby Ghaut, Sengkang, Punggol
    },
    CC: {
        name: 'Circle Line',
        operator: 'SMRT',
        startTime: 5 * 60 + 50,   // 5:50 AM
        endTime: 23 * 60 + 59,    // 11:59 PM
        stationDwellTime: 25,     // Driverless trains
        avgTravelTime: 2,         // Circle line generally faster
        peakFrequency: 2,
        offPeakFrequency: 4,
        maxFleet: 64,             // Official fleet: 64 trains
        depots: ['CC1', 'CC11', 'CC29'], // Dhoby Ghaut, Tai Seng (Kim Chuan), Harbourfront
    },
    CE: {
        name: 'Circle Extension',
        operator: 'SMRT',
        startTime: 6 * 60,        // ~6:00 AM
        endTime: 23 * 60 + 50,    // ~11:50 PM
        stationDwellTime: 25,
        avgTravelTime: 2,
        peakFrequency: 5,         // Shuttle service less frequent
        offPeakFrequency: 7,
        maxFleet: 4,              // Small shuttle fleet
        depots: ['CC4'],          // Promenade (start)
    },
    DT: {
        name: 'Downtown Line',
        operator: 'SBS Transit',
        startTime: 6 * 60 + 4,    // 6:04 AM
        endTime: 24 * 60 + 7,     // 12:07 AM next day
        stationDwellTime: 25,     // Driverless trains
        avgTravelTime: 2,
        peakFrequency: 2,
        offPeakFrequency: 5,
        maxFleet: 92,             // Official fleet: 92 trains
        depots: ['DT1', 'DT27', 'DT35'], // Bukit Panjang (Gali Batu), Ubi (Kim Chuan), Expo
    },
    TE: {
        name: 'Thomson-East Coast Line',
        operator: 'SMRT',
        startTime: 5 * 60 + 48,   // 5:48 AM
        endTime: 24 * 60 + 26,    // 12:26 AM next day
        stationDwellTime: 25,     // Driverless trains
        avgTravelTime: 2.5,
        peakFrequency: 3,         // TEL slightly less frequent
        offPeakFrequency: 6,
        maxFleet: 91,             // Official fleet: 91 trains
        depots: ['TE1', 'TE9', 'TE29'], // Woodlands North, Caldecott/Mandai, Bayshore
    },
    CG: {
        name: 'Changi Airport Line',
        operator: 'SMRT',
        startTime: 5 * 60 + 20,   // 5:20 AM
        endTime: 24 * 60 + 6,     // 12:06 AM next day
        stationDwellTime: 40,     // Longer dwell at airport
        avgTravelTime: 3,         // Tanah Merah-Expo: 2 min, Expo-Changi: 4 min
        peakFrequency: 8,         // 7-9 minutes during peak
        offPeakFrequency: 12,     // 12-15 minutes during off-peak
        maxFleet: 6,              // Small shuttle service
        depots: ['CG2'],          // Changi Airport
    },
    // LRT Systems - loop-based, unidirectional on weekends
    BP: {
        name: 'Bukit Panjang LRT',
        operator: 'SMRT',
        startTime: 5 * 60 + 5,    // 5:05 AM
        endTime: 24 * 60 + 5,     // 12:05 AM next day
        stationDwellTime: 20,     // Short dwell for LRT
        avgTravelTime: 1.5,       // Shorter distances between stations
        peakFrequency: 3,         // 3-4 minutes during peak
        offPeakFrequency: 5,      // 5-7 minutes during off-peak
        maxFleet: 32,             // Official fleet: 32 trains
        isLoop: true,             // LRT operates in a loop, not back-and-forth
        weekendUnidirectional: true, // Only one direction on weekends/holidays
        depots: ['BP1'],          // Choa Chu Kang
    },
    SK: {
        name: 'Sengkang LRT',
        operator: 'SBS Transit',
        startTime: 5 * 60 + 18,   // 5:18 AM (from LTA data)
        endTime: 24 * 60 + 37,    // 12:37 AM next day
        stationDwellTime: 20,     // Short dwell for LRT
        avgTravelTime: 1.5,       // Shorter distances between stations
        peakFrequency: 3,
        offPeakFrequency: 5,
        maxFleet: 20,             // Sengkang-Punggol LRT share ~40 trains
        isLoop: true,             // LRT operates in a loop, not back-and-forth
        weekendUnidirectional: true, // Only one direction on weekends/holidays
        depots: ['STC'],          // Sengkang
    },
    PG: {
        name: 'Punggol LRT',
        operator: 'SBS Transit',
        startTime: 5 * 60 + 18,   // 5:18 AM (from LTA data)
        endTime: 24 * 60 + 40,    // 12:40 AM next day
        stationDwellTime: 20,     // Short dwell for LRT
        avgTravelTime: 1.5,       // Shorter distances between stations
        peakFrequency: 3,
        offPeakFrequency: 5,
        maxFleet: 20,             // Sengkang-Punggol LRT share ~40 trains
        isLoop: true,             // LRT operates in a loop, not back-and-forth
        weekendUnidirectional: true, // Only one direction on weekends/holidays
        depots: ['PTC'],          // Punggol
    }
};

export const SCHEDULE_CONFIG = {
    // General operating hours (used for time slider bounds)
    startTime: 5 * 60,          // 5:00 AM (earliest line)
    endTime: 24 * 60 + 26,      // 12:26 AM (latest line)

    // Peak hours (morning and evening) - official LTA definition
    peakHours: [
        { start: 7 * 60 + 30, end: 9 * 60 + 30 },   // 7:30 AM - 9:30 AM
        { start: 17 * 60, end: 20 * 60 }            // 5:00 PM - 8:00 PM
    ],

    // Default frequencies (used if line doesn't specify)
    peakFrequency: 2,
    offPeakFrequency: 5,
    nightFrequency: 7,

    // Default values
    avgTravelTime: 2.5,
    defaultDwellTime: 30
};

// Check if a given time is within a line's operating hours
export function isLineOperating(lineCode, timeInMinutes) {
    const schedule = LINE_SCHEDULES[lineCode];
    if (!schedule) return false;
    return timeInMinutes >= schedule.startTime && timeInMinutes <= schedule.endTime;
}

// Check if a given time (minutes from midnight) is during peak hours
export function isPeakHour(timeInMinutes) {
    return SCHEDULE_CONFIG.peakHours.some(
        peak => timeInMinutes >= peak.start && timeInMinutes <= peak.end
    );
}

// Check if it's late night (after 10 PM)
export function isLateNight(timeInMinutes) {
    return timeInMinutes >= 22 * 60;
}

// Get train frequency for a specific line at a given time
export function getLineFrequency(lineCode, timeInMinutes) {
    const schedule = LINE_SCHEDULES[lineCode];
    if (!schedule) return getFrequency(timeInMinutes);

    if (isPeakHour(timeInMinutes)) {
        return schedule.peakFrequency || SCHEDULE_CONFIG.peakFrequency;
    }
    if (isLateNight(timeInMinutes)) {
        return SCHEDULE_CONFIG.nightFrequency;
    }
    return schedule.offPeakFrequency || SCHEDULE_CONFIG.offPeakFrequency;
}

// Get default train frequency at a given time (for backward compatibility)
export function getFrequency(timeInMinutes) {
    if (isPeakHour(timeInMinutes)) {
        return SCHEDULE_CONFIG.peakFrequency;
    }
    if (isLateNight(timeInMinutes)) {
        return SCHEDULE_CONFIG.nightFrequency;
    }
    return SCHEDULE_CONFIG.offPeakFrequency;
}

// Get travel time between stations for a specific line
export function getTravelTime(lineCode) {
    const schedule = LINE_SCHEDULES[lineCode];
    return schedule?.avgTravelTime || SCHEDULE_CONFIG.avgTravelTime;
}

// Get dwell time for a specific line (in seconds)
export function getDwellTime(lineCode) {
    const schedule = LINE_SCHEDULES[lineCode];
    return schedule?.stationDwellTime || SCHEDULE_CONFIG.defaultDwellTime;
}

// Convert minutes from midnight to HH:MM format
export function formatTime(minutes) {
    const hours = Math.floor(minutes / 60) % 24;
    const mins = Math.floor(minutes % 60);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Parse time string (HH:MM) to minutes from midnight
export function parseTime(timeStr) {
    const [hours, mins] = timeStr.split(':').map(Number);
    return hours * 60 + mins;
}

// Get time range for the simulator
export function getTimeRange() {
    return {
        start: SCHEDULE_CONFIG.startTime,
        end: SCHEDULE_CONFIG.endTime,
        duration: SCHEDULE_CONFIG.endTime - SCHEDULE_CONFIG.startTime
    };
}

// Get operating status string for display
export function getOperatingStatus(timeInMinutes) {
    if (isPeakHour(timeInMinutes)) {
        return 'Peak Hour';
    }
    if (isLateNight(timeInMinutes)) {
        return 'Late Night';
    }
    return 'Off-Peak';
}
