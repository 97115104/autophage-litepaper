#!/usr/bin/env python3
"""
Fix all internal links to remove .html extensions
"""

import os
import re

def fix_html_links(directory):
    """Remove .html from all internal links in HTML files"""
    
    # Pattern to match href="something.html"
    # Excludes external links (http/https)
    pattern = r'href="([^"]*?)\.html"'
    
    # Get all HTML files
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                filepath = os.path.join(root, file)
                
                # Read the file
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Count replacements
                original_content = content
                
                # Replace all internal .html links
                def replace_link(match):
                    link = match.group(1)
                    # Skip external links
                    if link.startswith('http://') or link.startswith('https://'):
                        return match.group(0)
                    # Remove .html for internal links
                    return f'href="{link}"'
                
                content = re.sub(pattern, replace_link, content)
                
                # Only write if changes were made
                if content != original_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Fixed links in: {filepath}")

if __name__ == '__main__':
    # Run from the docs directory
    fix_html_links('.')
    print("Done! All internal .html links have been removed.")