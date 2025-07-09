#!/usr/bin/env python3
"""
Autophage Protocol Economic Simulation
======================================
Implementation of the metabolic economics model as specified in:
"The Autophage Protocol: Metabolic Economics for Decentralized Health"

This simulation models token dynamics with exponential decay rates calibrated
to biological persistence (Section 3: Metabolic Token Dynamics).
"""

import numpy as np
import matplotlib.pyplot as plt
from typing import Dict, List, Tuple
import json
from datetime import datetime

# Set random seed for reproducibility
np.random.seed(42)

class TokenSpecies:
    """Token species with decay rates as per Section 3.1"""
    RHYTHM = "Rhythm"
    HEALING = "Healing"
    FOUNDATION = "Foundation"
    CATALYST = "Catalyst"

class AutophageSimulation:
    """Main simulation class implementing the Autophage Protocol economic model"""
    
    def __init__(self, n_users: int = 10000, n_days: int = 365):
        """
        Initialize simulation parameters
        
        Parameters:
        -----------
        n_users : int
            Number of users in the simulation (default: 10,000)
        n_days : int
            Simulation duration in days (default: 365)
        """
        self.n_users = n_users
        self.n_days = n_days
        
        # Activity rate (Section 3.2: Behavioral Dynamics)
        self.activity_rate = 0.7  # 70% of users active each day
        
        # Token decay rates (Table 1: Token Species and Decay Rates)
        self.decay_rates = {
            TokenSpecies.RHYTHM: 0.05,      # 5% daily, half-life ~13.5 days
            TokenSpecies.HEALING: 0.0075,   # 0.75% daily, half-life ~92 days
            TokenSpecies.FOUNDATION: 0.001,  # 0.1% daily, half-life ~693 days
            TokenSpecies.CATALYST: 0.05      # 5% daily (simplified, no dynamic)
        }
        
        # Activity participation rates
        self.participation_rates = {
            TokenSpecies.RHYTHM: 1.0,        # All active users
            TokenSpecies.HEALING: 0.2,       # 20% of active users
            TokenSpecies.FOUNDATION: 0.05,   # 5% of active users
            TokenSpecies.CATALYST: 0.0       # Not modeled unless dynamic
        }
        
        # Reward distributions (Section 3.3: Token Generation)
        self.reward_params = {
            TokenSpecies.RHYTHM: (50, 10),       # μ=50, σ=10
            TokenSpecies.HEALING: (25, 5),       # μ=25, σ=5
            TokenSpecies.FOUNDATION: (100, 20),  # μ=100, σ=20
            TokenSpecies.CATALYST: (0, 0)        # Not modeled
        }
        
        # Initialize user balances
        self.balances = {
            species: np.zeros(n_users) 
            for species in self.decay_rates.keys()
        }
        
        # History tracking
        self.gini_history = []
        self.balance_history = {species: [] for species in self.decay_rates.keys()}
        
    def apply_whale_protection(self, balance: float, species: str) -> float:
        """
        Apply progressive decay rates for whale protection (Section 3.4)
        
        Parameters:
        -----------
        balance : float
            Current token balance
        species : str
            Token species
            
        Returns:
        --------
        float : Adjusted decay rate
        """
        if species != TokenSpecies.RHYTHM:
            return self.decay_rates[species]
        
        # Progressive decay tiers for Rhythm tokens
        if balance <= 10000:
            return 0.05  # 5% base rate
        elif balance <= 50000:
            return 0.075  # 7.5%
        elif balance <= 100000:
            return 0.10   # 10%
        else:
            return 0.15   # 15%
    
    def generate_rewards(self, active_users: np.ndarray, species: str) -> np.ndarray:
        """
        Generate token rewards for active users (Section 3.3)
        
        Parameters:
        -----------
        active_users : np.ndarray
            Boolean array of active users
        species : str
            Token species
            
        Returns:
        --------
        np.ndarray : Token rewards
        """
        rewards = np.zeros(self.n_users)
        μ, σ = self.reward_params[species]
        
        if μ == 0:  # Skip if not modeled
            return rewards
        
        # Determine which active users participate in this activity
        n_active = active_users.sum()
        participation_rate = self.participation_rates[species]
        n_participants = int(n_active * participation_rate)
        
        # Randomly select participants from active users
        active_indices = np.where(active_users)[0]
        if n_participants > 0 and len(active_indices) > 0:
            participant_indices = np.random.choice(
                active_indices, 
                size=min(n_participants, len(active_indices)), 
                replace=False
            )
            
            # Generate rewards (non-negative normal distribution)
            raw_rewards = np.random.normal(μ, σ, size=len(participant_indices))
            rewards[participant_indices] = np.maximum(0, raw_rewards)
        
        return rewards
    
    def apply_decay(self, species: str) -> None:
        """
        Apply exponential decay to token balances (Equation 3.1)
        
        B(t+1) = B(t) * (1 - λ) + R(t)
        
        where λ is the decay rate (potentially adjusted for whale protection)
        """
        for i in range(self.n_users):
            balance = self.balances[species][i]
            decay_rate = self.apply_whale_protection(balance, species)
            self.balances[species][i] *= (1 - decay_rate)
    
    def calculate_gini(self, balances: np.ndarray) -> float:
        """
        Calculate Gini coefficient (Section 4.1: Wealth Distribution)
        
        Uses the standard Gini coefficient formula:
        G = Σᵢ₌₁ⁿ Σⱼ₌₁ⁿ |xᵢ - xⱼ| / (2n² μ)
        
        Returns:
        --------
        float : Gini coefficient [0, 1]
        """
        if np.sum(balances) == 0:
            return 0.0
        
        # Sort balances
        sorted_balances = np.sort(balances)
        n = len(sorted_balances)
        
        # Calculate Gini using the efficient formula
        index = np.arange(1, n + 1)
        return (2 * np.sum(index * sorted_balances)) / (n * np.sum(sorted_balances)) - (n + 1) / n
    
    def simulate_day(self, day: int) -> None:
        """Simulate one day of the Autophage Protocol"""
        
        # Determine active users (70% activity rate)
        active_users = np.random.random(self.n_users) < self.activity_rate
        
        # Generate rewards and apply decay for each token species
        for species in self.decay_rates.keys():
            # Apply decay first (as per protocol specification)
            self.apply_decay(species)
            
            # Generate and distribute rewards
            rewards = self.generate_rewards(active_users, species)
            self.balances[species] += rewards
            
            # Store balance snapshot
            self.balance_history[species].append(self.balances[species].copy())
        
        # Calculate total wealth per user (sum across all tokens)
        total_wealth = sum(self.balances[species] for species in self.decay_rates.keys())
        
        # Calculate and store Gini coefficient
        gini = self.calculate_gini(total_wealth)
        self.gini_history.append(gini)
    
    def run(self) -> None:
        """Run the full simulation"""
        print(f"Starting Autophage Protocol simulation")
        print(f"Users: {self.n_users}, Days: {self.n_days}")
        print(f"Activity rate: {self.activity_rate}")
        print("-" * 50)
        
        for day in range(self.n_days):
            self.simulate_day(day)
            
            if (day + 1) % 30 == 0:
                current_gini = self.gini_history[-1]
                print(f"Day {day + 1}: Gini = {current_gini:.4f}")
        
        print("-" * 50)
        print(f"Simulation complete")
    
    def get_results(self) -> Dict:
        """Get simulation results"""
        final_gini = self.gini_history[-1] if self.gini_history else 0
        mean_gini = np.mean(self.gini_history) if self.gini_history else 0
        
        return {
            "final_gini": final_gini,
            "mean_gini": mean_gini,
            "gini_history": self.gini_history,
            "final_balances": {
                species: self.balances[species].tolist() 
                for species in self.decay_rates.keys()
            }
        }


class TraditionalEconomySimulation:
    """Baseline traditional economy for comparison (Section 4.2)"""
    
    def __init__(self, n_users: int = 10000, n_days: int = 365):
        self.n_users = n_users
        self.n_days = n_days
        
        # Initialize with exponential distribution (mean=1000)
        self.balances = np.random.exponential(1000, n_users)
        self.gini_history = []
    
    def simulate_day(self, day: int) -> None:
        """Simulate one day of traditional economy"""
        
        # Top 10% get 1% compound interest
        sorted_indices = np.argsort(self.balances)[::-1]
        top_10_percent = int(0.1 * self.n_users)
        self.balances[sorted_indices[:top_10_percent]] *= 1.01
        
        # Random transfers (10% of users transfer 0-10% of balance)
        n_transfers = int(0.1 * self.n_users)
        senders = np.random.choice(self.n_users, n_transfers, replace=False)
        
        for sender in senders:
            if self.balances[sender] > 0:
                transfer_pct = np.random.uniform(0, 0.1)
                transfer_amt = self.balances[sender] * transfer_pct
                receiver = np.random.choice([i for i in range(self.n_users) if i != sender])
                
                self.balances[sender] -= transfer_amt
                self.balances[receiver] += transfer_amt
        
        # Calculate Gini
        gini = self.calculate_gini(self.balances)
        self.gini_history.append(gini)
    
    def calculate_gini(self, balances: np.ndarray) -> float:
        """Calculate Gini coefficient"""
        sorted_balances = np.sort(balances)
        n = len(sorted_balances)
        index = np.arange(1, n + 1)
        return (2 * np.sum(index * sorted_balances)) / (n * np.sum(sorted_balances)) - (n + 1) / n
    
    def run(self) -> None:
        """Run traditional economy simulation"""
        print(f"Starting Traditional Economy simulation")
        print(f"Users: {self.n_users}, Days: {self.n_days}")
        print("-" * 50)
        
        for day in range(self.n_days):
            self.simulate_day(day)
            
            if (day + 1) % 30 == 0:
                current_gini = self.gini_history[-1]
                print(f"Day {day + 1}: Gini = {current_gini:.4f}")
        
        print("-" * 50)
        print(f"Simulation complete")


def run_monte_carlo(n_runs: int = 10) -> Dict:
    """
    Run Monte Carlo simulation (Section 4.3: Monte Carlo Analysis)
    
    Parameters:
    -----------
    n_runs : int
        Number of independent simulation runs
        
    Returns:
    --------
    Dict : Results including mean, std, and 95% CI
    """
    print(f"\nRunning Monte Carlo simulation with {n_runs} runs")
    print("=" * 50)
    
    autophage_results = []
    traditional_results = []
    
    for run in range(n_runs):
        print(f"\nRun {run + 1}/{n_runs}")
        
        # Run Autophage simulation
        auto_sim = AutophageSimulation()
        auto_sim.run()
        auto_results = auto_sim.get_results()
        autophage_results.append(auto_results)
        
        # Run Traditional simulation
        trad_sim = TraditionalEconomySimulation()
        trad_sim.run()
        traditional_results.append({
            "final_gini": trad_sim.gini_history[-1],
            "mean_gini": np.mean(trad_sim.gini_history),
            "gini_history": trad_sim.gini_history
        })
    
    # Calculate statistics
    auto_final_ginis = [r["final_gini"] for r in autophage_results]
    trad_final_ginis = [r["final_gini"] for r in traditional_results]
    
    # 95% confidence intervals
    auto_mean = np.mean(auto_final_ginis)
    auto_std = np.std(auto_final_ginis)
    auto_ci = (auto_mean - 1.96 * auto_std / np.sqrt(n_runs), 
               auto_mean + 1.96 * auto_std / np.sqrt(n_runs))
    
    trad_mean = np.mean(trad_final_ginis)
    trad_std = np.std(trad_final_ginis)
    trad_ci = (trad_mean - 1.96 * trad_std / np.sqrt(n_runs), 
               trad_mean + 1.96 * trad_std / np.sqrt(n_runs))
    
    return {
        "autophage": {
            "runs": autophage_results,
            "final_gini_mean": auto_mean,
            "final_gini_std": auto_std,
            "final_gini_ci": auto_ci
        },
        "traditional": {
            "runs": traditional_results,
            "final_gini_mean": trad_mean,
            "final_gini_std": trad_std,
            "final_gini_ci": trad_ci
        }
    }


def plot_results(results: Dict) -> None:
    """Generate plots for simulation results"""
    
    plt.figure(figsize=(12, 8))
    
    # Plot Gini evolution for all runs
    plt.subplot(2, 1, 1)
    
    # Autophage runs
    for i, run in enumerate(results["autophage"]["runs"]):
        plt.plot(run["gini_history"], alpha=0.3, color='blue', 
                label='Autophage' if i == 0 else '')
    
    # Traditional runs
    for i, run in enumerate(results["traditional"]["runs"]):
        plt.plot(run["gini_history"], alpha=0.3, color='red', 
                label='Traditional' if i == 0 else '')
    
    # Plot means
    auto_mean_history = np.mean([run["gini_history"] for run in results["autophage"]["runs"]], axis=0)
    trad_mean_history = np.mean([run["gini_history"] for run in results["traditional"]["runs"]], axis=0)
    
    plt.plot(auto_mean_history, 'b-', linewidth=2, label='Autophage Mean')
    plt.plot(trad_mean_history, 'r-', linewidth=2, label='Traditional Mean')
    
    plt.xlabel('Days')
    plt.ylabel('Gini Coefficient')
    plt.title('Gini Coefficient Evolution: Autophage vs Traditional Economy')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    # Plot final Gini distributions
    plt.subplot(2, 1, 2)
    
    auto_finals = [r["final_gini"] for r in results["autophage"]["runs"]]
    trad_finals = [r["final_gini"] for r in results["traditional"]["runs"]]
    
    positions = [1, 2]
    plt.boxplot([auto_finals, trad_finals], positions=positions, widths=0.6)
    plt.xticks(positions, ['Autophage', 'Traditional'])
    plt.ylabel('Final Gini Coefficient')
    plt.title('Final Gini Distribution (Day 365)')
    plt.grid(True, alpha=0.3)
    
    # Add mean and CI text
    auto_stats = results["autophage"]
    trad_stats = results["traditional"]
    
    plt.text(1, 0.3, f'μ={auto_stats["final_gini_mean"]:.3f}\n' + 
             f'σ={auto_stats["final_gini_std"]:.3f}\n' +
             f'95% CI: [{auto_stats["final_gini_ci"][0]:.3f}, {auto_stats["final_gini_ci"][1]:.3f}]',
             ha='center', va='bottom', fontsize=8)
    
    plt.text(2, 0.85, f'μ={trad_stats["final_gini_mean"]:.3f}\n' + 
             f'σ={trad_stats["final_gini_std"]:.3f}\n' +
             f'95% CI: [{trad_stats["final_gini_ci"][0]:.3f}, {trad_stats["final_gini_ci"][1]:.3f}]',
             ha='center', va='top', fontsize=8)
    
    plt.tight_layout()
    plt.savefig('gini_evolution.png', dpi=300, bbox_inches='tight')
    print("\nPlot saved to gini_evolution.png")


def main():
    """Main execution function"""
    print("="*60)
    print("AUTOPHAGE PROTOCOL ECONOMIC SIMULATION")
    print("Metabolic Economics for Decentralized Health")
    print("="*60)
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Run Monte Carlo simulation
    results = run_monte_carlo(n_runs=10)
    
    # Generate plots
    plot_results(results)
    
    # Print summary
    print("\n" + "="*60)
    print("SIMULATION RESULTS SUMMARY")
    print("="*60)
    
    print("\nAutophage Protocol:")
    auto_stats = results["autophage"]
    print(f"  Final Gini (mean ± std): {auto_stats['final_gini_mean']:.4f} ± {auto_stats['final_gini_std']:.4f}")
    print(f"  95% Confidence Interval: [{auto_stats['final_gini_ci'][0]:.4f}, {auto_stats['final_gini_ci'][1]:.4f}]")
    
    print("\nTraditional Economy:")
    trad_stats = results["traditional"]
    print(f"  Final Gini (mean ± std): {trad_stats['final_gini_mean']:.4f} ± {trad_stats['final_gini_std']:.4f}")
    print(f"  95% Confidence Interval: [{trad_stats['final_gini_ci'][0]:.4f}, {trad_stats['final_gini_ci'][1]:.4f}]")
    
    print("\nGini Coefficient Formula Used:")
    print("  G = (2 * Σᵢ₌₁ⁿ i * xᵢ) / (n * Σᵢ₌₁ⁿ xᵢ) - (n + 1) / n")
    print("  where xᵢ are sorted incomes/balances")
    
    # Save results to JSON
    save_results = {
        "timestamp": datetime.now().isoformat(),
        "parameters": {
            "n_users": 10000,
            "n_days": 365,
            "n_runs": 10,
            "activity_rate": 0.7,
            "decay_rates": {
                "Rhythm": 0.05,
                "Healing": 0.0075,
                "Foundation": 0.001,
                "Catalyst": 0.05
            }
        },
        "results": {
            "autophage": {
                "final_gini_mean": auto_stats['final_gini_mean'],
                "final_gini_std": auto_stats['final_gini_std'],
                "final_gini_ci": auto_stats['final_gini_ci']
            },
            "traditional": {
                "final_gini_mean": trad_stats['final_gini_mean'],
                "final_gini_std": trad_stats['final_gini_std'],
                "final_gini_ci": trad_stats['final_gini_ci']
            }
        }
    }
    
    with open('simulation_results.json', 'w') as f:
        json.dump(save_results, f, indent=2)
    
    print("\nResults saved to simulation_results.json")
    print("="*60)


if __name__ == "__main__":
    main()