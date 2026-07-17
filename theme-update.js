const fs = require('fs');
const path = require('path');

const replacements = [
  // Gradients
  { regex: /linear-gradient\(135deg,#f59e0b,#d97706\)/g, replacement: "linear-gradient(135deg,#ef4444,#f97316)" },
  { regex: /linear-gradient\(135deg, #f59e0b, #d97706\)/g, replacement: "linear-gradient(135deg, #ef4444, #f97316)" },
  { regex: /linear-gradient\(135deg,#f59e0b,#fbbf24\)/g, replacement: "linear-gradient(135deg,#ef4444,#f97316)" },
  { regex: /linear-gradient\(135deg, #f59e0b, #fbbf24\)/g, replacement: "linear-gradient(135deg, #ef4444, #f97316)" },
  { regex: /linear-gradient\(90deg,#f59e0b,#fbbf24\)/g, replacement: "linear-gradient(90deg,#ef4444,#f97316)" },
  // Solid Hex (do this after gradients)
  { regex: /#f59e0b/ig, replacement: "#f97316" },
  // Tailwind Classes
  { regex: /from-amber-400 to-rose-400/g, replacement: "from-red-500 via-orange-500 to-amber-500" },
  { regex: /from-amber-500 to-orange-500/g, replacement: "from-red-600 to-orange-500" },
  { regex: /hover:from-amber-400 hover:to-orange-400/g, replacement: "hover:from-red-500 hover:to-orange-400" },
];

function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    // Skip node_modules, .git, .next
    if (entry.isDirectory()) {
      if (!['node_modules', '.git', '.next', 'public', '.gemini'].includes(entry.name)) {
        processDirectory(fullPath);
      }
    } else if (entry.isFile()) {
      if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let modified = false;

        for (const { regex, replacement } of replacements) {
          if (regex.test(content)) {
            content = content.replace(regex, replacement);
            modified = true;
          }
        }

        if (modified) {
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log(`Updated: ${fullPath}`);
        }
      }
    }
  }
}

processDirectory('d:\\churchwork');
console.log('Theme update complete.');
