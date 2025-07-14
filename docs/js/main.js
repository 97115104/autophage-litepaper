// Update real-time metrics every 5 seconds
function updateMetrics() {
    const giniElement = document.getElementById('giniValue');
    const healthElement = document.getElementById('systemHealth');
    
    if (giniElement) {
        // Simulate small variations in Gini coefficient
        const base = 0.095;
        const variation = (Math.random() - 0.5) * 0.03;
        const gini = Math.max(0.08, Math.min(0.11, base + variation));
        giniElement.textContent = gini.toFixed(3);
    }
    
    if (healthElement) {
        // Simulate system health between 70-100%
        const health = Math.floor(70 + Math.random() * 30);
        healthElement.textContent = health + '%';
    }
}

// Update metrics every 5 seconds
if (document.getElementById('giniValue') || document.getElementById('systemHealth')) {
    setInterval(updateMetrics, 5000);
}

// Chart configuration for dark mode support
function getChartColors() {
    const isDark = document.body.classList.contains('dark-mode');
    return {
        text: isDark ? '#ccc' : '#000',
        grid: isDark ? '#333' : '#ddd',
        background: isDark ? '#0a0a0a' : '#fff'
    };
}

// Gini coefficient calculation
function calculateGini(wealth) {
    const n = wealth.length;
    const sorted = [...wealth].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);
    
    if (sum === 0) return 0;
    
    let giniSum = 0;
    for (let i = 0; i < n; i++) {
        giniSum += (2 * (i + 1) - n - 1) * sorted[i];
    }
    
    return giniSum / (n * sum);
}

// Gini simulation
let giniChart = null;

function runGiniSimulation() {
    const numAgents = parseInt(document.getElementById('numAgents').value);
    const simDays = parseInt(document.getElementById('simDays').value);
    
    // Update display values
    document.getElementById('numAgentsValue').textContent = numAgents;
    document.getElementById('simDaysValue').textContent = simDays;
    
    // Show loading indicator
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Running...';
    button.disabled = true;
    
    // Clear existing chart
    const ctx = document.getElementById('giniChart').getContext('2d');
    if (giniChart) {
        giniChart.destroy();
        giniChart = null;
    }
    
    // Show loading on canvas
    ctx.fillStyle = getChartColors().text;
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillText('Running simulation...', ctx.canvas.width/2, ctx.canvas.height/2);
    
    // Run simulation asynchronously
    setTimeout(() => {
    
    // Use the new simulation classes
    const autoSim = new AutophageBrowserSim(numAgents, simDays);
    const tradSim = new TraditionalEconomySim(numAgents, simDays);
    
    // Run simulations
    const autophageGini = autoSim.run();
    const traditionalGini = tradSim.run();
    
    // Create labels for chart
    const labels = [];
    for (let i = 0; i <= simDays; i++) {
        if (i % 5 === 0) labels.push(i);
    }
    
    // Sample data for chart (every 5th day)
    const autophageData = [];
    const traditionalData = [];
    for (let i = 0; i < autophageGini.length; i++) {
        if (i % 5 === 0) {
            autophageData.push(autophageGini[i]);
            traditionalData.push(traditionalGini[i]);
        }
    }
    
    // Create chart
    const colors = getChartColors();
    
    giniChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Traditional Economy',
                data: traditionalData,
                borderColor: '#e74c3c',
                backgroundColor: 'transparent',
                tension: 0.1
            }, {
                label: 'Autophage Protocol',
                data: autophageData,
                borderColor: '#2ecc71',
                backgroundColor: 'transparent',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Gini Coefficient Evolution',
                    color: colors.text
                },
                legend: {
                    labels: {
                        color: colors.text
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Days',
                        color: colors.text
                    },
                    ticks: {
                        color: colors.text
                    },
                    grid: {
                        color: colors.grid
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Gini Coefficient',
                        color: colors.text
                    },
                    ticks: {
                        color: colors.text
                    },
                    grid: {
                        color: colors.grid
                    },
                    min: 0,
                    max: 1
                }
            }
        }
    });
    
    window.giniChart = giniChart;
    
    // Re-enable button
    button.textContent = originalText;
    button.disabled = false;
    
    }, 100); // Small delay to show loading
}

// Token decay simulation
let decayChart = null;

function runDecaySimulation() {
    const initialBalance = parseInt(document.getElementById('initialBalance').value);
    const decayDays = parseInt(document.getElementById('decayDays').value);
    
    // Update display values
    document.getElementById('initialBalanceValue').textContent = initialBalance;
    document.getElementById('decayDaysValue').textContent = decayDays;
    
    // Show loading
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Running...';
    button.disabled = true;
    
    // Clear existing chart
    const ctx = document.getElementById('decayChart').getContext('2d');
    if (decayChart) {
        decayChart.destroy();
        decayChart = null;
    }
    
    // Show loading on canvas
    ctx.fillStyle = getChartColors().text;
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillText('Running simulation...', ctx.canvas.width/2, ctx.canvas.height/2);
    
    setTimeout(() => {
    
    // Token species decay rates
    const species = {
        'Rhythm': 0.05,
        'Healing': 0.0075,
        'Foundation': 0.001,
        'Catalyst': 0.04
    };
    
    const labels = [];
    const datasets = [];
    
    // Generate data for each species
    for (const [name, rate] of Object.entries(species)) {
        const data = [];
        for (let day = 0; day <= decayDays; day++) {
            if (day % 5 === 0) labels.push(day);
            const balance = initialBalance * Math.pow(1 - rate, day);
            if (day % 5 === 0) data.push(balance);
        }
        
        datasets.push({
            label: name,
            data: data,
            borderColor: getSpeciesColor(name),
            backgroundColor: 'transparent',
            tension: 0.1
        });
    }
    
    // Create chart
    const colors = getChartColors();
    
    decayChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Token Balance Decay Over Time',
                    color: colors.text
                },
                legend: {
                    labels: {
                        color: colors.text
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Days',
                        color: colors.text
                    },
                    ticks: {
                        color: colors.text
                    },
                    grid: {
                        color: colors.grid
                    }
                },
                y: {
                    type: 'logarithmic',
                    title: {
                        display: true,
                        text: 'Token Balance (log scale)',
                        color: colors.text
                    },
                    ticks: {
                        color: colors.text
                    },
                    grid: {
                        color: colors.grid
                    }
                }
            }
        }
    });
    
    window.decayChart = decayChart;
    
    // Re-enable button
    button.textContent = originalText;
    button.disabled = false;
    
    }, 100); // Small delay
}

function getSpeciesColor(species) {
    const colors = {
        'Rhythm': '#e74c3c',
        'Healing': '#3498db',
        'Foundation': '#f39c12',
        'Catalyst': '#9b59b6'
    };
    return colors[species] || '#95a5a6';
}

// Tetris game for loading screen
let tetrisGame = null;

class TetrisGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.blockSize = 20;
        this.cols = Math.floor(canvas.width / this.blockSize);
        this.rows = Math.floor(canvas.height / this.blockSize);
        
        // Tetris pieces (tetrominos)
        this.pieces = [
            // I piece
            {blocks: [[1,1,1,1]], color: '#00f0f0'},
            // O piece
            {blocks: [[1,1],[1,1]], color: '#f0f000'},
            // T piece
            {blocks: [[0,1,0],[1,1,1]], color: '#a000f0'},
            // S piece
            {blocks: [[0,1,1],[1,1,0]], color: '#00f000'},
            // Z piece
            {blocks: [[1,1,0],[0,1,1]], color: '#f00000'},
            // J piece
            {blocks: [[1,0,0],[1,1,1]], color: '#0000f0'},
            // L piece
            {blocks: [[0,0,1],[1,1,1]], color: '#f0a000'}
        ];
        
        this.reset();
        this.running = true;
        
        // Draw initial frame
        this.draw();
        
        // Start game loop
        this.dropCounter = 0;
        this.dropInterval = 1000;
        this.lastTime = 0;
        this.gameLoop();
        
        // Add keyboard controls
        this.keydownHandler = this.handleKeyPress.bind(this);
        document.addEventListener('keydown', this.keydownHandler);
    }
    
    reset() {
        // Initialize empty board
        this.board = Array(this.rows).fill(null).map(() => Array(this.cols).fill(0));
        this.score = 0;
        this.lines = 0;
        this.gameOver = false;
        
        // Spawn first piece
        this.spawnPiece();
    }
    
    spawnPiece() {
        const piece = this.pieces[Math.floor(Math.random() * this.pieces.length)];
        this.currentPiece = {
            shape: piece.blocks,
            color: piece.color,
            x: Math.floor(this.cols / 2) - Math.floor(piece.blocks[0].length / 2),
            y: 0
        };
        
        // Check if game over
        if (this.checkCollision()) {
            this.gameOver = true;
        }
    }
    
    rotate(piece) {
        // Transpose and reverse for clockwise rotation
        const rotated = piece[0].map((_, i) => piece.map(row => row[i])).reverse();
        return rotated;
    }
    
    checkCollision() {
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
            for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                if (this.currentPiece.shape[y][x]) {
                    const newX = this.currentPiece.x + x;
                    const newY = this.currentPiece.y + y;
                    
                    if (newX < 0 || newX >= this.cols || newY >= this.rows) {
                        return true;
                    }
                    
                    if (newY >= 0 && this.board[newY][newX]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    merge() {
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
            for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                if (this.currentPiece.shape[y][x]) {
                    this.board[this.currentPiece.y + y][this.currentPiece.x + x] = this.currentPiece.color;
                }
            }
        }
    }
    
    clearLines() {
        let linesCleared = 0;
        
        for (let y = this.rows - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                this.board.splice(y, 1);
                this.board.unshift(Array(this.cols).fill(0));
                linesCleared++;
                y++; // Check same row again
            }
        }
        
        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.score += linesCleared * 100 * linesCleared; // Bonus for multiple lines
        }
    }
    
    handleKeyPress(e) {
        if (!this.running || this.gameOver) return;
        
        // Prevent default scrolling behavior for arrow keys and space
        if ((e.keyCode >= 37 && e.keyCode <= 40) || e.keyCode === 32) {
            e.preventDefault();
        }
        
        switch(e.keyCode) {
            case 37: // left
                this.currentPiece.x--;
                if (this.checkCollision()) {
                    this.currentPiece.x++;
                }
                break;
            case 39: // right
                this.currentPiece.x++;
                if (this.checkCollision()) {
                    this.currentPiece.x--;
                }
                break;
            case 40: // down
                this.drop();
                break;
            case 38: // up - rotate
            case 32: // space - rotate
                const oldShape = this.currentPiece.shape;
                this.currentPiece.shape = this.rotate(this.currentPiece.shape);
                if (this.checkCollision()) {
                    this.currentPiece.shape = oldShape;
                }
                break;
        }
    }
    
    drop() {
        this.currentPiece.y++;
        if (this.checkCollision()) {
            this.currentPiece.y--;
            this.merge();
            this.clearLines();
            this.spawnPiece();
        }
        this.dropCounter = 0;
    }
    
    update(deltaTime) {
        if (this.gameOver) {
            if (Math.random() < 0.02) { // 2% chance to restart
                this.reset();
            }
            return;
        }
        
        this.dropCounter += deltaTime;
        if (this.dropCounter > this.dropInterval) {
            this.drop();
        }
    }
    
    draw() {
        if (!this.ctx) return;
        
        const colors = getChartColors();
        
        // Clear canvas
        this.ctx.fillStyle = colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw board
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.board[y][x]) {
                    this.ctx.fillStyle = this.board[y][x];
                    this.ctx.fillRect(x * this.blockSize, y * this.blockSize, 
                                    this.blockSize - 1, this.blockSize - 1);
                }
            }
        }
        
        // Draw current piece
        if (this.currentPiece && !this.gameOver) {
            this.ctx.fillStyle = this.currentPiece.color;
            for (let y = 0; y < this.currentPiece.shape.length; y++) {
                for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                    if (this.currentPiece.shape[y][x]) {
                        this.ctx.fillRect(
                            (this.currentPiece.x + x) * this.blockSize,
                            (this.currentPiece.y + y) * this.blockSize,
                            this.blockSize - 1, this.blockSize - 1
                        );
                    }
                }
            }
        }
        
        // Draw grid
        this.ctx.strokeStyle = colors.grid;
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i <= this.cols; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.blockSize, 0);
            this.ctx.lineTo(i * this.blockSize, this.canvas.height);
            this.ctx.stroke();
        }
        for (let i = 0; i <= this.rows; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.blockSize);
            this.ctx.lineTo(this.canvas.width, i * this.blockSize);
            this.ctx.stroke();
        }
        
        // Draw score
        this.ctx.fillStyle = colors.text;
        this.ctx.font = '14px Arial';
        this.ctx.fillText('Score: ' + this.score + ' Lines: ' + this.lines, 10, 25);
        
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
            this.ctx.fillRect(0, this.canvas.height/2 - 30, this.canvas.width, 60);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Game Over!', this.canvas.width/2, this.canvas.height/2);
            this.ctx.font = '14px Arial';
            this.ctx.fillText('Auto-restarting...', this.canvas.width/2, this.canvas.height/2 + 20);
            this.ctx.textAlign = 'left';
        }
    }
    
    gameLoop(currentTime = 0) {
        if (!this.running) return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.draw();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    stop() {
        this.running = false;
        // Remove keyboard event listener
        if (this.keydownHandler) {
            document.removeEventListener('keydown', this.keydownHandler);
        }
    }
}

// Monte Carlo simulation
function runMonteCarloSimulation() {
    const numRuns = parseInt(document.getElementById('monteCarloRuns').value);
    const variance = parseInt(document.getElementById('activityVariance').value) / 100;
    
    // Update display values
    document.getElementById('monteCarloRunsValue').textContent = numRuns;
    document.getElementById('activityVarianceValue').textContent = (variance * 100) + '%';
    
    // Show loading
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Running...';
    button.disabled = true;
    
    const results = document.getElementById('monteCarloResults');
    const loader = document.getElementById('monteCarloLoader');
    const progressText = document.getElementById('progressText');
    
    // Hide results, show loader
    results.style.display = 'none';
    loader.style.display = 'block';
    
    // Start snake game
    const canvas = document.getElementById('snakeCanvas');
    if (canvas) {
        // Add click handler to focus the game
        canvas.style.cursor = 'pointer';
        canvas.onclick = function() {
            canvas.style.outline = '3px solid #3498db';
            canvas.style.outlineOffset = '2px';
            canvas.focus();
        };
        
        // Remove outline when clicking elsewhere
        document.addEventListener('click', function(e) {
            if (e.target !== canvas) {
                canvas.style.outline = 'none';
            }
        });
        
        tetrisGame = new TetrisGame(canvas);
    }
    
    // Run simulations asynchronously with progress updates
    const giniResults = [];
    const wealthResults = [];
    const activityResults = [];
    let currentRun = 0;
    
    // Process simulations in batches to keep UI responsive
    function processBatch() {
        const batchSize = 10; // Small batch size to keep UI responsive
        const batchEnd = Math.min(currentRun + batchSize, numRuns);
        
        for (let run = currentRun; run < batchEnd; run++) {
            // Use the Autophage simulation for accurate results
            const sim = new AutophageBrowserSim(1000, 180);
            
            // Add variance to the activity rate
            sim.activityRate = Math.max(0.3, Math.min(0.95, 0.7 + (Math.random() - 0.5) * variance));
            
            // Run the simulation
            const giniHistory = sim.run();
            
            // Get final values
            const finalGini = giniHistory[giniHistory.length - 1];
            
            // Calculate total wealth
            const totalWealth = [];
            for (let i = 0; i < sim.nUsers; i++) {
                totalWealth.push(
                    sim.balances.rhythm[i] + 
                    sim.balances.healing[i] + 
                    sim.balances.foundation[i] + 
                    sim.balances.catalyst[i]
                );
            }
            const avgWealth = totalWealth.reduce((a, b) => a + b, 0) / sim.nUsers;
            
            giniResults.push(finalGini);
            wealthResults.push(avgWealth);
            activityResults.push(sim.activityRate);
        }
        
        currentRun = batchEnd;
        progressText.textContent = `Progress: ${currentRun}/${numRuns} (${Math.round(currentRun/numRuns*100)}%)`;
        
        if (currentRun < numRuns) {
            // Schedule next batch
            setTimeout(processBatch, 10); // Small delay to allow UI updates
        } else {
            // All simulations complete, show results
            finishSimulation();
        }
    }
    
    function finishSimulation() {
        
        // Calculate statistics
    const giniMean = mean(giniResults);
    const giniStd = std(giniResults);
    const wealthMean = mean(wealthResults);
    const wealthStd = std(wealthResults);
    const activityMean = mean(activityResults);
    const activityStd = std(activityResults);
    
    // Display results
    results.innerHTML = `Monte Carlo Simulation Results (${numRuns} runs)
=====================================

Gini Coefficient:
  Mean: ${giniMean.toFixed(4)}
  Std Dev: ${giniStd.toFixed(4)}
  95% CI: [${(giniMean - 1.96 * giniStd).toFixed(4)}, ${(giniMean + 1.96 * giniStd).toFixed(4)}]

Average Wealth:
  Mean: ${wealthMean.toFixed(2)} tokens
  Std Dev: ${wealthStd.toFixed(2)}
  95% CI: [${(wealthMean - 1.96 * wealthStd).toFixed(2)}, ${(wealthMean + 1.96 * wealthStd).toFixed(2)}]

Activity Rate:
  Mean: ${(activityMean * 100).toFixed(1)}%
  Std Dev: ${(activityStd * 100).toFixed(1)}%

Convergence: ${giniMean >= 0.08 && giniMean <= 0.11 ? '<svg class="icon icon-inline"><use href="../assets/icons.svg#icon-check"></use></svg> Within target range (0.08-0.11)' : '<svg class="icon icon-inline"><use href="../assets/icons.svg#icon-x"></use></svg> Outside target range'}`;

        // Stop tetris game
        if (tetrisGame) {
            tetrisGame.stop();
            tetrisGame = null;
        }
        
        // Hide loader, show results
        loader.style.display = 'none';
        results.style.display = 'block';
        
        // Re-enable button
        button.textContent = originalText;
        button.disabled = false;
    }
    
    // Start processing batches
    setTimeout(processBatch, 100);
}

// Biological scaling simulation
let scalingChart = null;

function runScalingSimulation() {
    const maxSize = parseInt(document.getElementById('networkSize').value);
    document.getElementById('networkSizeValue').textContent = maxSize.toLocaleString();
    
    const sizes = [];
    const efficiency = [];
    const metabolicRate = [];
    const allee = [];
    
    // Generate data points
    for (let i = 100; i <= maxSize; i *= 1.5) {
        sizes.push(Math.round(i));
        
        // Kleiber's Law: efficiency scales as N^(1/4)
        const eff = 1 + 0.3 * Math.pow(i / 1000, 0.25);
        efficiency.push(eff);
        
        // Metabolic rate scales as N^(-1/4)
        const met = Math.pow(i / 100, -0.25);
        metabolicRate.push(met);
        
        // Allee effect - fitness increases then plateaus
        const alleeValue = 1 - Math.exp(-i / 500);
        allee.push(alleeValue);
    }
    
    // Update or create chart
    const ctx = document.getElementById('scalingChart').getContext('2d');
    const colors = getChartColors();
    
    if (scalingChart) {
        scalingChart.destroy();
    }
    
    scalingChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sizes,
            datasets: [{
                label: 'Network Efficiency (Kleiber\'s Law)',
                data: efficiency,
                borderColor: '#2ecc71',
                backgroundColor: 'transparent',
                tension: 0.1,
                yAxisID: 'y'
            }, {
                label: 'Per-Capita Metabolic Rate',
                data: metabolicRate,
                borderColor: '#e74c3c',
                backgroundColor: 'transparent',
                tension: 0.1,
                yAxisID: 'y1'
            }, {
                label: 'Allee Effect (Network Value)',
                data: allee,
                borderColor: '#3498db',
                backgroundColor: 'transparent',
                tension: 0.1,
                yAxisID: 'y'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Biological Scaling in Network Economics',
                    color: colors.text
                },
                legend: {
                    labels: {
                        color: colors.text
                    }
                }
            },
            scales: {
                x: {
                    type: 'logarithmic',
                    title: {
                        display: true,
                        text: 'Network Size (log scale)',
                        color: colors.text
                    },
                    ticks: {
                        color: colors.text
                    },
                    grid: {
                        color: colors.grid
                    }
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Efficiency / Network Value',
                        color: colors.text
                    },
                    ticks: {
                        color: colors.text
                    },
                    grid: {
                        color: colors.grid
                    }
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Per-Capita Metabolic Rate',
                        color: colors.text
                    },
                    ticks: {
                        color: colors.text
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
    
    window.scalingChart = scalingChart;
}

// Utility functions
function mean(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function std(arr) {
    const m = mean(arr);
    const variance = arr.reduce((a, b) => a + Math.pow(b - m, 2), 0) / arr.length;
    return Math.sqrt(variance);
}

// Update input values on change
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for input changes
    const inputs = document.querySelectorAll('input[type="range"]');
    inputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const output = document.getElementById(e.target.id + 'Value');
            if (output) {
                let value = e.target.value;
                if (e.target.id === 'networkSize') {
                    value = parseInt(value).toLocaleString();
                } else if (e.target.id === 'activityVariance') {
                    value = value + '%';
                }
                output.textContent = value;
            }
        });
    });
});