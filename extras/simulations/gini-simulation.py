import numpy as np
import matplotlib.pyplot as plt

def calculate_gini(x):
    # Standard Gini implementation
    x = np.sort(x)
    n = len(x)
    cumx = np.cumsum(x)
    return (2 * np.sum((np.arange(1, n+1)) * x)) / (n * cumx[-1]) - (n + 1) / n

def simulate_autophage(
        n_users=10000, n_days=365, base_activity=40, 
        activity_hetero=0.3, decay=0.02, 
        vault_fraction=0.2, vault_decay=0.005, 
        streak_bonus=0.1, inactivity_prob=0.1):
    # Users have heterogeneous mean activity levels
    base_levels = np.random.normal(1, activity_hetero, n_users)
    base_levels = np.clip(base_levels, 0.3, 2)
    balances = np.zeros(n_users)
    vaults = np.zeros(n_users)
    gini_history = []
    for day in range(n_days):
        # Each day, users may be active (1-inactivity_prob) or not
        active_today = np.random.rand(n_users) > inactivity_prob
        activity_reward = base_activity * base_levels * active_today
        # Apply simple streak bonus if active last 5+ days (simulate with random)
        streaking = np.random.rand(n_users) < 0.2
        activity_reward += streak_bonus * activity_reward * streaking
        # 20% of new rewards go to "vault" (less decay), rest to main balance
        vaults += activity_reward * vault_fraction
        balances += activity_reward * (1 - vault_fraction)
        # Decay both vaults (slower) and balances (standard)
        balances *= (1 - decay)
        vaults *= (1 - vault_decay)
        total_balances = balances + vaults
        if total_balances.sum() > 0:
            gini_history.append(calculate_gini(total_balances))
    return balances + vaults, gini_history

def simulate_traditional(
        n_users=10000, n_days=365, base_wage=40, 
        wage_hetero=0.8, compounding=0.01, 
        inactivity_prob=0.1, windfall_prob=0.001):
    # Wage heterogeneity (lognormal for realism)
    wages = np.random.lognormal(mean=np.log(base_wage), sigma=wage_hetero, size=n_users)
    balances = np.random.lognormal(mean=np.log(base_wage*20), sigma=1.0, size=n_users)
    gini_history = []
    for day in range(n_days):
        # Random job loss: some users earn nothing today
        active_today = np.random.rand(n_users) > inactivity_prob
        today_income = wages * active_today
        # Richer users have slightly higher probability of extra income (network compounding)
        lucky = (np.random.rand(n_users) < (compounding * (balances / balances.max())))
        today_income += lucky * np.random.uniform(10, 100, n_users)
        # Rare windfalls (lottery, inheritance, VC rug)
        windfalls = (np.random.rand(n_users) < windfall_prob)
        today_income += windfalls * np.random.uniform(1000, 5000, n_users)
        balances += today_income
        if balances.sum() > 0:
            gini_history.append(calculate_gini(balances))
    return balances, gini_history

# Run Monte Carlo
def monte_carlo(sim_fn, label, n_runs=5, **kwargs):
    all_ginis = []
    for _ in range(n_runs):
        _, gini = sim_fn(**kwargs)
        all_ginis.append(gini)
    minlen = min(len(g) for g in all_ginis)
    arr = np.array([g[:minlen] for g in all_ginis])
    avg = arr.mean(axis=0)
    low = np.percentile(arr, 2.5, axis=0)
    high = np.percentile(arr, 97.5, axis=0)
    return avg, low, high, arr

if __name__ == "__main__":
    DAYS = 365
    USERS = 10000
    RUNS = 5

    autophage_avg, autophage_low, autophage_high, autophage_arr = monte_carlo(
        simulate_autophage, "Autophage", n_runs=RUNS, n_users=USERS, n_days=DAYS,
        base_activity=40, activity_hetero=0.3, decay=0.018, vault_fraction=0.18, vault_decay=0.005,
        streak_bonus=0.15, inactivity_prob=0.14
    )

    trad_avg, trad_low, trad_high, trad_arr = monte_carlo(
        simulate_traditional, "Traditional", n_runs=RUNS, n_users=USERS, n_days=DAYS,
        base_wage=40, wage_hetero=0.7, compounding=0.012, inactivity_prob=0.14, windfall_prob=0.001
    )

    plt.figure(figsize=(12,6))
    x = np.arange(len(autophage_avg))
    plt.plot(x, autophage_avg, label="Autophage", color="green", linewidth=2)
    plt.fill_between(x, autophage_low, autophage_high, color='green', alpha=0.15)
    plt.plot(x, trad_avg, label="Traditional", color="orange", linewidth=2)
    plt.fill_between(x, trad_low, trad_high, color='orange', alpha=0.15)
    plt.axhline(0.32, color="gray", linestyle="--", alpha=0.6, label="Target Zone")
    plt.axhline(0.38, color="gray", linestyle="--", alpha=0.6)
    plt.fill_between(x, 0.32, 0.38, color="gray", alpha=0.10)
    plt.xlabel("Days")
    plt.ylabel("Gini Coefficient")
    plt.title("Gini Coefficient Evolution (Autophage vs. Traditional)")
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.show()
