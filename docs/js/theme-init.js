// Prevent dark mode flash - this runs immediately
(function() {
    // Get theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // Determine if dark mode should be active
    let shouldBeDark = false;
    
    if (savedTheme) {
        // User has explicitly set a theme
        shouldBeDark = savedTheme === 'dark';
    } else {
        // Check time of day (7 PM to 6 AM)
        const hour = new Date().getHours();
        const isNightTime = hour >= 19 || hour < 6;
        
        // Check system preference
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Use night time or system preference
        shouldBeDark = isNightTime || prefersDark;
    }
    
    // Apply dark mode class to HTML element to prevent flash
    if (shouldBeDark) {
        document.documentElement.classList.add('dark-mode-init');
    }
})();