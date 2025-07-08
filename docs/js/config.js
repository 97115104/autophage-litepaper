// Configuration for the Autophage Protocol Documentation
const CONFIG = {
    // Detect if we're on GitHub Pages or local
    isProduction: window.location.hostname.includes('github.io') || window.location.hostname.includes('statusdothealth'),
    
    nav: {
        main: [
            { label: 'Home', href: 'index.html' },
            { label: 'About', href: 'about.html' },
            { label: 'Litepaper', href: 'paper/litepaper.pdf', external: true, production: 'https://github.com/statusdothealth/litepaper/blob/main/paper/litepaper.pdf' }
        ],
        tools: {
            label: 'Tools',
            items: [
                { label: 'Interactive Simulations', href: 'simulations.html' },
                { label: 'Mathematical Reference', href: 'math.html' }
            ]
        },
        extras: {
            label: 'Extras',
            items: [
                { label: 'Plain Language Summary', href: 'plain-language.html' },
                { label: 'Use Cases', href: 'use-cases.html' },
                { label: 'Complete Feature Set', href: 'features.html' },
                { label: 'Extended Mathematics', href: 'extended-math.html' },
                { label: 'References', href: 'references.html' },
                { label: 'Version History', href: 'versions.html' },
                { label: 'Note from the Author', href: 'author-note.html' },
                { label: 'GitHub', href: 'https://github.com/statusdothealth/litepaper', external: true }
            ]
        }
    },
    siteName: 'Autophage Protocol Research',
    orgName: '0x42 Research',
    orgLink: 'about.html#research',
    copyright: '0x42 Farm LLC'
};

// Helper to get base path for current page
function getBasePath() {
    const path = window.location.pathname;
    const depth = (path.match(/\//g) || []).length - 1;
    return '../'.repeat(Math.max(0, depth - 1)) || './';
}