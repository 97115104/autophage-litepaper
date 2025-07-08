import chalk from 'chalk';
import blessed from 'blessed';
import contrib from 'blessed-contrib';
import { writeFileSync } from 'fs';

// Reservoir parameters from litepaper
const RESERVOIR_CONFIG = {
  decayRates: {
    rhythm: 0.05,
    healing: 0.0075,
    foundation: 0.001,
    catalyst: 0.04
  },
  userActivity: {
    rhythm: 0.7,    // 70% of users active daily for Rhythm
    healing: 0.2,   // 20% for Healing
    foundation: 0.05, // 5% for Foundation
    catalyst: 0.3   // 30% for Catalyst
  },
  avgDailyGeneration: {
    rhythm: 50,
    healing: 25,
    foundation: 100,
    catalyst: 20
  },
  fees: {
    marketplace: 0.12,  // 12% marketplace fee
    app: 0.001,        // 0.1% app fee
    enterprise: 0.02   // 2% enterprise fee
  },
  solvencyMultipliers: {
    deposits: 0.4,      // 40% of user deposits
    monthlyOutflow: 3,  // 3x monthly healthcare outflow
    annualRevenue: 0.22 // 22% of annual revenue
  }
};

// Simulate reservoir dynamics
const simulateReservoir = (users, days) => {
  const results = {
    tokenChamber: [],
    usdcChamber: [],
    totalDecayInflow: [],
    healthcareOutflow: [],
    feeInflow: [],
    dailyMetrics: []
  };
  
  // Initial state
  let tokenChamber = users * 1000; // Starting tokens
  let usdcChamber = users * 10;    // Starting USDC
  const baseHealthcareOutflow = users * 0.8; // $0.80 per user per day average
  
  for (let day = 0; day < days; day++) {
    // Calculate daily token decay inflow
    let dailyDecayInflow = 0;
    
    Object.entries(RESERVOIR_CONFIG.decayRates).forEach(([token, decayRate]) => {
      const activeUsers = users * RESERVOIR_CONFIG.userActivity[token];
      const avgBalance = RESERVOIR_CONFIG.avgDailyGeneration[token] / decayRate;
      const tokensPerUser = avgBalance * activeUsers;
      dailyDecayInflow += tokensPerUser * decayRate;
    });
    
    // Calculate marketplace activity
    const marketplaceVolume = users * 5 * (1 + 0.2 * Math.sin(day / 30)); // Cyclical
    const appVolume = users * 0.15;
    const enterpriseVolume = users * 1.25 * (day > 180 ? 1.5 : 1); // Growth after 6 months
    
    // Fee calculations
    const marketplaceFees = marketplaceVolume * RESERVOIR_CONFIG.fees.marketplace;
    const appFees = appVolume * RESERVOIR_CONFIG.fees.app;
    const enterpriseFees = enterpriseVolume * RESERVOIR_CONFIG.fees.enterprise;
    const totalFees = marketplaceFees + appFees + enterpriseFees;
    
    // Healthcare settlements (with some randomness)
    const healthcareSettlement = baseHealthcareOutflow * (0.8 + 0.4 * Math.random());
    
    // Token outflows
    const rewardOutflow = dailyDecayInflow * 0.1; // 10% goes to rewards
    const healthcareTokenOutflow = dailyDecayInflow * 0.15; // 15% to healthcare
    
    // Update chambers
    tokenChamber += dailyDecayInflow - rewardOutflow - healthcareTokenOutflow;
    usdcChamber += totalFees - healthcareSettlement;
    
    // Store results
    results.tokenChamber.push(tokenChamber);
    results.usdcChamber.push(usdcChamber);
    results.totalDecayInflow.push(dailyDecayInflow);
    results.healthcareOutflow.push(healthcareSettlement);
    results.feeInflow.push(totalFees);
    
    results.dailyMetrics.push({
      day,
      tokenChamber,
      usdcChamber,
      decayInflow: dailyDecayInflow,
      feeInflow: totalFees,
      healthcareOutflow: healthcareSettlement,
      solvencyRatio: usdcChamber / (baseHealthcareOutflow * 90) // 3-month coverage
    });
  }
  
  return results;
};

export async function runReservoirSimulation(options = {}) {
  const users = parseInt(options.users) || 10000;
  const days = parseInt(options.days) || 365;
  
  // Create blessed screen
  const screen = blessed.screen({
    smartCSR: true,
    title: 'Autophage Protocol - Reservoir Dynamics Simulation'
  });

  // Create grid
  const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });

  // Title
  const titleBox = grid.set(0, 0, 1, 12, blessed.box, {
    content: `{center}${chalk.blue('RESERVOIR DYNAMICS SIMULATION')}{/center}`,
    tags: true,
    border: { type: 'line' },
    style: {
      border: { fg: 'blue' }
    }
  });

  // Token chamber chart
  const tokenChart = grid.set(1, 0, 5, 6, contrib.line, {
    style: {
      line: "cyan",
      text: "green",
      baseline: "black"
    },
    xLabelPadding: 3,
    xPadding: 5,
    label: 'Token Chamber Balance'
  });

  // USDC chamber chart
  const usdcChart = grid.set(1, 6, 5, 6, contrib.line, {
    style: {
      line: "yellow",
      text: "green",
      baseline: "black"
    },
    xLabelPadding: 3,
    xPadding: 5,
    label: 'USDC Chamber Balance'
  });

  // Flow gauge
  const flowGauge = grid.set(6, 0, 3, 4, contrib.gauge, {
    label: 'Daily Token Inflow',
    stroke: 'cyan',
    fill: 'white',
    width: '100%',
    height: '100%',
    percent: 0
  });

  // Solvency gauge
  const solvencyGauge = grid.set(6, 4, 3, 4, contrib.gauge, {
    label: 'Solvency Ratio',
    stroke: 'green',
    fill: 'white',
    width: '100%',
    height: '100%',
    percent: 0
  });

  // Metrics display
  const metricsBox = grid.set(6, 8, 3, 4, blessed.box, {
    label: 'Current Metrics',
    border: { type: 'line' },
    style: {
      border: { fg: 'white' }
    },
    tags: true
  });

  // Activity log
  const activityLog = grid.set(9, 0, 2, 12, contrib.log, {
    fg: "green",
    selectedFg: "green",
    label: 'Reservoir Activity Log'
  });

  // Controls
  const controlsBox = grid.set(11, 0, 1, 12, blessed.box, {
    content: `{center}${chalk.gray('[S] Save data | [R] Restart | [Q] Quit')}{/center}`,
    tags: true,
    border: { type: 'line' },
    style: {
      border: { fg: 'gray' }
    }
  });

  // Run simulation
  let simData = simulateReservoir(users, days);
  let currentDay = 0;
  let animationInterval;

  // Update displays
  const updateDisplays = () => {
    const dayData = simData.dailyMetrics[currentDay];
    
    // Update token chamber chart
    const tokenData = simData.tokenChamber.slice(0, currentDay + 1);
    tokenChart.setData([{
      x: Array.from({ length: tokenData.length }, (_, i) => i.toString()),
      y: tokenData
    }]);
    
    // Update USDC chamber chart
    const usdcData = simData.usdcChamber.slice(0, currentDay + 1);
    usdcChart.setData([{
      x: Array.from({ length: usdcData.length }, (_, i) => i.toString()),
      y: usdcData
    }]);
    
    // Update gauges
    const maxInflow = Math.max(...simData.totalDecayInflow);
    flowGauge.setPercent(Math.round(dayData.decayInflow / maxInflow * 100));
    
    const solvencyPercent = Math.min(100, Math.round(dayData.solvencyRatio * 100));
    solvencyGauge.setPercent(solvencyPercent);
    if (solvencyPercent < 100) {
      solvencyGauge.setOptions({ stroke: 'red' });
    } else if (solvencyPercent < 150) {
      solvencyGauge.setOptions({ stroke: 'yellow' });
    } else {
      solvencyGauge.setOptions({ stroke: 'green' });
    }
    
    // Update metrics
    const metrics = [
      `{bold}Day:{/bold} ${currentDay + 1} / ${days}`,
      `{bold}Users:{/bold} ${users.toLocaleString()}`,
      '',
      `{bold}Token Chamber:{/bold}`,
      `${Math.round(dayData.tokenChamber).toLocaleString()} tokens`,
      '',
      `{bold}USDC Chamber:{/bold}`,
      `$${Math.round(dayData.usdcChamber).toLocaleString()}`,
      '',
      `{bold}Daily Flows:{/bold}`,
      `In: ${Math.round(dayData.decayInflow).toLocaleString()}`,
      `Out: $${Math.round(dayData.healthcareOutflow).toLocaleString()}`,
      '',
      `{bold}Coverage:{/bold}`,
      `${(dayData.solvencyRatio * 3).toFixed(1)} months`
    ].join('\n');
    
    metricsBox.setContent(metrics);
    
    // Add to activity log
    if (currentDay % 30 === 0) {
      activityLog.log(`Month ${Math.floor(currentDay / 30) + 1}: Token balance ${Math.round(dayData.tokenChamber).toLocaleString()}, USDC $${Math.round(dayData.usdcChamber).toLocaleString()}`);
    }
    
    screen.render();
  };

  // Animation function
  const animate = () => {
    if (currentDay < days - 1) {
      currentDay++;
      updateDisplays();
    } else {
      clearInterval(animationInterval);
      activityLog.log(chalk.green('Simulation complete!'));
      activityLog.log(`Final token balance: ${Math.round(simData.tokenChamber[days-1]).toLocaleString()}`);
      activityLog.log(`Final USDC balance: $${Math.round(simData.usdcChamber[days-1]).toLocaleString()}`);
      activityLog.log(`Final solvency ratio: ${(simData.dailyMetrics[days-1].solvencyRatio * 100).toFixed(1)}%`);
    }
  };

  // Start animation
  updateDisplays();
  animationInterval = setInterval(animate, 50); // 50ms per day

  // Save function
  const saveData = () => {
    const filename = `reservoir-simulation-${Date.now()}.json`;
    writeFileSync(filename, JSON.stringify({
      parameters: { users, days },
      results: simData
    }, null, 2));
    
    activityLog.log(chalk.yellow(`Data saved to: ${filename}`));
  };

  // Key bindings
  screen.key(['q', 'C-c'], () => {
    clearInterval(animationInterval);
    return process.exit(0);
  });

  screen.key(['s'], () => {
    saveData();
  });

  screen.key(['r'], () => {
    clearInterval(animationInterval);
    currentDay = 0;
    simData = simulateReservoir(users, days);
    updateDisplays();
    animationInterval = setInterval(animate, 50);
  });

  // Focus screen
  screen.render();
}