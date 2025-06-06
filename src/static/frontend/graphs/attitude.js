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
        })
        .catch(err => console.error("Error fetching attitude data:", err));
}


// Buffers for plotting
const eulerHistory = {
    phi: [], theta: [], psi: [],
    phi_dot: [], theta_dot: [], psi_dot: [],
    labels: []
};

// Create angle chart
const eulerCtx = document.getElementById('eulerChart').getContext('2d');
const eulerChart = new Chart(eulerCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            { label: 'Roll (ϕ)', data: [], borderColor: 'red', fill: false },
            { label: 'Pitch (θ)', data: [], borderColor: 'lime', fill: false },
            { label: 'Yaw (ψ)', data: [], borderColor: 'cyan', fill: false }
        ]
    },
    options: {
        responsive: true,
        scales: { y: { beginAtZero: false }, x: { display: false } }
    }
});

// Create angle rate chart
const rateCtx = document.getElementById('eulerRateChart').getContext('2d');
const eulerRateChart = new Chart(rateCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            { label: 'ϕ̇', data: [], borderColor: 'red', fill: false },
            { label: 'θ̇', data: [], borderColor: 'lime', fill: false },
            { label: 'ψ̇', data: [], borderColor: 'cyan', fill: false }
        ]
    },
    options: {
        responsive: true,
        scales: { y: { beginAtZero: false }, x: { display: false } }
    }
});

// Update every 2 seconds
setInterval(fetchAttitudeData, 2000);



