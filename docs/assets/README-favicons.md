# Favicon Assets

This directory contains all favicon and icon assets for the Autophage Protocol documentation website.

## Design

The favicon represents an academic paper document with:
- Cream-colored paper background (#fdfcf8)
- Pink/red margin line on the left (#ff6b6b)
- Bold "A" for Autophage at the top
- Gray text lines representing content
- Mathematical formula V=V₀e^λ
- Proper paper proportions (21x27 in 32x32 space)
- Transparent background

## Files

### Source
- `favicon-source.svg` - Master SVG design
- `favicon.svg` - Copy used by browsers that support SVG favicons

### PNG Icons
- `favicon-16x16.png` - Browser tab icon (small)
- `favicon-32x32.png` - Browser tab icon (standard)
- `favicon-48x48.png` - Browser bookmark icon
- `favicon.ico` - Legacy ICO format with multiple sizes

### Apple Touch Icons
- `apple-touch-icon.png` - Default 180x180
- `apple-touch-icon-57x57.png` - iPhone (non-Retina)
- `apple-touch-icon-60x60.png` - iPhone (non-Retina)
- `apple-touch-icon-72x72.png` - iPad (non-Retina)
- `apple-touch-icon-76x76.png` - iPad (non-Retina)
- `apple-touch-icon-114x114.png` - iPhone (Retina)
- `apple-touch-icon-120x120.png` - iPhone (Retina)
- `apple-touch-icon-144x144.png` - iPad (Retina)
- `apple-touch-icon-152x152.png` - iPad (Retina)
- `apple-touch-icon-180x180.png` - iPhone 6 Plus

### Android Chrome Icons
- `android-chrome-192x192.png` - Android home screen
- `android-chrome-512x512.png` - Android splash screen

### Microsoft Tiles
- `mstile-70x70.png` - Small tile
- `mstile-144x144.png` - Medium tile
- `mstile-150x150.png` - Medium tile
- `mstile-310x150.png` - Wide tile
- `mstile-310x310.png` - Large tile

### Configuration Files
- `site.webmanifest` - PWA manifest for Android/Chrome
- `browserconfig.xml` - Microsoft tile configuration

### Other
- `logo-paper.png` - Full-size logo (not a favicon)

## Generation

Icons were generated using librsvg and ImageMagick with:
- 2400 DPI rendering for maximum quality
- Lanczos filter for optimal downsampling
- Transparent backgrounds
- Proper color profiles

Generation script is located at: `/scripts/generate_high_quality_favicons.py`