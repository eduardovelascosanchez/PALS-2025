import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));
const errors = [];

const required = [
  "index.html",
  "manifest.webmanifest",
  "sw.js",
  "offline.html",
  "404.html",
  ".nojekyll",
  "assets/css/styles.css",
  "assets/js/app.js",
  "assets/js/clinical.js",
  "assets/js/data.js",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
  "assets/icons/icon-maskable-512.png",
  ".github/workflows/pages.yml",
];

for (const file of required) {
  if (!exists(file)) errors.push(`Falta archivo esencial: ${file}`);
}

const manifest = JSON.parse(read("manifest.webmanifest"));
if (manifest.start_url !== "./" || manifest.scope !== "./") {
  errors.push("manifest.webmanifest debe usar start_url y scope relativos para GitHub Pages.");
}

for (const icon of manifest.icons ?? []) {
  const iconPath = icon.src.replace(/^\.\//, "");
  if (!exists(iconPath)) errors.push(`Icono declarado pero inexistente: ${iconPath}`);
}

const html = read("index.html");
if (/file:\/\//i.test(html)) errors.push("index.html contiene una ruta file:// no publicable.");
if (!html.includes('rel="manifest" href="./manifest.webmanifest"')) errors.push("index.html no enlaza el manifiesto con ruta relativa.");
if (!html.includes('type="module" src="./assets/js/app.js"')) errors.push("index.html no carga el módulo principal.");

const sw = read("sw.js");
const appShell = [...sw.matchAll(/^\s+"(\.\/[^\"]+)"[,]?$/gm)].map((match) => match[1]);
for (const item of appShell) {
  const itemPath = item === "./" ? "index.html" : item.replace(/^\.\//, "");
  if (!exists(itemPath)) errors.push(`El service worker intenta precachear un archivo inexistente: ${item}`);
}

const pkg = JSON.parse(read("package.json"));
if (!sw.includes(`pals-guide-v${pkg.version}`)) errors.push("CACHE_VERSION no coincide con package.json.");

const data = read("assets/js/data.js");
if (!data.includes("ahajournals.org") || !data.includes("cpr.heart.org")) {
  errors.push("Las fuentes clínicas primarias no están declaradas.");
}

if (errors.length) {
  console.error(errors.map((error) => `✗ ${error}`).join("\n"));
  process.exit(1);
}

console.log(`✓ Validación estática completa (${required.length} archivos esenciales, ${appShell.length} recursos offline).`);
