import { useEffect, useRef, useState, memo, useImperativeHandle, forwardRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { generateStationsGeoJSON, MRT_LINES, generateStraightLineGeoJSON } from '../data/mrt-routes.js';
import { DEPOTS } from '../data/depots.js';
import { NetworkModel } from '../data/NetworkModel.js';
import STATION_POLYGONS from '../data/station-polygons.json';

// Singapore bounds - restrict map to Singapore only
const SINGAPORE_BOUNDS = [
    [103.596, 1.1304],  // Southwest
    [104.0945, 1.4784]  // Northeast
];

// Singapore center coordinates
const SINGAPORE_CENTER = [103.8198, 1.3521];
const DEFAULT_ZOOM = 11.5;
const DEFAULT_PITCH = 45;
const DEFAULT_BEARING = -15;

// Dark theme map style with 3D buildings
const MAP_STYLE = {
    version: 8,
    name: 'Dark Singapore',
    glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
    sources: {
        'carto-dark': {
            type: 'raster',
            tiles: [
                'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
                'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
                'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'
            ],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }
    },
    layers: [
        {
            id: 'carto-dark-layer',
            type: 'raster',
            source: 'carto-dark',
            minzoom: 0,
            maxzoom: 20
        }
    ]
};

const MapViewComponent = forwardRef((props, ref) => {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const [isReady, setIsReady] = useState(false);

    // Expose update method to parent
    useImperativeHandle(ref, () => ({
        updateTrains: (trains) => {
            if (!mapRef.current || !mapRef.current.getSource('trains')) return;

            const source = mapRef.current.getSource('trains');

            // Efficiently update data without React reconcile
            const geojson = {
                type: 'FeatureCollection',
                features: trains.map(train => ({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [train.lng, train.lat]
                    },
                    properties: {
                        id: train.id,
                        line: train.line,
                        color: train.color,
                        lineName: train.lineName,
                        direction: train.direction,
                        bearing: train.bearing || 0,
                        isAtStation: train.isAtStation ? 1 : 0,
                        stationName: train.stationName || ''
                    }
                }))
            };

            source.setData(geojson);
        }
    }));

    // Initialize map once on mount
    useEffect(() => {
        // ... (lines 57-159 unchanged, logic remains same)
        // Prevent double initialization
        if (mapRef.current) return;
        if (!mapContainer.current) return;

        console.log('Creating map instance...');

        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: MAP_STYLE,
            center: SINGAPORE_CENTER,
            zoom: DEFAULT_ZOOM,
            pitch: DEFAULT_PITCH,
            bearing: DEFAULT_BEARING,
            antialias: true,
            maxBounds: SINGAPORE_BOUNDS,
            minZoom: 10,
            maxZoom: 18
        });

        mapRef.current = map;

        map.addControl(new maplibregl.NavigationControl(), 'top-right');

        map.on('error', (e) => {
            console.error('Map error:', e.error);
        });

        map.on('load', () => {
            console.log('Map style loaded');

            // Add MRT routes
            addMRTRoutes(map);

            // Add MRT stations
            addMRTStations(map);

            // Add Depots
            addDepots(map);

            // Add trains source (will be updated dynamically)
            map.addSource('trains', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: []
                }
            });

            // Add train glow effect (larger for stopped trains)
            map.addLayer({
                id: 'trains-glow',
                type: 'circle',
                source: 'trains',
                paint: {
                    'circle-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        10, ['case', ['==', ['get', 'isAtStation'], 1], 8, 5],
                        12, ['case', ['==', ['get', 'isAtStation'], 1], 16, 10],
                        14, ['case', ['==', ['get', 'isAtStation'], 1], 24, 16],
                        16, ['case', ['==', ['get', 'isAtStation'], 1], 36, 24]
                    ],
                    'circle-color': ['get', 'color'],
                    'circle-opacity': ['case', ['==', ['get', 'isAtStation'], 1], 0.4, 0.25],
                    'circle-blur': 0.5
                }
            });

            // Add train circles layer - larger for stopped trains
            map.addLayer({
                id: 'trains-circle',
                type: 'circle',
                source: 'trains',
                paint: {
                    'circle-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        10, ['case', ['==', ['get', 'isAtStation'], 1], 4, 3],
                        12, ['case', ['==', ['get', 'isAtStation'], 1], 8, 5],
                        14, ['case', ['==', ['get', 'isAtStation'], 1], 12, 8],
                        16, ['case', ['==', ['get', 'isAtStation'], 1], 18, 14]
                    ],
                    'circle-color': ['get', 'color'],
                    'circle-stroke-width': ['case', ['==', ['get', 'isAtStation'], 1], 3, 2],
                    'circle-stroke-color': ['case', ['==', ['get', 'isAtStation'], 1], '#ffffff', 'rgba(255,255,255,0.8)'],
                    'circle-opacity': 1
                }
            });

            console.log('All layers added successfully');
            setIsReady(true);
        });

        return () => {
            console.log('Cleaning up map...');
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // Removed the useEffect for trains prop since we use imperative handle now

    return (
        <div
            ref={mapContainer}
            className="map-container"
        />
    );
});

// Memoize to prevent unnecessary re-renders from parent state changes
export const MapView = memo(MapViewComponent);

function addMRTRoutes(map) {
    // Hybrid approach: Use real world geometry where available, fallback to straight lines where missing
    const routeGeoJSON = NetworkModel.getRouteGeoJSON(); // Curved paths from NetworkModel
    const fallbackFeatures = [];

    // Check which lines are missing from routeGeoJSON
    const presentCodes = new Set(routeGeoJSON.features.map(f => f.properties.code));
    const allLines = NetworkModel.getAllLines();

    Object.keys(allLines).forEach(code => {
        // If the line is not in the detailed GeoJSON, generate a fallback
        if (!presentCodes.has(code)) {
            console.warn(`Line ${code} missing from detailed geometry, using fallback.`);
            const fallback = generateStraightLineGeoJSON(code);
            if (fallback) fallbackFeatures.push(fallback);
        }
    });

    const combinedData = {
        type: 'FeatureCollection',
        features: [...routeGeoJSON.features, ...fallbackFeatures]
    };

    map.addSource('mrt-routes', {
        type: 'geojson',
        data: combinedData
    });

    // Add Station Polygons (3D Buildings)
    map.addSource('station-polygons', {
        type: 'geojson',
        data: STATION_POLYGONS
    });

    map.addLayer({
        id: 'station-buildings',
        type: 'fill-extrusion',
        source: 'station-polygons',
        paint: {
            'fill-extrusion-color': '#ffffff',
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': 0,
            'fill-extrusion-opacity': 0.9,
            'fill-extrusion-vertical-gradient': true
        }
    });

    Object.entries(MRT_LINES).forEach(([lineCode, line]) => {
        // Match GeoJSON property 'code' with our lineCode
        // Note: GeoJSON uses 'code' (e.g. 'NS', 'EW')
        const filter = ['==', ['get', 'code'], lineCode];

        // Glow effect for routes
        map.addLayer({
            id: `mrt-glow-${lineCode}`,
            type: 'line',
            source: 'mrt-routes',
            filter: filter,
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': line.color, // Use our config color to ensure consistency
                'line-width': 10,
                'line-opacity': 0.2,
                'line-blur': 3
            }
        });

        // White outline
        map.addLayer({
            id: `mrt-outline-${lineCode}`,
            type: 'line',
            source: 'mrt-routes',
            filter: filter,
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#ffffff',
                'line-width': 5,
                'line-opacity': 0.5
            }
        });

        // Colored line on top
        map.addLayer({
            id: `mrt-line-${lineCode}`,
            type: 'line',
            source: 'mrt-routes',
            filter: filter,
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': line.color,
                'line-width': 3,
                'line-opacity': 1
            }
        });
    });
}

function addMRTStations(map) {
    const lines = NetworkModel.getAllLines();
    const stationsGeoJSON = generateStationsGeoJSON(lines);

    map.addSource('mrt-stations', {
        type: 'geojson',
        data: stationsGeoJSON
    });

    // Station glow
    map.addLayer({
        id: 'mrt-stations-glow',
        type: 'circle',
        source: 'mrt-stations',
        paint: {
            'circle-radius': 10,
            'circle-color': ['get', 'color'],
            'circle-opacity': 0.15,
            'circle-blur': 0.5
        }
    });

    // Station circles
    map.addLayer({
        id: 'mrt-stations',
        type: 'circle',
        source: 'mrt-stations',
        paint: {
            'circle-radius': 5,
            'circle-color': ['get', 'color'],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
        }
    });

    // Station labels
    map.addLayer({
        id: 'mrt-labels',
        type: 'symbol',
        source: 'mrt-stations',
        minzoom: 12,
        layout: {
            'text-field': ['get', 'name'],
            'text-font': ['Open Sans Regular'],
            'text-size': 11,
            'text-offset': [0, 1.2],
            'text-anchor': 'top',
            'text-max-width': 8
        },
        paint: {
            'text-color': '#ffffff',
            'text-halo-color': 'rgba(0, 0, 0, 0.8)',
            'text-halo-width': 1.5
        }
    });

    // Station click popup
    map.on('click', 'mrt-stations', (e) => {
        const props = e.features[0].properties;
        const coords = e.features[0].geometry.coordinates.slice();

        new maplibregl.Popup({
            className: 'mrt-popup',
            closeButton: true
        })
            .setLngLat(coords)
            .setHTML(`
                <div class="station-popup">
                    <span class="station-code" style="background-color:${props.color}">${props.code}</span>
                    <span class="station-name">${props.name}</span>
                </div>
            `)
            .addTo(map);
    });

    map.on('mouseenter', 'mrt-stations', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'mrt-stations', () => {
        map.getCanvas().style.cursor = '';
    });

    // Train click popup
    map.on('click', 'trains-circle', (e) => {
        const props = e.features[0].properties;
        const coords = e.features[0].geometry.coordinates.slice();

        new maplibregl.Popup({
            className: 'mrt-popup',
            closeButton: true
        })
            .setLngLat(coords)
            .setHTML(`
                <div class="train-popup">
                    <span class="train-line" style="background-color:${props.color}">${props.line}</span>
                    <span class="train-info">${props.lineName}<br/>${props.direction === 'forward' ? '→' : '←'} ${props.direction}</span>
                </div>
            `)
            .addTo(map);
    });

    map.on('mouseenter', 'trains-circle', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'trains-circle', () => {
        map.getCanvas().style.cursor = '';
    });
}

export default MapView;

function addDepots(map) {
    const depotFeatures = Object.values(DEPOTS).map(depot => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: depot.coordinates },
        properties: { name: depot.name, capacity: depot.capacity }
    }));

    const connectionFeatures = Object.values(DEPOTS).map(depot => ({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: depot.connection.path },
        properties: { line: depot.connection.lineCode }
    }));

    map.addSource('depots', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: depotFeatures }
    });

    map.addSource('depot-connections', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: connectionFeatures }
    });

    // Connector tracks
    map.addLayer({
        id: 'depot-connector-lines',
        type: 'line',
        source: 'depot-connections',
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': '#666',
            'line-width': 2,
            'line-dasharray': [2, 2],
            'line-opacity': 0.7
        }
    });

    // Depot Markers (Square buildings)
    map.addLayer({
        id: 'depot-markers',
        type: 'circle',
        source: 'depots',
        paint: {
            'circle-radius': 6,
            'circle-color': '#444',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#888'
        }
    });

    // Depot Labels
    map.addLayer({
        id: 'depot-labels',
        type: 'symbol',
        source: 'depots',
        minzoom: 11,
        layout: {
            'text-field': 'D', // Simple icon
            'text-font': ['Open Sans Regular'], // Ensure font exists or use sans-serif default? MapLibre default usually Open Sans
            'text-size': 10,
            'text-offset': [0, 0]
        },
        paint: {
            'text-color': '#fff'
        }
    });

    // Depot Name Labels (Zoomed in)
    map.addLayer({
        id: 'depot-names',
        type: 'symbol',
        source: 'depots',
        minzoom: 13,
        layout: {
            'text-field': ['get', 'name'],
            'text-font': ['Open Sans Regular'],
            'text-size': 10,
            'text-offset': [0, 1.5], // Below marker
            'text-anchor': 'top'
        },
        paint: {
            'text-color': '#aaa',
            'text-halo-color': 'rgba(0,0,0,0.8)',
            'text-halo-width': 1
        }
    });
}
