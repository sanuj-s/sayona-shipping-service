import glob
html_files = glob.glob('*.html')

for f in html_files:
    with open(f, 'r') as file:
        content = file.read()
    
    # Replace all variations of the industries link
    content = content.replace('<a href="#industries">Industries</a>', '<a href="index.html#industries" class="nav-link">Industries</a>')
    
    # Also replace where it might already be index.html#industries but without class
    content = content.replace('<a href="index.html#industries">Industries</a>', '<a href="index.html#industries" class="nav-link">Industries</a>')

    with open(f, 'w') as file:
        file.write(content)
