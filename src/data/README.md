# Data Directory

This directory contains the static data used by the MRT Simulator.

## Files

- **`mrt-routes.js`**: Defines the logical structure of the MRT network, including Lines (codes, names, colors) and Stations (codes, names, approximate coordinates). Note that the coordinates here are used for "Station Markers" and as anchors for interpolation.
- **`singapore-mrt-fixed.json`**: A high-fidelity GeoJSON FeatureCollection containing the actual Curved Polyline geometry for each MRT/LRT line. This is used for rendering the lines on the map and for calculating detailed train movement paths.
    - **Source**: Derived from open-source community data (e.g., [raphodn/singapore-mrt](https://gist.github.com/raphodn/aca68c6e5b704d021fe0b0d8a376f4aa)).
    - **Maintenance**: See `scripts/process-routes.js` to regenerate this file from raw data.
- **`depots.js`**: Locations and connection paths for Train Depots.
- **`schedule.js`**: Operating hours, frequencies, and fleet sizes.
- **`travel-times.js`**: Approximate travel times between stations (Logic/Simulation data).

## Updating Route Geometry

If track alignments change (e.g. new lines opening), update `singapore-mrt-fixed.json`.
Refer to `scripts/process-routes.js` or the Agent Workflow "Update MRT Route Geometry".
