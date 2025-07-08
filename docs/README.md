# Autophage Protocol Documentation

This is the documentation website for the Autophage Protocol.

## Local Development

To test the site locally:

```bash
# Navigate to the docs directory
cd docs

# Run the Python server
python3 serve.py
# or
./serve.py
```

The site will open automatically at http://localhost:8000

### Alternative: Using Python's built-in server

```bash
# From the docs directory
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser.

### Alternative: Using Node.js

If you have Node.js installed:

```bash
# Install http-server globally (one time)
npm install -g http-server

# From the docs directory
http-server -p 8000
```

## GitHub Pages Deployment

The site is designed to be hosted on GitHub Pages. When deployed:

1. Enable GitHub Pages in repository settings
2. Set source to `/docs` folder on `main` branch
3. The site will be available at `https://[username].github.io/litepaper/`

The navigation automatically detects GitHub Pages deployment and adjusts PDF links accordingly.

## File Structure

```
docs/
├── index.html              # Homepage
├── about.html              # About the protocol and research
├── simulations.html        # Interactive simulations
├── math.html               # Mathematical reference
├── plain-language.html     # Plain language summary
├── author-note.html        # Note from the author
├── versions.html           # Version history
├── references.html         # Bibliography
├── features.html           # Complete feature set
├── extended-math.html      # Extended mathematics
├── template.html           # Template for new pages
├── css/
│   └── main.css           # Main stylesheet
├── js/
│   ├── config.js          # Navigation configuration
│   ├── components.js      # Reusable components
│   ├── main.js            # Simulation scripts
│   └── loading-reveal.js  # Homepage loading animation
├── paper/                  # Symlink to ../paper (for local testing)
└── manifest.json          # PWA manifest
```

## Navigation Configuration

Edit `js/config.js` to update navigation items across all pages.