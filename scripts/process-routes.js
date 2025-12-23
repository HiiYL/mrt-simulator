/**
 * Process Routes Data Script
 * 
 * This script transforms raw GeoJSON data (e.g., from raphodn/singapore-mrt gist)
 * into the standard FeatureCollection required by the MRT Simulator.
 * 
 * Usage: node scripts/process-routes.js [input_file] [output_file]
 * Default Input: src/data/raw-routes.geojson (you must download this first)
 * Default Output: src/data/singapore-mrt-fixed.json
 */

import fs from 'fs';
import path from 'path';

const inputFile = process.argv[2] || 'src/data/raw-routes.geojson';
const outputFile = process.argv[3] || 'src/data/singapore-mrt-fixed.json';

if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file '${inputFile}' not found.`);
    console.log('Please download the raw GeoJSON first. Example source:');
    console.log('https://gist.githubusercontent.com/raphodn/aca68c6e5b704d021fe0b0d8a376f4aa/raw/singapore-mrt.geojson');
    process.exit(1);
}

const rawContent = fs.readFileSync(inputFile, 'utf8');
let rawData;
try {
    rawData = JSON.parse(rawContent);
} catch (e) {
    console.error('Error parsing JSON:', e.message);
    process.exit(1);
}

// Check if it's the specific non-standard format (Features are objects with type:LineString at root)
// OR if it's a standard FeatureCollection
let featuresToProcess = [];
if (rawData.type === 'FeatureCollection' && Array.isArray(rawData.features)) {
    featuresToProcess = rawData.features;
} else if (Array.isArray(rawData)) {
    featuresToProcess = rawData;
} else {
    // Maybe root is the feature?
    featuresToProcess = [rawData];
}

console.log(`Processing ${featuresToProcess.length} raw items...`);

const processedFeatures = featuresToProcess
    .filter(item => {
        // Filter logic: Must be a LineString (routes)
        // Some raw data has 'type': 'LineString' at root, some inside 'geometry'
        const type = item.type || (item.geometry && item.geometry.type);
        const props = item.properties || {};

        // We only want Lines, not Stations (Points)
        // Adjust filter based on observed data
        // Observed: properties.type === 'line' OR properties.code matches known lines

        // If it's a Point, skip
        if (type === 'Point') return false;

        // If properties say it's a line
        if (props.type === 'line') return true;

        // Fallback: Check valid line code
        const validCodes = ['NS', 'EW', 'NE', 'CC', 'DT', 'TE', 'CG', 'BP', 'SK', 'PG'];
        if (props.code && validCodes.includes(props.code)) return true;

        return false;
    })
    .map(item => {
        // Standardize structure to GeoJSON Feature
        // Output: { type: "Feature", geometry: { type: "LineString", coordinates: [...] }, properties: { ... } }

        const type = item.type === 'Feature' ? item.geometry.type : item.type;
        const coords = item.type === 'Feature' ? item.geometry.coordinates : item.coordinates;
        const props = item.properties || {};

        return {
            type: "Feature",
            geometry: {
                type: type, // Should be LineString or MultiLineString
                coordinates: coords
            },
            properties: props
        };
    });

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
