#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

const copyEntries = [
    'css',
    'js',
    'images',
    'industries',
    'admin',
    'client',
    'public',
    'logo.png',
    'logo.jpg',
    'logo-symbol.png',
];

function existsAtRoot(relativePath) {
    return fs.existsSync(path.join(projectRoot, relativePath));
}

function copyEntry(relativePath) {
    const source = path.join(projectRoot, relativePath);
    const destination = path.join(distDir, relativePath);
    fs.cpSync(source, destination, { recursive: true });
}

function collectRootHtmlFiles() {
    return fs
        .readdirSync(projectRoot, { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
        .map((entry) => entry.name);
}

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

const rootHtmlFiles = collectRootHtmlFiles();
for (const htmlFile of rootHtmlFiles) {
    copyEntry(htmlFile);
}

for (const entry of copyEntries) {
    if (existsAtRoot(entry)) {
        copyEntry(entry);
    }
}

const copiedCount = rootHtmlFiles.length + copyEntries.filter(existsAtRoot).length;
console.log(`Static build complete. Copied ${copiedCount} entries into dist/.`);
