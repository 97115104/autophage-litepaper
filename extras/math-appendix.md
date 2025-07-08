# Mathematical Appendix - Autophage Protocol

This appendix contains all mathematical formulas, equations, and mathematical descriptions from the Autophage Protocol litepaper, organized by section.

## Table of Contents
1. [Metabolic Token Dynamics](#1-metabolic-token-dynamics)
2. [Reservoir Treasury Dynamics](#2-reservoir-treasury-dynamics)
3. [Metabolic Price Discovery](#3-metabolic-price-discovery)
4. [Privacy Architecture](#4-privacy-architecture)
5. [Empirical Governance](#5-empirical-governance)

---

## 1. Metabolic Token Dynamics

### 1.1 Core Balance Evolution Equation

The fundamental equation governing token balance evolution for user $u$ and species $i$:

$$V_i^{(u)}(t+1) = V_i^{(u)}(t) \cdot (1 - \delta_i) + G_i^{(u)}(t)$$

Where:
- $V_i^{(u)}(t)$ = balance of species $i$ for user $u$ at time $t$
- $\delta_i \in (0,1)$ = daily decay rate for species $i$
- $G_i^{(u)}(t)$ = issuance rate (token earnings per unit time)

### 1.2 Token Species and Decay Parameters

Token species set: $S = \{\mathrm{R}, \mathrm{H}, \mathrm{F}, \mathrm{C}\}$ (Rhythm, Healing, Foundation, Catalyst)

| Species | Decay Rate ($\delta_i$) | Half-Life Formula | Half-Life Value |
|---------|-------------------------|-------------------|-----------------|
| Rhythm (R) | $0.05$ | $t_{1/2,i} = \frac{\log 0.5}{\log(1 - \delta_i)}$ | $13.51$ days |
| Healing (H) | $0.0075$ | $t_{1/2,i} = \frac{\log 0.5}{\log(1 - \delta_i)}$ | $92.42$ days |
| Foundation (F) | $0.001$ | $t_{1/2,i} = \frac{\log 0.5}{\log(1 - \delta_i)}$ | $693.15$ days |
| Catalyst (C) | $0.02 - 0.10$ | $t_{1/2,i} = \frac{\log 0.5}{\log(1 - \delta_i)}$ | variable |

### 1.3 Earning Functions

#### Standard Health Activities (R, H, F)
For $i \in \{\mathrm{R}, \mathrm{H}, \mathrm{F}\}$:

$$G_i^{(u)}(t) = \sum_{j \in \mathcal{A}_i} \mu_j \cdot \mathbf{1}\{\text{activity } j \text{ verified at } t\}$$

Where:
- $A_j^{(u)}(t)$ = count of valid activity $j$ by user $u$ at $t$
- $\mathcal{A}_i$ = set of activities mapped to species $i$
- $\mu_j$ = activity multiplier for activity $j$
- $\mathbf{1}\{\cdot\}$ = indicator function

#### Catalyst Earning (Marketplace/Protocol)
For Catalyst ($\mathrm{C}$):

$$G_{\mathrm{C}}^{(u)}(t) = \sum_{m \in M^{(u)}(t)} \kappa_m \cdot \mathbf{1}\{\text{market event at } t\} + \sum_{p \in P^{(u)}(t)} \psi_p$$

Where:
- $M^{(u)}(t)$ = user $u$'s marketplace actions at $t$
- $P^{(u)}(t)$ = successful proposals or upgrades
- $\kappa_m$ = market event reward coefficient
- $\psi_p$ = proposal reward coefficient

### 1.4 Balance-Accelerated Decay

For balances above threshold $\tau_i$, effective decay rate:

$$\delta_i^{\text{eff}}(t) = \delta_i \cdot (1 + a_i)$$

Where $a_i$ is piecewise-defined:

$$a_i = 
\begin{cases}
0 & V_i^{(u)}(t) \leq \tau_1 \\
\gamma_1 & \tau_1 < V_i^{(u)}(t) \leq \tau_2 \\
\gamma_2 & \tau_2 < V_i^{(u)}(t) \leq \tau_3 \\
\cdots
\end{cases}$$

### 1.5 Global Circulation and Steady-State

Aggregate decay flow to reservoir:

$$R_{\text{in}}(t) = \sum_{i \in S} \delta_i \sum_{u=1}^N V_i^{(u)}(t)$$

Expected equilibrium balance per user with constant issuance $g_i$:

$$\mathbb{E}[V_i] = \frac{g_i}{\delta_i}$$

---

## 2. Reservoir Treasury Dynamics

### 2.1 Token Chamber Evolution

$$R_T(t+1) = R_T(t) + R_{\text{in}}(t) - W_{\text{hc}}(t) - S(t)$$

Where:
- $R_T(t)$ = token chamber balance at time $t$
- $R_{\text{in}}(t)$ = total decayed tokens flowing in
- $W_{\text{hc}}(t)$ = health claim outflow
- $S(t)$ = protocol-driven shrinkage

### 2.2 USDC Chamber Evolution

$$R_U(t+1) = R_U(t) + F_{\text{market}}(t) - H_{\text{settle}}(t)$$

Where:
- $R_U(t)$ = USDC chamber balance
- $F_{\text{market}}$ = fee inflow from marketplace
- $H_{\text{settle}}$ = healthcare settlement payments

### 2.3 Solvency Constraint

The protocol enforces minimum USDC reserves:

$$R_U(t) \geq \max \big(0.4 D,\, 3 O,\, 0.22 Y\big)$$

Where:
- $D$ = total user deposits
- $O$ = monthly health outflow
- $Y$ = annual revenue

---

## 3. Metabolic Price Discovery

### 3.1 Endogenous Price Formula

Token price at time $t$:

$$P(t) = \frac{E_{\text{health}}(t)(1 + \gamma C_{\text{ratio}}) + V_{\text{market}}(t)(1 - C_{\text{ratio}})}{S_{\text{active}}(t) V (1 + M_{\text{activity}})}$$

Where:
- $E_{\text{health}}(t)$ = total measured energy cost of verified activities
- $V_{\text{market}}(t)$ = market volume
- $S_{\text{active}}(t)$ = active token supply
- $V$ = velocity
- $C_{\text{ratio}}$ = catalyst ratio
- $M_{\text{activity}}$ = activity multiplier
- $\gamma$ = empirically chosen gradient parameter

### 3.2 Price Calculation Example

Given parameters at time $t$:
- Total health energy: $10,000
- Market volume: $5,000
- Active supply: $100,000$ tokens
- Velocity: $2.0$
- $M_{\text{activity}} = 1.5$
- $C_{\text{ratio}} = 0.3$, $\gamma = 2.0$

Step-by-step calculation:

$$P(t) = \frac{10{,}000 \cdot (1 + 2 \cdot 0.3) + 5{,}000 \cdot (1 - 0.3)}{100{,}000 \times 2.0 \times (1 + 1.5)}$$

$$= \frac{10{,}000 \cdot 1.6 + 5{,}000 \cdot 0.7}{100{,}000 \cdot 2.5}$$

$$= \frac{16,000 + 3,500}{250,000} = \frac{19,500}{250,000} = 0.078$$

---

## 4. Privacy Architecture

### 4.1 ProfileID Generation

Cryptographic separation of identity:

$$\text{ProfileID} = H(\text{UserID} \parallel \text{Salt} \parallel \text{Secret})$$

Where:
- $H$ = cryptographically secure hash function
- $\parallel$ = concatenation operator
- Output: 768 bits of entropy

### 4.2 Zero-Knowledge Proof System

Proof generation:
$$\pi = \text{zkVM.Prove}(\text{activity}, \text{witness}, \text{app\_params})$$

Verification:
$$\text{Verify}(\pi, \text{statement}, \text{protocol\_params}) \to \{0, 1\}$$

---

## 5. Empirical Governance

### 5.1 Contribution Score Calculation

User governance weight:

$$C = 0.5 \log_{10}(1 + R_{\text{lifetime}}) + 0.3 V_{\text{rep}} + 0.2 A_{\text{part}}$$

Where:
- $R_{\text{lifetime}}$ = lifetime decayed/donated/fee tokens
- $V_{\text{rep}}$ = verification reputation score
- $A_{\text{part}}$ = 90-day active participation fraction

### 5.2 Quadratic Voting Power

$$\text{Voting Power} = \sqrt{C} \cdot \text{Activity Multiplier} \cdot \text{Reputation Bonus}$$

### 5.3 Empirical Upgrade Success Criteria

Proposal passes if:

$$\frac{\mathbb{E}[\text{Metric}_{\text{treatment}}] - \mathbb{E}[\text{Metric}_{\text{control}}]}{\mathbb{E}[\text{Metric}_{\text{control}}]} \geq \epsilon$$

With:
- Significance requirement: $p < 0.05$
- Power requirement: $\geq 0.8$
- Confidence requirement: $\geq 0.95$

Where:
- $S$ = staked amount
- $\Delta$ = targeted improvement
- $n$ = required sample size
- $\epsilon$ = success threshold

---

## Summary of Key Mathematical Relationships

1. **Token Decay**: Exponential decay with rate $\delta_i$ leads to half-life $t_{1/2} = \frac{\log 0.5}{\log(1 - \delta_i)}$

2. **Equilibrium Balance**: With constant earning rate $g_i$, steady-state balance is $\mathbb{E}[V_i] = \frac{g_i}{\delta_i}$

3. **Price-Activity Relationship**: Price is proportional to health energy and inversely proportional to active supply and velocity

4. **Governance Power**: Quadratic in contribution score, emphasizing broad participation over concentrated holdings

5. **Privacy Guarantee**: 768 bits of entropy ensures computational infeasibility of identity recovery

6. **Solvency Ratio**: Minimum 22% annual revenue coverage ensures healthcare settlement capability

---

*Note: All formulas presented here are from the Autophage Protocol litepaper. For implementation details and parameter proofs, see Appendix A of the main document.*