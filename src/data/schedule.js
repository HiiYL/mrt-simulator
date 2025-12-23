// Singapore MRT Schedule Configuration
// Official operating hours from SMRT and SBS Transit (December 2024)

// Per-line operating hours (in minutes from midnight)
// Based on first/last train from central stations (weekday schedules)
export const LINE_SCHEDULES = {
    NS: {
        name: 'North-South Line',
        operator: 'SMRT',
        // First train: ~5:00 AM, Last train: ~12:15 AM
        startTime: 5 * 60,        // 5:00 AM
        endTime: 24 * 60 + 15,    // 12:15 AM next day
        stationDwellTime: 30,     // seconds at each station
    },
    EW: {
        name: 'East-West Line',
        operator: 'SMRT',
        // First train: ~5:00 AM, Last train: ~12:16 AM
        startTime: 5 * 60,        // 5:00 AM
        endTime: 24 * 60 + 16,    // 12:16 AM next day
        stationDwellTime: 30,
    },
    NE: {
        name: 'North-East Line',
        operator: 'SBS Transit',
        // First train: ~5:39 AM, Last train: ~11:25 PM
        startTime: 5 * 60 + 39,   // 5:39 AM
        endTime: 23 * 60 + 25,    // 11:25 PM
        stationDwellTime: 25,     // Driverless trains, slightly faster
    },
    CC: {
        name: 'Circle Line',
        operator: 'SMRT',
        // First train: ~5:50 AM, Last train: ~11:59 PM
        startTime: 5 * 60 + 50,   // 5:50 AM
        endTime: 23 * 60 + 59,    // 11:59 PM
        stationDwellTime: 25,     // Driverless trains
    },
    DT: {
        name: 'Downtown Line',
        operator: 'SBS Transit',
        // First train: ~6:04 AM, Last train: ~12:07 AM (from Downtown station)
        startTime: 6 * 60 + 4,    // 6:04 AM
        endTime: 24 * 60 + 7,     // 12:07 AM next day
        stationDwellTime: 25,     // Driverless trains
    },
    TE: {
        name: 'Thomson-East Coast Line',
        operator: 'SMRT',
        // First train: ~5:48 AM, Last train: ~12:26 AM
        startTime: 5 * 60 + 48,   // 5:48 AM
        endTime: 24 * 60 + 26,    // 12:26 AM next day
        stationDwellTime: 25,     // Driverless trains
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

    // Train frequency in minutes (based on LTA data)
    peakFrequency: 2,         // 2 minutes during peak
    offPeakFrequency: 5,      // 5 minutes during off-peak
    nightFrequency: 7,        // 7 minutes late night (after 10 PM)

    // Average travel time between stations (minutes)
    avgTravelTime: 2,         // 2 minutes between stations

    // Default dwell time at stations (seconds)
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
    return timeInMinutes >= 22 * 60; // After 10 PM
}

// Get train frequency at a given time
export function getFrequency(timeInMinutes) {
    if (isPeakHour(timeInMinutes)) {
        return SCHEDULE_CONFIG.peakFrequency;
    }
    if (isLateNight(timeInMinutes)) {
        return SCHEDULE_CONFIG.nightFrequency;
    }
    return SCHEDULE_CONFIG.offPeakFrequency;
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
