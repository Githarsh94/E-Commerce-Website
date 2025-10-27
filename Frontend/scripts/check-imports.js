const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'src');
const exts = ['.tsx', '.ts', '.jsx', '.js'];

function fileExists(p) {
  try {
    return fs.existsSync(p) && fs.statSync(p).isFile();
  } catch (e) { return false; }
}

function resolveImport(fromFile, importPath) {
  if (!importPath.startsWith('.')) return true; // ignore external modules
  const base = path.resolve(path.dirname(fromFile), importPath);
  // try file.ext
  for (const ext of exts) {
    if (fileExists(base + ext)) return true;
  }
  // try index files in folder
  for (const ext of exts) {
    if (fileExists(path.join(base, 'index' + ext))) return true;
  }
  return false;
}

function scanDir(dir) {
  const results = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results.push(...scanDir(full));
    } else if (stat.isFile() && /\.(tsx|ts|jsx|js)$/.test(item)) {
      results.push(full);
    }
  }
  return results;
}

const files = scanDir(root);
let missing = [];
const importRegex = /import\s+(?:[\s\S]+?)from\s+['"](.+?)['"]/g;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  let m;
  while ((m = importRegex.exec(content)) !== null) {
    const imp = m[1];
    if (!imp.startsWith('.')) continue;
    if (!resolveImport(file, imp)) {
      missing.push({ file: path.relative(root, file), import: imp });
    }
  }
}

if (missing.length === 0) {
  console.log('No unresolved relative imports found.');
  process.exit(0);
} else {
  console.log('Unresolved imports:');
  for (const mi of missing) {
    console.log(` - ${mi.file} -> ${mi.import}`);
  }
  process.exit(2);
}
