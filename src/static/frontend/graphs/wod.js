// update
function updateWOD(data) {
    document.getElementById("batt-voltage").innerText = `Battery Voltage: ${data["bat-voltage"].toFixed(2)} V`;
    document.getElementById("batt-current").innerText = `Battery Current: ${data["bat-current"].toFixed(2)} A`;
    document.getElementById("3v3-current").innerText = `3.3V Current: ${data["3v3-current"].toFixed(2)} A`;
    document.getElementById("5v-current").innerText = `5V Current: ${data["5v-current"].toFixed(2)} A`;
    document.getElementById("comm-temp").innerText = `Comm Temp: ${data["comm-temp"].toFixed(1)} °C`;
    document.getElementById("eps-temp").innerText = `EPS Temp: ${data["eps-temp"].toFixed(1)} °C`;
    document.getElementById("batt-temp").innerText = `Battery Temp: ${data["batt-temp"].toFixed(1)} °C`;
}


// Fetch latest WOD
function fetchWODData() {
    fetch('/api/wod_data')
        .then(res => res.json())
        .then(data => {
            updateWOD(data);
        })
        .catch(err => console.error("Error fetching data:", err));
}

setInterval(fetchWODData, 2000); // Fetch every 2 seconds




