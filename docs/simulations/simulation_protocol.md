# Simulation Protocol for Autophage Economic Model

## Purpose

This document details the simulation methodology used to validate the Autophage Protocol's economic model, as presented in "The Autophage Protocol: Metabolic Economics for Decentralized Health". The simulations demonstrate how metabolic token dynamics create more equitable wealth distribution compared to traditional economic systems.

## Mathematical Model

### 1. Token Dynamics (Section 3: Metabolic Token Dynamics)

The core equation governing token balance evolution is:

```
B_i,s(t+1) = B_i,s(t) × (1 - λ_s) + R_i,s(t)
```

Where:
- `B_i,s(t)` = Balance of user i for token species s at time t
- `λ_s` = Decay rate for species s
- `R_i,s(t)` = Rewards earned by user i for species s at time t

### 2. Decay Rates (Table 1 in paper)

| Token Species | Daily Decay | Half-life | Biological Analog |
|--------------|-------------|-----------|-------------------|
| Rhythm | 5% | ~13.5 days | Cardiovascular fitness |
| Healing | 0.75% | ~92 days | Therapeutic effects |
| Foundation | 0.1% | ~693 days | Vaccine immunity |
| Catalyst | 2-10% | Variable | Market dynamics |

### 3. Whale Protection (Section 3.4)

For Rhythm tokens only, progressive decay rates apply:

```
λ_effective = {
    0.05  if balance ≤ 10,000
    0.075 if 10,000 < balance ≤ 50,000
    0.10  if 50,000 < balance ≤ 100,000
    0.15  if balance > 100,000
}
```

### 4. Activity Model (Section 3.2: Behavioral Dynamics)

- Daily activity probability: `P(active) = 0.7`
- Activity-specific participation rates:
  - Rhythm: 100% of active users
  - Healing: 20% of active users
  - Foundation: 5% of active users

### 5. Reward Generation (Section 3.3)

Rewards follow truncated normal distributions:

```
R_rhythm ~ max(0, N(μ=50, σ=10))
R_healing ~ max(0, N(μ=25, σ=5))
R_foundation ~ max(0, N(μ=100, σ=20))
```

## Simulation Parameters

### Population
- **Size**: 10,000 users
- **Initial balances**: 0 (all users start with no tokens)
- **Heterogeneity**: Stochastic activity and reward generation

### Time
- **Duration**: 365 days
- **Time step**: 1 day
- **Order of operations**:
  1. Apply decay to existing balances
  2. Determine active users
  3. Generate and distribute rewards
  4. Calculate metrics

### Monte Carlo
- **Runs**: 10 independent simulations
- **Random seed**: 42 (for reproducibility)
- **Statistics**: Mean, standard deviation, 95% confidence intervals

## Metrics

### Primary Metric: Gini Coefficient

The Gini coefficient measures wealth inequality:

```
G = (2 × Σᵢ₌₁ⁿ i × x_i) / (n × Σᵢ₌₁ⁿ x_i) - (n + 1) / n
```

Where `x_i` are sorted wealth values.

**Interpretation**:
- G = 0: Perfect equality
- G = 1: Perfect inequality
- G < 0.4: Relatively equitable
- G > 0.8: Highly inequitable

### Secondary Metrics
- Token balance distributions
- Activity participation rates
- Decay impact analysis

## Baseline Comparison

The traditional economy simulation models:
1. **Initial wealth**: Exponential distribution with mean 1000
2. **Capital returns**: Top 10% earn 1% daily compound interest
3. **Transfers**: 10% of users randomly transfer 0-10% of wealth daily

This creates a Pareto-like distribution typical of traditional economies.

## Expected Results

Based on the theoretical model, we expect:

1. **Autophage Protocol**:
   - Gini coefficient: 0.32-0.38
   - Stable equilibrium after ~100 days
   - Bounded wealth accumulation

2. **Traditional Economy**:
   - Gini coefficient: 0.82+
   - Increasing inequality over time
   - Unbounded wealth accumulation

## Validation

Results are validated against:
1. Theoretical predictions from Section 4
2. Biological persistence data (Table 1)
3. Empirical economic inequality measures

## References

All equation numbers and section references correspond to:
> Harshberger, A. (2025). "The Autophage Protocol: Metabolic Economics for Decentralized Health"