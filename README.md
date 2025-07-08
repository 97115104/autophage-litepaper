# The Autophage Protocol Litepaper

This repository contains the litepaper for the Autophage Protocol, a decentralized health incentive system that implements metabolic economics.

## Overview

The Autophage Protocol introduces a revolutionary economic model where digital value decays over time, requiring continuous health activity for regeneration. Unlike traditional cryptocurrencies that can be hoarded indefinitely, Autophage tokens embody the fundamental patterns of biological life - they must be continuously earned through verified healthy behaviors.

## Key Features

- **Four Token Species**: Rhythm, Healing, Foundation, and Catalyst - each with different decay rates matching activity persistence
- **Metabolic Token Dynamics**: All tokens decay exponentially, preventing infinite accumulation
- **Privacy-First Architecture**: Zero-knowledge proofs separate identity from health data
- **Endogenous Price Discovery**: Value emerges from actual health activity energy costs
- **Empirical Governance**: Protocol upgrades require on-chain A/B testing with measurable results

## Repository Structure

### 📄 Core Documents
- `paper/litepaper.pdf` - The complete Autophage Protocol litepaper (PDF)
- `paper/litepaper.md` - Litepaper in Markdown format
- `paper/LaTeX/litepaper.tex` - LaTeX source file
- `paper/LaTeX/references.bib` - Bibliography

### 🌐 Interactive Website
The `docs/` directory contains an interactive website hosted on GitHub Pages:

- `docs/index.html` - Homepage with protocol overview
- `docs/simulations.html` - Interactive simulations (Gini coefficient, token decay, etc.)
- `docs/math.html` - Mathematical reference with all formulas
- `docs/plain-language.html` - Plain English summary for non-technical readers
- `docs/author-note.html` - Author's philosophical perspective
- `docs/about.html` - About the project and research group
- `docs/versions.html` - Version history and changelog
- `docs/references.html` - Complete bibliography
- `docs/features.html` - Comprehensive feature set and roadmap
- `docs/extended-math.html` - Extended mathematical appendix

### 📊 Supporting Materials
- `extras/math-appendix.md` - Complete mathematical formulas from the litepaper
- `extras/extended-math.md` - Additional mathematical proofs and derivations
- `extras/gini-simulation.py` - Python script for Gini coefficient simulations

### 🛠 Development Tools
- `cli/` - Command-line tools for simulations
  - `cli/simulations/tokenDecay.js` - Token decay simulation
  - `cli/simulations/reservoir.js` - Reservoir dynamics simulation

## Viewing the Documentation

### Online (Recommended)
Visit the interactive website at: [https://[username].github.io/litepaper/](https://[username].github.io/litepaper/)

### Local Development
1. Clone the repository
2. Open `docs/index.html` in a web browser
3. Or serve locally: `python -m http.server 8000` in the `docs/` directory

## Document Structure Guide

The litepaper is organized for different audiences:

- **Non-technical readers**: Start with Plain Language Summary (`docs/plain-language.html`)
- **Technical readers**: Mathematical Reference (`docs/math.html`) and Extended Mathematics (`docs/extended-math.html`)
- **Developers**: Interactive Simulations (`docs/simulations.html`) and Feature Set (`docs/features.html`)
- **Researchers**: Full PDF (`paper/litepaper.pdf`) and References (`docs/references.html`)

## About

**Organization**: 0x42 Research (Entropy Farms LLC)  
**Website**: [0x42.farm](https://0x42.farm)  
**Email**: research@0x42.farm

## Contributing

This is an active research project. For contributions, issues, or questions:
- Open an issue on GitHub
- Email research@0x42.farm
- Join our research community (coming soon)

## License

© 2025 0x42 Farm LLC. All rights reserved.

The Autophage Protocol is currently in the research phase. Implementation details and specifications may change as the protocol evolves.