function plotSpectrums() {
    const currentState = document.getElementById('stateSelect').value;

    const intensityCanvas = document.getElementById("intensitySpectrum");
    const absorptionCanvas = document.getElementById("absorptionSpectrum");
    const ctx1 = intensityCanvas.getContext("2d");
    const ctx2 = absorptionCanvas.getContext("2d");

    // If not in PAYLOAD mode
    if (currentState !== "PAYLOAD") {
        ctx1.clearRect(0, 0, intensityCanvas.width, intensityCanvas.height);
        ctx2.clearRect(0, 0, absorptionCanvas.width, absorptionCanvas.height);

        ctx1.fillStyle = "red";
        ctx1.font = "16px sans-serif";
        ctx1.textAlign = "center";
        ctx1.textBaseline = "middle";
        ctx1.fillText("Set satellite to PAYLOAD mode to display results.", intensityCanvas.width / 2, intensityCanvas.height / 2);

        return;
    }
    fetch("/payload")
        .then(res => res.json())
        .then(data => {
            const [timestamp, rawValues] = data.payload_data;
            const wavelengths = [410, 435, 460, 485, 510, 535, 560, 585, 610, 645, 680, 705, 730, 760, 810, 860, 900, 940];
            const readings = rawValues.map(Number);

            const canvasWidth = intensityCanvas.width;
            const canvasHeight = intensityCanvas.height;

            const minWavelength = 400;
            const maxWavelength = 950;
            const xTickSpacing = 50;
            const nPoints = 5000;

            const padding = {
                left: 60,
                right: 20,
                top: 20,
                bottom: 0
            };
            const plotWidth = canvasWidth - padding.left - padding.right;
            const plotHeight = canvasHeight - padding.top - padding.bottom;

            const wavelengthRange = Array.from({ length: nPoints }, (_, i) =>
                minWavelength + (i / (nPoints - 1)) * (maxWavelength - minWavelength)
            );

            const FWHM = 20;
            const sigma = FWHM / (2 * Math.sqrt(2 * Math.log(2)));

            function gaussian(x, A, mu, sigma) {
                return A * Math.exp(-Math.pow(x - mu, 2) / (2 * sigma * sigma));
            }

            // === PCHIP Interpolation ===
            function pchip(x, y, x_new) {
                const n = x.length;
                const h = Array(n - 1).fill(0).map((_, i) => x[i + 1] - x[i]);
                const delta = Array(n - 1).fill(0).map((_, i) => (y[i + 1] - y[i]) / h[i]);

                const d = new Array(n).fill(0);
                d[0] = delta[0];
                d[n - 1] = delta[n - 2];

                for (let i = 1; i < n - 1; i++) {
                    if (delta[i - 1] * delta[i] <= 0) {
                        d[i] = 0;
                    } else {
                        const w1 = 2 * h[i] + h[i - 1];
                        const w2 = h[i] + 2 * h[i - 1];
                        d[i] = (w1 + w2) > 0 ? (w1 + w2) * delta[i - 1] * delta[i] / (w1 * delta[i - 1] + w2 * delta[i]) : 0;
                    }
                }

                const y_interp = [];
                for (let xi of x_new) {
                    let i = x.findIndex((xv, idx) => xv <= xi && xi <= x[idx + 1]);
                    if (i === -1 || i >= n - 1) {
                        y_interp.push(0);
                        continue;
                    }

                    const hi = h[i];
                    const t = (xi - x[i]) / hi;
                    const h00 = (1 + 2 * t) * Math.pow(1 - t, 2);
                    const h10 = t * Math.pow(1 - t, 2);
                    const h01 = t * t * (3 - 2 * t);
                    const h11 = t * t * (t - 1);

                    const yi = h00 * y[i] + h10 * hi * d[i] + h01 * y[i + 1] + h11 * hi * d[i + 1];
                    y_interp.push(yi);
                }
                return y_interp;
            }

            const interpolatedSpectrum = pchip(wavelengths, readings, wavelengthRange);
            const maxVal = Math.max(...interpolatedSpectrum);

            // === Y-axis Tick Logic (multiples of 1/2/5/10) ===
            function getNiceTicks(maxVal, tickCount) {
                const exponent = Math.floor(Math.log10(maxVal));
                const fraction = maxVal / Math.pow(10, exponent);
                let niceFraction;

                if (fraction <= 1) niceFraction = 1;
                else if (fraction <= 2) niceFraction = 2;
                else if (fraction <= 5) niceFraction = 5;
                else niceFraction = 10;

                const niceMax = niceFraction * Math.pow(10, exponent);
                const step = niceMax / tickCount;
                const ticks = Array.from({ length: tickCount + 1 }, (_, i) => i * step);
                return [ticks, niceMax];
            }

            const [yTickValues, trueMaxY] = getNiceTicks(maxVal, 5);
            const normalisedSpectrum = interpolatedSpectrum.map(v => v / trueMaxY);

            // Mapping functions
            function mapX(w) {
                return padding.left + ((w - minWavelength) / (maxWavelength - minWavelength)) * plotWidth;
            }
            function mapY(v) {
                return padding.top + (1 - v / trueMaxY) * plotHeight;
            }

            function wavelengthToRGB(w) {
                let red = 0, green = 0, blue = 0, factor = 0;
                const Gamma = 0.8;
                const IntensityMax = 255;

                if (380 <= w && w < 440) [red, green, blue] = [(440 - w) / 60, 0, 1];
                else if (440 <= w && w < 490) [red, green, blue] = [0, (w - 440) / 50, 1];
                else if (490 <= w && w < 510) [red, green, blue] = [0, 1, (510 - w) / 20];
                else if (510 <= w && w < 580) [red, green, blue] = [(w - 510) / 70, 1, 0];
                else if (580 <= w && w < 645) [red, green, blue] = [1, (645 - w) / 65, 0];
                else if (645 <= w && w <= 780) [red, green, blue] = [1, 0, 0];

                if (380 <= w && w < 420) factor = 0.3 + 0.7 * (w - 380) / 40;
                else if (420 <= w && w < 701) factor = 1.0;
                else if (701 <= w && w <= 780) factor = 0.3 + 0.7 * (780 - w) / 80;

                const r = red > 0 ? Math.round(IntensityMax * Math.pow(red * factor, Gamma)) : 0;
                const g = green > 0 ? Math.round(IntensityMax * Math.pow(green * factor, Gamma)) : 0;
                const b = blue > 0 ? Math.round(IntensityMax * Math.pow(blue * factor, Gamma)) : 0;
                return `rgb(${r},${g},${b})`;
            }

            // === Clear and Setup ===
            ctx1.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx2.clearRect(0, 0, absorptionCanvas.width, absorptionCanvas.height);
            ctx1.fillStyle = "white";
            ctx1.fillRect(0, 0, canvasWidth, canvasHeight);
            ctx2.fillStyle = "black";
            ctx2.fillRect(0, 0, absorptionCanvas.width, absorptionCanvas.height);

            // === Y-axis Gridlines and Labels ===
            ctx1.strokeStyle = "#ccc";
            ctx1.fillStyle = "black";
            ctx1.font = "12px sans-serif";
            ctx1.textAlign = "right";
            ctx1.textBaseline = "middle";
            yTickValues.forEach(val => {
                const y = mapY(val);
                ctx1.beginPath();
                ctx1.moveTo(padding.left, y);
                ctx1.lineTo(canvasWidth - padding.right, y);
                ctx1.stroke();
                ctx1.fillText(val.toFixed(2), padding.left - 5, y);
            });

            // === X-axis Gridlines (Intensity plot) ===
            ctx1.strokeStyle = "#eee";
            for (let w = minWavelength; w <= maxWavelength; w += xTickSpacing) {
                const x = mapX(w);
                ctx1.beginPath();
                ctx1.moveTo(x, padding.top);
                ctx1.lineTo(x, canvasHeight - padding.bottom);
                ctx1.stroke();
            }

            // === Intensity Spectrum (coloured line) ===
            for (let i = 0; i < wavelengthRange.length - 1; i++) {
                const w1 = wavelengthRange[i];
                const w2 = wavelengthRange[i + 1];
                const x1 = mapX(w1);
                const x2 = mapX(w2);
                const y1 = mapY(interpolatedSpectrum[i]);
                const y2 = mapY(interpolatedSpectrum[i + 1]);

                ctx1.beginPath();
                ctx1.moveTo(x1, y1);
                ctx1.lineTo(x2, y2);
                ctx1.strokeStyle = wavelengthToRGB((w1 + w2) / 2);
                ctx1.lineWidth = 1.5;
                ctx1.stroke();
            }

            // === Gaussian curves over each sensor point ===
            ctx1.strokeStyle = "rgba(0,0,0,0.2)";
            ctx1.lineWidth = 1;
            wavelengths.forEach((wl, i) => {
                ctx1.beginPath();
                for (let j = 0; j < wavelengthRange.length; j++) {
                    const x = mapX(wavelengthRange[j]);
                    const y = mapY(gaussian(wavelengthRange[j], readings[i], wl, sigma));
                    if (j === 0) ctx1.moveTo(x, y);
                    else ctx1.lineTo(x, y);
                }
                ctx1.stroke();
            });

            // === Absorption Spectrum ===
            wavelengthRange.forEach((w, i) => {
                const x = mapX(w);
                ctx2.beginPath();
                ctx2.moveTo(x, 0);
                ctx2.lineTo(x, absorptionCanvas.height);
                ctx2.strokeStyle = wavelengthToRGB(w);
                ctx2.globalAlpha = normalisedSpectrum[i];
                ctx2.lineWidth = 1;
                ctx2.stroke();
            });
            ctx2.globalAlpha = 1.0;

            // === X-axis Wavelength Labels (Absorption plot) ===
            ctx2.fillStyle = "white";
            ctx2.font = "12px sans-serif";
            ctx2.textAlign = "center";
            ctx2.textBaseline = "top";
            for (let w = minWavelength; w <= maxWavelength; w += xTickSpacing) {
                const x = mapX(w);
                ctx2.fillText(w.toString(), x, 0);
            }

            // ctx2.fillStyle = "white";
            // ctx2.font = "14px sans-serif";
            // ctx2.textAlign = "center";
            // ctx2.textBaseline = "bottom";
            // ctx2.fillText("Wavelength (nm)", absorptionCanvas.width / 2, absorptionCanvas.height + 10);

            // === Axis Titles ===
            // ctx1.fillStyle = "black";
            // ctx1.font = "14px sans-serif";
            // ctx1.textAlign = "center";
            // ctx1.textBaseline = "top";
            // ctx1.fillText("Wavelength (nm)", canvasWidth / 2, canvasHeight - 20);

            ctx1.save();
            ctx1.translate(5, canvasHeight / 2);  // increased left buffer from 15 → 10
            ctx1.rotate(-Math.PI / 2);
            ctx1.textAlign = "center";
            ctx1.textBaseline = "top";
            ctx1.fillText("Relative Intensity (%)", 0, 0); 
            ctx1.restore();
        })
        .catch(err => console.error("Error fetching payload data:", err));
}

setInterval(plotSpectrums, 1000);