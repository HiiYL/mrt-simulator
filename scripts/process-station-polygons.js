
import fs from 'fs';
import path from 'path';

const inputFile = 'src/data/sgraildata/data/raw/master-plan-2019-rail-station-layer-geojson.geojson';
const outputFile = 'src/data/station-polygons.json';

if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file '${inputFile}' not found.`);
    process.exit(1);
}

const rawContent = fs.readFileSync(inputFile, 'utf8');
const rawData = JSON.parse(rawContent);

console.log(`Processing ${rawData.features.length} station polygons...`);

const processedFeatures = rawData.features.map(f => {
    const desc = f.properties.Description || '';

    // Extract Name using Regex
    // Look for <th>NAME</th> followed by <td>VALUE</td>
    const nameMatch = desc.match(/<th>NAME<\/th>\s*<td>(.*?)<\/td>/);
    let name = nameMatch ? nameMatch[1] : 'Unknown';

    // Cleanup name
    // e.g. "SERANGOON INTERCHANGE" -> "Serangoon"
    // "COVE" -> "Cove"
    // Title Case
    name = toTitleCase(name.replace(/INTERCHANGE/g, '').replace(/MRT STATION/g, '').replace(/LRT STATION/g, '').trim());

    return {
        type: 'Feature',
        properties: {
            name: name,
            original_name: nameMatch ? nameMatch[1] : null,
            height: 15 // Default height for 3D extrusion
        },
        geometry: f.geometry
    };
});

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

const outputData = {
    type: "FeatureCollection",
    features: processedFeatures
};

fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2));
console.log(`Saved station polygons to ${outputFile}`);
