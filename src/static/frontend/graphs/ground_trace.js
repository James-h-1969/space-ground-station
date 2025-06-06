// Simple 2D ground track using Chart.js
document.addEventListener('DOMContentLoaded', function() {
    // Create a canvas element for the ground track
    const groundTrackContainer = document.createElement('div');
    groundTrackContainer.style.width = '70%';
    groundTrackContainer.style.padding = '70px';
    groundTrackContainer.style.paddingTop = '20px';
    groundTrackContainer.style.marginLeft = "15%"
    groundTrackContainer.style.boxSizing = 'border-box';
    groundTrackContainer.style.backgroundColor = '#fff';
    groundTrackContainer.style.borderRadius = '12px';
    groundTrackContainer.style.marginTop = '20px';
    groundTrackContainer.style.height = '700px';
    
    // Add a title
    const title = document.createElement('div');
    title.textContent = 'Satellite Ground Track';
    title.style.fontSize = '24px';
    title.style.fontWeight = 'bold';
    title.style.color = '#444';
    title.style.textAlign = 'center';
    title.style.marginBottom = '15px';
    groundTrackContainer.appendChild(title);
    
    // Create the canvas for Chart.js
    const canvas = document.createElement('canvas');
    canvas.id = 'globeCanvas';
    canvas.style.width = '100%';
    canvas.style.height = 'calc(100%-100px)';
    groundTrackContainer.appendChild(canvas);
    
    // Add the container after the graphs section
    const graphsDiv = document.querySelector('.graphs');
    graphsDiv.parentNode.insertBefore(groundTrackContainer, graphsDiv.nextSibling);
    
    // Generate satellite track data
    // Simple circular orbit representation using sine/cosine functions
    const points = 60; // Number of points in the track
    const latitudes = [];
    const longitudes = [];
    
    // Create track data for a simple inclined orbit
    const inclination = 45; // Orbital inclination in degrees
    for (let i = 0; i < points; i++) {
      // Convert orbit position to lat/long
      const angle = (i / points) * Math.PI * 2;
      const lat = inclination * Math.sin(angle);
      const lng = (i / points) * 360 - 180;
      
      latitudes.push(lat);
      longitudes.push(lng);
    }
    
    // Current position in the orbit (will be animated)
    let currentPosition = 0;

    const backgroundImage = new Image();
    backgroundImage.src = 'static/images/ground-trace-background.jpg'; // Make sure this path is correct

    // Wait until the image is fully loaded before creating the chart
    backgroundImage.onload = () => {
        const backgroundPlugin = {
            id: 'customBackground',
            beforeDraw: (chart) => {
            const ctx = chart.ctx;
            const { width, height } = chart;

            ctx.save();
            ctx.globalAlpha = 0.2; // Adjust image transparency here
            ctx.drawImage(backgroundImage, 0, 0, width, height);
            ctx.restore();
            }
        };

        // Now safely create the chart
        const gtx = document.getElementById('globeCanvas').getContext('2d');
        const ground_trace = new Chart(gtx, {
            type: 'scatter',
            data: {
            datasets: [
                {
                label: 'Current Position',
                data: [{
                    x: longitudes[0],
                    y: latitudes[0]
                }],
                backgroundColor: 'yellow',
                borderColor: 'orange',
                borderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
                }
            ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'linear',
                        min: -180,
                        max: 180,
                        title: { display: true, text: 'Longitude' }
                    },
                    y: {
                        min: -90,
                        max: 90,
                        title: { display: true, text: 'Latitude' }
                    }
                },
                layout: {
                    padding: {
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0
                    }
                  },
                plugins: {
                    legend: { position: 'top' }
                }
            },
            plugins: [backgroundPlugin]
        });
            // Update the satellite position every second
        setInterval(() => {
            currentPosition = (currentPosition + 1) % points;
            
            // Update current position marker
            ground_trace.data.datasets[0].data = [{
            x: longitudes[currentPosition],
            y: latitudes[currentPosition]
            }];
            
            ground_trace.update();
        }, 1000);
    };
  });
  