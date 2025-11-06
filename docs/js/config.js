// Configuration for the Autophage Protocol Documentation
const CONFIG = {
    // Detect if we're on GitHub Pages or local
    isProduction: window.location.hostname.includes('github.io') || window.location.hostname.includes('statusdothealth'),
    
    nav: {
        main: [
            { label: 'Home', href: '' },
            { label: 'About', href: 'about' },
            { label: 'Litepaper', href: 'paper/litepaper.pdf', external: true, production: 'https://github.com/97115104//litepaper/blob/main/paper/litepaper.pdf' }
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
                { label: 'For Non-Technical Readers', href: 'non-technical' },
                { label: 'Complete Feature Set', href: 'features' },
                { label: 'Note from the Author', href: 'author-note' },
                { label: 'References', href: 'references' },
                { label: 'Acknowledgments', href: 'acknowledgments' },
                { label: 'Version History', href: 'versions' }
            ]
        }
    },
    siteName: 'Autophage Protocol',
    orgName: 'Health Protocol Labs',
    orgLink: 'about#research',
    copyright: 'Health Protocol Labs',
    // This should be updated with each deployment/release
    deploymentDate: 'December 2024'
};

// Helper to get base path for current page
function getBasePath() {
    const path = window.location.pathname;
    const depth = (path.match(/\//g) || []).length - 1;
    return '../'.repeat(Math.max(0, depth - 1)) || './';
}