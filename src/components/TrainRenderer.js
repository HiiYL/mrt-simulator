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

        this.customLayer = this.createCustomLayer();
    }

    createCustomLayer() {
        const self = this;

        return {
            id: '3d-trains',
            type: 'custom',
            renderingMode: '3d',

            onAdd(map, gl) {
                self.scene = new THREE.Scene();
                self.camera = new THREE.Camera();

                // Create renderer using the map's canvas WebGL context
                self.renderer = new THREE.WebGLRenderer({
                    canvas: map.getCanvas(),
                    context: gl,
                    antialias: true
                });

                self.renderer.autoClear = false;

                // Add ambient light
                const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
                self.scene.add(ambientLight);

                // Add directional light
                const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
                directionalLight.position.set(1, 1, 1).normalize();
                self.scene.add(directionalLight);
            },

            render(gl, matrix) {
                // Update camera matrix to match MapLibre's camera
                const rotationX = new THREE.Matrix4().makeRotationAxis(
                    new THREE.Vector3(1, 0, 0),
                    Math.PI / 2
                );

                const m = new THREE.Matrix4().fromArray(matrix);
                self.camera.projectionMatrix = m.multiply(rotationX);

                self.renderer.resetState();
                self.renderer.render(self.scene, self.camera);
                // Note: Don't call triggerRepaint() here as it causes infinite loops
                // The map will be repainted by the animation loop in App.jsx
            }
        };
    }

    getLayer() {
        return this.customLayer;
    }

    // Update train positions
    updateTrains(trains) {
        if (!this.scene) return;

        const existingIds = new Set(this.trainMeshes.keys());
        const newIds = new Set(trains.map(t => t.id));

        // Remove trains that no longer exist
        existingIds.forEach(id => {
            if (!newIds.has(id)) {
                const mesh = this.trainMeshes.get(id);
                this.scene.remove(mesh);
                mesh.geometry.dispose();
                mesh.material.dispose();
                this.trainMeshes.delete(id);
            }
        });

        // Update or create trains
        trains.forEach(train => {
            const mercatorCoord = maplibregl.MercatorCoordinate.fromLngLat(
                [train.lng, train.lat],
                0 // altitude
            );

            // Scale factor for the train model
            const scale = mercatorCoord.meterInMercatorCoordinateUnits() * 80;

            let mesh = this.trainMeshes.get(train.id);

            if (!mesh) {
                // Create new train mesh
                mesh = this.createTrainMesh(train.color);
                this.trainMeshes.set(train.id, mesh);
                this.scene.add(mesh);
            }

            // Update position
            mesh.position.set(
                mercatorCoord.x,
                mercatorCoord.y,
                mercatorCoord.z
            );

            // Update rotation (bearing)
            mesh.rotation.z = -THREE.MathUtils.degToRad(train.bearing || 0);

            // Update scale
            mesh.scale.set(scale, scale, scale);
        });
    }

    createTrainMesh(color) {
        // Create a simple train model (elongated box)
        const trainLength = 3;
        const trainWidth = 1;
        const trainHeight = 0.8;

        const geometry = new THREE.BoxGeometry(trainLength, trainWidth, trainHeight);

        // Create material with the line color
        const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(color),
            emissive: new THREE.Color(color).multiplyScalar(0.3),
            shininess: 100,
            transparent: true,
            opacity: 0.95
        });

        const mesh = new THREE.Mesh(geometry, material);

        // Add a small roof/window section
        const roofGeometry = new THREE.BoxGeometry(
            trainLength * 0.95,
            trainWidth * 0.8,
            trainHeight * 0.3
        );
        const roofMaterial = new THREE.MeshPhongMaterial({
            color: 0x333333,
            shininess: 100
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.z = trainHeight * 0.5;
        mesh.add(roof);

        // Add front lights
        const lightGeometry = new THREE.CircleGeometry(0.15, 8);
        const lightMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffcc,
            transparent: true,
            opacity: 0.9
        });

        const frontLight1 = new THREE.Mesh(lightGeometry, lightMaterial);
        frontLight1.position.set(trainLength / 2 + 0.01, trainWidth * 0.25, 0);
        frontLight1.rotation.y = Math.PI / 2;
        mesh.add(frontLight1);

        const frontLight2 = new THREE.Mesh(lightGeometry, lightMaterial);
        frontLight2.position.set(trainLength / 2 + 0.01, -trainWidth * 0.25, 0);
        frontLight2.rotation.y = Math.PI / 2;
        mesh.add(frontLight2);

        return mesh;
    }

    // Clean up resources
    dispose() {
        this.trainMeshes.forEach(mesh => {
            this.scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
        });
        this.trainMeshes.clear();

        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}
