const canvas = document.getElementById('satelliteCanvas');

// Scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    canvas.clientWidth / canvas.clientHeight,
    0.01,
    1000
);

// Renderer using the existing canvas
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(800, 400)
renderer.setClearColor(0x000000); 

// Add axis helper centered at origin
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);



// Create a material for the CubeSat body
const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 }); // Grey color for general body
const topMaterial = new THREE.MeshBasicMaterial({ color: 0x606060 }); // Darker grey for top face
const sideMaterial = new THREE.MeshBasicMaterial({ color: 0x404040 }); // Darker grey for top face

// Create the 2U CubeSat body (rectangular prism)
const bodyGeometry = new THREE.BoxGeometry(1, 1, 2); // 2U CubeSat: 1x2x0.5 units
const body = new THREE.Mesh(bodyGeometry, [
    bodyMaterial, // front
    bodyMaterial, // back
    sideMaterial, // left
    sideMaterial, // right
    topMaterial,  // top face darker
    topMaterial  // bottom
]);
scene.add(body);

const debugGeometry = new THREE.BoxGeometry(1, 1, 1);
const debugMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const debugCube = new THREE.Mesh(debugGeometry, debugMaterial);
scene.add(debugCube);

// Position the camera so we can see the CubeSat
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

// Example satellite attitude angles (in degrees)
let pitch = 0, yaw = 0, roll = 0;

// Function to update the CubeSat's rotation based on attitude
function updateAttitude() {
    body.rotation.x = THREE.MathUtils.degToRad(pitch);   // Pitch: x-axis
    body.rotation.y = THREE.MathUtils.degToRad(yaw);     // Yaw: y-axis
    body.rotation.z = THREE.MathUtils.degToRad(roll);    // Roll: z-axis
}

function addStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });

    const starVertices = [];
    for (let i = 0; i < 1000; i++) {
        const x = THREE.MathUtils.randFloatSpread(200); // Random between -100 to 100
        const y = THREE.MathUtils.randFloatSpread(200);
        const z = THREE.MathUtils.randFloatSpread(200);
        starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

addStars();

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    updateAttitude(); // Update the CubeSat's attitude
    renderer.render(scene, camera); // Render the scene with the camera
}

animate(); // Start the animation loop

function updateVelocityDisplay(vx, vy, vz) {
    document.getElementById('velX').textContent = vx.toFixed(2);
    document.getElementById('velY').textContent = vy.toFixed(2);
    document.getElementById('velZ').textContent = vz.toFixed(2);
}

// Example usage with simulated values
setInterval(() => {
    const vx = Math.random() * 2 - 1;
    const vy = Math.random() * 2 - 1;
    const vz = Math.random() * 2 - 1;
    updateVelocityDisplay(vx, vy, vz);
}, 1000);


function fetchAttitudeData() {
    fetch('/attitude')
        .then(res => res.json())
        .then(data => {
            const attitude = data.attitude_data;
            if (!attitude) return;

            // Assign values
            const [phi, theta, psi, phi_dot, theta_dot, psi_dot] = attitude;

            // Display values
            document.getElementById('rollVal').textContent = phi.toFixed(2);
            document.getElementById('pitchVal').textContent = theta.toFixed(2);
            document.getElementById('yawVal').textContent = psi.toFixed(2);
            document.getElementById('rollRate').textContent = phi_dot.toFixed(2);
            document.getElementById('pitchRate').textContent = theta_dot.toFixed(2);
            document.getElementById('yawRate').textContent = psi_dot.toFixed(2);

            // Update the 3D model orientation (degrees to radians)
            roll = phi;
            pitch = theta;
            yaw = psi;
        })
        .catch(err => console.error("Error fetching attitude data:", err));
}

// Update every 2 seconds
setInterval(fetchAttitudeData, 2000);