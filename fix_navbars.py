import re
import glob

html_files = glob.glob("*.html")

for file in html_files:
    with open(file, "r") as f:
        html = f.read()
    
    # Add class="navbar" to the main <header> tag
    html = re.sub(r'<header>', '<header class="navbar">', html, count=1)
    
    with open(file, "w") as f:
        f.write(html)

print("Navbars updated.")
