let chart;

function initChart() {
    const ctx = document.getElementById('eqGraph').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: freqs,
            datasets: [{
                label: 'EQ Curve',
                data: freqs.map(f => values[f] || 0),
                borderColor: '#007acc',
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: -20,
                    max: 20,
                    title: {
                        display: true,
                        text: 'dB',
                        color: '#666'
                    },
                    grid: {
                        display: true,
                        color: '#eee'
                    },
                    ticks: {
                        stepSize: 5,
                        color: '#666'
                    }
                },
                x: {
                    type: 'logarithmic',
                    min: 20,
                    max: 20000,
                    title: {
                        display: true,
                        text: 'Frequency (Hz)',
                        color: '#666'
                    },
                    grid: {
                        display: true,
                        color: '#eee'
                    },
                    ticks: {
                        callback: function(value) {
                            if ([20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000].includes(value)) {
                                return value >= 1000 ? (value/1000) + 'k' : value;
                            }
                            return '';
                        },
                        color: '#666'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}