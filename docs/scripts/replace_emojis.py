#!/usr/bin/env python3
"""Replace all emojis with SVG icon references."""

import os
import re
from pathlib import Path

# Define emoji to SVG icon mappings
EMOJI_REPLACEMENTS = {
    '📄': '<svg class="icon icon-inline"><use href="assets/icons.svg#icon-document"></use></svg>',
    '⭐': '<svg class="icon icon-inline"><use href="assets/icons.svg#icon-star"></use></svg>',
    '❌': '<svg class="icon icon-inline icon-error"><use href="assets/icons.svg#icon-x-red"></use></svg>',
    '✅': '<svg class="icon icon-inline icon-success"><use href="assets/icons.svg#icon-check-green"></use></svg>',
    '✓': '<svg class="icon icon-inline"><use href="assets/icons.svg#icon-check"></use></svg>',
    '✗': '<svg class="icon icon-inline"><use href="assets/icons.svg#icon-x"></use></svg>',
    '⚠️': '<svg class="icon icon-inline icon-warning"><use href="assets/icons.svg#icon-warning"></use></svg>',
    '🎮': '<svg class="icon icon-inline"><use href="assets/icons.svg#icon-game"></use></svg>',
    '📊': '<svg class="icon icon-inline"><use href="assets/icons.svg#icon-chart"></use></svg>',
    '⚔️': '<svg class="icon icon-inline"><use href="assets/icons.svg#icon-swords"></use></svg>',
    '🐍': '<svg class="icon icon-inline"><use href="assets/icons.svg#icon-snake"></use></svg>',
    '💰': '<svg class="icon icon-inline"><use href="assets/icons.svg#icon-money"></use></svg>',
    '⛽': '<svg class="icon icon-inline"><use href="assets/icons.svg#icon-fuel"></use></svg>',
    '🪙': '<svg class="icon icon-inline"><use href="assets/icons.svg#icon-coin"></use></svg>',
    '🏛️': '<svg class="icon icon-inline"><use href="assets/icons.svg#icon-building"></use></svg>',
    '🔐': '<svg class="icon icon-inline"><use href="assets/icons.svg#icon-lock"></use></svg>',
    '🗳️': '<svg class="icon icon-inline"><use href="assets/icons.svg#icon-ballot"></use></svg>',
}

# Special replacements for contract icons (larger size)
CONTRACT_ICON_REPLACEMENTS = {
    '🪙': '<svg class="icon"><use href="assets/icons.svg#icon-coin"></use></svg>',
    '🏛️': '<svg class="icon"><use href="assets/icons.svg#icon-building"></use></svg>',
    '🔐': '<svg class="icon"><use href="assets/icons.svg#icon-lock"></use></svg>',
    '🗳️': '<svg class="icon"><use href="assets/icons.svg#icon-ballot"></use></svg>',
}

def get_icon_path_prefix(file_path):
    """Calculate the correct relative path to assets/icons.svg based on file location."""
    # Get the depth of the file relative to docs root
    rel_path = os.path.relpath(file_path, '/Users/x97115104/Documents/Projects/biz/litepaper/docs')
    depth = len(Path(rel_path).parts) - 1
    
    if depth == 0:
        return 'assets/icons.svg'
    else:
        return '../' * depth + 'assets/icons.svg'

def replace_emojis_in_file(file_path):
    """Replace emojis in a single file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return False
    
    original_content = content
    icon_path = get_icon_path_prefix(file_path)
    
    # Check if this is the smart-contracts.html file for special handling
    is_smart_contracts = file_path.endswith('smart-contracts.html')
    
    # Replace emojis
    for emoji, svg in EMOJI_REPLACEMENTS.items():
        # Adjust the SVG path
        adjusted_svg = svg.replace('assets/icons.svg', icon_path)
        
        # For contract icons in smart-contracts.html, use larger icons
        if is_smart_contracts and emoji in CONTRACT_ICON_REPLACEMENTS:
            adjusted_svg = CONTRACT_ICON_REPLACEMENTS[emoji].replace('assets/icons.svg', icon_path)
        
        content = content.replace(emoji, adjusted_svg)
    
    # Only write if content changed
    if content != original_content:
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated: {file_path}")
            return True
        except Exception as e:
            print(f"Error writing {file_path}: {e}")
            return False
    
    return False

def main():
    """Process all HTML and JS files."""
    docs_dir = Path('/Users/x97115104/Documents/Projects/biz/litepaper/docs')
    updated_count = 0
    
    # Process HTML files
    for html_file in docs_dir.rglob('*.html'):
        if replace_emojis_in_file(str(html_file)):
            updated_count += 1
    
    # Process JS files
    for js_file in docs_dir.rglob('*.js'):
        if replace_emojis_in_file(str(js_file)):
            updated_count += 1
    
    print(f"\nTotal files updated: {updated_count}")

if __name__ == '__main__':
    main()