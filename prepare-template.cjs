const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = __dirname;
const source = fs.readdirSync(root).find(name => name.startsWith('Linker') && name.endsWith('.html'));
if (!source) throw new Error('No se encontró la plantilla original.');
const assets = path.join(root, 'assets');
fs.mkdirSync(assets, { recursive: true });
let html = fs.readFileSync(path.join(root, source), 'utf8');
const types = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/avif': 'avif', 'image/gif': 'gif', 'image/svg+xml': 'svg', 'image/x-icon': 'ico', 'font/woff2': 'woff2', 'font/woff': 'woff', 'application/font-woff': 'woff' };
const extracted = new Map();
html = html.replace(/data:([\w/+.-]+);base64,([A-Za-z0-9+/=\r\n]+)/g, (original, mime, encoded) => {
  if (!types[mime]) return original;
  const bytes = Buffer.from(encoded.replace(/\s/g, ''), 'base64');
  const hash = crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 16);
  const name = `${hash}.${types[mime]}`;
  if (!extracted.has(name)) fs.writeFileSync(path.join(assets, name), bytes);
  extracted.set(name, bytes.length);
  return `assets/${name}`;
});
let styleCount = 0;
html = html.replace(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi, (_, attributes, css) => {
  const name = `template-${++styleCount}.css`;
  fs.writeFileSync(path.join(assets, name), css.replaceAll('assets/', './'));
  const media = attributes.match(/\bmedia=("[^"]*"|'[^']*'|[^\s>]+)/i);
  return `<link rel="stylesheet" href="assets/${name}"${media ? ` media=${media[1]}` : ''}>`;
});
html = html.replace(/<link\b[^>]*\brel=["']?(?:preconnect|dns-prefetch|modulepreload)[^>]*>/gi, '');
fs.writeFileSync(path.join(root, 'index.html'), html);
const missing = [...html.matchAll(/(?:src|href)=["']?(assets\/[^\s"'<>]+)/g)].map(match => match[1]).filter(file => !fs.existsSync(path.join(root, file)));
if (missing.length) throw new Error(`Recursos faltantes: ${missing.join(', ')}`);
console.log(JSON.stringify({ source, output: 'index.html', assets: extracted.size, styles: styleCount, missing: missing.length, originalBytes: fs.statSync(path.join(root, source)).size, htmlBytes: Buffer.byteLength(html) }, null, 2));
