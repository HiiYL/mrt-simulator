// Time Controls Component - Time scrubber and playback controls
import { useState, useEffect, useRef } from 'react';
import { SCHEDULE_CONFIG, formatTime, isPeakHour } from '../data/schedule.js';

export function TimeControls({
    currentTime,
    onTimeChange,
    isPlaying,
    onPlayPause,
    playbackSpeed,
    onSpeedChange
}) {
    const sliderRef = useRef(null);

    const timeRange = {
        start: SCHEDULE_CONFIG.startTime,
        end: SCHEDULE_CONFIG.endTime,
        duration: SCHEDULE_CONFIG.endTime - SCHEDULE_CONFIG.startTime
    };

    const handleSliderChange = (e) => {
        const value = parseFloat(e.target.value);
        onTimeChange(value);
    };

    const isPeak = isPeakHour(currentTime);

    // Calculate slider percentage for gradient
    const sliderPercent = ((currentTime - timeRange.start) / timeRange.duration) * 100;

    return (
        <div className="time-controls">
            <div className="time-display">
                <div className="current-time">{formatTime(currentTime)}</div>
                <div className={`peak-indicator ${isPeak ? 'peak' : 'off-peak'}`}>
                    {isPeak ? '🚇 Peak Hour' : '🚃 Off-Peak'}
                </div>
            </div>

            <div className="slider-container">
                <span className="time-label">{formatTime(timeRange.start)}</span>
                <div className="slider-wrapper">
                    <input
                        ref={sliderRef}
                        type="range"
                        min={timeRange.start}
                        max={timeRange.end}
                        step={1}
                        value={currentTime}
                        onChange={handleSliderChange}
                        className="time-slider"
                        style={{
                            background: `linear-gradient(to right, 
                var(--accent-color) 0%, 
                var(--accent-color) ${sliderPercent}%, 
                var(--slider-bg) ${sliderPercent}%, 
                var(--slider-bg) 100%)`
                        }}
                    />
                    {/* Peak hour indicators */}
                    <div className="peak-markers">
                        {SCHEDULE_CONFIG.peakHours.map((peak, i) => {
                            const startPercent = ((peak.start - timeRange.start) / timeRange.duration) * 100;
                            const endPercent = ((peak.end - timeRange.start) / timeRange.duration) * 100;
                            return (
                                <div
                                    key={i}
                                    className="peak-marker"
                                    style={{
                                        left: `${startPercent}%`,
                                        width: `${endPercent - startPercent}%`
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
                <span className="time-label">{formatTime(timeRange.end)}</span>
            </div>

            <div className="playback-controls">
                <button
                    className="play-button"
                    onClick={onPlayPause}
                    title={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? '⏸️' : '▶️'}
                </button>

                <div className="speed-controls">
                    {[1, 10, 60, 300].map(speed => (
                        <button
                            key={speed}
                            className={`speed-button ${playbackSpeed === speed ? 'active' : ''}`}
                            onClick={() => onSpeedChange(speed)}
                            title={`${speed}x speed`}
                        >
                            {speed}x
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TimeControls;
