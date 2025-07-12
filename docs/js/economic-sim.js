/**
 * Economic Simulations for Autophage Protocol
 * Implements revenue model, break-even analysis, and growth projections
 */

// Global chart instances
let revenueChart, breakEvenChart, growthChart, sensitivityChart;

// Revenue model parameters
const revenueModel = {
    appIntegration: { base: 0.15, margin: 0.95 },
    marketplace: { base: 0.45, margin: 0.88, feeRate: 0.12, avgTransaction: 3.75 },
    enterprise: { base: 1.25, margin: 0.92, adoptionRate: 0.05, feePerUser: 25 }
};

// Initialize all simulations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeSliders();
    initializeCharts();
    updateAllCalculations();
});

// Initialize slider event listeners
function initializeSliders() {
    // Revenue sliders
    const revenueSliders = [
        'totalUsers', 'appFee', 'marketplaceVolume', 'marketplaceFeeRate', 
        'enterpriseAdoption', 'enterpriseFee'
    ];
    
    revenueSliders.forEach(sliderId => {
        const slider = document.getElementById(sliderId);
        if (slider) {
            slider.addEventListener('input', function() {
                updateSliderValue(sliderId);
                updateAllCalculations();
            });
        }
    });
    
    // Cost structure sliders
    ['fixedCosts', 'variableCost'].forEach(sliderId => {
        const slider = document.getElementById(sliderId);
        if (slider) {
            slider.addEventListener('input', function() {
                updateSliderValue(sliderId);
                updateBreakEvenAnalysis();
                updateProfitabilityStatus();
            });
        }
    });
    
    // Growth sliders
    ['growthRate', 'startingUsers'].forEach(sliderId => {
        const slider = document.getElementById(sliderId);
        if (slider) {
            slider.addEventListener('input', function() {
                updateSliderValue(sliderId);
                updateGrowthProjections();
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
        case 'totalUsers':
        case 'startingUsers':
            displayValue = value.toLocaleString();
            break;
        case 'appFee':
        case 'variableCost':
            displayValue = `$${value.toFixed(2)}`;
            break;
        case 'marketplaceVolume':
            displayValue = `$${value.toFixed(2)}`;
            break;
        case 'marketplaceFeeRate':
        case 'enterpriseAdoption':
        case 'growthRate':
            displayValue = `${value}%`;
            break;
        case 'enterpriseFee':
            displayValue = `$${value.toFixed(2)}`;
            break;
        case 'fixedCosts':
            displayValue = `$${value.toLocaleString()}`;
            break;
        default:
            displayValue = value;
    }
    
    valueElement.textContent = displayValue;
}

// Update all calculations
function updateAllCalculations() {
    updateRevenueCalculations();
    updateBreakEvenAnalysis();
    updateGrowthProjections();
    updateSensitivityAnalysis();
    updateProfitabilityStatus();
}

// Calculate and update revenue metrics
function updateRevenueCalculations() {
    const totalUsers = parseFloat(document.getElementById('totalUsers').value);
    const appFee = parseFloat(document.getElementById('appFee').value);
    const marketplaceVolume = parseFloat(document.getElementById('marketplaceVolume').value);
    const marketplaceFeeRate = parseFloat(document.getElementById('marketplaceFeeRate').value) / 100;
    const enterpriseAdoption = parseFloat(document.getElementById('enterpriseAdoption').value) / 100;
    const enterpriseFee = parseFloat(document.getElementById('enterpriseFee').value);
    
    // Calculate revenue streams
    const appRevenue = totalUsers * appFee;
    const marketplaceRevenue = totalUsers * marketplaceVolume * marketplaceFeeRate;
    const enterpriseRevenue = totalUsers * enterpriseAdoption * enterpriseFee;
    
    const totalMonthlyRevenue = appRevenue + marketplaceRevenue + enterpriseRevenue;
    const totalAnnualRevenue = totalMonthlyRevenue * 12;
    const revenuePerUser = totalMonthlyRevenue / totalUsers;
    
    // Calculate weighted average margin
    const appMargin = 0.95;
    const marketplaceMargin = 0.88;
    const enterpriseMargin = 0.92;
    
    const weightedMargin = (
        (appRevenue * appMargin + 
         marketplaceRevenue * marketplaceMargin + 
         enterpriseRevenue * enterpriseMargin) / 
        totalMonthlyRevenue
    ) * 100;
    
    // Update display
    document.getElementById('monthlyRevenue').textContent = 
        `$${totalMonthlyRevenue.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
    document.getElementById('annualRevenue').textContent = 
        `$${totalAnnualRevenue.toLocaleString(undefined, {maximumFractionDigits: 0})}`;
    document.getElementById('revenuePerUser').textContent = 
        `$${revenuePerUser.toFixed(2)}`;
    document.getElementById('grossMargin').textContent = 
        `${weightedMargin.toFixed(1)}%`;
    
    // Update revenue chart
    updateRevenueChart(appRevenue, marketplaceRevenue, enterpriseRevenue);
}

// Update revenue breakdown chart
function updateRevenueChart(appRevenue, marketplaceRevenue, enterpriseRevenue) {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    
    const data = {
        labels: ['App Integration', 'Marketplace', 'Enterprise'],
        datasets: [{
            data: [appRevenue, marketplaceRevenue, enterpriseRevenue],
            backgroundColor: [
                'rgba(52, 152, 219, 0.8)',
                'rgba(46, 204, 113, 0.8)',
                'rgba(155, 89, 182, 0.8)'
            ],
            borderColor: [
                'rgba(52, 152, 219, 1)',
                'rgba(46, 204, 113, 1)',
                'rgba(155, 89, 182, 1)'
            ],
            borderWidth: 2
        }]
    };
    
    if (revenueChart) {
        revenueChart.data = data;
        revenueChart.update();
    } else {
        revenueChart = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = '$' + context.parsed.toLocaleString();
                                const percentage = ((context.parsed / context.dataset.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Update break-even analysis
function updateBreakEvenAnalysis() {
    const fixedCosts = parseFloat(document.getElementById('fixedCosts').value);
    const variableCost = parseFloat(document.getElementById('variableCost').value);
    
    // Get current revenue per user
    const totalUsers = parseFloat(document.getElementById('totalUsers').value);
    const appFee = parseFloat(document.getElementById('appFee').value);
    const marketplaceVolume = parseFloat(document.getElementById('marketplaceVolume').value);
    const marketplaceFeeRate = parseFloat(document.getElementById('marketplaceFeeRate').value) / 100;
    const enterpriseAdoption = parseFloat(document.getElementById('enterpriseAdoption').value) / 100;
    const enterpriseFee = parseFloat(document.getElementById('enterpriseFee').value);
    
    const revenuePerUser = appFee + 
                           (marketplaceVolume * marketplaceFeeRate) + 
                           (enterpriseAdoption * enterpriseFee);
    
    const contributionMargin = revenuePerUser - variableCost;
    const breakEvenUsers = Math.ceil(fixedCosts / contributionMargin);
    
    // Estimate timeline (assuming 20% monthly growth from 1000 users)
    const monthsToBreakEven = Math.log(breakEvenUsers / 1000) / Math.log(1.20);
    const timelineText = `Month ${Math.floor(monthsToBreakEven)}-${Math.ceil(monthsToBreakEven + 2)}`;
    
    // Update display
    document.getElementById('breakEvenFixed').textContent = `$${fixedCosts.toLocaleString()}`;
    document.getElementById('breakEvenVariable').textContent = `$${variableCost.toFixed(2)}/month`;
    document.getElementById('breakEvenRevenue').textContent = `$${revenuePerUser.toFixed(2)}/month`;
    document.getElementById('contributionMargin').textContent = `$${contributionMargin.toFixed(2)}/month`;
    document.getElementById('breakEvenUsers').textContent = breakEvenUsers.toLocaleString();
    document.getElementById('breakEvenTimeline').textContent = timelineText;
    
    // Update break-even chart
    updateBreakEvenChart(fixedCosts, variableCost, revenuePerUser);
}

// Update break-even chart
function updateBreakEvenChart(fixedCosts, variableCost, revenuePerUser) {
    const ctx = document.getElementById('breakEvenChart').getContext('2d');
    
    // Generate data points
    const maxUsers = 100000;
    const dataPoints = [];
    for (let users = 0; users <= maxUsers; users += 5000) {
        dataPoints.push(users);
    }
    
    const revenueData = dataPoints.map(users => users * revenuePerUser);
    const costData = dataPoints.map(users => fixedCosts + (users * variableCost));
    
    const breakEvenUsers = Math.ceil(fixedCosts / (revenuePerUser - variableCost));
    
    const data = {
        labels: dataPoints,
        datasets: [
            {
                label: 'Revenue',
                data: revenueData,
                borderColor: 'rgba(46, 204, 113, 1)',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                borderWidth: 3,
                fill: false
            },
            {
                label: 'Total Costs',
                data: costData,
                borderColor: 'rgba(231, 76, 60, 1)',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                borderWidth: 3,
                fill: false
            }
        ]
    };
    
    if (breakEvenChart) {
        breakEvenChart.data = data;
        breakEvenChart.update();
    } else {
        breakEvenChart = new Chart(ctx, {
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
                                return context.dataset.label + ': $' + 
                                       context.parsed.y.toLocaleString();
                            }
                        }
                    },
                    annotation: {
                        annotations: {
                            breakEven: {
                                type: 'line',
                                xMin: breakEvenUsers,
                                xMax: breakEvenUsers,
                                borderColor: 'rgba(155, 89, 182, 1)',
                                borderWidth: 2,
                                borderDash: [5, 5],
                                label: {
                                    content: `Break-even: ${breakEvenUsers.toLocaleString()} users`,
                                    enabled: true,
                                    position: 'start'
                                }
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: 'Number of Users'
                        },
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Monthly Amount ($)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
}

// Update growth projections
function updateGrowthProjections() {
    const growthRate = parseFloat(document.getElementById('growthRate').value) / 100;
    const startingUsers = parseFloat(document.getElementById('startingUsers').value);
    
    const ctx = document.getElementById('growthChart').getContext('2d');
    
    // Generate 36 months of data
    const months = [];
    const userCounts = [];
    const revenues = [];
    
    for (let month = 0; month <= 36; month++) {
        months.push(`Month ${month}`);
        const users = startingUsers * Math.pow(1 + growthRate, month);
        userCounts.push(users);
        
        // Calculate revenue based on current parameters
        const revenuePerUser = parseFloat(document.getElementById('revenuePerUser').textContent.replace('$', ''));
        revenues.push(users * revenuePerUser);
    }
    
    const data = {
        labels: months,
        datasets: [
            {
                label: 'Monthly Revenue',
                data: revenues,
                borderColor: 'rgba(52, 152, 219, 1)',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 3,
                fill: true,
                yAxisID: 'y1'
            },
            {
                label: 'User Count',
                data: userCounts,
                borderColor: 'rgba(155, 89, 182, 1)',
                backgroundColor: 'rgba(155, 89, 182, 0.1)',
                borderWidth: 3,
                fill: false,
                yAxisID: 'y2'
            }
        ]
    };
    
    if (growthChart) {
        growthChart.data = data;
        growthChart.update();
    } else {
        growthChart = new Chart(ctx, {
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
                                if (context.dataset.label === 'Monthly Revenue') {
                                    return 'Revenue: $' + context.parsed.y.toLocaleString(undefined, {maximumFractionDigits: 0});
                                } else {
                                    return 'Users: ' + context.parsed.y.toLocaleString(undefined, {maximumFractionDigits: 0});
                                }
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
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Monthly Revenue ($)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + (value / 1000000).toFixed(1) + 'M';
                            }
                        }
                    },
                    y2: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'User Count'
                        },
                        ticks: {
                            callback: function(value) {
                                if (value >= 1000000) {
                                    return (value / 1000000).toFixed(1) + 'M';
                                } else if (value >= 1000) {
                                    return (value / 1000).toFixed(0) + 'K';
                                }
                                return value;
                            }
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

// Update sensitivity analysis
function updateSensitivityAnalysis() {
    const ctx = document.getElementById('sensitivityChart').getContext('2d');
    
    // Base values
    const baseUsers = 1000000;
    const baseAppFee = 0.15;
    const baseMarketplaceFee = 0.12;
    const baseEnterpriseAdoption = 0.05;
    
    // Calculate base revenue
    const baseRevenue = baseUsers * (
        baseAppFee + 
        (3.75 * baseMarketplaceFee) + 
        (baseEnterpriseAdoption * 25)
    ) * 12;
    
    // Sensitivity ranges (-20% to +20%)
    const sensitivityRange = [-20, -10, 0, 10, 20];
    
    // Calculate sensitivity for each parameter
    const appFeeSensitivity = sensitivityRange.map(pct => {
        const adjustedFee = baseAppFee * (1 + pct/100);
        return ((baseUsers * (adjustedFee + (3.75 * baseMarketplaceFee) + (baseEnterpriseAdoption * 25)) * 12) - baseRevenue) / baseRevenue * 100;
    });
    
    const marketplaceFeeSensitivity = sensitivityRange.map(pct => {
        const adjustedRate = baseMarketplaceFee * (1 + pct/100);
        return ((baseUsers * (baseAppFee + (3.75 * adjustedRate) + (baseEnterpriseAdoption * 25)) * 12) - baseRevenue) / baseRevenue * 100;
    });
    
    const enterpriseAdoptionSensitivity = sensitivityRange.map(pct => {
        const adjustedAdoption = baseEnterpriseAdoption * (1 + pct/100);
        return ((baseUsers * (baseAppFee + (3.75 * baseMarketplaceFee) + (adjustedAdoption * 25)) * 12) - baseRevenue) / baseRevenue * 100;
    });
    
    const data = {
        labels: sensitivityRange.map(x => x + '%'),
        datasets: [
            {
                label: 'App Integration Fee',
                data: appFeeSensitivity,
                borderColor: 'rgba(52, 152, 219, 1)',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 3
            },
            {
                label: 'Marketplace Fee Rate',
                data: marketplaceFeeSensitivity,
                borderColor: 'rgba(46, 204, 113, 1)',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                borderWidth: 3
            },
            {
                label: 'Enterprise Adoption',
                data: enterpriseAdoptionSensitivity,
                borderColor: 'rgba(155, 89, 182, 1)',
                backgroundColor: 'rgba(155, 89, 182, 0.1)',
                borderWidth: 3
            }
        ]
    };
    
    if (sensitivityChart) {
        sensitivityChart.data = data;
        sensitivityChart.update();
    } else {
        sensitivityChart = new Chart(ctx, {
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
                                       context.parsed.y.toFixed(1) + '% change in revenue';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Parameter Change'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Revenue Impact (%)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }
}

// Update profitability status
function updateProfitabilityStatus() {
    const totalUsers = parseFloat(document.getElementById('totalUsers').value);
    const monthlyRevenue = parseFloat(document.getElementById('monthlyRevenue').textContent.replace(/[$,]/g, ''));
    const fixedCosts = parseFloat(document.getElementById('fixedCosts').value);
    const variableCost = parseFloat(document.getElementById('variableCost').value);
    
    const totalCosts = fixedCosts + (totalUsers * variableCost);
    const monthlyProfit = monthlyRevenue - totalCosts;
    const profitMargin = (monthlyProfit / monthlyRevenue * 100).toFixed(1);
    
    const statusElement = document.getElementById('profitabilityStatus');
    
    if (monthlyProfit > 0) {
        statusElement.className = 'success-metric';
        statusElement.innerHTML = `<strong>Status:</strong> At ${totalUsers.toLocaleString()} users, the protocol generates $${monthlyProfit.toLocaleString(undefined, {maximumFractionDigits: 0})} in monthly profit with a ${profitMargin}% profit margin.`;
    } else {
        statusElement.className = 'warning-metric';
        statusElement.innerHTML = `<strong>Status:</strong> At ${totalUsers.toLocaleString()} users, the protocol has a monthly loss of $${Math.abs(monthlyProfit).toLocaleString(undefined, {maximumFractionDigits: 0})}. More users needed to reach profitability.`;
    }
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
    [revenueChart, breakEvenChart, growthChart, sensitivityChart].forEach(chart => {
        if (chart) {
            chart.options.plugins.legend.labels.color = Chart.defaults.color;
            chart.update();
        }
    });
}