#!/usr/bin/env python3
"""
Quick test to verify simulation setup
"""

import numpy as np
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt

print("Testing Autophage Protocol simulations...")
print(f"NumPy version: {np.__version__}")
print(f"Matplotlib version: {matplotlib.__version__}")

# Test basic simulation components
from autophage_simulation import AutophageSimulation, TokenSpecies

# Create small test simulation
sim = AutophageSimulation(n_users=100, n_days=30)
print("\nRunning test simulation (100 users, 30 days)...")
sim.run()

results = sim.get_results()
print(f"\nTest Results:")
print(f"Final Gini: {results['final_gini']:.4f}")
print(f"Mean Gini: {results['mean_gini']:.4f}")

# Test plot generation
plt.figure(figsize=(8, 6))
plt.plot(results['gini_history'])
plt.xlabel('Days')
plt.ylabel('Gini Coefficient')
plt.title('Test Simulation - Gini Evolution')
plt.savefig('test_plot.png')
print("\nTest plot saved to test_plot.png")

print("\n✓ All tests passed! Simulation suite is ready to use.")