// Loading reveal animation - only for homepage
(function() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLoadingReveal);
    } else {
        initLoadingReveal();
    }
    
    function initLoadingReveal() {
        // Only run on homepage and if not shown before
        if ((window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) && 
            !localStorage.getItem('autophageIntroShown')) {
        // Add loading CSS
        const style = document.createElement('style');
        style.textContent = `
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #0a0a0a;
                z-index: 9999;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                overflow: hidden;
            }
            
            .organism-container {
                position: relative;
                width: 300px;
                height: 300px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            /* Central organism */
            .organism {
                position: absolute;
                width: 60px;
                height: 60px;
                background: radial-gradient(circle at 30% 30%, #ffffff, #888888);
                border-radius: 50%;
                box-shadow: 0 0 40px rgba(255, 255, 255, 0.6),
                           inset 0 0 20px rgba(255, 255, 255, 0.2);
                animation: pulse 2s ease-in-out infinite;
                z-index: 10;
            }
            
            .organism::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 30px;
                height: 30px;
                background: radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.8), transparent);
                border-radius: 50%;
                animation: glow 2s ease-in-out infinite;
            }
            
            /* Decay particles */
            .decay-particle {
                position: absolute;
                width: 4px;
                height: 4px;
                background: #ffffff;
                border-radius: 50%;
                opacity: 0;
                box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
            }
            
            .decay-particle:nth-child(2) { animation: decay1 3s ease-out infinite 0s; }
            .decay-particle:nth-child(3) { animation: decay2 3s ease-out infinite 0.5s; }
            .decay-particle:nth-child(4) { animation: decay3 3s ease-out infinite 1s; }
            .decay-particle:nth-child(5) { animation: decay4 3s ease-out infinite 1.5s; }
            .decay-particle:nth-child(6) { animation: decay5 3s ease-out infinite 2s; }
            .decay-particle:nth-child(7) { animation: decay6 3s ease-out infinite 2.5s; }
            
            /* Orbital rings */
            .orbit-ring {
                position: absolute;
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 50%;
                animation: rotate 20s linear infinite;
            }
            
            .orbit-ring:nth-child(8) {
                width: 120px;
                height: 120px;
                animation-duration: 15s;
            }
            
            .orbit-ring:nth-child(9) {
                width: 180px;
                height: 180px;
                animation-duration: 25s;
                animation-direction: reverse;
            }
            
            .orbit-ring:nth-child(10) {
                width: 240px;
                height: 240px;
                animation-duration: 35s;
            }
            
            /* Orbiting particles */
            .orbit-particle {
                position: absolute;
                width: 6px;
                height: 6px;
                background: #cccccc;
                border-radius: 50%;
                top: -3px;
                left: 50%;
                transform: translateX(-50%);
                box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
            }
            
            .loading-text {
                position: absolute;
                bottom: 30%;
                color: rgba(255, 255, 255, 0.5);
                font-family: 'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', monospace;
                font-size: 10pt;
                text-align: center;
                letter-spacing: 1px;
                opacity: 0;
                animation: fadeIn 1.5s ease-in 1s forwards;
            }
            
            /* Click/tap effect */
            .loading-overlay.clicked {
                animation: dissolve 0.8s ease-out forwards;
            }
            
            .loading-overlay.clicked .organism {
                animation: explode 0.8s ease-out forwards;
            }
            
            .loading-overlay.clicked .decay-particle {
                animation: scatter 0.8s ease-out forwards !important;
            }
            
            .loading-overlay.clicked .orbit-ring {
                animation: ringExpand 0.8s ease-out forwards;
            }
            
            /* Animations */
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            @keyframes glow {
                0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
                50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
            }
            
            @keyframes rotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            @keyframes decay1 {
                0% { opacity: 0; transform: translate(0, 0) scale(1); }
                10% { opacity: 1; }
                100% { opacity: 0; transform: translate(80px, -60px) scale(0); }
            }
            
            @keyframes decay2 {
                0% { opacity: 0; transform: translate(0, 0) scale(1); }
                10% { opacity: 1; }
                100% { opacity: 0; transform: translate(-90px, -40px) scale(0); }
            }
            
            @keyframes decay3 {
                0% { opacity: 0; transform: translate(0, 0) scale(1); }
                10% { opacity: 1; }
                100% { opacity: 0; transform: translate(70px, 70px) scale(0); }
            }
            
            @keyframes decay4 {
                0% { opacity: 0; transform: translate(0, 0) scale(1); }
                10% { opacity: 1; }
                100% { opacity: 0; transform: translate(-80px, 50px) scale(0); }
            }
            
            @keyframes decay5 {
                0% { opacity: 0; transform: translate(0, 0) scale(1); }
                10% { opacity: 1; }
                100% { opacity: 0; transform: translate(0, -90px) scale(0); }
            }
            
            @keyframes decay6 {
                0% { opacity: 0; transform: translate(0, 0) scale(1); }
                10% { opacity: 1; }
                100% { opacity: 0; transform: translate(0, 90px) scale(0); }
            }
            
            @keyframes fadeIn {
                to { opacity: 1; }
            }
            
            @keyframes dissolve {
                to { 
                    background: transparent;
                    opacity: 0;
                }
            }
            
            @keyframes explode {
                to {
                    transform: scale(40);
                    opacity: 0;
                }
            }
            
            @keyframes scatter {
                to {
                    transform: translate(var(--scatter-x, 200px), var(--scatter-y, 200px)) scale(0);
                    opacity: 0;
                }
            }
            
            @keyframes ringExpand {
                to {
                    transform: scale(5);
                    opacity: 0;
                }
            }
            
            /* Mobile adjustments */
            @media (max-width: 768px) {
                .organism-container {
                    transform: scale(0.8);
                }
                
                .loading-text {
                    font-size: 10pt;
                    bottom: 25%;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Create loading overlay
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="organism-container">
                <div class="organism"></div>
                <div class="decay-particle"></div>
                <div class="decay-particle"></div>
                <div class="decay-particle"></div>
                <div class="decay-particle"></div>
                <div class="decay-particle"></div>
                <div class="decay-particle"></div>
                <div class="orbit-ring"><div class="orbit-particle"></div></div>
                <div class="orbit-ring"><div class="orbit-particle"></div></div>
                <div class="orbit-ring"><div class="orbit-particle"></div></div>
            </div>
            <div class="loading-text">click to enter</div>
        `;
        document.body.appendChild(overlay);
        
        // Add random scatter values to decay particles
        const particles = overlay.querySelectorAll('.decay-particle');
        particles.forEach((particle) => {
            particle.style.setProperty('--scatter-x', `${Math.random() * 400 - 200}px`);
            particle.style.setProperty('--scatter-y', `${Math.random() * 400 - 200}px`);
        });
        
        // Click handler
        function hideOverlay() {
            overlay.classList.add('clicked');
            localStorage.setItem('autophageIntroShown', 'true');
            setTimeout(() => {
                overlay.classList.add('hidden');
                setTimeout(() => overlay.remove(), 500);
            }, 800);
        }
        
        overlay.addEventListener('click', hideOverlay);
        
        // Auto-hide after 5 seconds
        setTimeout(hideOverlay, 5000);
        }
    }
})();