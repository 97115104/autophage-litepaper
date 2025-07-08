import chalk from 'chalk';
import blessed from 'blessed';
import contrib from 'blessed-contrib';
import { writeFileSync } from 'fs';

// Token decay rates from the litepaper
const DECAY_RATES = {
  rhythm: 0.05,      // 5% daily decay
  healing: 0.0075,   // 0.75% daily decay
  foundation: 0.001, // 0.1% daily decay
  catalyst: 0.04     // 4% daily decay (average)
};

// Token colors
const TOKEN_COLORS = {
  rhythm: [244, 147, 31],      // Orange
  healing: [105, 189, 69],     // Green
  foundation: [29, 92, 153],   // Blue
  catalyst: [146, 39, 143]     // Purple
};

// Half-life calculations
const calculateHalfLife = (decayRate) => {
  return Math.log(0.5) / Math.log(1 - decayRate);
};

// Simulate token balance over time
const simulateTokenDecay = (initialBalance, decayRate, days, dailyEarnings = 0) => {
  const balances = [initialBalance];
  let currentBalance = initialBalance;
  
  for (let day = 1; day <= days; day++) {
    // Apply decay
    currentBalance = currentBalance * (1 - decayRate);
    // Add daily earnings
    currentBalance += dailyEarnings;
    balances.push(currentBalance);
  }
  
  return balances;
};

// Calculate accelerated decay for large balances
const calculateAcceleratedDecay = (balance, baseDecay, thresholds) => {
  let effectiveDecay = baseDecay;
  
  for (const threshold of thresholds) {
    if (balance > threshold.balance) {
      effectiveDecay = baseDecay * (1 + threshold.acceleration);
    }
  }
  
  return effectiveDecay;
};

export async function runTokenDecaySimulation(options = {}) {
  const days = parseInt(options.days) || 90;
  const initialBalance = parseInt(options.balance) || 1000;
  
  // Create blessed screen
  const screen = blessed.screen({
    smartCSR: true,
    title: 'Autophage Protocol - Token Decay Simulation'
  });

  // Create grid
  const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });

  // Title
  const titleBox = grid.set(0, 0, 1, 12, blessed.box, {
    content: `{center}${chalk.cyan('TOKEN DECAY SIMULATION')}{/center}`,
    tags: true,
    border: { type: 'line' },
    style: {
      border: { fg: 'cyan' }
    }
  });

  // Main decay chart
  const decayChart = grid.set(1, 0, 6, 8, contrib.line, {
    style: {
      line: "yellow",
      text: "green",
      baseline: "black"
    },
    xLabelPadding: 3,
    xPadding: 5,
    showLegend: true,
    legend: { width: 20 },
    label: 'Token Balance Over Time'
  });

  // Token info panel
  const infoPanel = grid.set(1, 8, 6, 4, blessed.box, {
    label: 'Token Properties',
    border: { type: 'line' },
    style: {
      border: { fg: 'white' }
    },
    tags: true
  });

  // Comparison table
  const comparisonTable = grid.set(7, 0, 3, 12, contrib.table, {
    keys: true,
    fg: 'white',
    selectedFg: 'white',
    selectedBg: 'blue',
    interactive: false,
    label: 'Token Comparison',
    width: '100%',
    height: '100%',
    border: { type: "line", fg: "cyan" },
    columnSpacing: 10,
    columnWidth: [15, 12, 12, 20, 15]
  });

  // Controls
  const controlsBox = grid.set(10, 0, 2, 12, blessed.box, {
    content: `{center}${chalk.gray('Press [Space] to toggle earnings | [R] to regenerate | [S] to save data | [Q] to quit')}{/center}`,
    tags: true,
    border: { type: 'line' },
    style: {
      border: { fg: 'gray' }
    }
  });

  // Generate data for all token types
  let showWithEarnings = false;
  
  const generateChartData = () => {
    const chartData = [];
    const days_array = Array.from({ length: days + 1 }, (_, i) => i);
    
    Object.entries(DECAY_RATES).forEach(([token, rate]) => {
      const earnings = showWithEarnings ? 
        (token === 'rhythm' ? 50 : 
         token === 'healing' ? 25 : 
         token === 'foundation' ? 10 : 20) : 0;
      
      const balances = simulateTokenDecay(initialBalance, rate, days, earnings);
      
      chartData.push({
        title: token.charAt(0).toUpperCase() + token.slice(1),
        x: days_array,
        y: balances,
        style: {
          line: TOKEN_COLORS[token]
        }
      });
    });
    
    return chartData;
  };

  // Update chart
  const updateChart = () => {
    const data = generateChartData();
    decayChart.setData(data);
    screen.render();
  };

  // Update info panel
  const updateInfo = () => {
    const info = [
      `{bold}Initial Balance:{/bold} ${initialBalance} tokens`,
      `{bold}Simulation Days:{/bold} ${days}`,
      `{bold}Daily Earnings:{/bold} ${showWithEarnings ? 'Enabled' : 'Disabled'}`,
      '',
      '{bold}Half-Life Values:{/bold}',
      `{rgb(244,147,31)-fg}Rhythm:{/} ${calculateHalfLife(DECAY_RATES.rhythm).toFixed(1)} days`,
      `{rgb(105,189,69)-fg}Healing:{/} ${calculateHalfLife(DECAY_RATES.healing).toFixed(1)} days`,
      `{rgb(29,92,153)-fg}Foundation:{/} ${calculateHalfLife(DECAY_RATES.foundation).toFixed(1)} days`,
      `{rgb(146,39,143)-fg}Catalyst:{/} ${calculateHalfLife(DECAY_RATES.catalyst).toFixed(1)} days`,
      '',
      '{bold}Decay Formula:{/bold}',
      'V(t+1) = V(t) × (1 - δ) + G(t)',
      '',
      showWithEarnings ? '{yellow-fg}Earnings Active{/}' : '{gray-fg}No Earnings{/}'
    ].join('\n');
    
    infoPanel.setContent(info);
  };

  // Update comparison table
  const updateTable = () => {
    const tableData = [];
    
    Object.entries(DECAY_RATES).forEach(([token, rate]) => {
      const earnings = showWithEarnings ? 
        (token === 'rhythm' ? 50 : 
         token === 'healing' ? 25 : 
         token === 'foundation' ? 10 : 20) : 0;
      
      const balances = simulateTokenDecay(initialBalance, rate, days, earnings);
      const finalBalance = balances[balances.length - 1];
      const percentRemaining = (finalBalance / initialBalance * 100).toFixed(1);
      
      tableData.push([
        token.charAt(0).toUpperCase() + token.slice(1),
        `${(rate * 100).toFixed(2)}%`,
        `${calculateHalfLife(rate).toFixed(1)} days`,
        showWithEarnings ? `${earnings}/day` : 'None',
        `${Math.round(finalBalance)} (${percentRemaining}%)`
      ]);
    });
    
    comparisonTable.setData({
      headers: ['Token', 'Decay Rate', 'Half-Life', 'Daily Earnings', 'Final Balance'],
      data: tableData
    });
  };

  // Save simulation data
  const saveData = () => {
    const data = {
      parameters: {
        initialBalance,
        days,
        showWithEarnings
      },
      tokenData: {}
    };
    
    Object.entries(DECAY_RATES).forEach(([token, rate]) => {
      const earnings = showWithEarnings ? 
        (token === 'rhythm' ? 50 : 
         token === 'healing' ? 25 : 
         token === 'foundation' ? 10 : 20) : 0;
      
      const balances = simulateTokenDecay(initialBalance, rate, days, earnings);
      
      data.tokenData[token] = {
        decayRate: rate,
        halfLife: calculateHalfLife(rate),
        dailyEarnings: earnings,
        balances: balances
      };
    });
    
    const filename = `token-decay-simulation-${Date.now()}.json`;
    writeFileSync(filename, JSON.stringify(data, null, 2));
    
    // Show confirmation
    const msg = blessed.message({
      parent: screen,
      border: 'line',
      height: 'shrink',
      width: 'half',
      top: 'center',
      left: 'center',
      label: ' {blue-fg}Success{/} ',
      tags: true,
      keys: true,
      hidden: true,
      vi: true
    });
    
    msg.display(`Data saved to:\n${filename}`, 2);
  };

  // Initial render
  updateChart();
  updateInfo();
  updateTable();
  screen.render();

  // Key bindings
  screen.key(['q', 'C-c'], () => {
    return process.exit(0);
  });

  screen.key(['space'], () => {
    showWithEarnings = !showWithEarnings;
    updateChart();
    updateInfo();
    updateTable();
    screen.render();
  });

  screen.key(['r'], () => {
    updateChart();
    screen.render();
  });

  screen.key(['s'], () => {
    saveData();
  });

  // Focus screen
  screen.render();
}