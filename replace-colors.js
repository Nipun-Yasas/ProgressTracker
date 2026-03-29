const fs = require('fs');
const path = require('path');

const walk = (dir, fileList = []) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.next' || file === '.git') continue;
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            walk(filepath, fileList);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            fileList.push(filepath);
        }
    }
    return fileList;
};

const map = {
    // Backgrounds
    'bg-zinc-950': 'bg-background',
    'bg-zinc-950/50': 'bg-background/50',
    'bg-zinc-950/80': 'bg-background/80',
    'bg-zinc-950/95': 'bg-background/95',
    'bg-zinc-900': 'bg-backgroundSecondary',
    'bg-zinc-900/95': 'bg-backgroundSecondary/95',
    'bg-zinc-800': 'bg-hoverPrimary',
    'bg-zinc-800/20': 'bg-hoverPrimary/20',
    'bg-zinc-800/50': 'bg-hoverPrimary/50',
    'hover:bg-zinc-800': 'hover:bg-hoverPrimary',
    'hover:bg-zinc-700': 'hover:bg-hoverPrimary',

    // Primary Colors Background
    'bg-emerald-600': 'bg-primary',
    'bg-emerald-500': 'bg-primary',
    'bg-emerald-500/10': 'bg-primary/10',
    'hover:bg-emerald-500': 'hover:bg-hover',
    'hover:bg-emerald-500/20': 'hover:bg-hover/20',
    'bg-emerald-400/10': 'bg-primary/10',
    'hover:bg-emerald-400/20': 'hover:bg-hover/20',
    'bg-emerald-500/30': 'bg-primary/30',

    // Text Colors
    'text-white': 'text-btnHoverText',
    'text-zinc-100': 'text-textPrimary',
    'text-zinc-200': 'text-textPrimary',
    'text-zinc-300': 'text-textPrimary',
    'text-zinc-400': 'text-textSecondary',
    'text-zinc-500': 'text-textSecondary',
    'hover:text-white': 'hover:text-textPrimary',

    // Primary Text
    'text-emerald-400': 'text-primary',
    'text-emerald-500': 'text-primary',
    'text-emerald-600': 'text-primary',

    // Borders
    'border-zinc-800': 'border-borderPrimary',
    'border-zinc-800/50': 'border-borderPrimary/50',
    'border-zinc-700': 'border-borderPrimary',
    'border-zinc-900': 'border-borderPrimary',
    'border-emerald-500': 'border-primary',
    'border-emerald-400/20': 'border-primary/20',
    'border-emerald-500/20': 'border-primary/20',

    // Ring
    'focus:ring-emerald-500/50': 'focus:ring-primary/50',
    'focus:border-emerald-500': 'focus:border-primary',
    
    // Selection
    'selection:bg-emerald-500/30': 'selection:bg-primary/30',
};

const regexStr = Object.keys(map).map(k => k.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('|');
const regex = new RegExp(`(?<=['"\\s\`])(${regexStr})(?=['"\\s\`]|$)`, 'g');

const files = walk('.');

let changedFiles = 0;
for (const file of files) {
    const original = fs.readFileSync(file, 'utf8');
    let content = original;
    // Replace whole words that match
    content = content.replace(regex, (match) => {
        return map[match] || match;
    });

    if (original !== content) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
        changedFiles++;
    }
}
console.log(`Updated \${changedFiles} files`);
