import numpy as np
import matplotlib.pyplot as plt
from scipy import stats
from tqdm import tqdm
from colorama import Fore, Style, init

# Initialize colorama for colored terminal output
init(autoreset=True)

def calculate_gini(wealth_distribution):
    sorted_wealth = np.sort(wealth_distribution)
    n = len(sorted_wealth)
    cumulative_wealth = np.cumsum(sorted_wealth)
    return (2 * np.sum((np.arange(1, n+1) * sorted_wealth))) / (n * cumulative_wealth[-1]) - (n + 1) / n

def simulate_autophage_economy(n_users=10000, n_days=365, activity_rate=0.7):
    balances = np.zeros(n_users)
    rhythm_decay = 0.05
    healing_decay = 0.0075
    foundation_decay = 0.001
    gini_history = []

    # Use tqdm for a progress bar
    for day in tqdm(range(n_days), desc=Fore.GREEN + "Simulating Autophage Economy", ncols=70):
        active_users = np.random.random(n_users) < activity_rate
        rhythm_generation = active_users * np.random.normal(50, 10, n_users)
        rhythm_generation = np.maximum(0, rhythm_generation)
        healing_active = active_users & (np.random.random(n_users) < 0.2)
        healing_generation = healing_active * np.random.normal(25, 5, n_users)
        healing_generation = np.maximum(0, healing_generation)
        foundation_active = active_users & (np.random.random(n_users) < 0.05)
        foundation_generation = foundation_active * np.random.normal(100, 20, n_users)
        foundation_generation = np.maximum(0, foundation_generation)
        balances = balances * (1 - rhythm_decay)
        balances += rhythm_generation + healing_generation + foundation_generation
        balances = np.maximum(0, balances)
        if np.sum(balances) > 0:
            gini = calculate_gini(balances)
            gini_history.append(gini)
    return balances, gini_history

def simulate_traditional_economy(n_users=10000, n_days=365):
    balances = np.random.exponential(1000, n_users)
    gini_history = []

    for day in tqdm(range(n_days), desc=Fore.CYAN + "Simulating Traditional Economy", ncols=70):
        top_10_percent = int(n_users * 0.1)
        sorted_indices = np.argsort(balances)[::-1]
        balances[sorted_indices[:top_10_percent]] *= 1.01
        n_transactions = int(n_users * 0.1)
        for _ in range(n_transactions):
            sender = np.random.randint(n_users)
            receiver = np.random.randint(n_users)
            if balances[sender] > 0:
                amount = np.random.uniform(0, 0.1) * balances[sender]
                balances[sender] -= amount
                balances[receiver] += amount
        if np.sum(balances) > 0:
            gini = calculate_gini(balances)
            gini_history.append(gini)
    return balances, gini_history

def print_summary(final_gini_autophage, final_gini_traditional):
    print()
    print(Fore.YELLOW + Style.BRIGHT + "Final Gini Coefficients:")
    print(f"{Fore.GREEN}Autophage Protocol: {final_gini_autophage:.3f}")
    print(f"{Fore.CYAN}Traditional Economy: {final_gini_traditional:.3f}")
    print()
    print(Fore.YELLOW + Style.BRIGHT + "Paper claims:")
    print(f"{Fore.GREEN}Autophage: 0.30-0.35 (Actual: {final_gini_autophage:.3f})")
    print(f"{Fore.CYAN}Traditional: 0.82-0.88 (Actual: {final_gini_traditional:.3f})")

def print_wealth_distribution(sorted_autophage, sorted_traditional):
    print()
    print(Fore.MAGENTA + "Wealth Distribution Analysis (Day 365):")
    print(
        f"{Fore.GREEN}Autophage - Top 10% own: "
        f"{np.sum(sorted_autophage[-int(len(sorted_autophage)*0.1):]) / np.sum(sorted_autophage) * 100:.1f}% of wealth"
    )
    print(
        f"{Fore.CYAN}Traditional - Top 10% own: "
        f"{np.sum(sorted_traditional[-int(len(sorted_traditional)*0.1):]) / np.sum(sorted_traditional) * 100:.1f}% of wealth"
    )
    print(
        f"{Fore.GREEN}Autophage - Bottom 50% own: "
        f"{np.sum(sorted_autophage[:int(len(sorted_autophage)*0.5)]) / np.sum(sorted_autophage) * 100:.1f}% of wealth"
    )
    print(
        f"{Fore.CYAN}Traditional - Bottom 50% own: "
        f"{np.sum(sorted_traditional[:int(len(sorted_traditional)*0.5)]) / np.sum(sorted_traditional) * 100:.1f}% of wealth"
    )
    print()

# Main execution
if __name__ == "__main__":
    print(Fore.GREEN + "Running Autophage Protocol simulation...")
    autophage_balances, autophage_gini = simulate_autophage_economy()

    print(Fore.CYAN + "\nRunning traditional economy simulation...")
    traditional_balances, traditional_gini = simulate_traditional_economy()

    final_gini_autophage = autophage_gini[-1]
    final_gini_traditional = traditional_gini[-1]

    print_summary(final_gini_autophage, final_gini_traditional)

    # Plot results
    plt.figure(figsize=(12, 6))
    plt.subplot(1, 2, 1)
    plt.plot(autophage_gini, label='Autophage', color='green', linewidth=2)
    plt.plot(traditional_gini, label='Traditional', color='orange', linewidth=2)
    plt.axhline(y=0.35, color='gray', linestyle='--', alpha=0.5, label='Target Range')
    plt.axhline(y=0.45, color='gray', linestyle='--', alpha=0.5)
    plt.fill_between(range(len(autophage_gini)), 0.35, 0.45, alpha=0.1, color='gray')
    plt.xlabel('Days')
    plt.ylabel('Gini Coefficient')
    plt.title('Gini Coefficient Evolution Over Time')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.ylim(0.2, 0.9)

    plt.subplot(1, 2, 2)
    sorted_autophage = np.sort(autophage_balances)
    sorted_traditional = np.sort(traditional_balances)
    cumsum_autophage = np.cumsum(sorted_autophage) / np.sum(sorted_autophage)
    cumsum_traditional = np.cumsum(sorted_traditional) / np.sum(sorted_traditional)
    population_percentiles = np.arange(1, len(sorted_autophage) + 1) / len(sorted_autophage)
    plt.plot(population_percentiles, cumsum_autophage, label='Autophage', color='green', linewidth=2)
    plt.plot(population_percentiles, cumsum_traditional, label='Traditional', color='orange', linewidth=2)
    plt.plot([0, 1], [0, 1], 'k--', alpha=0.5, label='Perfect Equality')
    plt.xlabel('Cumulative Population')
    plt.ylabel('Cumulative Wealth')
    plt.title('Lorenz Curves (Day 365)')
    plt.legend()
    plt.grid(True, alpha=0.3)

    plt.tight_layout()
    plt.show()

    print_wealth_distribution(sorted_autophage, sorted_traditional)
