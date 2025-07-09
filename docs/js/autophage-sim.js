// Autophage Protocol Browser Simulation
// Implements the core economic model for interactive visualization

class AutophageBrowserSim {
    constructor(nUsers = 1000, nDays = 180) {
        this.nUsers = nUsers;
        this.nDays = nDays;
        
        // Token decay rates from paper
        this.decayRates = {
            rhythm: 0.05,
            healing: 0.0075,
            foundation: 0.001,
            catalyst: 0.05
        };
        
        // Initialize user balances
        this.balances = {
            rhythm: new Array(nUsers).fill(0),
            healing: new Array(nUsers).fill(0),
            foundation: new Array(nUsers).fill(0),
            catalyst: new Array(nUsers).fill(0)
        };
        
        this.giniHistory = [];
        this.activityRate = 0.7;
    }
    
    // Calculate Gini coefficient
    calculateGini(balances) {
        const sorted = [...balances].sort((a, b) => a - b);
        const n = sorted.length;
        const sum = sorted.reduce((a, b) => a + b, 0);
        
        if (sum === 0) return 0;
        
        let giniSum = 0;
        for (let i = 0; i < n; i++) {
            giniSum += (i + 1) * sorted[i];
        }
        
        return (2 * giniSum) / (n * sum) - (n + 1) / n;
    }
    
    // Apply whale protection for Rhythm tokens
    getDecayRate(balance, token) {
        if (token !== 'rhythm') return this.decayRates[token];
        
        if (balance <= 10000) return 0.05;
        if (balance <= 50000) return 0.075;
        if (balance <= 100000) return 0.10;
        return 0.15;
    }
    
    // Simulate one day
    simulateDay() {
        // Determine active users
        const activeUsers = new Array(this.nUsers).fill(false);
        for (let i = 0; i < this.nUsers; i++) {
            activeUsers[i] = Math.random() < this.activityRate;
        }
        
        // Apply decay and generate rewards for each token type
        for (const token of Object.keys(this.decayRates)) {
            for (let i = 0; i < this.nUsers; i++) {
                // Apply decay
                const decayRate = this.getDecayRate(this.balances[token][i], token);
                this.balances[token][i] *= (1 - decayRate);
                
                // Generate rewards if active
                if (activeUsers[i]) {
                    let reward = 0;
                    
                    if (token === 'rhythm') {
                        // All active users get rhythm rewards
                        reward = Math.max(0, this.normalRandom(50, 10));
                    } else if (token === 'healing' && Math.random() < 0.2) {
                        // 20% of active users get healing rewards
                        reward = Math.max(0, this.normalRandom(25, 5));
                    } else if (token === 'foundation' && Math.random() < 0.05) {
                        // 5% of active users get foundation rewards
                        reward = Math.max(0, this.normalRandom(100, 20));
                    }
                    
                    this.balances[token][i] += reward;
                }
            }
        }
        
        // Calculate total wealth per user
        const totalWealth = new Array(this.nUsers).fill(0);
        for (let i = 0; i < this.nUsers; i++) {
            totalWealth[i] = 
                this.balances.rhythm[i] + 
                this.balances.healing[i] + 
                this.balances.foundation[i] + 
                this.balances.catalyst[i];
        }
        
        // Calculate and store Gini
        const gini = this.calculateGini(totalWealth);
        this.giniHistory.push(gini);
    }
    
    // Run full simulation
    run() {
        this.giniHistory = [];
        for (let day = 0; day < this.nDays; day++) {
            this.simulateDay();
        }
        return this.giniHistory;
    }
    
    // Normal distribution helper
    normalRandom(mean, std) {
        // Box-Muller transform
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        return mean + z0 * std;
    }
}

// Traditional economy simulation for comparison
class TraditionalEconomySim {
    constructor(nUsers = 1000, nDays = 180) {
        this.nUsers = nUsers;
        this.nDays = nDays;
        
        // Initialize with exponential distribution
        this.balances = new Array(nUsers).fill(0).map(() => 
            -Math.log(Math.random()) * 1000
        );
        
        this.giniHistory = [];
    }
    
    calculateGini(balances) {
        const sorted = [...balances].sort((a, b) => a - b);
        const n = sorted.length;
        const sum = sorted.reduce((a, b) => a + b, 0);
        
        if (sum === 0) return 0;
        
        let giniSum = 0;
        for (let i = 0; i < n; i++) {
            giniSum += (i + 1) * sorted[i];
        }
        
        return (2 * giniSum) / (n * sum) - (n + 1) / n;
    }
    
    simulateDay() {
        // Top 10% get 1% compound interest
        const sorted = [...this.balances]
            .map((bal, idx) => ({bal, idx}))
            .sort((a, b) => b.bal - a.bal);
        
        const top10pct = Math.floor(this.nUsers * 0.1);
        for (let i = 0; i < top10pct; i++) {
            const idx = sorted[i].idx;
            this.balances[idx] *= 1.01;
        }
        
        // Random transfers
        const nTransfers = Math.floor(this.nUsers * 0.1);
        for (let i = 0; i < nTransfers; i++) {
            const sender = Math.floor(Math.random() * this.nUsers);
            if (this.balances[sender] > 0) {
                const transferPct = Math.random() * 0.1;
                const amount = this.balances[sender] * transferPct;
                const receiver = Math.floor(Math.random() * this.nUsers);
                
                if (receiver !== sender) {
                    this.balances[sender] -= amount;
                    this.balances[receiver] += amount;
                }
            }
        }
        
        const gini = this.calculateGini(this.balances);
        this.giniHistory.push(gini);
    }
    
    run() {
        this.giniHistory = [];
        for (let day = 0; day < this.nDays; day++) {
            this.simulateDay();
        }
        return this.giniHistory;
    }
}

// Export for use in main simulation page
window.AutophageBrowserSim = AutophageBrowserSim;
window.TraditionalEconomySim = TraditionalEconomySim;