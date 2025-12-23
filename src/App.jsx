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

    // If within service hours (5AM - 1AM next day), use current time
    if (minutesFromMidnight >= SCHEDULE_CONFIG.serviceStartTime ||
      minutesFromMidnight < (SCHEDULE_CONFIG.endTime % (24 * 60))) {
      // Handle times after midnight (e.g., 12:30 AM = 30 minutes)
      if (minutesFromMidnight < SCHEDULE_CONFIG.serviceStartTime) {
        return minutesFromMidnight + 24 * 60; // Convert to 24+ hour format
      }
      return minutesFromMidnight;
    }

    // Otherwise start at 4:30 AM to see deployment phase
    return 4 * 60 + 30;
  };

  const [displayTime, setDisplayTime] = useState(getInitialTime);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(60);
  const [stats, setStats] = useState(null);

  const simulationEngine = useRef(getSimulationEngine());
  const lastUpdateTime = useRef(Date.now());
  const currentTimeRef = useRef(getInitialTime());
  const mapViewRef = useRef(null);

  // Animation loop - uses refs to avoid re-render cascades
  useEffect(() => {
    let animationFrame;
    let lastDisplayUpdate = 0;

    const animate = (timestamp) => {
      if (isPlaying) {
        const now = Date.now();
        const deltaMs = now - lastUpdateTime.current;
        lastUpdateTime.current = now;

        // Calculate time increment based on playback speed
        const deltaMinutes = (deltaMs / 1000) * (playbackSpeed / 60);

        currentTimeRef.current += deltaMinutes;

        // Loop back to start if past end time
        if (currentTimeRef.current >= SCHEDULE_CONFIG.endTime) {
          currentTimeRef.current = SCHEDULE_CONFIG.startTime;
        }

        // Update train positions directly (no state update)
        const engine = simulationEngine.current;
        const trainPositions = engine.getTrainPositions(currentTimeRef.current);

        // Imperatively update map without re-render
        if (mapViewRef.current) {
          mapViewRef.current.updateTrains(trainPositions);
        }

        // Only update display time and stats every 100ms to reduce re-renders
        if (timestamp - lastDisplayUpdate > 100) {
          lastDisplayUpdate = timestamp;
          setDisplayTime(currentTimeRef.current);
          setStats(engine.getStatistics(currentTimeRef.current));
        }
      }

      animationFrame = requestAnimationFrame(animate);
    };

    // Initial train positions
    const engine = simulationEngine.current;

    // Initial update
    const initialTrains = engine.getTrainPositions(currentTimeRef.current);
    if (mapViewRef.current) {
      mapViewRef.current.updateTrains(initialTrains);
    }

    setStats(engine.getStatistics(currentTimeRef.current));

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isPlaying, playbackSpeed]);

  const handleTimeChange = useCallback((time) => {
    currentTimeRef.current = time;
    setDisplayTime(time);
    lastUpdateTime.current = Date.now();

    const engine = simulationEngine.current;
    const currentTrains = engine.getTrainPositions(time);

    if (mapViewRef.current) {
      mapViewRef.current.updateTrains(currentTrains);
    }

    setStats(engine.getStatistics(time));
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
      <MapView ref={mapViewRef} />

      <InfoPanel stats={stats} currentTime={displayTime} />

      <TimeControls
        currentTime={displayTime}
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
