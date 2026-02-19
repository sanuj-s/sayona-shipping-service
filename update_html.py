import os
import glob

html_files = glob.glob('*.html')

new_css = '''    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/components.css">
    <link rel="stylesheet" href="css/animations.css">
    <link rel="stylesheet" href="css/responsive.css">'''

new_js = '''    <script src="js/main.js" defer></script>
    <script src="js/navbar.js" defer></script>
    <script src="js/loader.js" defer></script>
    <script src="js/scrollreveal.js" defer></script>
    <script src="js/counter.js" defer></script>
    <script src="js/progressbar.js" defer></script>'''

for f in html_files:
    with open(f, 'r') as file:
        content = file.read()
    
    # Replace CSS
    content = content.replace('    <link rel="stylesheet" href="css/style.css">', new_css)
    content = content.replace('  <link rel="stylesheet" href="css/style.css">', new_css)
    
    # Replace JS
    content = content.replace('    <script type="module" src="js/main.js"></script>', new_js)
    content = content.replace('  <script type="module" src="js/main.js"></script>', new_js)
    
    content = content.replace('    <script type="module" src="js/ui.js"></script>\n', '')
    content = content.replace('  <script type="module" src="js/ui.js"></script>\n', '')
    content = content.replace('<script type="module" src="js/ui.js"></script>\n', '')

    content = content.replace('type="module" src="js/data.js"', 'src="js/data.js" defer')
    content = content.replace('type="module" src="js/tracking.js"', 'src="js/tracking.js" defer')
    content = content.replace('type="module" src="js/contact.js"', 'src="js/contact.js" defer')

    with open(f, 'w') as file:
        file.write(content)
