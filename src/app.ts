import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";

// Display in the container.
const container = document.getElementById('container');
console.log(`init container`);
const fileInput = document.getElementById('fileInput') as HTMLInputElement;
console.log(`init fileInput`);

// Create the scene and a camera
const scene = new THREE.Scene();
console.log(`created scene`);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
console.log(`created camera`);

// Generate the WebGLRenderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
if (container == null) {
    alert('Container is null');
} else {
    container.appendChild(renderer.domElement);
    console.log(`Created renderer`);
}

// Generate orbit controls.
const controls = new OrbitControls(camera, renderer.domElement);
console.log(`Created controls`);

const light = new THREE.DirectionalLight(0xffffff, 1);
console.log(`Created light`);
light.position.set(1, 1, 1);
scene.add(light);
console.log(`Added light to the scene`);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
console.log(`Added ambient light to the scene`);

const defaultMaterial = new THREE.MeshPhongMaterial({color: 0x808080});
console.log(`Created default material`);
const objLoader = new OBJLoader();
console.log(`Created obj loader`);

// Add listening for the file to be selected.
fileInput.addEventListener('change', (event: Event) => {
    console.log(`Changed called`);
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
    let filterCounter: number = 0;
    scene.children
        .filter(c => c.type === 'Group')
        .forEach(g => {
            scene.remove(g);
            filterCounter++;
        });

    console.log(`Filtered children, total count = ${filterCounter}`);

    const reader = new FileReader();
    console.log(`Created reader`);
    reader.onload = () => {
        const objData = reader.result as string;
        console.log(`Created objData with value ${objData}`);
        const object = objLoader.parse(objData);
        console.log(`Created object by parsing`);

        let traverseCounter: number = 0;
        object.traverse((child => {
            if (child instanceof THREE.Mesh) {
                child.material = defaultMaterial;
                traverseCounter++;
            }
        }));

        console.log(`Finished changing materials, count ${traverseCounter}`);

        scene.add(object);
        console.log(`Added to the scene`);
    };

    reader.readAsText(file);
    console.log(`Read as text file`);
});

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