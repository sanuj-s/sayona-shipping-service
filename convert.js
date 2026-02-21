const fs = require('fs');

function htmlToJsx(html) {
    let jsx = html;

    // Extract everything inside <div id="app">
    let bodyMatch = jsx.match(/<div id="app">([\s\S]*?)<\/div>\s*<!-- Scroll Progress Bar -->/);
    if (bodyMatch) {
        jsx = bodyMatch[1];
    } else {
        bodyMatch = jsx.match(/<body>([\s\S]*?)<\/body>/);
        if (bodyMatch) jsx = bodyMatch[1];
    }

    // Basic replacements
    jsx = jsx.replace(/class="/g, 'className="');
    jsx = jsx.replace(/for="/g, 'htmlFor="');
    jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');

    // Self-closing tags (safe simple regex)
    jsx = jsx.replace(/<img([^>]*)>/gi, (match, p1) => {
        if (p1.endsWith('/')) return match;
        return `<img${p1} />`;
    });

    jsx = jsx.replace(/<input([^>]*)>/gi, (match, p1) => {
        if (p1.endsWith('/')) return match;
        return `<input${p1} />`;
    });

    jsx = jsx.replace(/<br\s*>/gi, '<br />');
    jsx = jsx.replace(/<hr\s*>/gi, '<hr />');

    // Styles specific replacements to camelCase object
    jsx = jsx.replace(/style="background: #f8fafc; padding: 80px 0;"/g, 'style={{background: "#f8fafc", padding: "80px 0"}}');
    jsx = jsx.replace(/style="text-align: center; max-width: 600px; margin: 0 auto 3rem; color: var\(--text-secondary\);"/g, 'style={{textAlign: "center", maxWidth: "600px", margin: "0 auto 3rem", color: "var(--text-secondary)"}}');
    jsx = jsx.replace(/style="width: 60%;"/g, 'style={{width: "60%"}}');
    jsx = jsx.replace(/style="max-width: 600px;"/g, 'style={{maxWidth: "600px"}}');
    jsx = jsx.replace(/style="width: 100%;"/g, 'style={{width: "100%"}}');
    jsx = jsx.replace(/style="display:none;"/g, 'style={{display: "none"}}');
    jsx = jsx.replace(/style="padding: 100px 0;"/g, 'style={{padding: "100px 0"}}');
    jsx = jsx.replace(/style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start;"/g, 'style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "start"}}');
    jsx = jsx.replace(/style="width: 100%; border-radius: 12px; box-shadow: 0 20px 40px rgba\(0,0,0,0.15\); margin-bottom: 30px;"/g, 'style={{width: "100%", borderRadius: "12px", boxShadow: "0 20px 40px rgba(0,0,0,0.15)", marginBottom: "30px"}}');
    jsx = jsx.replace(/style="max-width: 100%;"/g, 'style={{maxWidth: "100%"}}');
    jsx = jsx.replace(/style="appearance: none;"/g, 'style={{appearance: "none"}}');
    jsx = jsx.replace(/style="min-width: 200px;"/g, 'style={{minWidth: "200px"}}');
    jsx = jsx.replace(/style="border:0;"/g, 'style={{border: 0}}');

    // Fix unclosed tags like <link>, <meta> if they ended up inside the jsx body
    jsx = jsx.replace(/<link([^>]*)>/gi, (match, p1) => {
        if (p1.endsWith('/')) return match;
        return `<link${p1} />`;
    });
    jsx = jsx.replace(/<meta([^>]*)>/gi, (match, p1) => {
        if (p1.endsWith('/')) return match;
        return `<meta${p1} />`;
    });

    // Fix iframe attributes
    jsx = jsx.replace(/allowfullscreen=""/g, 'allowFullScreen');
    jsx = jsx.replace(/referrerpolicy="/g, 'referrerPolicy="');

    return jsx;
}

const pages = [
    { in: 'index.html', out: 'pages/Home.jsx', name: 'Home' },
    { in: 'tracking.html', out: 'pages/Tracking.jsx', name: 'Tracking' },
    { in: 'services.html', out: 'pages/Services.jsx', name: 'Services' },
    { in: 'contact.html', out: 'pages/Contact.jsx', name: 'Contact' }
];

if (!fs.existsSync('pages')) {
    fs.mkdirSync('pages');
}

for (const p of pages) {
    if (fs.existsSync(p.in)) {
        const html = fs.readFileSync(p.in, 'utf-8');
        const jsx = htmlToJsx(html);
        const template = `export default function ${p.name}() {\n  return (\n    <>\n${jsx}\n    </>\n  );\n}\n`;
        fs.writeFileSync(p.out, template);
        console.log(`Created ${p.out}`);
    } else {
        console.log(`File not found: ${p.in}`);
    }
}
