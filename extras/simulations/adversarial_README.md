# Adversarial Stress Test - Autophage Protocol

This directory contains an adversarial stress test designed to maximize wealth inequality (Gini coefficient) in the Autophage Protocol through various attack strategies.

## Purpose

To test the robustness of the Autophage Protocol's fairness mechanisms by attempting to break them through adversarial agent behaviors.

## Running the Simulation

```bash
python adversarial_stress_test.py
```

## Attack Strategies Implemented

1. **Whale Exploiters** - Stay just below decay thresholds
2. **Sybil Swarms** - Multiple accounts per agent to distribute wealth
3. **Collusion Pools** - Groups funneling wealth to leaders
4. **Decay Gamers** - Optimize activity based on reward/decay math
5. **Passive Hoarders** - Never active (control group)
6. **Foundation Maxers** - Only low-decay activities
7. **Burst Farmers** - Periodic intense activity

## Results Summary

Despite aggressive attacks:
- Maximum Gini achieved: **0.629** (vs target 0.32-0.38)
- Final Gini: **0.547**
- Top 1% wealth share: **17.8%** (vs ~50%+ in traditional economies)

The protocol demonstrated remarkable resilience. See `adversarial_findings.md` for detailed analysis.

## Files Generated

- `adversarial_stress_test.py` - Main simulation code
- `adversarial_results.json` - Numerical results
- `adversarial_results.png` - Visualization plots
- `adversarial_findings.md` - Detailed findings report