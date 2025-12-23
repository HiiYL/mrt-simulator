// Singapore MRT Schedule Configuration
// Based on real operating hours and frequencies (December 2024)

// Per-line operating hours (in minutes from midnight)
// Weekday schedules
export const LINE_SCHEDULES = {
    NS: {
        name: 'North-South Line',
        startTime: 4 * 60 + 59,   // 4:59 AM
        endTime: 24 * 60 + 15,    // 12:15 AM next day
    },
    EW: {
        name: 'East-West Line',
        startTime: 4 * 60 + 59,   // 4:59 AM
        endTime: 24 * 60 + 16,    // 12:16 AM next day
    },
    NE: {
        name: 'North-East Line',
        startTime: 5 * 60 + 39,   // 5:39 AM
        endTime: 23 * 60 + 25,    // 11:25 PM
    },
    CC: {
        name: 'Circle Line',
        startTime: 5 * 60 + 50,   // 5:50 AM
        endTime: 23 * 60 + 59,    // 11:59 PM
    },
    DT: {
        name: 'Downtown Line',
        startTime: 5 * 60 + 30,   // 5:30 AM
        endTime: 23 * 60 + 35,    // 11:35 PM
    },
    TE: {
        name: 'Thomson-East Coast Line',
        startTime: 5 * 60 + 36,   // 5:36 AM
        endTime: 23 * 60 + 30,    // 11:30 PM
    }
};

export const SCHEDULE_CONFIG = {
    // General operating hours (used for time slider bounds)
    startTime: 4 * 60 + 59, // 4:59 AM (earliest line)
    endTime: 24 * 60 + 16,  // 12:16 AM (latest line)

    // Peak hours (morning and evening)
    peakHours: [
        { start: 7 * 60, end: 9 * 60 },     // 7:00 AM - 9:00 AM
        { start: 17 * 60, end: 19 * 60 }    // 5:00 PM - 7:00 PM
    ],

    // Train frequency in minutes
    peakFrequency: 2.5,      // 2-3 minutes during peak
    offPeakFrequency: 6,     // 5-7 minutes during off-peak

    // Average journey time between stations (minutes)
    avgStationTime: 2.5,

    // Dwell time at stations (seconds)
    dwellTime: 30
};

// Check if a given time is within a line's operating hours
export function isLineOperating(lineCode, timeInMinutes) {
    const schedule = LINE_SCHEDULES[lineCode];
    if (!schedule) return false;

    // Handle times past midnight
    const adjustedTime = timeInMinutes > 24 * 60 ? timeInMinutes : timeInMinutes;
    return adjustedTime >= schedule.startTime && adjustedTime <= schedule.endTime;
}

// Check if a given time (minutes from midnight) is during peak hours
export function isPeakHour(timeInMinutes) {
    return SCHEDULE_CONFIG.peakHours.some(
        peak => timeInMinutes >= peak.start && timeInMinutes <= peak.end
    );
}

// Get train frequency at a given time
export function getFrequency(timeInMinutes) {
    return isPeakHour(timeInMinutes)
        ? SCHEDULE_CONFIG.peakFrequency
        : SCHEDULE_CONFIG.offPeakFrequency;
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
