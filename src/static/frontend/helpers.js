const clock_val = () => {
    // grab the clock element
    let element = document.getElementById('timing');

    // find the date and make it look nice
    let timestamp = new Date();

    // format 
    let seconds = `${timestamp.getUTCSeconds()}`;
    let minutes = `${timestamp.getUTCMinutes()}`;
    let hours = `${timestamp.getUTCHours()}`;

    if (seconds.length == 1){seconds = "0" + seconds;}
    if (minutes.length == 1){minutes = "0" + minutes;}
    if (hours.length == 1){hours = "0" + hours;}

    let nice_time = `${hours}:${minutes}:${seconds} (UTC)`;

    // set the element as the nice time 
    element.textContent = nice_time;
}

const state_update = () => {
    let element = document.getElementById("state_sat");

    let current_state = element.textContent;

    if (current_state !== "Nominal"){
        const states = ["Detumbling", "RX/TX", "Payload", "SAFE"]

        // update the state randomly
        const randomState = Math.round(Math.random() * 3);

        current_state = states[randomState];
    } else {
        current_state = "Nominal"
    }

    element.textContent = `${current_state}`;
}



// Run on interval
setInterval(() => {
    clock_val();
}, 1000);


state_update();
// Run on interval
setInterval(() => {
    state_update();
}, 20000);

