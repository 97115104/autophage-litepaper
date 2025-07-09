# Autophage Protocol Economic Simulations

This directory contains the complete simulation suite for the Autophage Protocol, as described in the paper "The Autophage Protocol: Metabolic Economics for Decentralized Health" by Austin Harshberger.

## Overview

The simulations implement the metabolic economics model with exponential decay rates calibrated to biological persistence. The code demonstrates how token decay mechanics create more equitable wealth distribution compared to traditional economic systems.

## Installation

1. Ensure Python 3.8+ is installed
2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Simulations

### Basic Simulation
```bash
python autophage_simulation.py
```

This runs a Monte Carlo simulation with 10 independent runs, comparing the Autophage Protocol to a traditional economy baseline.

### Advanced Agent-Based Model (Optional)
```bash
python autophage_abm.py
```

This runs an agent-based model with heterogeneous user behaviors and adaptive strategies.

## Key Features

- **Token Species**: Models 4 token types with different decay rates
  - Rhythm: 5% daily decay (exercise rewards)
  - Healing: 0.75% daily decay (therapy activities)
  - Foundation: 0.1% daily decay (preventive care)
  - Catalyst: 5% daily decay (simplified, no dynamic adjustment)

- **Whale Protection**: Progressive decay rates for Rhythm tokens to prevent excessive accumulation

- **Monte Carlo Analysis**: 10 independent runs with statistical analysis and 95% confidence intervals

- **Gini Coefficient Tracking**: Measures wealth inequality over time

## Output Files

- `gini_evolution.png`: Visualization of Gini coefficient evolution over 365 days
- `simulation_results.json`: Complete numerical results from all runs
- `example_cli_output.txt`: Sample command-line output for reference

## Parameters

All parameters match the specifications in the academic paper:

- **Population**: 10,000 users
- **Duration**: 365 days
- **Activity Rate**: 70% of users active daily
- **Reward Distributions**:
  - Rhythm: Normal(μ=50, σ=10)
  - Healing: Normal(μ=25, σ=5)
  - Foundation: Normal(μ=100, σ=20)

## Mathematical Reference

The simulation implements the core equations from the paper:

**Token Decay (Equation 3.1)**:
```
B(t+1) = B(t) * (1 - λ) + R(t)
```

**Gini Coefficient (Section 4.1)**:
```
G = (2 * Σᵢ₌₁ⁿ i * xᵢ) / (n * Σᵢ₌₁ⁿ xᵢ) - (n + 1) / n
```

## Reproducibility

The simulation uses a fixed random seed (42) for reproducibility. Results should be identical across runs on the same platform.

## License

MIT License - See LICENSE file for details.

## Citation

If you use this code in your research, please cite:

```bibtex
@article{harshberger2025autophage,
  title={The Autophage Protocol: Metabolic Economics for Decentralized Health},
  author={Harshberger, Austin},
  journal={arXiv preprint},
  year={2025}
}
```