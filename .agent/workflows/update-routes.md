---
description: Update the detailed MRT route geometry (GeoJSON) from external sources.
---

This workflow updates `src/data/singapore-mrt-fixed.json` using fresh data from the community.

1.  **Download Raw Data**
    Download the latest `singapore-mrt.geojson` from a reliable source (e.g., [raphodn/singapore-mrt Gist](https://gist.github.com/raphodn/aca68c6e5b704d021fe0b0d8a376f4aa)).
    Save it to `src/data/raw-routes.geojson`.
    
    ```bash
    curl -L -o src/data/raw-routes.geojson https://gist.githubusercontent.com/raphodn/aca68c6e5b704d021fe0b0d8a376f4aa/raw/singapore-mrt.geojson
    ```

2.  **Process Data**
    Run the processing script to filter, fix, and standardize the GeoJSON.
    // turbo
    ```bash
    node scripts/process-routes.js src/data/raw-routes.geojson src/data/singapore-mrt-fixed.json
    ```

3.  **Cleanup**
    Remove the raw file.
    // turbo
    ```bash
    rm src/data/raw-routes.geojson
    ```

4.  **Verification**
    Reload the simulator and verify that:
    - Map lines are visible.
    - Trains follow the tracks correctly.
