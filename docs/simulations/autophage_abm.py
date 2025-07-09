#!/usr/bin/env python3
"""
Autophage Protocol Agent-Based Model
====================================
Advanced simulation with heterogeneous agent behaviors and adaptive strategies.
Based on "The Autophage Protocol: Metabolic Economics for Decentralized Health"

This model extends the basic simulation with agent-specific strategies and
behavioral adaptation based on wealth dynamics.
"""

import numpy as np
import matplotlib.pyplot as plt
from typing import Dict, List, Tuple, Optional
from enum import Enum
import json
from datetime import datetime

# Set random seed for reproducibility
np.random.seed(42)

class AgentType(Enum):
    """Agent behavioral archetypes"""
    MAXIMIZER = "maximizer"      # Optimizes activity for maximum rewards
    HOARDER = "hoarder"          # Minimizes activity to reduce decay
    BALANCED = "balanced"        # Moderate activity pattern
    RISK_AVERSE = "risk_averse"  # Avoids high-decay activities
    SOCIAL = "social"            # Activity influenced by peers

class Agent:
    """Individual agent with adaptive behavior"""
    
    def __init__(self, agent_id: int, agent_type: AgentType):
        self.id = agent_id
        self.type = agent_type
        self.balances = {
            "Rhythm": 0.0,
            "Healing": 0.0,
            "Foundation": 0.0,
            "Catalyst": 0.0
        }
        self.activity_history = []
        self.wealth_history = []
        self.strategy_params = self._initialize_strategy()
        
    def _initialize_strategy(self) -> Dict:
        """Initialize strategy parameters based on agent type"""
        if self.type == AgentType.MAXIMIZER:
            return {
                "base_activity_rate": 0.95,
                "rhythm_preference": 1.2,
                "healing_preference": 0.8,
                "foundation_preference": 0.6,
                "adapt_rate": 0.1
            }
        elif self.type == AgentType.HOARDER:
            return {
                "base_activity_rate": 0.4,
                "rhythm_preference": 0.5,
                "healing_preference": 0.7,
                "foundation_preference": 1.5,
                "adapt_rate": 0.05
            }
        elif self.type == AgentType.RISK_AVERSE:
            return {
                "base_activity_rate": 0.6,
                "rhythm_preference": 0.3,
                "healing_preference": 1.0,
                "foundation_preference": 1.8,
                "adapt_rate": 0.02
            }
        elif self.type == AgentType.SOCIAL:
            return {
                "base_activity_rate": 0.7,
                "rhythm_preference": 1.0,
                "healing_preference": 1.0,
                "foundation_preference": 1.0,
                "adapt_rate": 0.15,
                "social_influence": 0.3
            }
        else:  # BALANCED
            return {
                "base_activity_rate": 0.7,
                "rhythm_preference": 1.0,
                "healing_preference": 1.0,
                "foundation_preference": 1.0,
                "adapt_rate": 0.08
            }
    
    def decide_activity(self, day: int, network_state: Optional[Dict] = None) -> bool:
        """Decide whether to be active based on strategy and state"""
        base_rate = self.strategy_params["base_activity_rate"]
        
        # Adapt based on wealth trajectory
        if len(self.wealth_history) > 7:
            recent_trend = np.mean(self.wealth_history[-7:]) - np.mean(self.wealth_history[-14:-7])
            if recent_trend < 0:
                # Losing wealth, increase activity
                base_rate = min(1.0, base_rate + self.strategy_params["adapt_rate"])
            elif recent_trend > 0 and self.type == AgentType.HOARDER:
                # Gaining wealth and hoarding, might reduce activity
                base_rate = max(0.2, base_rate - self.strategy_params["adapt_rate"])
        
        # Social agents influenced by network
        if self.type == AgentType.SOCIAL and network_state:
            network_activity = network_state.get("avg_activity_rate", 0.7)
            influence = self.strategy_params.get("social_influence", 0.3)
            base_rate = base_rate * (1 - influence) + network_activity * influence
        
        return np.random.random() < base_rate
    
    def choose_activities(self, token_types: List[str]) -> Dict[str, bool]:
        """Choose which token-generating activities to participate in"""
        activities = {}
        
        for token in token_types:
            if token == "Catalyst":
                activities[token] = False  # Not modeled
                continue
                
            pref_key = f"{token.lower()}_preference"
            preference = self.strategy_params.get(pref_key, 1.0)
            
            # Base participation rates
            base_rates = {
                "Rhythm": 1.0,
                "Healing": 0.2,
                "Foundation": 0.05
            }
            
            # Adjust by preference
            participation_prob = base_rates[token] * preference
            participation_prob = min(1.0, participation_prob)
            
            activities[token] = np.random.random() < participation_prob
        
        return activities
    
    def update_wealth_history(self):
        """Track total wealth over time"""
        total_wealth = sum(self.balances.values())
        self.wealth_history.append(total_wealth)
    
    def adapt_strategy(self, market_state: Dict):
        """Adapt strategy based on market conditions"""
        if self.type == AgentType.MAXIMIZER:
            # Maximizers shift to highest reward/decay ratio activities
            rhythm_ratio = 50 / 0.05  # reward/decay
            healing_ratio = 25 / 0.0075
            foundation_ratio = 100 / 0.001
            
            # Adjust preferences based on ratios
            total_ratio = rhythm_ratio + healing_ratio + foundation_ratio
            self.strategy_params["rhythm_preference"] = rhythm_ratio / total_ratio * 3
            self.strategy_params["healing_preference"] = healing_ratio / total_ratio * 3
            self.strategy_params["foundation_preference"] = foundation_ratio / total_ratio * 3

class AutophageABM:
    """Agent-Based Model for Autophage Protocol"""
    
    def __init__(self, n_agents: int = 10000, n_days: int = 365):
        self.n_agents = n_agents
        self.n_days = n_days
        
        # Token parameters (from paper)
        self.decay_rates = {
            "Rhythm": 0.05,
            "Healing": 0.0075,
            "Foundation": 0.001,
            "Catalyst": 0.05
        }
        
        self.reward_params = {
            "Rhythm": (50, 10),
            "Healing": (25, 5),
            "Foundation": (100, 20),
            "Catalyst": (0, 0)
        }
        
        # Initialize agents with distribution of types
        self.agents = self._initialize_agents()
        
        # Tracking
        self.gini_history = []
        self.type_wealth_history = {agent_type: [] for agent_type in AgentType}
        self.activity_rates_history = []
        
    def _initialize_agents(self) -> List[Agent]:
        """Initialize agent population with type distribution"""
        agents = []
        
        # Agent type distribution
        type_distribution = {
            AgentType.BALANCED: 0.4,     # 40%
            AgentType.MAXIMIZER: 0.2,    # 20%
            AgentType.HOARDER: 0.15,     # 15%
            AgentType.RISK_AVERSE: 0.15, # 15%
            AgentType.SOCIAL: 0.1        # 10%
        }
        
        for i in range(self.n_agents):
            # Assign type based on distribution
            rand = np.random.random()
            cumsum = 0
            for agent_type, prob in type_distribution.items():
                cumsum += prob
                if rand < cumsum:
                    agents.append(Agent(i, agent_type))
                    break
        
        return agents
    
    def apply_whale_protection(self, balance: float, token: str) -> float:
        """Progressive decay for whale protection"""
        if token != "Rhythm":
            return self.decay_rates[token]
        
        if balance <= 10000:
            return 0.05
        elif balance <= 50000:
            return 0.075
        elif balance <= 100000:
            return 0.10
        else:
            return 0.15
    
    def simulate_day(self, day: int):
        """Simulate one day of agent interactions"""
        
        # Calculate network state
        total_active = sum(1 for agent in self.agents if len(agent.activity_history) > 0 and agent.activity_history[-1])
        avg_activity_rate = total_active / self.n_agents if day > 0 else 0.7
        
        network_state = {
            "avg_activity_rate": avg_activity_rate,
            "day": day
        }
        
        daily_activities = []
        
        for agent in self.agents:
            # Apply decay to existing balances
            for token in self.decay_rates:
                if agent.balances[token] > 0:
                    decay_rate = self.apply_whale_protection(agent.balances[token], token)
                    agent.balances[token] *= (1 - decay_rate)
            
            # Decide if active
            is_active = agent.decide_activity(day, network_state)
            agent.activity_history.append(is_active)
            daily_activities.append(is_active)
            
            if is_active:
                # Choose activities
                activities = agent.choose_activities(list(self.decay_rates.keys()))
                
                # Generate rewards
                for token, participated in activities.items():
                    if participated and self.reward_params[token][0] > 0:
                        μ, σ = self.reward_params[token]
                        reward = max(0, np.random.normal(μ, σ))
                        agent.balances[token] += reward
            
            # Update wealth history
            agent.update_wealth_history()
            
            # Periodic strategy adaptation
            if day % 30 == 0 and day > 0:
                market_state = {"day": day, "network": network_state}
                agent.adapt_strategy(market_state)
        
        # Track activity rate
        self.activity_rates_history.append(np.mean(daily_activities))
        
        # Calculate Gini coefficient
        total_wealth = [sum(agent.balances.values()) for agent in self.agents]
        gini = self.calculate_gini(np.array(total_wealth))
        self.gini_history.append(gini)
        
        # Track wealth by agent type
        for agent_type in AgentType:
            type_agents = [a for a in self.agents if a.type == agent_type]
            if type_agents:
                avg_wealth = np.mean([sum(a.balances.values()) for a in type_agents])
                self.type_wealth_history[agent_type].append(avg_wealth)
    
    def calculate_gini(self, wealth_array: np.ndarray) -> float:
        """Calculate Gini coefficient"""
        if np.sum(wealth_array) == 0:
            return 0.0
        
        sorted_wealth = np.sort(wealth_array)
        n = len(sorted_wealth)
        index = np.arange(1, n + 1)
        return (2 * np.sum(index * sorted_wealth)) / (n * np.sum(sorted_wealth)) - (n + 1) / n
    
    def run(self):
        """Run the agent-based simulation"""
        print(f"Starting Autophage ABM Simulation")
        print(f"Agents: {self.n_agents}, Days: {self.n_days}")
        print(f"Agent type distribution:")
        type_counts = {}
        for agent in self.agents:
            type_counts[agent.type] = type_counts.get(agent.type, 0) + 1
        for agent_type, count in type_counts.items():
            print(f"  {agent_type.value}: {count} ({count/self.n_agents*100:.1f}%)")
        print("-" * 50)
        
        for day in range(self.n_days):
            self.simulate_day(day)
            
            if (day + 1) % 30 == 0:
                print(f"Day {day + 1}:")
                print(f"  Gini coefficient: {self.gini_history[-1]:.4f}")
                print(f"  Activity rate: {self.activity_rates_history[-1]:.3f}")
                
                # Print wealth by type
                print("  Average wealth by agent type:")
                for agent_type in AgentType:
                    if self.type_wealth_history[agent_type]:
                        avg_wealth = self.type_wealth_history[agent_type][-1]
                        print(f"    {agent_type.value}: {avg_wealth:.1f}")
        
        print("-" * 50)
        print("Simulation complete")
    
    def analyze_results(self) -> Dict:
        """Analyze simulation results"""
        # Agent statistics by type
        type_stats = {}
        for agent_type in AgentType:
            type_agents = [a for a in self.agents if a.type == agent_type]
            if type_agents:
                final_wealth = [sum(a.balances.values()) for a in type_agents]
                type_stats[agent_type.value] = {
                    "count": len(type_agents),
                    "avg_final_wealth": np.mean(final_wealth),
                    "std_final_wealth": np.std(final_wealth),
                    "avg_activity_rate": np.mean([np.mean(a.activity_history) for a in type_agents])
                }
        
        # Find top and bottom performers
        wealth_rankings = [(i, sum(a.balances.values())) for i, a in enumerate(self.agents)]
        wealth_rankings.sort(key=lambda x: x[1], reverse=True)
        
        top_10_types = [self.agents[idx].type.value for idx, _ in wealth_rankings[:10]]
        bottom_10_types = [self.agents[idx].type.value for idx, _ in wealth_rankings[-10:]]
        
        return {
            "final_gini": self.gini_history[-1],
            "avg_activity_rate": np.mean(self.activity_rates_history),
            "type_statistics": type_stats,
            "top_performer_types": top_10_types,
            "bottom_performer_types": bottom_10_types
        }

def plot_abm_results(abm: AutophageABM):
    """Generate plots for ABM results"""
    
    fig, axes = plt.subplots(2, 2, figsize=(14, 10))
    
    # 1. Gini evolution
    ax = axes[0, 0]
    ax.plot(abm.gini_history, 'b-', linewidth=2)
    ax.set_xlabel('Days')
    ax.set_ylabel('Gini Coefficient')
    ax.set_title('Gini Coefficient Evolution (ABM)')
    ax.grid(True, alpha=0.3)
    
    # 2. Activity rate over time
    ax = axes[0, 1]
    ax.plot(abm.activity_rates_history, 'g-', linewidth=2)
    ax.set_xlabel('Days')
    ax.set_ylabel('Activity Rate')
    ax.set_title('Population Activity Rate')
    ax.grid(True, alpha=0.3)
    
    # 3. Wealth by agent type
    ax = axes[1, 0]
    for agent_type in AgentType:
        if abm.type_wealth_history[agent_type]:
            ax.plot(abm.type_wealth_history[agent_type], 
                   label=agent_type.value, linewidth=2)
    ax.set_xlabel('Days')
    ax.set_ylabel('Average Wealth')
    ax.set_title('Average Wealth by Agent Type')
    ax.legend()
    ax.grid(True, alpha=0.3)
    
    # 4. Final wealth distribution by type
    ax = axes[1, 1]
    type_wealth_data = {}
    for agent_type in AgentType:
        type_agents = [a for a in abm.agents if a.type == agent_type]
        if type_agents:
            type_wealth_data[agent_type.value] = [sum(a.balances.values()) for a in type_agents]
    
    positions = list(range(len(type_wealth_data)))
    ax.boxplot(type_wealth_data.values(), positions=positions)
    ax.set_xticks(positions)
    ax.set_xticklabels(type_wealth_data.keys(), rotation=45)
    ax.set_ylabel('Final Wealth')
    ax.set_title('Final Wealth Distribution by Agent Type')
    ax.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('abm_results.png', dpi=300, bbox_inches='tight')
    print("\nABM plots saved to abm_results.png")

def main():
    """Main execution for ABM"""
    print("="*60)
    print("AUTOPHAGE PROTOCOL AGENT-BASED MODEL")
    print("Heterogeneous Agents with Adaptive Strategies")
    print("="*60)
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Run ABM simulation
    abm = AutophageABM(n_agents=10000, n_days=365)
    abm.run()
    
    # Analyze results
    results = abm.analyze_results()
    
    # Generate plots
    plot_abm_results(abm)
    
    # Print analysis
    print("\n" + "="*60)
    print("ABM RESULTS ANALYSIS")
    print("="*60)
    
    print(f"\nFinal Gini Coefficient: {results['final_gini']:.4f}")
    print(f"Average Activity Rate: {results['avg_activity_rate']:.3f}")
    
    print("\nAgent Type Performance:")
    for agent_type, stats in results['type_statistics'].items():
        print(f"\n{agent_type.upper()}:")
        print(f"  Count: {stats['count']}")
        print(f"  Avg Final Wealth: {stats['avg_final_wealth']:.2f} ± {stats['std_final_wealth']:.2f}")
        print(f"  Avg Activity Rate: {stats['avg_activity_rate']:.3f}")
    
    print("\nTop 10 Performers (by type):")
    type_counts = {}
    for t in results['top_performer_types']:
        type_counts[t] = type_counts.get(t, 0) + 1
    for t, count in type_counts.items():
        print(f"  {t}: {count}")
    
    print("\nBottom 10 Performers (by type):")
    type_counts = {}
    for t in results['bottom_performer_types']:
        type_counts[t] = type_counts.get(t, 0) + 1
    for t, count in type_counts.items():
        print(f"  {t}: {count}")
    
    # Save detailed results
    save_results = {
        "timestamp": datetime.now().isoformat(),
        "parameters": {
            "n_agents": abm.n_agents,
            "n_days": abm.n_days,
            "decay_rates": abm.decay_rates,
            "reward_params": abm.reward_params
        },
        "results": results,
        "gini_history": abm.gini_history,
        "activity_history": abm.activity_rates_history
    }
    
    with open('abm_results.json', 'w') as f:
        json.dump(save_results, f, indent=2)
    
    print("\nDetailed results saved to abm_results.json")
    print("="*60)

if __name__ == "__main__":
    main()