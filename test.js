function resetAll() {
    document.querySelectorAll('.slider').forEach(slider => {
        const freq = slider.dataset.freq; // This line is correct
        slider.value = 0;
        values[freq] = 0;
        updateEQFilter(freq, 0); // But freq might be a string, not number
        // ... rest of code
    });
    updateOutput();
}