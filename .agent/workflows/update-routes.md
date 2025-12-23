---
description: Update the detailed MRT route geometry from the sgraildata submodule.
---

This workflow updates `src/data/singapore-mrt-fixed.json` using the local submodule data.

1.  **Update Submodule**
    Ensure the submodule is up to date.
    
    ```bash
    git submodule update --remote --merge
    ```

2.  **Process Routes**
    Run the processing script to extracting lines from the submodule and map them to our system codes.
    // turbo
    ```bash
    node scripts/process-routes.js
    ```

3.  **Align Stations**
    Snap station coordinates to the new track geometry.
    // turbo
    ```bash
    node scripts/align-stations.js
    ```

4.  **Process Station Buildings**
    Extract station models (3D footprints).
    // turbo
    ```bash
    node scripts/process-station-polygons.js
    ```

5.  **Verification**
    Reload the simulator and verify that:
    - Map lines (especially new ones like TE) are visible and curved.
    - Trains follow the tracks correctly.
