// MapView Component - Main map display with MRT routes and trains
import { useEffect, useRef, useState, memo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { generateRouteGeoJSON, generateStationsGeoJSON, MRT_LINES } from '../data/mrt-routes.js';
import { TrainRenderer } from './TrainRenderer.js';

// Simple inline style for reliable loading
const MAP_STYLE = {
    version: 8,
    name: 'OSM Raster',
    sources: {
        'osm': {
            type: 'raster',
            tiles: [
                'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap'
        }
    },
    layers: [
        {
            id: 'osm-layer',
            type: 'raster',
            source: 'osm'
        }
    ]
};

// Singapore center coordinates
const SINGAPORE_CENTER = [103.8198, 1.3521];
const DEFAULT_ZOOM = 11.5;
const DEFAULT_PITCH = 45;
const DEFAULT_BEARING = -15;

function MapViewComponent({ trains }) {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const trainRendererRef = useRef(null);
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
            antialias: true
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

            // Initialize Three.js train renderer
            try {
                const trainRenderer = new TrainRenderer(map);
                map.addLayer(trainRenderer.getLayer());
                trainRendererRef.current = trainRenderer;
                console.log('All layers added successfully');
            } catch (e) {
                console.error('Error adding train renderer:', e);
            }

            setIsReady(true);
        });

        return () => {
            console.log('Cleaning up map...');
            if (trainRendererRef.current) {
                trainRendererRef.current.dispose();
                trainRendererRef.current = null;
            }
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // Update train positions when trains change
    useEffect(() => {
        if (!isReady || !trainRendererRef.current || !trains) return;

        trainRendererRef.current.updateTrains(trains);

        if (mapRef.current) {
            mapRef.current.triggerRepaint();
        }
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
        // White outline first
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
                'line-width': 6,
                'line-opacity': 0.7
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
                'line-width': 4,
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

    map.addLayer({
        id: 'mrt-stations',
        type: 'circle',
        source: 'mrt-stations',
        paint: {
            'circle-radius': 6,
            'circle-color': ['get', 'color'],
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
        }
    });

    map.addLayer({
        id: 'mrt-labels',
        type: 'symbol',
        source: 'mrt-stations',
        minzoom: 12,
        layout: {
            'text-field': ['get', 'name'],
            'text-font': ['Open Sans Regular'],
            'text-size': 11,
            'text-offset': [0, 1],
            'text-anchor': 'top'
        },
        paint: {
            'text-color': '#ffffff',
            'text-halo-color': '#000000',
            'text-halo-width': 1
        }
    });

    map.on('click', 'mrt-stations', (e) => {
        const props = e.features[0].properties;
        const coords = e.features[0].geometry.coordinates.slice();

        new maplibregl.Popup()
            .setLngLat(coords)
            .setHTML(`<div style="padding:8px;color:#333"><b style="color:${props.color}">${props.code}</b><br/>${props.name}</div>`)
            .addTo(map);
    });

    map.on('mouseenter', 'mrt-stations', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'mrt-stations', () => {
        map.getCanvas().style.cursor = '';
    });
}

export default MapView;
