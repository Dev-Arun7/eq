// MP3 EQ Engine
let mp3AudioContext = null;
let mp3Source = null;
let mp3Buffer = null;
let eqFilters = [];
let mp3GainNode = null;
let isMP3Playing = false;
let mp3StartTime = 0;
let mp3PauseTime = 0;

function initMP3Audio() {
    try {
        mp3AudioContext = new (window.AudioContext || window.webkitAudioContext)();
        mp3GainNode = mp3AudioContext.createGain();
        mp3GainNode.gain.value = 0.5;
        
        // Create 109 BiquadFilter nodes for each frequency
        createEQFilters();
        
        console.log('MP3 Audio initialized with', eqFilters.length, 'EQ bands');
    } catch (error) {
        console.error('MP3 Audio not supported:', error);
    }
}

function createEQFilters() {
    eqFilters = [];
    
    freqs.forEach(freq => {
        const filter = mp3AudioContext.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.setValueAtTime(freq, mp3AudioContext.currentTime);
        filter.Q.setValueAtTime(0.7, mp3AudioContext.currentTime);
        filter.gain.setValueAtTime(0, mp3AudioContext.currentTime);
        eqFilters.push(filter);
    });
    
    // Chain all filters together
    for (let i = 0; i < eqFilters.length - 1; i++) {
        eqFilters[i].connect(eqFilters[i + 1]);
    }
    
    // Connect last filter to gain node, then to output
    eqFilters[eqFilters.length - 1].connect(mp3GainNode);
    mp3GainNode.connect(mp3AudioContext.destination);
}

function loadMP3File(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        mp3AudioContext.decodeAudioData(e.target.result)
            .then(buffer => {
                mp3Buffer = buffer;
                document.getElementById('mp3Status').textContent = `Loaded: ${file.name}`;
                document.getElementById('playMP3Btn').disabled = false;
                updateMP3Duration(buffer.duration);
            })
            .catch(error => {
                console.error('Error decoding audio:', error);
                document.getElementById('mp3Status').textContent = 'Error loading file';
            });
    };
    reader.readAsArrayBuffer(file);
}

function playMP3() {
    if (!mp3Buffer) return;
    
    stopMP3();
    
    mp3Source = mp3AudioContext.createBufferSource();
    mp3Source.buffer = mp3Buffer;
    mp3Source.connect(eqFilters[0]); // Connect to first filter
    
    const offset = mp3PauseTime || 0;
    mp3Source.start(0, offset);
    mp3StartTime = mp3AudioContext.currentTime - offset;
    isMP3Playing = true;
    
    document.getElementById('playMP3Btn').textContent = '⏸ Pause';
    
    // Update progress
    updateMP3Progress();
}

function pauseMP3() {
    if (mp3Source && isMP3Playing) {
        mp3PauseTime = mp3AudioContext.currentTime - mp3StartTime;
        stopMP3();
        document.getElementById('playMP3Btn').textContent = '▶ Play';
    }
}

function stopMP3() {
    if (mp3Source) {
        mp3Source.stop();
        mp3Source = null;
    }
    isMP3Playing = false;
}

function updateEQFilter(frequency, gainDB) {
    const filterIndex = freqs.indexOf(frequency);
    if (filterIndex !== -1 && eqFilters[filterIndex]) {
        eqFilters[filterIndex].gain.setValueAtTime(gainDB, mp3AudioContext.currentTime);
    }
}

function setMP3Volume(volume) {
    if (mp3GainNode) {
        mp3GainNode.gain.value = volume;
    }
}

function updateMP3Duration(duration) {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    document.getElementById('mp3Duration').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function updateMP3Progress() {
    if (isMP3Playing && mp3Buffer) {
        const currentTime = mp3AudioContext.currentTime - mp3StartTime;
        const progress = (currentTime / mp3Buffer.duration) * 100;
        document.getElementById('mp3Progress').value = progress;
        
        const minutes = Math.floor(currentTime / 60);
        const seconds = Math.floor(currentTime % 60);
        document.getElementById('mp3CurrentTime').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (currentTime < mp3Buffer.duration) {
            requestAnimationFrame(updateMP3Progress);
        } else {
            // Song ended
            isMP3Playing = false;
            document.getElementById('playMP3Btn').textContent = '▶ Play';
            mp3PauseTime = 0;
        }
    }
}