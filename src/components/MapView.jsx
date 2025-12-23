// MapView Component - Main map display with MRT routes and trains
import { useEffect, useRef, useState, memo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { generateRouteGeoJSON, generateStationsGeoJSON, MRT_LINES } from '../data/mrt-routes.js';

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

function MapViewComponent({ trains }) {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const [isReady, setIsReady] = useState(false);

    // Initialize map once on mount
    useEffect(() => {
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

            // Add trains source (will be updated dynamically)
            map.addSource('trains', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: []
                }
            });

            // Add train glow effect (larger, semi-transparent circle behind)
            map.addLayer({
                id: 'trains-glow',
                type: 'circle',
                source: 'trains',
                paint: {
                    'circle-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        10, 6,
                        12, 12,
                        14, 18,
                        16, 28
                    ],
                    'circle-color': ['get', 'color'],
                    'circle-opacity': 0.3,
                    'circle-blur': 0.5
                }
            });

            // Add train circles layer - the main train marker
            map.addLayer({
                id: 'trains-circle',
                type: 'circle',
                source: 'trains',
                paint: {
                    'circle-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        10, 3,
                        12, 6,
                        14, 10,
                        16, 16
                    ],
                    'circle-color': ['get', 'color'],
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff',
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

    // Update train positions when trains change
    useEffect(() => {
        if (!isReady || !mapRef.current || !trains) return;

        const map = mapRef.current;
        const source = map.getSource('trains');

        if (!source) return;

        // Convert trains to GeoJSON
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
                    bearing: train.bearing || 0
                }
            }))
        };

        source.setData(geojson);
    }, [trains, isReady]);

    return (
        <div
            ref={mapContainer}
            className="map-container"
        />
    );
}

// Memoize to prevent unnecessary re-renders from parent state changes
export const MapView = memo(MapViewComponent);

function addMRTRoutes(map) {
    const routeGeoJSON = generateRouteGeoJSON();

    map.addSource('mrt-routes', {
        type: 'geojson',
        data: routeGeoJSON
    });

    Object.entries(MRT_LINES).forEach(([lineCode, line]) => {
        // Glow effect for routes
        map.addLayer({
            id: `mrt-glow-${lineCode}`,
            type: 'line',
            source: 'mrt-routes',
            filter: ['==', ['get', 'line'], lineCode],
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': line.color,
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
            filter: ['==', ['get', 'line'], lineCode],
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
            filter: ['==', ['get', 'line'], lineCode],
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
    const stationsGeoJSON = generateStationsGeoJSON();

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
