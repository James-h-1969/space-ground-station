async function updateState() {
    const state = document.getElementById('stateSelect').value;
    const response = await fetch('/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state })
    });

    document.getElementById("actualState").value = state;

    if (response.ok) {
        const data = await response.json();
        alert("State updated!");
        document.getElementById('currentState').innerText = data.numeric_value;
    } else {
        alert("Failed to update state.");
    }
}

async function fetchState() {
    const response = await fetch('/state');
    const data = await response.json();
    document.getElementById('currentState').innerText = data.value;
}

async function fetchUTCTime(){
    const response = await fetch('/utc_time');
    const data = await response.json();
    document.getElementById('utcTime').innerText = data.utc_time;
}

setInterval(fetchUTCTime, 1000);