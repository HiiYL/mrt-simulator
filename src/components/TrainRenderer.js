// Three.js Train Renderer - Custom MapLibre layer for 3D trains
import * as THREE from 'three';
import maplibregl from 'maplibre-gl';

export class TrainRenderer {
    constructor(map) {
        this.map = map;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.trainMeshes = new Map();

        // Store model transform for coordinate conversion
        this.modelTransform = null;

        this.customLayer = this.createCustomLayer();
    }

    createCustomLayer() {
        const self = this;

        return {
            id: '3d-trains',
            type: 'custom',
            renderingMode: '3d',

            onAdd(map, gl) {
                self.camera = new THREE.Camera();
                self.scene = new THREE.Scene();

                // Create renderer using the map's canvas WebGL context
                self.renderer = new THREE.WebGLRenderer({
                    canvas: map.getCanvas(),
                    context: gl,
                    antialias: true
                });

                self.renderer.autoClear = false;

                // Add strong ambient light for visibility
                const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
                self.scene.add(ambientLight);

                // Add directional light
                const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
                directionalLight.position.set(0, 70, 100);
                self.scene.add(directionalLight);

                console.log('TrainRenderer: layer added to map');
            },

            render(gl, matrix) {
                if (!self.scene || !self.camera || !self.renderer) return;

                // Convert matrix array to Three.js Matrix4
                const m = new THREE.Matrix4().fromArray(matrix);

                // Apply rotation to align with MapLibre's coordinate system
                const l = new THREE.Matrix4()
                    .makeRotationAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2);

                self.camera.projectionMatrix = m.multiply(l);

                self.renderer.resetState();
                self.renderer.render(self.scene, self.camera);
            }
        };
    }

    getLayer() {
        return this.customLayer;
    }

    // Convert lng/lat to world position for Three.js
    lngLatToWorld(lng, lat, altitude = 0) {
        const mercator = maplibregl.MercatorCoordinate.fromLngLat([lng, lat], altitude);
        return {
            x: mercator.x,
            y: mercator.y,
            z: mercator.z,
            scale: mercator.meterInMercatorCoordinateUnits()
        };
    }

    // Update train positions
    updateTrains(trains) {
        if (!this.scene) {
            return;
        }

        const existingIds = new Set(this.trainMeshes.keys());
        const newIds = new Set(trains.map(t => t.id));

        // Remove trains that no longer exist
        existingIds.forEach(id => {
            if (!newIds.has(id)) {
                const mesh = this.trainMeshes.get(id);
                this.scene.remove(mesh);
                mesh.geometry.dispose();
                if (mesh.material.dispose) mesh.material.dispose();
                this.trainMeshes.delete(id);
            }
        });

        // Update or create trains
        trains.forEach((train) => {
            // Convert to world coordinates with slight elevation
            const world = this.lngLatToWorld(train.lng, train.lat, 20);

            // Scale: each train should be about 100 meters long visually
            const trainScale = world.scale * 100;

            let mesh = this.trainMeshes.get(train.id);

            if (!mesh) {
                // Create new train mesh
                mesh = this.createTrainMesh(train.color);
                this.trainMeshes.set(train.id, mesh);
                this.scene.add(mesh);
            }

            // Update position
            mesh.position.set(world.x, world.y, world.z);

            // Update rotation (bearing) - convert bearing to radians
            // Bearing is clockwise from north, Three.js rotation is counter-clockwise
            mesh.rotation.z = -THREE.MathUtils.degToRad(train.bearing || 0);

            // Update scale
            mesh.scale.set(trainScale, trainScale, trainScale);
        });
    }

    createTrainMesh(color) {
        // Create a simple but visible train model
        const trainLength = 3;
        const trainWidth = 1;
        const trainHeight = 1;

        const geometry = new THREE.BoxGeometry(trainLength, trainWidth, trainHeight);

        // Use MeshBasicMaterial for guaranteed visibility (not affected by lighting issues)
        const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(color),
            transparent: false
        });

        const mesh = new THREE.Mesh(geometry, material);

        // Add a contrasting top
        const roofGeometry = new THREE.BoxGeometry(trainLength * 0.9, trainWidth * 0.7, 0.3);
        const roofMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.z = trainHeight * 0.5 + 0.15;
        mesh.add(roof);

        return mesh;
    }

    // Clean up resources
    dispose() {
        this.trainMeshes.forEach(mesh => {
            this.scene.remove(mesh);
            mesh.geometry.dispose();
            if (mesh.material.dispose) mesh.material.dispose();
        });
        this.trainMeshes.clear();

        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}
