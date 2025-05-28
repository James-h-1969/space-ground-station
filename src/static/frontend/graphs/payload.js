// Ellie to add here.

const wavelengths = [410, 435, 460, 485, 510, 535, 560, 585, 610, 645, 680, 705, 730, 760, 810, 860, 900, 940];

function wavelengthToRGB(wavelength) {
    let r = 0, g = 0, b = 0;
    if (wavelength >= 380 && wavelength < 440) {
        r = -(wavelength - 440) / (440 - 380);
        g = 0;
        b = 1;
    } else if (wavelength >= 440 && wavelength < 490) {
        r = 0;
        g = (wavelength - 440) / (490 - 440);
        b = 1;
    } else if (wavelength >= 490 && wavelength < 510) {
        r = 0;
        g = 1;
        b = -(wavelength - 510) / (510 - 490);
    } else if (wavelength >= 510 && wavelength < 580) {
        r = (wavelength - 510) / (580 - 510);
        g = 1;
        b = 0;
    } else if (wavelength >= 580 && wavelength < 645) {
        r = 1;
        g = -(wavelength - 645) / (645 - 580);
        b = 0;
    } else if (wavelength >= 645 && wavelength <= 780) {
        r = 1;
        g = 0;
        b = 0;
    }
    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);
    return `rgb(${r},${g},${b})`;
}

function plotSpectrums() {
    fetch("/payload")
        .then(res => res.json())
        .then(data => {
            const [timestamp, spectralValues] = data.payload_data;
            const maxIntensity = Math.max(...spectralValues);

            const intensityCanvas = document.getElementById("intensitySpectrum");
            const absorptionCanvas = document.getElementById("absorptionSpectrum");

            console.log("Intensity canvas:", intensityCanvas);
            console.log("Absorption canvas:", absorptionCanvas);

            const ctx1 = intensityCanvas.getContext("2d");
            const ctx2 = absorptionCanvas.getContext("2d");

            // Clear canvases
            ctx1.clearRect(0, 0, intensityCanvas.width, intensityCanvas.height);
            ctx2.clearRect(0, 0, absorptionCanvas.width, absorptionCanvas.height);

            // Intensity plot
            ctx1.beginPath();
            ctx1.moveTo(0, intensityCanvas.height);
            for (let i = 0; i < wavelengths.length; i++) {
                const x = (wavelengths[i] - 400) / 550 * intensityCanvas.width;
                const y = intensityCanvas.height - (spectralValues[i] / maxIntensity) * intensityCanvas.height;
                ctx1.lineTo(x, y);
            }
            ctx1.strokeStyle = "white";
            ctx1.lineWidth = 2;
            ctx1.stroke();

            // Absorption spectrum
            for (let i = 0; i < wavelengths.length; i++) {
                const x = (wavelengths[i] - 400) / 550 * absorptionCanvas.width;
                const normIntensity = spectralValues[i] / maxIntensity;
                ctx2.beginPath();
                ctx2.moveTo(x, 0);
                ctx2.lineTo(x, absorptionCanvas.height);
                ctx2.strokeStyle = wavelengthToRGB(wavelengths[i]);
                ctx2.globalAlpha = normIntensity;
                ctx2.lineWidth = 3;
                ctx2.stroke();
            }
            ctx2.globalAlpha = 1.0;
        })
        .catch(err => console.error("Error fetching payload data:", err));
}
