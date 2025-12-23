// Main App Component
import { useState, useEffect, useCallback, useRef } from 'react';
import MapView from './components/MapView.jsx';
import TimeControls from './components/TimeControls.jsx';
import InfoPanel from './components/InfoPanel.jsx';
import { getSimulationEngine } from './simulation/SimulationEngine.js';
import { SCHEDULE_CONFIG } from './data/schedule.js';
import './index.css';

function App() {
  // Initialize to current real time or start of operations
  const getInitialTime = () => {
    const now = new Date();
    const minutesFromMidnight = now.getHours() * 60 + now.getMinutes();

    // If within operating hours, use current time
    if (minutesFromMidnight >= SCHEDULE_CONFIG.startTime &&
      minutesFromMidnight < SCHEDULE_CONFIG.endTime) {
      return minutesFromMidnight;
    }

    // Otherwise start at 8:00 AM (peak hour)
    return 8 * 60;
  };

  const [currentTime, setCurrentTime] = useState(getInitialTime);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(60); // 60x default (1 sim-second = 1 real-minute)
  const [trains, setTrains] = useState([]);
  const [stats, setStats] = useState(null);

  const simulationEngine = useRef(getSimulationEngine());
  const lastUpdateTime = useRef(Date.now());

  // Animation loop
  useEffect(() => {
    let animationFrame;

    const animate = () => {
      if (isPlaying) {
        const now = Date.now();
        const deltaMs = now - lastUpdateTime.current;
        lastUpdateTime.current = now;

        // Calculate time increment based on playback speed
        // 60x means 1 real second = 1 simulated minute
        const deltaMinutes = (deltaMs / 1000) * (playbackSpeed / 60);

        setCurrentTime(prev => {
          let newTime = prev + deltaMinutes;

          // Loop back to start if past end time
          if (newTime >= SCHEDULE_CONFIG.endTime) {
            newTime = SCHEDULE_CONFIG.startTime;
          }

          return newTime;
        });
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isPlaying, playbackSpeed]);

  // Update train positions when time changes
  useEffect(() => {
    const engine = simulationEngine.current;
    const trainPositions = engine.getTrainPositions(currentTime);
    const statistics = engine.getStatistics(currentTime);

    setTrains(trainPositions);
    setStats(statistics);
  }, [currentTime]);

  const handleTimeChange = useCallback((time) => {
    setCurrentTime(time);
    lastUpdateTime.current = Date.now();
  }, []);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
    lastUpdateTime.current = Date.now();
  }, []);

  const handleSpeedChange = useCallback((speed) => {
    setPlaybackSpeed(speed);
    lastUpdateTime.current = Date.now();
  }, []);

  return (
    <div className="app">
      <MapView trains={trains} />

      <InfoPanel stats={stats} currentTime={currentTime} />

      <TimeControls
        currentTime={currentTime}
        onTimeChange={handleTimeChange}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        playbackSpeed={playbackSpeed}
        onSpeedChange={handleSpeedChange}
      />

      <div className="app-title">
        <h1>Singapore MRT Simulator</h1>
        <p>Real-time 3D visualization of the MRT network</p>
      </div>
    </div>
  );
}

export default App;
