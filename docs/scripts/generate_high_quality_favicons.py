#!/usr/bin/env python3
"""
Generate high-quality favicon formats from the logo-paper.svg file
"""

import os
import subprocess
import json

# Define the sizes needed for different favicon formats
FAVICON_SIZES = {
    # Standard favicon sizes
    'favicon-16x16.png': 16,
    'favicon-32x32.png': 32,
    'favicon-48x48.png': 48,
    
    # Apple touch icons
    'apple-touch-icon.png': 180,
    'apple-touch-icon-57x57.png': 57,
    'apple-touch-icon-60x60.png': 60,
    'apple-touch-icon-72x72.png': 72,
    'apple-touch-icon-76x76.png': 76,
    'apple-touch-icon-114x114.png': 114,
    'apple-touch-icon-120x120.png': 120,
    'apple-touch-icon-144x144.png': 144,
    'apple-touch-icon-152x152.png': 152,
    'apple-touch-icon-180x180.png': 180,
    
    # Android Chrome icons
    'android-chrome-192x192.png': 192,
    'android-chrome-512x512.png': 512,
    
    # Microsoft tiles
    'mstile-70x70.png': 70,
    'mstile-144x144.png': 144,
    'mstile-150x150.png': 150,
    'mstile-310x150.png': (310, 150),
    'mstile-310x310.png': 310,
}

def create_favicon_png_high_quality(input_svg, output_png, size):
    """Convert SVG to PNG at specified size with high quality settings"""
    if isinstance(size, tuple):
        width, height = size
        size_arg = f"{width}:{height}"
    else:
        width = height = size
        size_arg = f"{size}:{size}"
    
    # First, let's try using rsvg-convert for better SVG rendering
    # This provides better quality than ImageMagick for SVG files
    try:
        cmd = [
            'rsvg-convert',
            '-w', str(width),
            '-h', str(height),
            '-f', 'png',
            '-o', output_png,
            input_svg
        ]
        subprocess.run(cmd, check=True, capture_output=True)
        print(f"Created (rsvg): {output_png} ({width}x{height})")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        # If rsvg-convert is not available, fall back to ImageMagick with better settings
        pass
    
    # Use ImageMagick with ultra-high-quality settings and transparent background
    cmd = [
        'convert',
        '-background', 'transparent',
        '-density', '2400',  # Ultra-high density for perfect quality
        input_svg,
        '-colorspace', 'sRGB',
        '-resize', f"{width}x{height}!",  # Force exact size
        '-filter', 'Lanczos',  # Best downsampling filter
        '-sharpen', '0x0.5',  # Gentle sharpening
        '-quality', '100',  # Maximum quality
        '-define', 'png:compression-level=9',  # Best compression
        '-define', 'png:compression-strategy=1',
        '-define', 'png:exclude-chunk=all',
        '-strip',  # Remove metadata
        output_png
    ]
    
    try:
        subprocess.run(cmd, check=True, capture_output=True)
        print(f"Created (ImageMagick): {output_png} ({width}x{height})")
        
        # For larger sizes, apply additional optimization
        if width >= 144:
            optimize_cmd = [
                'convert',
                output_png,
                '-strip',  # Remove metadata
                '-interlace', 'none',
                '-colorspace', 'sRGB',
                '-quality', '100',
                output_png
            ]
            subprocess.run(optimize_cmd, check=True, capture_output=True)
            
    except subprocess.CalledProcessError as e:
        print(f"Error creating {output_png}: {e}")
        if e.stderr:
            print(f"Error output: {e.stderr.decode()}")
        return False
    except FileNotFoundError:
        print("ImageMagick (convert) not found. Please install it:")
        print("  macOS: brew install imagemagick")
        print("  Linux: sudo apt-get install imagemagick")
        return False
    
    return True

def create_ico_file_high_quality(png_files, output_ico):
    """Create ICO file from multiple PNG files with high quality"""
    # Sort PNG files by size (ICO format works better this way)
    sorted_files = sorted(png_files, key=lambda x: int(x.split('-')[1].split('x')[0]))
    
    cmd = ['convert'] + sorted_files + [
        '-colorspace', 'sRGB',
        '-compress', 'none',
        output_ico
    ]
    
    try:
        subprocess.run(cmd, check=True, capture_output=True)
        print(f"Created: {output_ico}")
    except subprocess.CalledProcessError as e:
        print(f"Error creating {output_ico}: {e}")

def preprocess_svg(input_svg, output_svg):
    """Preprocess SVG to ensure better rendering"""
    with open(input_svg, 'r') as f:
        svg_content = f.read()
    
    # Add white background rect if not present
    if 'background' not in svg_content:
        # Insert a white background rect after the opening svg tag
        svg_content = svg_content.replace(
            '<svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">',
            '<svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">\n  <rect x="0" y="0" width="200" height="260" fill="white"/>'
        )
    
    with open(output_svg, 'w') as f:
        f.write(svg_content)

def check_dependencies():
    """Check if required tools are installed"""
    tools = {
        'ImageMagick': ['convert', '--version'],
        'librsvg (optional, for better quality)': ['rsvg-convert', '--version']
    }
    
    print("Checking dependencies...")
    for tool_name, cmd in tools.items():
        try:
            subprocess.run(cmd, capture_output=True, check=True)
            print(f"✓ {tool_name} is installed")
        except FileNotFoundError:
            if 'optional' in tool_name:
                print(f"⚠ {tool_name} is not installed (will use fallback)")
            else:
                print(f"✗ {tool_name} is not installed")
                return False
    return True

def main():
    # Check dependencies
    if not check_dependencies():
        print("\nPlease install the required dependencies:")
        print("  macOS: brew install imagemagick librsvg")
        print("  Linux: sudo apt-get install imagemagick librsvg2-bin")
        return
    
    # Use the favicon-final.svg from docs directory
    input_svg = '/Users/x97115104/Documents/Projects/biz/litepaper/docs/favicon-final.svg'
    if not os.path.exists(input_svg):
        print(f"Error: {input_svg} not found!")
        return
    
    # Change to assets directory for output
    os.chdir('assets')
    
    print(f"\nGenerating high-quality favicons from {input_svg}...")
    
    # Copy the original SVG as favicon.svg
    os.system(f'cp "{input_svg}" favicon.svg')
    print("Created: favicon.svg")
    
    # Generate all PNG sizes
    png_files_for_ico = []
    for filename, size in FAVICON_SIZES.items():
        if create_favicon_png_high_quality(input_svg, filename, size):
            if filename.startswith('favicon-') and filename.endswith('.png'):
                png_files_for_ico.append(filename)
    
    # Create ICO file with multiple sizes
    if png_files_for_ico:
        create_ico_file_high_quality(png_files_for_ico, 'favicon.ico')
    
    # Optimize PNGs with optipng if available
    try:
        print("\nOptimizing PNG files...")
        for filename in FAVICON_SIZES.keys():
            if os.path.exists(filename):
                subprocess.run(['optipng', '-o7', filename], capture_output=True)
        print("PNG optimization complete")
    except FileNotFoundError:
        print("optipng not found, skipping PNG optimization")
        print("Install with: brew install optipng (macOS) or apt-get install optipng (Linux)")
    
    print("\nHigh-quality favicon generation complete!")
    
    # Show file sizes
    print("\nGenerated file sizes:")
    for filename in sorted(FAVICON_SIZES.keys()):
        if os.path.exists(filename):
            size = os.path.getsize(filename)
            print(f"  {filename}: {size:,} bytes")

if __name__ == '__main__':
    main()