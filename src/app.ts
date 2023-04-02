import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";

// Display in the container.
const container = document.getElementById('container');
const fileInput = document.getElementById('fileInput') as HTMLInputElement;

// Create the scene and a camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Generate the WebGLRenderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
if (container == null) {
    alert('Container is null');
} else {
    container.appendChild(renderer.domElement);
}

// Generate orbit controls.
const controls = new OrbitControls(camera, renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
scene.add(ambientLight);

const defaultMaterial = new THREE.MeshPhongMaterial({color: 0x808080});
const objLoader = new OBJLoader();

// Add listening for the file to be selected.
fileInput.addEventListener('change', (event: Event) => {
    const target = (event.target as HTMLInputElement);

    if (!target.files || target.files.length === 0) {
        alert('target.files is null');
        return;
    }

    const file = target.files[0];

    if (!file) {
        alert('File could not be found.');
        return;
    }

    // Clear the scene
    scene.children
        .filter(c => c.type === 'Group')
        .forEach(g => scene.remove(g));

    const reader = new FileReader();
    reader.onload = () => {
        const objData = reader.result as string;
        const object = objLoader.parse(objData);

        displayObjText(objData);

        object.traverse((child => {
            if (child instanceof THREE.Mesh) {
                child.material = defaultMaterial;
            }
        }));

        scene.add(object);
        centreAndScaleModel(object, camera);
    };

    reader.readAsText(file);
});

function displayObjText(objData: string) {
    const textDisplay = document.getElementById('objTextDisplay');
    if (!textDisplay) {
        alert('Could not find objTextDisplay element');
        return
    }

    textDisplay.innerText = ''; // Clear any previous remenants in here.

    const lines = objData.split('\n');

    lines.forEach((line, index) => {
        const element = document.createElement('span');
        element.innerText = line;
        element.setAttribute('data-line-number', index.toString())

        if (line.startsWith('v ')) {
            element.style.color = 'blue';
        }
        if (line.startsWith('f ')) {
            element.style.color = 'red';
        }

        element.addEventListener('click', () => {
            const newVal = prompt('Edit: ', line);
            if (newVal) {
                element.innerText = newVal;
            }
        });

        textDisplay.appendChild(element);
        textDisplay.appendChild(document.createElement('br'));
    });
}

function centreAndScaleModel(object: THREE.Object3D, camera: THREE.PerspectiveCamera, maxSize: number = 3) {
    const boundingBox = new THREE.Box3().setFromObject(object, true);
    const center = boundingBox.getCenter(new THREE.Vector3());
    const size = boundingBox.getSize(new THREE.Vector3());
    const maxDimensions = Math.max(size.x, size.y, size.z);

    const scale = maxSize / maxDimensions;
    object.scale.set(scale, scale, scale);
    object.position.sub(center).multiplyScalar(scale);

    const modelRadius = size.length() * scale / 2;
    const fovRadians = camera.fov * (Math.PI / 180);
    const distance = modelRadius / Math.sin(fovRadians / 2);
    camera.position.set(0, 0, distance);
    camera.lookAt(new THREE.Vector3());
}

function animate() {
    requestAnimationFrame(animate);
    console.log(`Requested animation frame`);
    controls.update();
    console.log(`Updated controls`);
    renderer.render(scene, camera);
    console.log(`Rendered scene and camera`);
}

animate();
console.log(`Called animate`);