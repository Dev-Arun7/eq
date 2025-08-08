let audioContext = null;
let oscillator = null;
let gainNode = null;
let isPlaying = false;

function initAudio() {
    try {
        audioContext = mp3AudioContext; // Use same context as MP3
        gainNode = audioContext.createGain();
        gainNode.connect(eqFilters[0]); // Connect to EQ chain instead of direct to speakers
        gainNode.gain.value = 0.1;
    } catch (error) {
        console.error('Audio not supported:', error);
    }
}

function startTone(frequency) {
    if (!audioContext) initAudio();
    if (!audioContext) return;

    stopTone();
    
    oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.connect(gainNode);
    oscillator.start();
    isPlaying = true;
}

function stopTone() {
    if (oscillator) {
        oscillator.stop();
        oscillator = null;
    }
    isPlaying = false;
}

function updateFrequency(frequency) {
    if (oscillator && isPlaying) {
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    }
}

function setVolume(volume) {
    if (gainNode) {
        gainNode.gain.value = volume;
    }
}