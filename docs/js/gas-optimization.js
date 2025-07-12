/**
 * Gas Optimization Simulations for Autophage Protocol
 * Implements lazy decay, batch processing, and state channel calculations
 */

// Global chart instances
let lazyDecayChart, batchChart, stateChannelChart;

// Gas costs (in gas units)
const GAS_COSTS = {
    // Storage operations
    SSTORE_INIT: 20000,      // Initial storage
    SSTORE_UPDATE: 5000,     // Update existing storage
    SLOAD: 2100,             // Read from storage
    
    // Computation
    BASIC_MATH: 3,           // Addition, subtraction
    MULTIPLY: 5,             // Multiplication
    EXPONENT: 10,            // Per iteration for exponentiation
    
    // Transaction overhead
    TX_BASE: 21000,          // Base transaction cost
    TX_DATA_ZERO: 4,         // Per zero byte
    TX_DATA_NONZERO: 16,     // Per non-zero byte
    
    // Specific operations
    BALANCE_UPDATE: 5000,    // Update single balance
    TIMESTAMP_CHECK: 200,    // Check timestamp
    MERKLE_VERIFY: 3000,     // Verify single Merkle proof
    BATCH_OVERHEAD: 30000,   // Batch processing overhead
};

// Initialize all simulations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeSliders();
    initializeCharts();
    updateAllCalculations();
});

// Initialize slider event listeners
function initializeSliders() {
    // Lazy decay sliders
    ['numUsers', 'daysInactive', 'activeUserPercent'].forEach(sliderId => {
        const slider = document.getElementById(sliderId);
        if (slider) {
            slider.addEventListener('input', function() {
                updateSliderValue(sliderId);
                updateLazyDecayCalculations();
            });
        }
    });
    
    // Batch processing sliders
    ['verificationsPerDay', 'batchSize', 'gasPrice'].forEach(sliderId => {
        const slider = document.getElementById(sliderId);
        if (slider) {
            slider.addEventListener('input', function() {
                updateSliderValue(sliderId);
                updateBatchCalculations();
            });
        }
    });
}

// Update slider display values
function updateSliderValue(sliderId) {
    const slider = document.getElementById(sliderId);
    const valueElement = document.getElementById(sliderId + 'Value');
    
    if (!slider || !valueElement) return;
    
    let value = parseFloat(slider.value);
    let displayValue;
    
    switch(sliderId) {
        case 'numUsers':
            displayValue = value.toLocaleString();
            break;
        case 'daysInactive':
            displayValue = `${value} days`;
            break;
        case 'activeUserPercent':
            displayValue = `${value}%`;
            break;
        case 'verificationsPerDay':
        case 'batchSize':
            displayValue = value.toString();
            break;
        case 'gasPrice':
            displayValue = `${value} gwei`;
            break;
        default:
            displayValue = value;
    }
    
    valueElement.textContent = displayValue;
}

// Update all calculations
function updateAllCalculations() {
    updateLazyDecayCalculations();
    updateBatchCalculations();
    updateStateChannelChart();
    updateCombinedImpact();
}

// Calculate and update lazy decay metrics
function updateLazyDecayCalculations() {
    const numUsers = parseInt(document.getElementById('numUsers').value);
    const daysInactive = parseInt(document.getElementById('daysInactive').value);
    const activeUserPercent = parseInt(document.getElementById('activeUserPercent').value) / 100;
    
    // Calculate gas costs for naive approach (update all balances every block)
    const gasPerBlockNaive = numUsers * 4 * GAS_COSTS.BALANCE_UPDATE; // 4 token species
    const blocksPerDay = 24 * 60 * 60 / 12; // ~7200 blocks per day (12 second blocks)
    const naiveGasPerDay = gasPerBlockNaive * blocksPerDay;
    const naiveGasPerMonth = naiveGasPerDay * 30;
    
    // Calculate gas costs for lazy decay (update only on interaction)
    const activeUsersDaily = Math.floor(numUsers * activeUserPercent);
    const gasPerInteraction = GAS_COSTS.TX_BASE + 
                             GAS_COSTS.TIMESTAMP_CHECK + 
                             (4 * (GAS_COSTS.SLOAD + GAS_COSTS.BALANCE_UPDATE + GAS_COSTS.EXPONENT * daysInactive));
    const lazyGasPerDay = activeUsersDaily * gasPerInteraction;
    const lazyGasPerMonth = lazyGasPerDay * 30;
    
    // Calculate savings
    const totalSavings = naiveGasPerMonth - lazyGasPerMonth;
    const savingsPercent = (totalSavings / naiveGasPerMonth * 100).toFixed(1);
    const perDaySavings = Math.floor(totalSavings / (numUsers * (1 - activeUserPercent) * 30));
    
    // Update display
    document.getElementById('calcUsers').textContent = numUsers.toLocaleString();
    document.getElementById('calcInactive').textContent = daysInactive;
    document.getElementById('naiveGasTotal').textContent = naiveGasPerMonth.toLocaleString();
    document.getElementById('lazyGasTotal').textContent = lazyGasPerMonth.toLocaleString();
    document.getElementById('totalSavings').textContent = totalSavings.toLocaleString();
    document.getElementById('savingsPercent').textContent = savingsPercent;
    document.getElementById('perDaySavings').textContent = perDaySavings.toLocaleString();
    
    // Update chart
    updateLazyDecayChart(naiveGasPerDay, lazyGasPerDay);
}

// Update lazy decay comparison chart
function updateLazyDecayChart(naiveGasPerDay, lazyGasPerDay) {
    const ctx = document.getElementById('lazyDecayChart').getContext('2d');
    
    // Generate 30 days of data
    const days = Array.from({length: 30}, (_, i) => i + 1);
    const naiveCumulative = days.map(day => naiveGasPerDay * day);
    const lazyCumulative = days.map(day => lazyGasPerDay * day);
    
    const data = {
        labels: days.map(d => `Day ${d}`),
        datasets: [
            {
                label: 'Naive Implementation',
                data: naiveCumulative,
                borderColor: 'rgba(231, 76, 60, 1)',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                borderWidth: 3,
                fill: false
            },
            {
                label: 'Lazy Decay',
                data: lazyCumulative,
                borderColor: 'rgba(46, 204, 113, 1)',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                borderWidth: 3,
                fill: false
            }
        ]
    };
    
    if (lazyDecayChart) {
        lazyDecayChart.data = data;
        lazyDecayChart.update();
    } else {
        lazyDecayChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + 
                                       context.parsed.y.toLocaleString() + ' gas';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time Period'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Cumulative Gas Used'
                        },
                        ticks: {
                            callback: function(value) {
                                if (value >= 1000000) {
                                    return (value / 1000000).toFixed(0) + 'M';
                                }
                                return value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
}

// Calculate and update batch processing metrics
function updateBatchCalculations() {
    const verificationsPerDay = parseInt(document.getElementById('verificationsPerDay').value);
    const batchSize = parseInt(document.getElementById('batchSize').value);
    const gasPrice = parseInt(document.getElementById('gasPrice').value);
    
    // Individual verification costs
    const individualGasPerTx = GAS_COSTS.TX_BASE + GAS_COSTS.BALANCE_UPDATE + 1000; // Additional overhead
    const individualGasPerDay = verificationsPerDay * individualGasPerTx;
    
    // Batch verification costs
    const batchesPerDay = Math.ceil(verificationsPerDay / batchSize);
    const batchGasPerTx = GAS_COSTS.TX_BASE + 
                         GAS_COSTS.BATCH_OVERHEAD + 
                         (batchSize * GAS_COSTS.MERKLE_VERIFY);
    const batchGasPerDay = batchesPerDay * batchGasPerTx;
    
    // Update batch processing chart
    updateBatchChart(verificationsPerDay, gasPrice);
}

// Update batch processing chart
function updateBatchChart(verificationsPerDay, gasPrice) {
    const ctx = document.getElementById('batchChart').getContext('2d');
    
    // Calculate costs for different batch sizes
    const batchSizes = [1, 10, 25, 50, 75, 100];
    const gasCosts = batchSizes.map(size => {
        const batchesPerDay = Math.ceil(verificationsPerDay / size);
        const gasPerBatch = GAS_COSTS.TX_BASE + 
                           GAS_COSTS.BATCH_OVERHEAD + 
                           (size * GAS_COSTS.MERKLE_VERIFY);
        return batchesPerDay * gasPerBatch;
    });
    
    // Convert to ETH costs
    const ethCosts = gasCosts.map(gas => (gas * gasPrice * 1e-9).toFixed(4));
    
    const data = {
        labels: batchSizes.map(s => `Batch of ${s}`),
        datasets: [{
            label: 'Daily Gas Cost',
            data: gasCosts,
            borderColor: 'rgba(52, 152, 219, 1)',
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            borderWidth: 3,
            yAxisID: 'y1'
        }, {
            label: 'Daily ETH Cost',
            data: ethCosts,
            borderColor: 'rgba(155, 89, 182, 1)',
            backgroundColor: 'rgba(155, 89, 182, 0.1)',
            borderWidth: 3,
            yAxisID: 'y2',
            hidden: true
        }]
    };
    
    if (batchChart) {
        batchChart.data = data;
        batchChart.update();
    } else {
        batchChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                if (context.dataset.label === 'Daily Gas Cost') {
                                    return 'Gas: ' + context.parsed.y.toLocaleString();
                                } else {
                                    return 'ETH: ' + context.parsed.y;
                                }
                            }
                        }
                    }
                },
                scales: {
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Gas Units'
                        },
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        }
                    },
                    y2: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'ETH Cost'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }
}

// Update state channel comparison chart
function updateStateChannelChart() {
    const ctx = document.getElementById('stateChannelChart').getContext('2d');
    
    // Simulate transaction volumes
    const txVolumes = [100, 500, 1000, 5000, 10000, 50000];
    
    // On-chain costs (each tx is separate)
    const onChainCosts = txVolumes.map(vol => vol * GAS_COSTS.TX_BASE);
    
    // State channel costs (only opening + closing + disputes)
    const stateChannelCosts = txVolumes.map(vol => {
        const openCost = GAS_COSTS.TX_BASE * 2; // Opening requires 2 transactions
        const closeCost = GAS_COSTS.TX_BASE;
        const disputeRate = 0.01; // 1% dispute rate
        const disputeCost = vol * disputeRate * GAS_COSTS.TX_BASE * 2;
        return openCost + closeCost + disputeCost;
    });
    
    const data = {
        labels: txVolumes.map(v => `${v.toLocaleString()} txs`),
        datasets: [
            {
                label: 'On-Chain',
                data: onChainCosts,
                borderColor: 'rgba(231, 76, 60, 1)',
                backgroundColor: 'rgba(231, 76, 60, 0.2)',
                borderWidth: 3
            },
            {
                label: 'State Channel',
                data: stateChannelCosts,
                borderColor: 'rgba(46, 204, 113, 1)',
                backgroundColor: 'rgba(46, 204, 113, 0.2)',
                borderWidth: 3
            }
        ]
    };
    
    if (stateChannelChart) {
        stateChannelChart.data = data;
        stateChannelChart.update();
    } else {
        stateChannelChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const gas = context.parsed.y;
                                const eth = (gas * 30 * 1e-9).toFixed(4); // Assume 30 gwei
                                return `${context.dataset.label}: ${gas.toLocaleString()} gas (${eth} ETH)`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Transaction Volume'
                        }
                    },
                    y: {
                        type: 'logarithmic',
                        title: {
                            display: true,
                            text: 'Total Gas Cost (log scale)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
}

// Update combined optimization impact
function updateCombinedImpact() {
    // Assume 1000 users, 100 daily verifications, 30 gwei gas price
    const gasPrice = 30; // gwei
    const ethPrice = 2000; // USD per ETH
    
    // Unoptimized costs (per month)
    const unoptimizedGas = 
        (1000 * 4 * GAS_COSTS.BALANCE_UPDATE * 7200 * 30) + // Naive decay for 1000 users
        (100 * 30 * GAS_COSTS.TX_BASE); // Individual verifications
    
    // Optimized costs (per month)
    const optimizedGas = 
        (200 * GAS_COSTS.TX_BASE * 30) + // 20% active users with lazy decay
        (4 * (GAS_COSTS.TX_BASE + GAS_COSTS.BATCH_OVERHEAD + 50 * GAS_COSTS.MERKLE_VERIFY) * 30); // Weekly batches
    
    // Convert to USD
    const unoptimizedUSD = (unoptimizedGas * gasPrice * 1e-9 * ethPrice).toFixed(0);
    const optimizedUSD = (optimizedGas * gasPrice * 1e-9 * ethPrice).toFixed(0);
    const savingsPercent = ((1 - optimizedGas / unoptimizedGas) * 100).toFixed(1);
    
    // Update display
    document.getElementById('unoptimizedCost').textContent = `$${parseInt(unoptimizedUSD).toLocaleString()}`;
    document.getElementById('optimizedCost').textContent = `$${parseInt(optimizedUSD).toLocaleString()}`;
    document.getElementById('totalSavingsPercent').textContent = `${savingsPercent}%`;
}

// Initialize charts with proper styling
function initializeCharts() {
    // Set default chart options
    Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
    
    // Update chart colors when theme changes
    window.addEventListener('storage', (e) => {
        if (e.key === 'theme') {
            updateChartTheme();
        }
    });
}

// Update chart theme colors
function updateChartTheme() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    Chart.defaults.color = isDarkMode ? '#e0e0e0' : '#333333';
    
    // Update all charts
    [lazyDecayChart, batchChart, stateChannelChart].forEach(chart => {
        if (chart) {
            chart.options.plugins.legend.labels.color = Chart.defaults.color;
            chart.update();
        }
    });
}