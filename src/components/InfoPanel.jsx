// Info Panel Component - Statistics and legend display
import { MRT_LINES, getAllLineCodes } from '../data/mrt-routes.js';
import { formatTime } from '../data/schedule.js';

export function InfoPanel({ stats, currentTime }) {
    const lineCodes = getAllLineCodes();

    return (
        <div className="info-panel">
            <h2>🚇 Singapore MRT</h2>

            <div className="stats-section">
                <div className="stat">
                    <span className="stat-value">{stats?.totalTrains || 0}</span>
                    <span className="stat-label">Active Trains</span>
                </div>
                <div className="stat">
                    <span className="stat-value">{stats?.trainsInMotion || 0}</span>
                    <span className="stat-label">In Motion</span>
                </div>
            </div>

            <div className="operating-status">
                <span className={`status-badge ${stats?.isPeakHour ? 'peak' : 'off-peak'}`}>
                    {stats?.operatingStatus || 'Off-Peak'}
                </span>
                <span className="frequency-info">
                    Every {stats?.frequency || 5} min
                </span>
            </div>

            <div className="legend">
                <h3>MRT Lines</h3>
                {lineCodes.map(code => {
                    const line = MRT_LINES[code];
                    const trainCount = stats?.trainsByLine?.[code] || 0;
                    return (
                        <div key={code} className="legend-item">
                            <span
                                className="legend-color"
                                style={{ backgroundColor: line.color }}
                            />
                            <span className="legend-name">{line.name}</span>
                            <span className="legend-count">{trainCount}</span>
                        </div>
                    );
                })}
            </div>

            <div className="credits">
                <p>Based on official SMRT/SBS schedules</p>
                <p>© 2024 MRT Simulator</p>
            </div>
        </div>
    );
}

export default InfoPanel;
