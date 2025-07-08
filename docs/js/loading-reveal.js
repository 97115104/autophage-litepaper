// Loading reveal animation - only for homepage
(function() {
    // Only run on homepage
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        // Add loading CSS
        const style = document.createElement('style');
        style.textContent = `
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #000;
                z-index: 9999;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                transition: opacity 0.5s ease-out;
            }
            .loading-overlay.hidden {
                opacity: 0;
                pointer-events: none;
            }
            .light-reveal {
                position: absolute;
                width: 0;
                height: 0;
                background: radial-gradient(circle, transparent 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,1) 70%);
                border-radius: 50%;
                animation: lightExpand 5s ease-out forwards;
            }
            .loading-overlay.clicked .light-reveal {
                animation-duration: 0.8s;
            }
            @keyframes lightExpand {
                0% { width: 0; height: 0; }
                100% { width: 300vmax; height: 300vmax; }
            }
            .loading-text {
                position: absolute;
                color: #666;
                font-family: 'Computer Modern', serif;
                font-size: 10pt;
                text-align: center;
                opacity: 0;
                animation: fadeIn 1s ease-in 0.5s forwards;
            }
            @keyframes fadeIn {
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        // Create loading overlay
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="light-reveal"></div>
            <div class="loading-text">click to enter</div>
        `;
        document.body.appendChild(overlay);
        
        // Click handler
        function hideOverlay() {
            overlay.classList.add('clicked');
            setTimeout(() => {
                overlay.classList.add('hidden');
                setTimeout(() => overlay.remove(), 500);
            }, 800);
        }
        
        overlay.addEventListener('click', hideOverlay);
        
        // Auto-hide after 5 seconds
        setTimeout(hideOverlay, 5000);
    }
})();