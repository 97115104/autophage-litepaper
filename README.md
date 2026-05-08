# The Autophage Protocol Litepaper

This repository contains the complete litepaper for the Autophage Protocol, a decentralized health incentive system that implements metabolic economics through value decay and biological scaling laws.

## Overview

The Autophage Protocol introduces a revolutionary economic model where digital value decays over time, requiring continuous health activity for regeneration. Unlike traditional cryptocurrencies that can be hoarded indefinitely, Autophage tokens embody the fundamental patterns of biological life - they must be continuously earned through verified healthy behaviors. Traditional money persists indefinitely, creating economies where wealth concentrates among those who already possess it. The Autophage Protocol introduces money that decays, transforming economics from a system of accumulation to one of circulation.

## Key Features

- **Four Token Species**: Rhythm (exercise), Healing (therapy), Foundation (preventive care), and Catalyst (ecosystem balance) - each with different decay rates matching activity persistence
- **Metabolic Token Dynamics**: All tokens decay exponentially at biologically-calibrated rates, preventing infinite accumulation
- **Privacy-First Architecture**: Zero-knowledge proofs separate identity from health data while enabling verification
- **Biological Scaling Laws**: Network effects follow Kleiber's Law, bottlenecks trigger Liebig's Law rebalancing, small communities benefit from Allee Effect multipliers
- **Genetic Traits System**: Users evolve permanent earning multipliers by burning Foundation tokens
- **Wellness Vaults**: Targeted saving with reduced decay rates for locked tokens
- **Empirical Governance**: Protocol upgrades require on-chain A/B testing with measurable health improvements

## Repository Structure

### 📄 Core Documents
- [`paper/litepaper.pdf`](paper/litepaper.pdf) - The complete Autophage Protocol litepaper (PDF)
- [`paper/litepaper.md`](paper/litepaper.md) - Litepaper in Markdown format
- [`paper/LaTeX/litepaper.tex`](paper/LaTeX/litepaper.tex) - LaTeX source file
- [`paper/LaTeX/references.bib`](paper/LaTeX/references.bib) - Complete bibliography

### 🌐 Interactive Documentation Website
The [`docs/`](docs/) directory contains a comprehensive interactive website with dark/light mode:

**Main Pages:**
- [`docs/index.html`](docs/index.html) - Homepage with protocol overview and key concepts
- [`docs/plain-language.html`](docs/plain-language.html) - Plain English summary for non-technical readers
- [`docs/about.html`](docs/about.html) - About the project, research group, and contact information
- [`docs/author-note.html`](docs/author-note.html) - Author's philosophical perspective with personalized greeting

**Technical Documentation:**
- [`docs/math.html`](docs/math.html) - Mathematical reference with all core formulas
- [`docs/extended-math.html`](docs/extended-math.html) - Extended mathematical appendix with proofs
- [`docs/features.html`](docs/features.html) - Complete feature set, implementation roadmap, and technical specifications
- [`docs/simulations.html`](docs/simulations.html) - Interactive simulations (Gini coefficient, token decay, network effects)

**Reference Materials:**
- [`docs/references.html`](docs/references.html) - Complete bibliography with links
- [`docs/versions.html`](docs/versions.html) - Version history and detailed changelog
- [`docs/use-cases.html`](docs/use-cases.html) - Detailed use cases and character stories

### 📊 Research & Analysis Tools
- [`extras/math-appendix.md`](extras/math-appendix.md) - Complete mathematical formulas from the litepaper
- [`extras/extended-math.md`](extras/extended-math.md) - Additional mathematical proofs and derivations
- [`extras/gini-simulation.py`](extras/gini-simulation.py) - **Python script for Gini coefficient simulations** with wealth distribution analysis

### 🛠 Development Tools & Simulations
- [`cli/`](cli/) - Command-line tools and Node.js simulations
  - [`cli/simulations/tokenDecay.js`](cli/simulations/tokenDecay.js) - Token decay simulation engine
  - [`cli/simulations/reservoir.js`](cli/simulations/reservoir.js) - Reservoir dynamics and flow simulation
  - [`cli/package.json`](cli/package.json) - Node.js dependencies and scripts

### 🎨 Assets & Configuration
- [`docs/assets/logo.svg`](docs/assets/logo.svg) - Protocol logo and branding
- [`docs/js/`](docs/js/) - Interactive website JavaScript (theme management, components, simulations)
- [`docs/css/`](docs/css/) - Stylesheets with LaTeX-inspired typography and responsive design

## Viewing the Documentation

### Online (Recommended)
Visit the live interactive website at: **[https://97115104.github.io/autophage-litepaper/](https://97115104.github.io/autophage-litepaper/)**

### Local Development
1. Clone the repository: `git clone https://github.com/97115104//litepaper.git`
2. Navigate to docs: `cd litepaper/docs`
3. Serve locally: 
   - Python: `python -m http.server 8000`
   - Node.js: `npx serve .`
   - Or open `docs/index.html` directly in a web browser

### Running Simulations
**Gini Coefficient Analysis:**
```bash
cd extras
python gini-simulation.py
```

**Token Decay Simulations:**
```bash
cd cli
npm install
npm run simulate:decay
npm run simulate:reservoir
```

## Document Navigation Guide

The documentation is organized for different audiences:

- **🚀 Quick Start**: [Plain Language Summary](docs/plain-language.html) - Understand the protocol in 5 minutes
- **👥 Non-technical**: [Use Cases](docs/use-cases.html) and [Features](docs/features.html) - Real-world applications
- **🔬 Technical**: [Mathematical Reference](docs/math.html) and [Extended Math](docs/extended-math.html) - Complete formulas and proofs
- **💻 Developers**: [Interactive Simulations](docs/simulations.html) and [CLI Tools](cli/) - Implementation tools
- **📚 Researchers**: [Full PDF](paper/litepaper.pdf), [References](docs/references.html), and [Gini Simulation](extras/gini-simulation.py)

## Key Links & Resources

**Protocol Resources:**
- 📄 [Complete Litepaper PDF](paper/litepaper.pdf)
- 🌐 [Interactive Website](https://97115104.github.io/autophage-litepaper/)
- 🧮 [Mathematical Appendix](https://97115104.github.io/autophage-litepaper/math)
- 📊 [Live Simulations](docs/simulations.html)

**Research & Analysis:**
- 📈 [Gini Coefficient Simulation Script](https://97115104.github.io/autophage-litepaper/simulations) | [Local](extras/gini-simulation.py)
- 🔬 [Extended Mathematical Proofs](docs/extended-math.html)
- 📝 [Patent Application](https://hsc.97115104.com/patents/1) - System and Method for Privacy-Preserving Health Incentives

**Development:**
- 💻 [GitHub Repository](https://github.com/97115104//litepaper)
- 🛠 [CLI Simulation Tools](cli/)
- ⚙️ [Technical Specifications](docs/features.html)

## About the Research

**Organization**: Happy Stack Calculus  
**Website**: [Happy Stack Calculus](hsc.97115104.com)  
**Protocol Website**: [https://97115104.github.io/autophage-litepaper/](https://97115104.github.io/autophage-litepaper/)  
**Email**: info@97115104.com  
**Author**: Austin Harshberger

The Autophage Protocol represents a fundamental reimagining of economic systems, applying biological principles to create sustainable, health-focused value networks. The research combines cryptographic privacy preservation, mathematical modeling of biological systems, and empirical governance mechanisms to create an economy that rewards activity over accumulation.

## Contributing

This is an active research project welcoming collaboration:

- 🐛 **Issues**: Open GitHub issues for bugs, suggestions, or questions
- 📧 **Research**: Email info@97115104.com for academic collaboration
- 💡 **Ideas**: Join discussions about protocol improvements and implementations
- 🔬 **Simulations**: Contribute analysis tools and mathematical models

## Citation

```bibtex
@misc{harshberger2025autophage,
  author = {Harshberger, Austin},
  title = {The Autophage Protocol: Metabolic Economics Through Value Decay},
  year = {2025},
  howpublished = {\url{https://97115104.github.io/autophage-litepaper/}},
  note = {Happy Stack Calculus}
}
```

## License

This project is licensed under the Apache License, Version 2.0 - see the [LICENSE](LICENSE) file for details.

© 2025 Happy Stack Calculus. The Autophage Protocol litepaper and associated materials are released under Apache 2.0, providing a balance of openness and flexibility for both academic and commercial use.

The Autophage Protocol is currently in the research and development phase. Implementation details and specifications may evolve as the protocol matures toward production deployment.
