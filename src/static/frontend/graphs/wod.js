// update
function updateWOD(data) {
    document.getElementById("mode").innerText = `${data.mode}`;
    // document.getElementById("batt-voltage").innerText = `${data["bat-voltage"].toFixed(2)} V`;
    // document.getElementById("batt-current").innerText = `${data["bat-current"].toFixed(2)} A`;
    const voltage = data["bat-voltage"];
    document.getElementById("batt-voltage").innerText = `${voltage.toFixed(2)} V`;
    setSliderPosition("batt-voltage-slider", voltage, 0, 4.5);
    const current = data["bat-current"];
    document.getElementById("batt-current").innerText = `${current.toFixed(2)} A`;
    setSliderPosition("batt-current-slider", current, -2, 2);
    document.getElementById("3v3-current").innerText = `${data["3v3-current"].toFixed(2)} A`;
    document.getElementById("5v-current").innerText = `${data["5v-current"].toFixed(2)} A`;
    const commTemp = data["comm-temp"];
    document.getElementById("comm-temp").innerText = `${commTemp.toFixed(1)} °C`;
    document.getElementById("comm-temp").className = `temp-value ${commTemp >= -30 && commTemp <= 85 ? 'green' : 'red'}`;
    const epsTemp = data["eps-temp"];
    document.getElementById("eps-temp").innerText = `${epsTemp.toFixed(1)} °C`;
    document.getElementById("eps-temp").className = `temp-value ${epsTemp >= -40 && epsTemp <= 80 ? 'green' : 'red'}`;
    const battTemp = data["batt-temp"];
    document.getElementById("batt-temp").innerText = `${battTemp.toFixed(1)} °C`;
    document.getElementById("batt-temp").className = `temp-value ${battTemp >= -20 && battTemp <= 60 ? 'green' : 'red'}`;

    setSliderPosition("comm-temp-slider", data["comm-temp"]);
    setSliderPosition("eps-temp-slider", data["eps-temp"]);
    setSliderPosition("batt-temp-slider", data["batt-temp"]);
}


// Fetch latest WOD
function fetchWODData() {
    fetch('/wod')
        .then(res => res.json())
        .then(data => {
            if (data.status === "success" && data.WOD_data) {
                const values = data.WOD_data;

                updateWOD({
                    timestamp: values[0],
                    mode: values[1],
                    "bat-voltage": values[2],
                    "bat-current": values[3],
                    "3v3-current": values[4],
                    "5v-current": values[5],
                    "comm-temp": values[6],
                    "eps-temp": values[7],
                    "batt-temp": values[8]
                });
            }
        })
        .catch(err => console.error("Error fetching WOD data:", err));
}

function setSliderPosition(sliderId, value, min = -50, max = 100) {
    const slider = document.getElementById(sliderId);
    const clamped = Math.max(min, Math.min(value, max));
    const percentage = ((clamped - min) / (max - min)) * 100;
    slider.style.left = `${percentage}%`;
}

setInterval(fetchWODData, 2000); // Fetch every 2 seconds




