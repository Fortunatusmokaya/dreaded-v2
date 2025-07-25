const express = require('express');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const REPO = 'https://github.com/Fortunatusmokaya/botfiles-v2.git';
const DIR = path.join(__dirname, 'bot');

function exec(cmd, cwd = process.cwd()) {
  execSync(cmd, { stdio: 'inherit', cwd });
}


if (fs.existsSync(DIR)) {
  console.log('🧹 Removing old bot...');
  fs.rmSync(DIR, { recursive: true, force: true });
}


console.log('📥 Cloning latest bot...');
exec(`git clone --depth=1 ${REPO} ${DIR}`);


const pkg = JSON.parse(fs.readFileSync(path.join(DIR, 'package.json'), 'utf8'));
const deps = Object.keys(pkg.dependencies || {});

const missing = deps.filter(dep => {
  try {
    require.resolve(dep);
    return false;
  } catch {
    return true;
  }
});

if (missing.length > 0) {
  console.log(`📦 Installing missing deps: ${missing.join(', ')}`);
  exec(`npm install ${missing.join(' ')}`);
} else {
  console.log('✅ All dependencies already present.');
}


console.log('🚀 Starting bot...');
require(path.join(DIR, 'index.js'));


app.get('/', (req, res) => {
  res.send('🤖 Bot is running!');
});

app.listen(PORT, () => {
  console.log(`🌐 Express server running at http://localhost:${PORT}`);
});