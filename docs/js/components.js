// Theme management functions
const ThemeManager = {
    // Get the appropriate theme based on time, system preference, or saved preference
    getTheme: function() {
        // First check if user has explicitly set a theme
        const savedTheme = localStorage.getItem('theme');
        const savedThemeTime = localStorage.getItem('themeSetTime');
        
        // If theme was manually set in the last 24 hours, respect it
        if (savedTheme && savedThemeTime) {
            const hoursSinceSet = (Date.now() - parseInt(savedThemeTime)) / (1000 * 60 * 60);
            if (hoursSinceSet < 24) {
                return savedTheme;
            }
        }
        
        // Check if it's after 7 PM
        const hour = new Date().getHours();
        if (hour >= 19 || hour < 6) { // 7 PM to 6 AM
            return 'dark';
        }
        
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        
        // Default to light
        return 'light';
    },
    
    // Apply theme to the page
    applyTheme: function(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            const button = document.querySelector('.mode-toggle');
            if (button) button.textContent = 'L';
        } else {
            document.body.classList.remove('dark-mode');
            const button = document.querySelector('.mode-toggle');
            if (button) button.textContent = 'D';
        }
    },
    
    // Save theme preference with timestamp
    saveTheme: function(theme) {
        localStorage.setItem('theme', theme);
        localStorage.setItem('themeSetTime', Date.now().toString());
    }
};

// Component system for Autophage Protocol Documentation
const Components = {
    // Initialize components
    init: async function(config = {}) {
        // Load header
        const headerDiv = document.getElementById('header');
        if (headerDiv) {
            headerDiv.innerHTML = this.header(config.title || CONFIG.siteName, config.version || '1.0');
        }
        
        // Load footer
        const footerDiv = document.getElementById('footer');
        if (footerDiv) {
            footerDiv.innerHTML = this.footer();
        }
        
        // Update deployment date
        await this.updateDeploymentDate();
        
        // Initialize theme
        const theme = ThemeManager.getTheme();
        ThemeManager.applyTheme(theme);
        
        // Add mode toggle functionality
        this.initializeModeToggle();
        
        // Add back to top functionality
        this.initializeBackToTop();
    },
    
    // Generate navigation HTML
    navigation: function() {
        const basePath = getBasePath();
        let navHTML = '<nav class="latex-nav">';
        
        // Main navigation items
        CONFIG.nav.main.forEach((item, index) => {
            if (index > 0) navHTML += '<span class="nav-separator"> • </span>';
            let href = item.href;
            
            // Handle production URLs for external items
            if (item.external && item.production && CONFIG.isProduction) {
                href = item.production;
            } else if (!item.external) {
                href = basePath + item.href;
            }
            
            const target = item.external ? ' target="_blank"' : '';
            navHTML += `<a href="${href}"${target}>${item.label}</a>`;
        });
        
        // Tools dropdown
        navHTML += '<span class="nav-separator"> • </span>';
        navHTML += '<div class="dropdown">';
        navHTML += `<button class="dropdown-toggle" onclick="toggleDropdown(event)">${CONFIG.nav.tools.label} ▼</button>`;
        navHTML += '<div class="dropdown-content">';
        CONFIG.nav.tools.items.forEach(item => {
            navHTML += `<a href="${basePath}${item.href}">${item.label}</a>`;
        });
        navHTML += '</div></div>';
        
        // Extras dropdown
        navHTML += '<span class="nav-separator"> • </span>';
        navHTML += '<div class="dropdown">';
        navHTML += `<button class="dropdown-toggle" onclick="toggleDropdown(event)">${CONFIG.nav.extras.label} ▼</button>`;
        navHTML += '<div class="dropdown-content">';
        CONFIG.nav.extras.items.forEach(item => {
            const href = item.external ? item.href : basePath + item.href;
            const target = item.external ? ' target="_blank"' : '';
            navHTML += `<a href="${href}"${target}>${item.label}</a>`;
        });
        navHTML += '</div></div>';
        
        navHTML += '</nav>';
        return navHTML;
    },
    
    // Generate header HTML
    header: function(title = CONFIG.siteName, version = '1.0') {
        const basePath = getBasePath();
        return `
        <!-- Title -->
        <div class="latex-title">
            <h1>${title}</h1>
            <div class="latex-author"><a href="${basePath}${CONFIG.orgLink}">${CONFIG.orgName}</a></div>
            <div class="latex-date">Version ${version} — <span id="deployment-date">\\today</span></div>
        </div>
        
        <!-- Navigation -->
        ${this.navigation()}
        `;
    },
    
    // Generate footer HTML
    footer: function() {
        return `
        <footer style="margin-top: 4em; padding-top: 2em; border-top: 0.4pt solid var(--rule-color); text-align: left; font-size: 10pt; color: var(--caption-color);">
            <p>© <span id="copyright-year">${new Date().getFullYear()}</span> ${CONFIG.copyright}. All rights reserved.
          <a href="https://attest.97115104.com" 
             target="_blank" 
             rel="noopener" 
             title="Built with AI assistance"
             style="display: inline-flex; align-items: center; gap: 3px; padding: 2px 6px; margin-left: 8px; border-radius: 10px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); color: #888; text-decoration: none; font-size: 10px; opacity: 0.6; transition: all 0.2s; vertical-align: middle; -webkit-tap-highlight-color: transparent;"
             onmouseover="if(!('ontouchstart' in window)) { this.style.opacity='0.9'; this.querySelector('span').textContent='Built with AI'; }" 
             onmouseout="if(!('ontouchstart' in window)) { this.style.opacity='0.6'; this.querySelector('span').textContent='AI'; }">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
              <path d="M8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="12" cy="12" r="2" fill="currentColor"/>
              <path d="M12 6V8M12 16V18M18 12H16M8 12H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span>AI</span>
          </a>
            </p>
        </footer>
        `;
    },
    
    // Initialize mode toggle functionality
    initializeModeToggle: function() {
        // Add mode toggle button
        const modeToggle = document.createElement('button');
        modeToggle.className = 'mode-toggle';
        modeToggle.onclick = function() { window.toggleMode(); };
        modeToggle.textContent = document.body.classList.contains('dark-mode') ? 'L' : 'D';
        modeToggle.setAttribute('aria-label', 'Toggle dark mode');
        document.body.appendChild(modeToggle);
    },
    
    // Initialize back to top functionality
    initializeBackToTop: function() {
        // Add back to top button
        const backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.onclick = function() { window.scrollToTop(); };
        backToTop.innerHTML = '↑';
        backToTop.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(backToTop);
        
        // Show/hide based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
        
        // Add post-it note (desktop only)
        if (window.innerWidth > 768) {
            const postIt = document.createElement('div');
            postIt.className = 'post-it';
            postIt.innerHTML = `
                <p class="post-it-text">Research Preview</p>
                <p class="post-it-subtext">feedback welcome</p>
            `;
            document.body.appendChild(postIt);
        }
        
        
        
        // Update copyright year
        const yearElement = document.getElementById('copyright-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
        
        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set theme recently
                const savedThemeTime = localStorage.getItem('themeSetTime');
                if (!savedThemeTime || (Date.now() - parseInt(savedThemeTime)) > (1000 * 60 * 60 * 24)) {
                    const theme = ThemeManager.getTheme();
                    ThemeManager.applyTheme(theme);
                }
            });
        }
        
        // Check for time-based theme changes every minute
        setInterval(() => {
            const savedThemeTime = localStorage.getItem('themeSetTime');
            if (!savedThemeTime || (Date.now() - parseInt(savedThemeTime)) > (1000 * 60 * 60 * 24)) {
                const theme = ThemeManager.getTheme();
                ThemeManager.applyTheme(theme);
            }
        }, 60000); // Check every minute
        
        // Mark body as loaded
        document.body.classList.add('loaded');
    },
    
    // Update deployment date from last-modified header
    updateDeploymentDate: async function() {
        const deploymentDateElement = document.getElementById('deployment-date');
        if (!deploymentDateElement) return;
        
        try {
            // Fetch the current page to get its last-modified header
            const response = await fetch(window.location.pathname, {
                method: 'HEAD'
            });
            
            const lastModified = response.headers.get('last-modified');
            if (lastModified) {
                const date = new Date(lastModified);
                deploymentDateElement.textContent = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            } else {
                // Fallback to configured deployment date
                deploymentDateElement.textContent = CONFIG.deploymentDate || 'December 2024';
            }
        } catch (error) {
            // If fetch fails, use fallback
            deploymentDateElement.textContent = CONFIG.deploymentDate || 'December 2024';
        }
    }
};

// Dropdown functionality
function toggleDropdown(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const dropdown = event.target.closest('.dropdown');
    const wasOpen = dropdown.classList.contains('show');
    
    // Close all dropdowns
    document.querySelectorAll('.dropdown.show').forEach(d => {
        d.classList.remove('show');
    });
    
    // Toggle clicked dropdown
    if (!wasOpen) {
        dropdown.classList.add('show');
    }
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown.show').forEach(d => {
            d.classList.remove('show');
        });
    }
});

// Touch event handling for mobile
let touchStartY = 0;
document.addEventListener('touchstart', (e) => {
    if (e.target.closest('.dropdown-toggle')) {
        touchStartY = e.touches[0].clientY;
    }
}, { passive: true });

document.addEventListener('touchend', (e) => {
    if (e.target.closest('.dropdown-toggle')) {
        const touchEndY = e.changedTouches[0].clientY;
        // Only toggle if it's a tap, not a scroll
        if (Math.abs(touchEndY - touchStartY) < 10) {
            e.preventDefault();
            toggleDropdown(e);
        }
    }
}, { passive: false });

// Global functions
window.toggleMode = function() {
    document.body.classList.toggle('dark-mode');
    const button = document.querySelector('.mode-toggle');
    const isDark = document.body.classList.contains('dark-mode');
    button.textContent = isDark ? 'L' : 'D';
    ThemeManager.saveTheme(isDark ? 'dark' : 'light');
};

window.scrollToTop = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    const button = document.querySelector('.mode-toggle');
    const backToTop = document.querySelector('.back-to-top');
    
    if (e.key === 'l' || e.key === 'L') {
        document.body.classList.remove('dark-mode');
        if (button) button.textContent = 'D';
        ThemeManager.saveTheme('light');
    } else if (e.key === 'd' || e.key === 'D') {
        document.body.classList.add('dark-mode');
        if (button) button.textContent = 'L';
        ThemeManager.saveTheme('dark');
    } else if ((e.key === 's' || e.key === 'S') && backToTop && backToTop.classList.contains('visible')) {
        scrollToTop();
    }
});

// Show/hide back to top button and post-it note
window.addEventListener('scroll', () => {
    const backToTop = document.querySelector('.back-to-top');
    const postIt = document.querySelector('.post-it');
    
    if (backToTop) {
        if (window.scrollY > 200) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
    
    if (postIt) {
        if (window.scrollY > 50) {
            postIt.classList.add('hidden');
        } else {
            postIt.classList.remove('hidden');
        }
    }
}, { passive: true });

// Listen for theme changes across tabs
window.addEventListener('storage', (e) => {
    if (e.key === 'theme') {
        const theme = e.newValue;
        if (theme) {
            ThemeManager.applyTheme(theme);
        }
    }
});