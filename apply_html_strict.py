import glob
import re

html_files = glob.glob('*.html')

new_js = """<script src="https://unpkg.com/scrollreveal"></script>

    <script src="js/navbar.js"></script>
    <script src="js/loader.js"></script>
    <script src="js/scrollreveal.js"></script>
    <script src="js/counter.js"></script>
    <script src="js/progressbar.js"></script>
    <script src="js/main.js"></script>"""

old_js_pattern = re.compile(r'<script.*?>.*?</script>', re.DOTALL)
loader_progress_pattern = re.compile(r'(<div id="loader">.*?</div>.*?)(<div id="progress-bar"></div>|<div class="scroll-progress-bar" id="scrollProgress"></div>)', re.DOTALL)

for f in html_files:
    with open(f, 'r') as file:
        content = file.read()
    
    # Remove old scrollreveal from head if exists
    content = content.replace('<script src="https://unpkg.com/scrollreveal"></script>', '')
    
    # Replace old scripts with new ones before </body>
    # We will find the last index of </body> and insert before it
    
    # First, strip all custom scripts at the bottom
    content = re.sub(r'<script src="js/.*?></script>', '', content)
    
    # Insert new js before </body>
    content = content.replace('</body>', new_js + '\n</body>')
    
    # Replace scrollProgress with progress-bar
    content = content.replace('<div class="scroll-progress-bar" id="scrollProgress"></div>', '')
    content = content.replace('<div id="progress-bar"></div>', '')
    
    # Make sure we have the required loader and progress bar exactly as requested
    
    # Let's just insert them right after <body>
    body_idx = content.find('<body>') + 6
    
    # Remove existing loader
    content = re.sub(r'<div id="loader">.*?</div>', '', content, flags=re.DOTALL)
    
    loader_html = """
    <div id="loader">
      <div class="spinner"></div>
    </div>
    <div id="progress-bar"></div>
"""
    content = content[:body_idx] + loader_html + content[body_idx:]
    
    # Clean up multiple empty lines
    content = re.sub(r'\n\s*\n\s*\n', '\\n\\n', content)
    
    with open(f, 'w') as file:
        file.write(content)
