// Constants
const freqs = [
    20, 21, 22, 23, 24, 26, 27, 29, 30, 32, 34, 36, 38, 40,
    43, 45, 48, 50, 53, 56, 59, 63, 66, 70, 74, 78, 83, 87, 92, 97,
    103, 109, 115, 121, 128, 136, 143, 151, 160, 169, 178, 188,
    199, 210, 222, 235, 248, 262, 277, 292, 309, 326, 345, 364, 385,
    406, 429, 453, 479, 506, 534, 565, 596, 630, 665, 703, 743, 784,
    829, 875, 924, 977, 1032, 1090, 1151, 1216, 1284, 1357, 1433,
    1514, 1599, 1689, 1784, 1885, 1991, 2103, 2221, 2347, 2479,
    2618, 2766, 2921, 3086, 3260, 3443, 3637, 3842, 4058, 4287,
    4528, 4783, 5052, 5337, 5637, 5955, 6290, 6644, 7018, 7414,
    7831, 8272, 8738, 9230, 9749, 10298, 10878, 11490, 12137, 12821,
    13543, 14305, 15110, 15961, 16860, 17809, 18812, 19871
];

const sections = [
    { name: "🔊 Bass (20-250 Hz)", start: 0, end: 32 },
    { name: "🎵 Low Mids (250-500 Hz)", start: 32, end: 50 },
    { name: "🎤 Mids (500-2000 Hz)", start: 50, end: 78 },
    { name: "✨ High Mids (2-8 kHz)", start: 78, end: 108 },
    { name: "🔔 Treble (8-20 kHz)", start: 108, end: freqs.length }
];

// DOM elements and initial values
const slidersDiv = document.getElementById("sliders");
const output = document.getElementById("output");
let values = {};

// Initialize frequencies
freqs.forEach(freq => {
    values[freq] = 0;
});

// Main update function
function updateOutput() {
    const eqString = freqs.map(f => `${f} ${values[f] || 0}`).join("; ");
    output.value = `GraphicEQ: ${eqString}`;
    chart.data.datasets[0].data = freqs.map(f => values[f] || 0);
    chart.update('none');
}

// Create frequency sections and sliders
sections.forEach((section, sectionIndex) => {
    const sectionDiv = document.createElement("div");
    sectionDiv.className = "freq-section";
    
    const headerDiv = document.createElement("div");
    headerDiv.className = "section-header";
    
    const title = document.createElement("h4");
    title.textContent = section.name;
    
    const resetBtn = document.createElement("button");
    resetBtn.className = "btn reset-section";
    resetBtn.textContent = "Reset";
    resetBtn.onclick = () => resetSection(sectionIndex);
    
    headerDiv.appendChild(title);
    headerDiv.appendChild(resetBtn);
    sectionDiv.appendChild(headerDiv);

    for (let i = section.start; i < section.end && i < freqs.length; i++) {
        const freq = freqs[i];
        
        const container = document.createElement("div");
        container.className = "freq";

        const label = document.createElement("label");
        label.textContent = `${freq} Hz`;

        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = -20;
        slider.max = 20;
        slider.step = 0.1;
        slider.value = 0;
        slider.className = "slider";
        slider.dataset.freq = freq;
        slider.oninput = () => {
            values[freq] = parseFloat(slider.value);
            updateOutput();
        };

        const valDisplay = document.createElement("span");
        valDisplay.textContent = "0 dB";
        slider.addEventListener("input", () => {
            valDisplay.textContent = slider.value + " dB";
        });

        const resetFreqBtn = document.createElement("button");
        resetFreqBtn.className = "btn reset-freq";
        resetFreqBtn.textContent = "R";
        resetFreqBtn.onclick = () => {
            slider.value = 0;
            values[freq] = 0;
            valDisplay.textContent = "0 dB";
            updateOutput();
        };

        container.appendChild(label);
        container.appendChild(slider);
        container.appendChild(valDisplay);
        container.appendChild(resetFreqBtn);
        sectionDiv.appendChild(container);
    }
    
    slidersDiv.appendChild(sectionDiv);
});

// Reset functions
function resetSection(sectionIndex) {
    const section = sections[sectionIndex];
    for (let i = section.start; i < section.end && i < freqs.length; i++) {
        const freq = freqs[i];
        const slider = document.querySelector(`input[data-freq="${freq}"]`);
        if (slider) {
            slider.value = 0;
            values[freq] = 0;
            slider.nextElementSibling.textContent = "0 dB";
        }
    }
    updateOutput();
}

function resetAll() {
    document.querySelectorAll('.slider').forEach(slider => {
        slider.value = 0;
        values[slider.dataset.freq] = 0;
        slider.nextElementSibling.textContent = "0 dB";
    });
    updateOutput();
}