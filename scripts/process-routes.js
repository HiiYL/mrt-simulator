/**
 * Process Routes Data Script
 * 
 * This script transforms the standard sg-rail.geojson from the sgraildata submodule
 * into the standard FeatureCollection required by the MRT Simulator.
 * 
 * Source: src/data/sgraildata/data/v1/sg-rail.geojson
 * Output: src/data/singapore-mrt-fixed.json
 */

import fs from 'fs';
import path from 'path';

const inputFile = process.argv[2] || 'src/data/sgraildata/data/v1/sg-rail.geojson';
const outputFile = process.argv[3] || 'src/data/singapore-mrt-fixed.json';

if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file '${inputFile}' not found.`);
    console.log('Ensure submodule is initialized: git submodule update --init --recursive');
    process.exit(1);
}

const rawContent = fs.readFileSync(inputFile, 'utf8');
const rawData = JSON.parse(rawContent);

console.log(`Processing features from ${inputFile}...`);

const NAME_TO_CODE = {
    'North South Line': 'NS',
    'East West Line': 'EW',
    'North East Line': 'NE',
    'Circle Line': 'CC',
    'Downtown Line': 'DT',
    'Thomson-East Coast Line': 'TE',
    'Bukit Panjang LRT': 'BP',
    'Sengkang LRT (East Loop)': 'SK',
    'Sengkang LRT (West Loop)': 'SK',
    'Punggol LRT (East Loop)': 'PG',
    'Punggol LRT (West Loop)': 'PG'
};

const processedFeatures = rawData.features
    .filter(f => f.geometry && f.geometry.type.includes('LineString')) // Keep LineString and MultiLineString
    .map(f => {
        const name = f.properties.name;
        const code = NAME_TO_CODE[name];

        if (!code) {
            console.warn(`Warning: Unknown line name '${name}'. Skipping assignment or keeping as is.`);
        }

        return {
            type: "Feature",
            geometry: f.geometry,
            properties: {
                ...f.properties,
                code: code || f.properties.code, // Inject mapped code
                type: 'line' // Marker for downstream usage
            }
        };
    })
    .filter(f => f.properties.code); // Only keep recognized lines

const outputData = {
    type: "FeatureCollection",
    features: processedFeatures
};

// Ensure directory exists
const outDir = path.dirname(outputFile);
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2));

console.log(`Successfully wrote ${processedFeatures.length} route features to ${outputFile}`);
