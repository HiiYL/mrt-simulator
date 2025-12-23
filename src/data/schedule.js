// Singapore MRT Schedule Configuration
// Based on real operating hours and frequencies

export const SCHEDULE_CONFIG = {
    // Operating hours (in minutes from midnight)
    startTime: 5 * 60 + 30, // 5:30 AM
    endTime: 24 * 60,       // 12:00 AM (midnight)

    // Peak hours (morning and evening)
    peakHours: [
        { start: 7 * 60, end: 9 * 60 },     // 7:00 AM - 9:00 AM
        { start: 17 * 60, end: 20 * 60 }    // 5:00 PM - 8:00 PM
    ],

    // Train frequency in minutes
    peakFrequency: 2.5,      // 2-3 minutes during peak
    offPeakFrequency: 6,     // 5-7 minutes during off-peak

    // Average journey time between stations (minutes)
    avgStationTime: 2.5,

    // Dwell time at stations (seconds)
    dwellTime: 30
};

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
