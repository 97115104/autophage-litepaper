import numpy as np
import matplotlib.pyplot as plt
from tqdm import tqdm
from colorama import Fore, Style, init

init(autoreset=True)

def calculate_gini(wealth_distribution):
    sorted_wealth = np.sort(wealth_distribution)
    n = len(sorted_wealth)
    cumulative_wealth = np.cumsum(sorted_wealth)
    return (2 * np.sum((np.arange(1, n+1) * sorted_wealth))) / (n * cumulative_wealth[-1]) - (n + 1) / n

def simulate_autophage_economy(n_users=10000, n_days=365, activity_rate=0.7):
    balances = np.zeros(n_users)
    rhythm_decay = 0.05
    gini_history = []
    for day in range(n_days):
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
    for day in range(n_days):
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

def run_monte_carlo(sim_fn, label, n_runs=10, **kwargs):
    all_ginis = []
    print(Fore.YELLOW + f"\nRunning Monte Carlo for {label} ({n_runs} runs)...")
    for i in tqdm(range(n_runs), desc=f"{label} MC", ncols=60):
        _, gini_history = sim_fn(**kwargs)
        all_ginis.append(gini_history)
    # Pad shorter runs (shouldn't happen, but just in case)
    min_len = min(map(len, all_ginis))
    all_ginis = [g[:min_len] for g in all_ginis]
    ginis_arr = np.array(all_ginis)
    avg_gini = ginis_arr.mean(axis=0)
    ci95_low = np.percentile(ginis_arr, 2.5, axis=0)
    ci95_high = np.percentile(ginis_arr, 97.5, axis=0)
    return avg_gini, ci95_low, ci95_high, ginis_arr

def print_gini_stats(gini_list, label):
    avg_gini = np.mean(gini_list)
    std_gini = np.std(gini_list)
    print(
        f"{Fore.YELLOW}{label}:\n"
        f"    Average Gini (over time): {Fore.GREEN}{avg_gini:.3f}{Style.RESET_ALL}\n"
        f"    Std Dev: {std_gini:.3f}\n"
        f"    Final Gini: {Fore.MAGENTA}{gini_list[-1]:.3f}{Style.RESET_ALL}\n"
        f"    Calculation: Ḡ = (1/n) ∑ₜ Gₜ,   n={len(gini_list)}\n"
    )
    return avg_gini

def print_monte_carlo_stats(ginis_arr, label):
    # Show mean of final Ginicoefficient and its confidence interval
    final_ginis = ginis_arr[:, -1]
    avg_final = final_ginis.mean()
    ci_low = np.percentile(final_ginis, 2.5)
    ci_high = np.percentile(final_ginis, 97.5)
    print(
        f"{Fore.CYAN}{label} Monte Carlo Results:\n"
        f"    Avg Final Gini: {Fore.GREEN}{avg_final:.3f}{Style.RESET_ALL}\n"
        f"    95% CI: [{ci_low:.3f}, {ci_high:.3f}]\n"
        f"    Calculation: avg_final = (1/N) ∑ₖ Gᵏ_T  (N runs)\n"
    )

# --- Main execution ---

if __name__ == "__main__":
    # Monte Carlo mode: 10 runs each, feel free to set to 1 for speed
    N_RUNS = 10
    DAYS = 365
    USERS = 10000

    # Autophage MC
    auto_avg, auto_low, auto_high, auto_arr = run_monte_carlo(
        simulate_autophage_economy, "Autophage", n_runs=N_RUNS, n_users=USERS, n_days=DAYS
    )

    # Traditional MC
    trad_avg, trad_low, trad_high, trad_arr = run_monte_carlo(
        simulate_traditional_economy, "Traditional", n_runs=N_RUNS, n_users=USERS, n_days=DAYS
    )

    print_gini_stats(auto_avg, "Autophage Protocol (MC mean)")
    print_gini_stats(trad_avg, "Traditional Economy (MC mean)")

    print_monte_carlo_stats(auto_arr, "Autophage Protocol")
    print_monte_carlo_stats(trad_arr, "Traditional Economy")

    # Plot Gini coefficient with confidence intervals
    import matplotlib.pyplot as plt

    plt.figure(figsize=(12, 6))
    x = np.arange(DAYS)

    plt.plot(x, auto_avg, color='green', label='Autophage (mean)', linewidth=2)
    plt.fill_between(x, auto_low, auto_high, color='green', alpha=0.2, label='Autophage (95% CI)')
    plt.plot(x, trad_avg, color='orange', label='Traditional (mean)', linewidth=2)
    plt.fill_between(x, trad_low, trad_high, color='orange', alpha=0.2, label='Traditional (95% CI)')
    plt.axhline(y=0.35, color='gray', linestyle='--', alpha=0.5, label='Target Range')
    plt.axhline(y=0.45, color='gray', linestyle='--', alpha=0.5)
    plt.fill_between(x, 0.35, 0.45, alpha=0.1, color='gray')
    plt.xlabel('Days')
    plt.ylabel('Gini Coefficient')
    plt.title('Gini Coefficient Evolution (Monte Carlo Mean + 95% CI)')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.ylim(0.2, 0.9)
    plt.tight_layout()
    plt.show()

    # Show formula for the average Gini in CLI output (for receipts)
    print(Fore.YELLOW + "\nFormula used for average Gini coefficient:")
    print(Fore.CYAN + "    Ḡ = (1/n) ∑ₜ Gₜ")
    print("    where Gₜ is the Gini coefficient at day t, n = number of days\n")

    print(Fore.YELLOW + "Formula used for Monte Carlo average of final Gini coefficients:")
    print(Fore.CYAN + "    avg_final = (1/N) ∑ₖ Gᵏ_T")
    print("    where Gᵏ_T is the final Gini in run k, N = number of runs\n")
