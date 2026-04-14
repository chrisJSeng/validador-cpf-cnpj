#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

console.log('🏗️  Building dual ESM/CJS...\n');

console.log('📦 Cleaning old builds...');

['dist', 'dist-esm'].forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

console.log('📦 Building CommonJS...');

execSync('npx tsc', { stdio: 'inherit' });

console.log('📦 Building ESM...');

execSync('npx tsc -p tsconfig.esm.json', { stdio: 'inherit' });

console.log('📦 Preparing ESM files...');
fs.readdirSync('dist-esm').forEach(file => {
  if (file.endsWith('.js')) {
    const src = path.join('dist-esm', file);
    const dest = path.join('dist', file.replace('.js', '.mjs'));
    let content = fs.readFileSync(src, 'utf-8');
    
    content = content.replaceAll(
      /from ['"]\.\/([^'"]+)(['"]);/g,
      "from './$1.mjs';"
    );
    
    fs.writeFileSync(dest, content, 'utf-8');
    console.log(`   ✓ ${file.replace('.js', '.mjs')}`);
  }
});

fs.rmSync('dist-esm', { recursive: true, force: true });

console.log('\n✅ Build complete!');
console.log('   dist/index.js    (CommonJS)');
console.log('   dist/index.mjs   (ESM)');
console.log('   dist/index.d.ts  (Types)');
