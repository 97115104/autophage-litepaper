#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import open from 'open';
import { runTokenDecaySimulation } from './simulations/tokenDecay.js';
import { runReservoirSimulation } from './simulations/reservoir.js';
import { runPriceDiscoverySimulation } from './simulations/priceDiscovery.js';
import { runGiniSimulation } from './simulations/giniEvolution.js';
import { runUserJourneySimulation } from './simulations/userJourneys.js';
import { runGovernanceSimulation } from './simulations/governance.js';
import { runAllSimulations } from './simulations/all.js';
import { generateWebVisualizations } from './utils/webGenerator.js';

const program = new Command();

// Token colors matching the protocol
const tokenColors = {
  rhythm: chalk.rgb(244, 147, 31),
  healing: chalk.rgb(105, 189, 69),
  foundation: chalk.rgb(29, 92, 153),
  catalyst: chalk.rgb(146, 39, 143)
};

// ASCII Art Logo
const logo = `
${tokenColors.catalyst('╔═══════════════════════════════════════════════════════════╗')}
${tokenColors.catalyst('║')}  ${tokenColors.rhythm('█████')}  ${tokenColors.healing('██')}   ${tokenColors.foundation('██')} ${tokenColors.rhythm('████████')}  ${tokenColors.healing('██████')}  ${tokenColors.foundation('██████')}  ${tokenColors.catalyst('██')}   ${tokenColors.rhythm('██')}  ${tokenColors.catalyst('║')}
${tokenColors.catalyst('║')} ${tokenColors.rhythm('██   ██')} ${tokenColors.healing('██')}   ${tokenColors.foundation('██')}    ${tokenColors.rhythm('██')}    ${tokenColors.healing('██    ██')} ${tokenColors.foundation('██   ██')} ${tokenColors.catalyst('██')}   ${tokenColors.rhythm('██')}  ${tokenColors.catalyst('║')}
${tokenColors.catalyst('║')} ${tokenColors.rhythm('███████')} ${tokenColors.healing('██')}   ${tokenColors.foundation('██')}    ${tokenColors.rhythm('██')}    ${tokenColors.healing('██    ██')} ${tokenColors.foundation('██████')}  ${tokenColors.catalyst('███████')}  ${tokenColors.catalyst('║')}
${tokenColors.catalyst('║')} ${tokenColors.rhythm('██   ██')} ${tokenColors.healing('██')}   ${tokenColors.foundation('██')}    ${tokenColors.rhythm('██')}    ${tokenColors.healing('██    ██')} ${tokenColors.foundation('██')}      ${tokenColors.catalyst('██')}   ${tokenColors.rhythm('██')}  ${tokenColors.catalyst('║')}
${tokenColors.catalyst('║')} ${tokenColors.rhythm('██   ██')}  ${tokenColors.healing('█████')}     ${tokenColors.rhythm('██')}     ${tokenColors.healing('██████')}  ${tokenColors.foundation('██')}      ${tokenColors.catalyst('██')}   ${tokenColors.rhythm('██')}  ${tokenColors.catalyst('║')}
${tokenColors.catalyst('╚═══════════════════════════════════════════════════════════╝')}
           ${chalk.gray('PROTOCOL SIMULATOR v1.0')}
`;

// Display welcome message
console.clear();
console.log(logo);
console.log(chalk.gray('\nMetabolic Economics for Decentralized Health\n'));

program
  .name('autophage')
  .description('Comprehensive simulator for the Autophage Protocol')
  .version('1.0.0');

// Interactive menu command (default)
program
  .command('menu', { isDefault: true })
  .description('Launch interactive simulation menu')
  .action(async () => {
    const choices = [
      {
        name: `${tokenColors.rhythm('⚡')} Token Decay Simulation`,
        value: 'tokenDecay',
        short: 'Token Decay'
      },
      {
        name: `${tokenColors.foundation('💧')} Reservoir Dynamics`,
        value: 'reservoir',
        short: 'Reservoir'
      },
      {
        name: `${tokenColors.healing('📈')} Price Discovery`,
        value: 'priceDiscovery',
        short: 'Price'
      },
      {
        name: `${tokenColors.catalyst('📊')} Gini Coefficient Evolution`,
        value: 'gini',
        short: 'Gini'
      },
      {
        name: `${chalk.cyan('👥')} User Journey Simulations`,
        value: 'userJourneys',
        short: 'Journeys'
      },
      {
        name: `${chalk.magenta('🗳️')} Governance Voting Power`,
        value: 'governance',
        short: 'Governance'
      },
      new inquirer.Separator(),
      {
        name: `${chalk.yellow('🎯')} Run All Simulations`,
        value: 'all',
        short: 'All'
      },
      {
        name: `${chalk.blue('🌐')} Generate Web Visualizations`,
        value: 'web',
        short: 'Web'
      },
      new inquirer.Separator(),
      {
        name: chalk.gray('Exit'),
        value: 'exit'
      }
    ];

    const { simulation } = await inquirer.prompt([
      {
        type: 'list',
        name: 'simulation',
        message: 'Select a simulation to run:',
        choices,
        pageSize: 12
      }
    ]);

    switch (simulation) {
      case 'tokenDecay':
        await runTokenDecaySimulation();
        break;
      case 'reservoir':
        await runReservoirSimulation();
        break;
      case 'priceDiscovery':
        await runPriceDiscoverySimulation();
        break;
      case 'gini':
        await runGiniSimulation();
        break;
      case 'userJourneys':
        await runUserJourneySimulation();
        break;
      case 'governance':
        await runGovernanceSimulation();
        break;
      case 'all':
        await runAllSimulations();
        break;
      case 'web':
        await generateWebVisualizations();
        break;
      case 'exit':
        console.log(chalk.gray('\nThank you for using Autophage Protocol Simulator!\n'));
        process.exit(0);
    }

    // After simulation, ask if they want to run another
    const { runAnother } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'runAnother',
        message: 'Would you like to run another simulation?',
        default: true
      }
    ]);

    if (runAnother) {
      program.parse(process.argv);
    } else {
      console.log(chalk.gray('\nThank you for using Autophage Protocol Simulator!\n'));
    }
  });

// Direct commands for each simulation
program
  .command('decay')
  .description('Run token decay simulation')
  .option('-d, --days <number>', 'number of days to simulate', '90')
  .option('-b, --balance <number>', 'initial balance', '1000')
  .action(async (options) => {
    await runTokenDecaySimulation(options);
  });

program
  .command('reservoir')
  .description('Run reservoir dynamics simulation')
  .option('-u, --users <number>', 'number of users', '10000')
  .option('-d, --days <number>', 'number of days to simulate', '365')
  .action(async (options) => {
    await runReservoirSimulation(options);
  });

program
  .command('price')
  .description('Run price discovery simulation')
  .option('-d, --days <number>', 'number of days to simulate', '180')
  .action(async (options) => {
    await runPriceDiscoverySimulation(options);
  });

program
  .command('gini')
  .description('Run Gini coefficient evolution simulation')
  .option('-u, --users <number>', 'number of users', '10000')
  .option('-d, --days <number>', 'number of days to simulate', '365')
  .option('-r, --runs <number>', 'number of Monte Carlo runs', '10')
  .action(async (options) => {
    await runGiniSimulation(options);
  });

program
  .command('journey <type>')
  .description('Run user journey simulation (trader, saver, professional)')
  .action(async (type) => {
    await runUserJourneySimulation({ type });
  });

program
  .command('governance')
  .description('Run governance voting power simulation')
  .option('-u, --users <number>', 'number of users to simulate', '1000')
  .action(async (options) => {
    await runGovernanceSimulation(options);
  });

program
  .command('all')
  .description('Run all simulations in sequence')
  .action(async () => {
    await runAllSimulations();
  });

program
  .command('web')
  .description('Generate web visualizations and open in browser')
  .option('-p, --port <number>', 'port for local server', '8080')
  .action(async (options) => {
    await generateWebVisualizations(options);
  });

// Parse command line arguments
program.parse(process.argv);

// If no command specified, show interactive menu
if (!process.argv.slice(2).length) {
  program.outputHelp();
}