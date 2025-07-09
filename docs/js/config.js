// Configuration for the Autophage Protocol Documentation
const CONFIG = {
    // Detect if we're on GitHub Pages or local
    isProduction: window.location.hostname.includes('github.io') || window.location.hostname.includes('statusdothealth'),
    
    nav: {
        main: [
            { label: 'Home', href: '' },
            { label: 'About', href: 'about' },
            { label: 'Litepaper', href: 'paper/litepaper.pdf', external: true, production: 'https://github.com/statusdothealth/litepaper/blob/main/paper/litepaper.pdf' }
        ],
        tools: {
            label: 'Tools',
            items: [
                { label: 'Simulations', href: 'simulations' },
                { label: 'Mathematical Reference', href: 'math' }
            ]
        },
        extras: {
            label: 'Extras',
            items: [
                { label: 'Plain Language Summary', href: 'plain-language' },
                { label: 'Use Cases', href: 'use-cases' },
                { label: 'Complete Feature Set', href: 'features' },
                { label: 'Extended Mathematics', href: 'extended-math' },
                { label: 'References', href: 'references' },
                { label: 'Note from the Author', href: 'author-note' },
                { label: 'Version History', href: 'versions' },
                { label: 'GitHub', href: 'https://github.com/statusdothealth/litepaper', external: true }
            ]
        }
    },
    siteName: 'Autophage Protocol Research',
    orgName: '0x42 Research',
    orgLink: 'about#research',
    copyright: '0x42 Research'
};

// Helper to get base path for current page
function getBasePath() {
    const path = window.location.pathname;
    const depth = (path.match(/\//g) || []).length - 1;
    return '../'.repeat(Math.max(0, depth - 1)) || './';
}