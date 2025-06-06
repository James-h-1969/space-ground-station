// Buffers for previous values
const eulerHistory = {
    phi: [], theta: [], psi: [],
    phi_dot: [], theta_dot: [], psi_dot: [],
    labels: []
};

// Setup the Euler angle chart
const eulerCtx = document.getElementById('eulerChart').getContext('2d');
const eulerChart = new Chart(eulerCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            { label: 'ϕ (Roll)', data: [], borderColor: 'red', fill: false },
            { label: 'θ (Pitch)', data: [], borderColor: 'cyan', fill: false },
            { label: 'ψ (Yaw)', data: [], borderColor: 'lime', fill: false }
        ]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                min: -180,
                max: 180,
                grid: { display: true },
                title: { display: true, text: 'Degrees' }
            },
            x: {
                display: false
            }
        },
        plugins: {
            legend: { labels: { color: '#fff' } }
        }
    }
});

// Setup the Euler angle rate chart
const rateCtx = document.getElementById('eulerRateChart').getContext('2d');
const eulerRateChart = new Chart(rateCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            { label: 'ϕ̇ (Roll Rate)', data: [], borderColor: 'red', fill: false },
            { label: 'θ̇ (Pitch Rate)', data: [], borderColor: 'cyan', fill: false },
            { label: 'ψ̇ (Yaw Rate)', data: [], borderColor: 'lime', fill: false }
        ]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                min: -10,
                max: 10,
                grid: { display: true },
                title: { display: true, text: '°/s' }
            },
            x: {
                display: false
            }
        },
        plugins: {
            legend: { labels: { color: '#fff' } }
        }
    }
});

// Fetch and update function
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

            // Store new values
            const timestamp = new Date().toLocaleTimeString();
            eulerHistory.labels.push(timestamp);
            eulerHistory.phi.push(phi);
            eulerHistory.theta.push(theta);
            eulerHistory.psi.push(psi);
            eulerHistory.phi_dot.push(phi_dot);
            eulerHistory.theta_dot.push(theta_dot);
            eulerHistory.psi_dot.push(psi_dot);

            // Keep only the last 10
            if (eulerHistory.labels.length > 10) {
                Object.keys(eulerHistory).forEach(key => eulerHistory[key].shift());
            }

            // Update angle plot
            eulerChart.data.labels = [...eulerHistory.labels];
            eulerChart.data.datasets[0].data = [...eulerHistory.phi];
            eulerChart.data.datasets[1].data = [...eulerHistory.theta];
            eulerChart.data.datasets[2].data = [...eulerHistory.psi];
            eulerChart.update();

            // Update rate plot
            eulerRateChart.data.labels = [...eulerHistory.labels];
            eulerRateChart.data.datasets[0].data = [...eulerHistory.phi_dot];
            eulerRateChart.data.datasets[1].data = [...eulerHistory.theta_dot];
            eulerRateChart.data.datasets[2].data = [...eulerHistory.psi_dot];
            eulerRateChart.update();
        })
        .catch(err => console.error("Error fetching attitude data:", err));
}

// Update every 2 seconds
setInterval(fetchAttitudeData, 2000);



