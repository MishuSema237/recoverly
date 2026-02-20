const fs = require('fs');
const path = require('path');

const replacements = [
    { search: /Tesla Capital/g, replace: 'Recoverly' },
    { search: /red-600/g, replace: '[#c9933a]' },
    { search: /red-500/g, replace: '[#c9933a]' },
    { search: /red-700/g, replace: '[#b08132]' },
    { search: /red-800/g, replace: '[#b08132]' },
    { search: /bg-red-50/g, replace: 'bg-[#fdfcf0]' },
    { search: /text-red-700/g, replace: 'text-[#854d0e]' },
    { search: /tesla-capital-logo\.png/g, replace: 'RecoverlyLogo.png' }
];

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

walk('./src', (filePath) => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.css') || filePath.endsWith('.js')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        replacements.forEach(r => {
            content = content.replace(r.search, r.replace);
        });
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content);
            console.log(`Updated: ${filePath}`);
        }
    }
});
