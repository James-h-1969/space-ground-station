// update
function updateWOD(data) {
    document.getElementById("mode").innerText = `${data.mode}`;
    document.getElementById("batt-voltage").innerText = `${data["bat-voltage"].toFixed(2)} V`;
    document.getElementById("batt-current").innerText = `${data["bat-current"].toFixed(2)} A`;
    document.getElementById("3v3-current").innerText = `${data["3v3-current"].toFixed(2)} A`;
    document.getElementById("5v-current").innerText = `${data["5v-current"].toFixed(2)} A`;
    document.getElementById("comm-temp").innerText = `${data["comm-temp"].toFixed(1)} °C`;
    document.getElementById("eps-temp").innerText = `${data["eps-temp"].toFixed(1)} °C`;
    document.getElementById("batt-temp").innerText = `${data["batt-temp"].toFixed(1)} °C`;
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

setInterval(fetchWODData, 2000); // Fetch every 2 seconds




