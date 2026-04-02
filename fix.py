import os
import glob

html_files = glob.glob('**/*.html', recursive=True)
css_files = glob.glob('**/*.css', recursive=True)

for fp in html_files:
    if 'node_modules' in fp or '.git' in fp or '.gemini' in fp:
        continue
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace('font-awesome/6.0.0/css/all.min.css', 'font-awesome/6.7.2/css/all.min.css')
    content = content.replace('fa-star-half-alt', 'fa-star-half-stroke')
    content = content.replace('fa-container-storage', 'fa-boxes-stacked')
    
    if '/' in fp: 
        depth = fp.count('/')
        prefix = '../' * depth
    else:
        prefix = ''
        
    content = content.replace('href="/privacy-policy.html"', f'href="{prefix}privacy-policy.html"')
    
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(content)

for fp in css_files:
    if 'node_modules' in fp or '.git' in fp or '.gemini' in fp:
        continue
    with open(fp, 'r', encoding='utf-8') as f:
        content = f.read()

    res = []
    i = 0
    while i < len(content):
        idx = content.find('@media (prefers-color-scheme: dark)', i)
        if idx == -1:
            res.append(content[i:])
            break
        
        res.append(content[i:idx])
        brace_idx = content.find('{', idx)
        if brace_idx == -1:
            break
        
        depth = 1
        curr = brace_idx + 1
        while curr < len(content) and depth > 0:
            if content[curr] == '{':
                depth += 1
            elif content[curr] == '}':
                depth -= 1
            curr += 1
            
        i = curr 

    new_content = ''.join(res)
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(new_content)

print("Done with automated replacements!")
