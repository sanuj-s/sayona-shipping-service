"""
Batch HTML refactor for Sayona Shipping:
1. Replace hardcoded navbar + footer with component placeholders
2. Remove Poppins font references
3. Migrate inline styles to CSS classes (company.html, index.html, contact.html)
4. Fix services.html "30 Years" stat
"""
import re, os

PROJECT = '/Users/apple/Desktop/PROJECT-1'

# ─── Pages that get navbar/footer component injection ───
# Root pages (basePath = '')
ROOT_PAGES = [
    'services.html', 'company.html', 'contact.html',
    'tracking.html', 'privacy-policy.html', 'careers.html'
]

# Industry pages (basePath = '../')
INDUSTRY_PAGES = [
    'industries/textile.html', 'industries/hightech.html',
    'industries/pharma.html', 'industries/automotive.html',
    'industries/agri-products.html', 'industries/general-cargo.html'
]

def read(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

# ─── 1. Remove Poppins from pages that load it ───
def remove_poppins(content):
    # Remove the Poppins link tag (may span single or multi line)
    content = re.sub(
        r'\s*<link\s+href="https://fonts\.googleapis\.com/css2\?family=Poppins[^"]*"\s*\n?\s*rel="stylesheet"\s*>',
        '', content
    )
    content = re.sub(
        r'\s*<link\s+href="https://fonts\.googleapis\.com/css2\?family=Poppins[^"]*"\s+rel="stylesheet"\s*>',
        '', content
    )
    return content

# ─── 2. Extract and replace navbar ───
def replace_navbar(content, base_path):
    """Replace everything from top-bar through </nav> (closing of corporate-nav) with placeholder"""
    # For root pages: pattern starts with <!-- Top Utility Bar --> and ends after closing </nav> of corporate-nav
    # This is complex, so let me use a more targeted approach

    # Find the top-bar start
    top_bar_patterns = [
        r'(\s*<!-- Top Utility Bar -->)',
        r'(\s*<div class="top-bar">)',
    ]

    # Find where navbar ends - it's the </nav> that closes the corporate-nav
    # The structure is: top-bar div -> <nav class="navbar corporate-nav"> -> ... -> </nav>

    # For pages with top bar
    top_bar_match = re.search(r'(\s*)(?:<!-- Top Utility Bar -->\s*)?<div class="top-bar">', content)
    nav_match = re.search(r'<nav class="navbar corporate-nav">', content)

    if not nav_match:
        print(f"  WARNING: No corporate-nav found")
        return content

    # Find the start point (either top-bar or navbar)
    if top_bar_match and top_bar_match.start() < nav_match.start():
        start = top_bar_match.start()
    else:
        start = nav_match.start()

    # Find the end: we need to find the closing </nav> that matches the corporate-nav
    # The corporate-nav contains a nested <nav id="navMenu"> so we need to count nav tags
    pos = nav_match.start()
    depth = 0
    i = pos
    end = None
    while i < len(content):
        if content[i:i+4] == '<nav':
            depth += 1
        elif content[i:i+6] == '</nav>':
            depth -= 1
            if depth == 0:
                end = i + 6
                break
        i += 1

    if end is None:
        print(f"  WARNING: Could not find closing </nav>")
        return content

    # Build the replacement
    indent = '    '
    if base_path:
        replacement = f"""
{indent}<div id="navbar-placeholder"></div>
{indent}<script>window.SAYONA_BASE = '{base_path}';</script>
{indent}<script src="{base_path}components/navbar.js"></script>
"""
    else:
        replacement = f"""
{indent}<div id="navbar-placeholder"></div>
{indent}<script>window.SAYONA_BASE = '';</script>
{indent}<script src="components/navbar.js"></script>
"""

    content = content[:start] + replacement + content[end:]
    return content

# ─── 3. Extract and replace footer ───
def replace_footer(content, base_path):
    """Replace <footer class="footer">...</footer> with placeholder"""
    footer_match = re.search(r'<footer class="footer">', content)
    if not footer_match:
        print(f"  WARNING: No footer found")
        return content

    start = footer_match.start()
    end_match = content.find('</footer>', start)
    if end_match == -1:
        print(f"  WARNING: No closing </footer>")
        return content

    end = end_match + len('</footer>')

    indent = '    '
    if base_path:
        replacement = f"""{indent}<div id="footer-placeholder"></div>
{indent}<script src="{base_path}components/footer.js"></script>"""
    else:
        replacement = f"""{indent}<div id="footer-placeholder"></div>
{indent}<script src="components/footer.js"></script>"""

    content = content[:start] + replacement + content[end:]
    return content


# ─── Process root pages ───
for page in ROOT_PAGES:
    path = os.path.join(PROJECT, page)
    if not os.path.exists(path):
        print(f"SKIP (not found): {page}")
        continue
    print(f"Processing: {page}")
    content = read(path)
    content = remove_poppins(content)
    content = replace_navbar(content, '')
    content = replace_footer(content, '')
    write(path, content)
    print(f"  Done: {page}")

# ─── Process industry pages ───
for page in INDUSTRY_PAGES:
    path = os.path.join(PROJECT, page)
    if not os.path.exists(path):
        print(f"SKIP (not found): {page}")
        continue
    print(f"Processing: {page}")
    content = read(path)
    content = remove_poppins(content)
    content = replace_navbar(content, '../')
    content = replace_footer(content, '../')
    write(path, content)
    print(f"  Done: {page}")

# ─── index.html: special handling ───
# index.html has a unique navbar with hero — we replace it too,
# but keeping the hero the same since it's page-specific
print("\nProcessing: index.html (navbar + footer)")
idx_path = os.path.join(PROJECT, 'index.html')
idx = read(idx_path)
idx = replace_navbar(idx, '')
idx = replace_footer(idx, '')
write(idx_path, idx)
print("  Done: index.html")


# ─── Fix services.html "30 Years" stat ───
print("\nFixing: services.html 30 Years stat")
svc_path = os.path.join(PROJECT, 'services.html')
svc = read(svc_path)
svc = svc.replace(
    '<h2 class="counter stat-number" data-target="30">30</h2>\n                            <p class="stat-label">Years Experience</p>',
    '<h2 class="counter stat-number" data-target="500">500</h2>\n                            <p class="stat-label">Clients Served</p>'
)
write(svc_path, svc)
print("  Done: services.html stat fix")


print("\n=== All pages processed ===")
