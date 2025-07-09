// Update real-time metrics every 5 seconds
function updateMetrics() {
    const giniElement = document.getElementById('giniValue');
    const healthElement = document.getElementById('systemHealth');
    
    if (giniElement) {
        // Simulate small variations in Gini coefficient
        const base = 0.095;
        const variation = (Math.random() - 0.5) * 0.03;
        const gini = Math.max(0.08, Math.min(0.11, base + variation));
        giniElement.textContent = gini.toFixed(3);
    }
    
    if (healthElement) {
        // Simulate system health between 70-100%
        const health = Math.floor(70 + Math.random() * 30);
        healthElement.textContent = health + '%';
    }
}

// Update metrics every 5 seconds
if (document.getElementById('giniValue') || document.getElementById('systemHealth')) {
    setInterval(updateMetrics, 5000);
}

// Chart configuration for dark mode support
function getChartColors() {
    const isDark = document.body.classList.contains('dark-mode');
    return {
        text: isDark ? '#ccc' : '#000',
        grid: isDark ? '#333' : '#ddd',
        background: isDark ? '#0a0a0a' : '#fff'
    };
}

// Gini coefficient calculation
function calculateGini(wealth) {
    const n = wealth.length;
    const sorted = [...wealth].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);
    
    if (sum === 0) return 0;
    
    let giniSum = 0;
    for (let i = 0; i < n; i++) {
        giniSum += (2 * (i + 1) - n - 1) * sorted[i];
    }
    
    return giniSum / (n * sum);
}

// Gini simulation
let giniChart = null;

function runGiniSimulation() {
    const numAgents = parseInt(document.getElementById('numAgents').value);
    const simDays = parseInt(document.getElementById('simDays').value);
    
    // Update display values
    document.getElementById('numAgentsValue').textContent = numAgents;
    document.getElementById('simDaysValue').textContent = simDays;
    
    // Show loading indicator
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Running...';
    button.disabled = true;
    
    // Clear existing chart
    const ctx = document.getElementById('giniChart').getContext('2d');
    if (giniChart) {
        giniChart.destroy();
        giniChart = null;
    }
    
    // Show loading on canvas
    ctx.fillStyle = getChartColors().text;
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillText('Running simulation...', ctx.canvas.width/2, ctx.canvas.height/2);
    
    // Run simulation asynchronously
    setTimeout(() => {
    
    // Use the new simulation classes
    const autoSim = new AutophageBrowserSim(numAgents, simDays);
    const tradSim = new TraditionalEconomySim(numAgents, simDays);
    
    // Run simulations
    const autophageGini = autoSim.run();
    const traditionalGini = tradSim.run();
    
    // Create labels for chart
    const labels = [];
    for (let i = 0; i <= simDays; i++) {
        if (i % 5 === 0) labels.push(i);
    }
    
    // Sample data for chart (every 5th day)
    const autophageData = [];
    const traditionalData = [];
    for (let i = 0; i < autophageGini.length; i++) {
        if (i % 5 === 0) {
            autophageData.push(autophageGini[i]);
            traditionalData.push(traditionalGini[i]);
        }
    }
    
    // Create chart
    const colors = getChartColors();
    
    giniChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Traditional Economy',
                data: traditionalData,
                borderColor: '#e74c3c',
                backgroundColor: 'transparent',
                tension: 0.1
            }, {
                label: 'Autophage Protocol',
                data: autophageData,
                borderColor: '#2ecc71',
                backgroundColor: 'transparent',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Gini Coefficient Evolution',
                    color: colors.text
                },
                legend: {
                    labels: {
                        color: colors.text
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Days',
                        color: colors.text
                    },
                    ticks: {
                        color: colors.text
                    },
                    grid: {
                        color: colors.grid
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Gini Coefficient',
                        color: colors.text
                    },
                    ticks: {
                        color: colors.text
                    },
                    grid: {
                        color: colors.grid
                    },
                    min: 0,
                    max: 1
                }
            }
        }
    });
    
    window.giniChart = giniChart;
    
    // Re-enable button
    button.textContent = originalText;
    button.disabled = false;
    
    }, 100); // Small delay to show loading
}

// Token decay simulation
let decayChart = null;

function runDecaySimulation() {
    const initialBalance = parseInt(document.getElementById('initialBalance').value);
    const decayDays = parseInt(document.getElementById('decayDays').value);
    
    // Update display values
    document.getElementById('initialBalanceValue').textContent = initialBalance;
    document.getElementById('decayDaysValue').textContent = decayDays;
    
    // Show loading
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Running...';
    button.disabled = true;
    
    // Clear existing chart
    const ctx = document.getElementById('decayChart').getContext('2d');
    if (decayChart) {
        decayChart.destroy();
        decayChart = null;
    }
    
    // Show loading on canvas
    ctx.fillStyle = getChartColors().text;
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillText('Running simulation...', ctx.canvas.width/2, ctx.canvas.height/2);
    
    setTimeout(() => {
    
    // Token species decay rates
    const species = {
        'Rhythm': 0.05,
        'Healing': 0.0075,
        'Foundation': 0.001,
        'Catalyst': 0.04
    };
    
    const labels = [];
    const datasets = [];
    
    // Generate data for each species
    for (const [name, rate] of Object.entries(species)) {
        const data = [];
        for (let day = 0; day <= decayDays; day++) {
            if (day % 5 === 0) labels.push(day);
            const balance = initialBalance * Math.pow(1 - rate, day);
            if (day % 5 === 0) data.push(balance);
        }
        
        datasets.push({
            label: name,
            data: data,
            borderColor: getSpeciesColor(name),
            backgroundColor: 'transparent',
            tension: 0.1
        });
    }
    
    // Create chart
    const colors = getChartColors();
    
    decayChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Token Balance Decay Over Time',
                    color: colors.text
                },
                legend: {
                    labels: {
                        color: colors.text
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Days',
                        color: colors.text
                    },
                    ticks: {
                        color: colors.text
                    },
                    grid: {
                        color: colors.grid
                    }
                },
                y: {
                    type: 'logarithmic',
                    title: {
                        display: true,
                        text: 'Token Balance (log scale)',
                        color: colors.text
                    },
                    ticks: {
                        color: colors.text
                    },
                    grid: {
                        color: colors.grid
                    }
                }
            }
        }
    });
    
    window.decayChart = decayChart;
    
    // Re-enable button
    button.textContent = originalText;
    button.disabled = false;
    
    }, 100); // Small delay
}

function getSpeciesColor(species) {
    const colors = {
        'Rhythm': '#e74c3c',
        'Healing': '#3498db',
        'Foundation': '#f39c12',
        'Catalyst': '#9b59b6'
    };
    return colors[species] || '#95a5a6';
}

// Monte Carlo simulation
function runMonteCarloSimulation() {
    const numRuns = parseInt(document.getElementById('monteCarloRuns').value);
    const variance = parseInt(document.getElementById('activityVariance').value) / 100;
    
    // Update display values
    document.getElementById('monteCarloRunsValue').textContent = numRuns;
    document.getElementById('activityVarianceValue').textContent = (variance * 100) + '%';
    
    // Show loading
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Running...';
    button.disabled = true;
    
    const results = document.getElementById('monteCarloResults');
    results.innerHTML = 'Initializing Monte Carlo simulation...\n';
    
    // Run simulations asynchronously with progress updates
    setTimeout(() => {
        const giniResults = [];
        const wealthResults = [];
        const activityResults = [];
        
        for (let run = 0; run < numRuns; run++) {
            // Update progress every 100 runs
            if (run % 100 === 0) {
                results.innerHTML = `Running simulation... ${run}/${numRuns} (${Math.round(run/numRuns*100)}%)\n`;
            }
            
            // Use the Autophage simulation for accurate results
            const sim = new AutophageBrowserSim(1000, 180);
            
            // Add variance to the activity rate
            sim.activityRate = Math.max(0.3, Math.min(0.95, 0.7 + (Math.random() - 0.5) * variance));
            
            // Run the simulation
            const giniHistory = sim.run();
            
            // Get final values
            const finalGini = giniHistory[giniHistory.length - 1];
            
            // Calculate total wealth
            const totalWealth = [];
            for (let i = 0; i < sim.nUsers; i++) {
                totalWealth.push(
                    sim.balances.rhythm[i] + 
                    sim.balances.healing[i] + 
                    sim.balances.foundation[i] + 
                    sim.balances.catalyst[i]
                );
            }
            const avgWealth = totalWealth.reduce((a, b) => a + b, 0) / sim.nUsers;
            
            giniResults.push(finalGini);
            wealthResults.push(avgWealth);
            activityResults.push(sim.activityRate);
        }
        
        // Calculate statistics
    const giniMean = mean(giniResults);
    const giniStd = std(giniResults);
    const wealthMean = mean(wealthResults);
    const wealthStd = std(wealthResults);
    const activityMean = mean(activityResults);
    const activityStd = std(activityResults);
    
    // Display results
    results.innerHTML = `Monte Carlo Simulation Results (${numRuns} runs)
=====================================

Gini Coefficient:
  Mean: ${giniMean.toFixed(4)}
  Std Dev: ${giniStd.toFixed(4)}
  95% CI: [${(giniMean - 1.96 * giniStd).toFixed(4)}, ${(giniMean + 1.96 * giniStd).toFixed(4)}]

Average Wealth:
  Mean: ${wealthMean.toFixed(2)} tokens
  Std Dev: ${wealthStd.toFixed(2)}
  95% CI: [${(wealthMean - 1.96 * wealthStd).toFixed(2)}, ${(wealthMean + 1.96 * wealthStd).toFixed(2)}]

Activity Rate:
  Mean: ${(activityMean * 100).toFixed(1)}%
  Std Dev: ${(activityStd * 100).toFixed(1)}%

Convergence: ${giniMean >= 0.08 && giniMean <= 0.11 ? '✓ Within target range (0.08-0.11)' : '✗ Outside target range'}`;

        // Re-enable button
        button.textContent = originalText;
        button.disabled = false;
        
    }, 100); // Small delay
}

// Biological scaling simulation
let scalingChart = null;

function runScalingSimulation() {
    const maxSize = parseInt(document.getElementById('networkSize').value);
    document.getElementById('networkSizeValue').textContent = maxSize.toLocaleString();
    
    const sizes = [];
    const efficiency = [];
    const metabolicRate = [];
    const allee = [];
    
    // Generate data points
    for (let i = 100; i <= maxSize; i *= 1.5) {
        sizes.push(Math.round(i));
        
        // Kleiber's Law: efficiency scales as N^(1/4)
        const eff = 1 + 0.3 * Math.pow(i / 1000, 0.25);
        efficiency.push(eff);
        
        // Metabolic rate scales as N^(-1/4)
        const met = Math.pow(i / 100, -0.25);
        metabolicRate.push(met);
        
        // Allee effect - fitness increases then plateaus
        const alleeValue = 1 - Math.exp(-i / 500);
        allee.push(alleeValue);
    }
    
    // Update or create chart
    const ctx = document.getElementById('scalingChart').getContext('2d');
    const colors = getChartColors();
    
    if (scalingChart) {
        scalingChart.destroy();
    }
    
    scalingChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sizes,
            datasets: [{
                label: 'Network Efficiency (Kleiber\'s Law)',
                data: efficiency,
                borderColor: '#2ecc71',
                backgroundColor: 'transparent',
                tension: 0.1,
                yAxisID: 'y'
            }, {
                label: 'Per-Capita Metabolic Rate',
                data: metabolicRate,
                borderColor: '#e74c3c',
                backgroundColor: 'transparent',
                tension: 0.1,
                yAxisID: 'y1'
            }, {
                label: 'Allee Effect (Network Value)',
                data: allee,
                borderColor: '#3498db',
                backgroundColor: 'transparent',
                tension: 0.1,
                yAxisID: 'y'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Biological Scaling in Network Economics',
                    color: colors.text
                },
                legend: {
                    labels: {
                        color: colors.text
                    }
                }
            },
            scales: {
                x: {
                    type: 'logarithmic',
                    title: {
                        display: true,
                        text: 'Network Size (log scale)',
                        color: colors.text
                    },
                    ticks: {
                        color: colors.text
                    },
                    grid: {
                        color: colors.grid
                    }
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Efficiency / Network Value',
                        color: colors.text
                    },
                    ticks: {
                        color: colors.text
                    },
                    grid: {
                        color: colors.grid
                    }
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Per-Capita Metabolic Rate',
                        color: colors.text
                    },
                    ticks: {
                        color: colors.text
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
    
    window.scalingChart = scalingChart;
}

// Utility functions
function mean(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function std(arr) {
    const m = mean(arr);
    const variance = arr.reduce((a, b) => a + Math.pow(b - m, 2), 0) / arr.length;
    return Math.sqrt(variance);
}

// Update input values on change
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for input changes
    const inputs = document.querySelectorAll('input[type="range"]');
    inputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const output = document.getElementById(e.target.id + 'Value');
            if (output) {
                let value = e.target.value;
                if (e.target.id === 'networkSize') {
                    value = parseInt(value).toLocaleString();
                } else if (e.target.id === 'activityVariance') {
                    value = value + '%';
                }
                output.textContent = value;
            }
        });
    });
});