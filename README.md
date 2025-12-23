# Singapore MRT Simulator

A realistic, high-fidelity visualization of the Singapore MRT (Mass Rapid Transit) network, built with React, Vite, and MapLibre GL JS.

## Features

- **Realistic Simulation**: Trains move across the network based on realistic travel times and dwell times.
- **Detailed Route Geometry**: Uses accurate, real-world curved path data (GeoJSON) for smooth visual tracking.
- **Dynamic Fleet Management**:
    - Simulates demand-based train injection and withdrawal.
    - Trains physically enter/exit via real-world Depot connections.
    - **Peak Hour Logic**: Increases fleet frequency during peak hours (07:00-09:00, 17:00-20:00).
- **Interactive Map**:
    - Vector-based rendering using MapLibre GL JS.
    - Clickable stations.
    - Visual indicators for Lines, Stations, and moving Trains.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- NPM

### Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open `http://localhost:5173` in your browser.

## Data Sources & Updates

The project uses a combination of static configuration and community-sourced GeoJSON data.

- **Route Geometry**: `src/data/singapore-mrt-fixed.json` (Derived from open data).
- **Schedules**: `src/data/schedule.js` (Simulated frequencies).
- **Depots**: `src/data/depots.js` (Real-world locations).

### Updating Maps
If the MRT network changes (new lines/stations), you can update the geometry using the included workflow:
1.  Download fresh GeoJSON data.
2.  Run `node scripts/process-routes.js <file>`.
3.  See `.agent/workflows/update-routes.md` for details.

## Tech Stack

- **Framework**: React + Vite
- **Map Engine**: MapLibre GL JS
- **Language**: JavaScript (ES Modules)

## Project Structure

- `src/components/`: UI Components (`MapView`, `TimeControls`, etc.)
- `src/simulation/`: Core Logic (`SimulationEngine`, `RouteInterpolator`)
- `src/data/`: Static data files and assets.
