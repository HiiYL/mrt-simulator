// Script to fetch first train timings from LTA and save raw data
// Run with: node scripts/fetch-travel-times.mjs

import { writeFileSync } from 'fs';

const LINE_STATIONS = {
    EWL: ['CG2', 'CG1', 'EW1', 'EW2', 'EW3', 'EW4', 'EW5', 'EW6', 'EW7', 'EW8', 'EW9', 'EW10', 'EW11', 'EW12', 'EW13', 'EW14', 'EW15', 'EW16', 'EW17', 'EW18', 'EW19', 'EW20', 'EW21', 'EW22', 'EW23', 'EW24', 'EW25', 'EW26', 'EW27', 'EW28', 'EW29', 'EW30', 'EW31', 'EW32', 'EW33'],
    NSL: ['NS1', 'NS2', 'NS3', 'NS4', 'NS5', 'NS7', 'NS8', 'NS9', 'NS10', 'NS11', 'NS12', 'NS13', 'NS14', 'NS15', 'NS16', 'NS17', 'NS18', 'NS19', 'NS20', 'NS21', 'NS22', 'NS23', 'NS24', 'NS25', 'NS26', 'NS27', 'NS28'],
    NEL: ['NE1', 'NE3', 'NE4', 'NE5', 'NE6', 'NE7', 'NE8', 'NE9', 'NE10', 'NE11', 'NE12', 'NE13', 'NE14', 'NE15', 'NE16', 'NE17', 'NE18'],
    CCL: ['CC1', 'CC2', 'CC3', 'CC4', 'CC5', 'CC6', 'CC7', 'CC8', 'CC9', 'CC10', 'CC11', 'CC12', 'CC13', 'CC14', 'CC15', 'CC16', 'CC17', 'CC19', 'CC20', 'CC21', 'CC22', 'CC23', 'CC24', 'CC25', 'CC26', 'CC27', 'CC28', 'CC29'],
    DTL: ['DT1', 'DT2', 'DT3', 'DT5', 'DT6', 'DT7', 'DT8', 'DT9', 'DT10', 'DT11', 'DT12', 'DT13', 'DT14', 'DT15', 'DT16', 'DT17', 'DT18', 'DT19', 'DT20', 'DT21', 'DT22', 'DT23', 'DT24', 'DT25', 'DT26', 'DT27', 'DT28', 'DT29', 'DT30', 'DT31', 'DT32', 'DT33', 'DT34', 'DT35'],
    TEL: ['TE1', 'TE2', 'TE3', 'TE4', 'TE5', 'TE6', 'TE7', 'TE8', 'TE9', 'TE11', 'TE12', 'TE13', 'TE14', 'TE15', 'TE16', 'TE17', 'TE18', 'TE19', 'TE20', 'TE22', 'TE23', 'TE24', 'TE25', 'TE26', 'TE27', 'TE28', 'TE29'],
};

async function fetchStationTiming(lineCode, stationCode) {
    const url = `https://www.lta.gov.sg/map/mrt/${lineCode}/${stationCode}.html`;

    try {
        const response = await fetch(url, {
            headers: {
                'Accept': '*/*',
                'Referer': 'https://www.lta.gov.sg/content/ltagov/en/map/train.html',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) {
            console.error(`  [FAIL] ${stationCode}: HTTP ${response.status}`);
            return null;
        }

        const html = await response.text();
        return parseStationHtml(html, stationCode);
    } catch (error) {
        console.error(`  [ERROR] ${stationCode}:`, error.message);
        return null;
    }
}

function parseStationHtml(html, stationCode) {
    const result = {
        stationCode,
        stationName: '',
        directions: []
    };

    // Extract station name from header
    const nameMatch = html.match(/<h4 class="mb-0">([^<]+)<\/h4>/);
    if (nameMatch) {
        result.stationName = nameMatch[1].trim();
    }

    // Extract direction labels from buttons
    const directionLabels = [];
    const labelMatches = html.matchAll(/<label class="btn btn-primary[^"]*"><input[^>]+>([^<]+)<\/label>/g);
    for (const match of labelMatches) {
        directionLabels.push(match[1].trim());
    }

    // Parse each tab (tab1, tab2, tab3)
    for (let i = 1; i <= 3; i++) {
        const tabRegex = new RegExp(`<div class="tab${i}"[^>]*>([\\s\\S]*?)<\\/div>\\s*(?:<div class="tab|<h5 class="mt-5">Exit)`, 'i');
        const tabMatch = html.match(tabRegex);

        if (tabMatch) {
            const tabContent = tabMatch[1];

            // Extract first train times from first-train table
            const firstTrainMatch = tabContent.match(/<table class="table first-train">([\s\S]*?)<\/table>/);
            if (firstTrainMatch) {
                const tableContent = firstTrainMatch[1];

                // Extract all times
                const times = {};
                const rowMatches = tableContent.matchAll(/<tr>\s*<td>([^<]+)<\/td>\s*<td>(\d{4})<\/td>\s*<\/tr>/g);
                for (const row of rowMatches) {
                    const day = row[1].trim();
                    const time = row[2];
                    if (day.includes('Mon')) times.weekday = time;
                    else if (day.includes('Sat')) times.saturday = time;
                    else if (day.includes('Sun')) times.sunday = time;
                }

                if (Object.keys(times).length > 0) {
                    result.directions.push({
                        towards: directionLabels[i - 1] || `Direction ${i}`,
                        firstTrain: times
                    });
                }
            }
        }
    }

    return result;
}

async function main() {
    console.log('=== LTA MRT First Train Timings Fetcher ===\n');

    const allStations = {};
    let successCount = 0;
    let failCount = 0;

    for (const [lineCode, stations] of Object.entries(LINE_STATIONS)) {
        console.log(`\n[${lineCode}] Fetching ${stations.length} stations...`);

        for (const stationCode of stations) {
            const timing = await fetchStationTiming(lineCode, stationCode);
            if (timing && timing.directions.length > 0) {
                allStations[stationCode] = timing;
                console.log(`  [OK] ${stationCode} (${timing.stationName}): ${timing.directions.length} directions`);
                successCount++;
            } else if (timing) {
                console.log(`  [WARN] ${stationCode}: No timing data found`);
                failCount++;
            } else {
                failCount++;
            }
            // Rate limit - wait 150ms between requests
            await new Promise(r => setTimeout(r, 150));
        }
    }

    console.log(`\n=== Summary ===`);
    console.log(`Success: ${successCount}, Failed: ${failCount}`);

    // Save raw data to JSON
    const outputPath = './scripts/lta-raw-timings.json';
    writeFileSync(outputPath, JSON.stringify(allStations, null, 2));
    console.log(`\nRaw data saved to: ${outputPath}`);
}

main();
