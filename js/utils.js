// File operations
function downloadTxt() {
    const filename = document.getElementById('filename').value || 'Wavelet custom eq';
    const content = output.value;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename + '.txt';
    a.click();
    URL.revokeObjectURL(url);
}

function loadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        parseAndLoadEQ(content);
    };
    reader.readAsText(file);
}

function parseAndLoadEQ(content) {
    const graphicEQMatch = content.match(/GraphicEQ:\s*(.+)/);
    if (!graphicEQMatch) {
        alert('No GraphicEQ data found in file');
        return;
    }

    const eqData = graphicEQMatch[1];
    const pairs = eqData.split(';').map(pair => pair.trim());
    
    pairs.forEach(pair => {
        const [freq, value] = pair.split(' ');
        const frequency = parseFloat(freq);
        const dbValue = parseFloat(value);
        
        if (!isNaN(frequency) && !isNaN(dbValue)) {
            values[frequency] = dbValue;
            const slider = document.querySelector(`input[data-freq="${frequency}"]`);
            if (slider) {
                slider.value = dbValue;
                slider.nextElementSibling.textContent = dbValue + ' dB';
            }
        }
    });
    
    updateOutput();
}

function copyOutput() {
    output.select();
    document.execCommand('copy');
}

function smoothEQ() {
    const smoothedValues = {...values};
    
    for (let i = 1; i < freqs.length - 1; i++) {
        const prevFreq = freqs[i-1];
        const currentFreq = freqs[i];
        const nextFreq = freqs[i+1];
        
        const avgValue = (values[prevFreq] + values[currentFreq] + values[nextFreq]) / 3;
        smoothedValues[currentFreq] = parseFloat(avgValue.toFixed(1));
    }
    
    freqs.forEach(freq => {
        const slider = document.querySelector(`input[data-freq="${freq}"]`);
        if (slider) {
            slider.value = smoothedValues[freq];
            values[freq] = smoothedValues[freq];
            slider.nextElementSibling.textContent = smoothedValues[freq] + " dB";
        }
    });
    
    updateOutput();
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && document.activeElement.classList.contains('slider')) {
        e.preventDefault();
        const slider = document.activeElement;
        slider.value = 0;
        values[slider.dataset.freq] = 0;
        slider.nextElementSibling.textContent = "0 dB";
        updateOutput();
    }
});