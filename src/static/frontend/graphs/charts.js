const ctx = document.getElementById('dataChart').getContext('2d');

let payload_chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [410, 435, 460, 485, 510, 535, 560, 585, 610, 645, 680, 705, 730, 760, 810, 860, 900, 940],
        datasets: [{
            data: [],
            borderColor: 'blue',
            backgroundColor: 'rgba(255,0,0,0.1)',
            fill: false,
            tension: 0.4 // Makes the curve smooth
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            spectrumBackground: true
        },
        scales: {
            x: {
                type: 'linear',
                ticks: {
                    color: '#333'
                },
                grid: {
                    color: '#eee'
                },
                min: 400,
                max: 950
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#333'
                },
                grid: {
                    color: '#eee'
                }
            }
        }
    },
    plugins: [{
        id: 'spectrumBackground',
        beforeDraw: payload_chartchart => {
            const { ctx, chartArea } = payload_chart;
            const spectrum = [
                { color: '#8B00FF', start: 400, end: 450 }, // Violet
                { color: '#4B0082', start: 450, end: 470 }, // Indigo
                { color: '#0000FF', start: 470, end: 495 }, // Blue
                { color: '#00FF00', start: 495, end: 570 }, // Green
                { color: '#FFFF00', start: 570, end: 590 }, // Yellow
                { color: '#FF7F00', start: 590, end: 620 }, // Orange
                { color: '#FF0000', start: 620, end: 750 },  // Red
                { color: '#000000', start: 750, end: 950 },  // Red

            ];

            const xScale = payload_chart.scales.x;

            spectrum.forEach(band => {
                const x1 = xScale.getPixelForValue(band.start);
                const x2 = xScale.getPixelForValue(band.end);
                ctx.fillStyle = band.color;
                ctx.globalAlpha = 0.1; // subtle background
                ctx.fillRect(x1, chartArea.top, x2 - x1, chartArea.height);
            });

            ctx.globalAlpha = 1; // reset alpha
        }
    }]
});

// Update chart with latest payload
function updateChartFromPayload(payload) {
    if (!payload || payload.length !== 18) return;

    payload_chart.data.datasets[0].data = payload;
    payload_chart.update();
}

// Fetch latest payload
function fetchPayloadData() {
    fetch('/api/payload_data')
        .then(res => res.json())
        .then(data => {
            updateChartFromPayload(data);
        })
        .catch(err => console.error("Error fetching data:", err));
}

// Connection status check
function checkStatus() {
    fetch('/api/status')
        .then(res => res.json())
        .then(data => {
            const statusEl = document.getElementById('status');
            if (data.connected) {
                statusEl.textContent = "Connected";
                statusEl.classList.remove("disconnected");
            } else {
                statusEl.textContent = "Disconnected";
                statusEl.classList.add("disconnected");
            }
        });
}

// Run on interval
setInterval(() => {
    fetchPayloadData();
    checkStatus();
}, 2000);
