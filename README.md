# Guía PALS 2025 — PWA

Aplicación web progresiva, estática y en español para consulta educativa de PALS 2025. Integra resúmenes de algoritmos, cálculos por peso, escenarios de simulación, registro cronológico y debriefing. Está preparada para funcionar sin conexión y publicarse directamente en GitHub Pages.

> **Alcance:** recurso educativo independiente para profesionales entrenados. No es un manual oficial, una certificación, un expediente clínico ni un dispositivo médico. Siempre deben verificarse peso, concentración, dosis máxima, dispositivo, algoritmo oficial y protocolo institucional.

## Qué incluye

- Paro cardiaco, bradicardia, taquiarritmia y cuidados después de ROSC.
- Calculadora con máximos explícitos para epinefrina, amiodarona, atropina y adenosina.
- Energía para desfibrilación y cardioversión sincronizada.
- Simulador con cronómetro, ciclos de 2 minutos, ventana de epinefrina y exportación Markdown.
- Persistencia local sin solicitar nombres ni identificadores de pacientes.
- Manifiesto, iconos, service worker y página sin conexión.
- Pruebas automáticas, validación estática y despliegue por GitHub Actions.

## Estructura

```text
.
├── .github/
│   ├── workflows/pages.yml       # validación y despliegue
│   └── CODEOWNERS                 # responsables de revisión
├── assets/
│   ├── css/styles.css             # diseño responsivo
│   ├── icons/                     # iconos instalables
│   └── js/
│       ├── app.js                 # interfaz, PWA y simulación
│       ├── clinical.js            # cálculos puros y temporización
│       └── data.js                # contenido clínico y fuentes
├── docs/
│   ├── ARCHITECTURE.md
│   ├── CLINICAL_GOVERNANCE.md
│   ├── CONTENT_SOURCES.md
│   └── PUBLISHING.md
├── scripts/validate.mjs
├── tests/clinical.test.mjs
├── 404.html
├── index.html
├── manifest.webmanifest
├── offline.html
└── sw.js
```

## Probar localmente

La PWA debe abrirse mediante HTTP; no uses doble clic sobre `index.html` si deseas probar el service worker.

```bash
npm ci
npm run check
python3 -m http.server 4173
```

Después abre `http://localhost:4173`.

## Publicar en GitHub Pages

1. Crea un repositorio vacío en GitHub, por ejemplo `pals-2025-pwa`.
2. Copia estos archivos a la raíz, crea la rama `main` y súbelos.
3. En **Settings → Pages → Build and deployment**, selecciona **GitHub Actions**.
4. Abre la pestaña **Actions** y confirma que “Validar y publicar en GitHub Pages” finaliza correctamente.
5. Verifica la URL indicada por el despliegue: `https://USUARIO.github.io/pals-2025-pwa/`.
6. Prueba instalación y modo avión después de una primera carga en línea.

No hay que editar rutas para un repositorio con subdirectorio: `start_url`, `scope`, recursos y caché son relativos.

## Flujo de actualización

1. Crea una rama: `content/actualizacion-aaaa-mm` o `fix/descripcion`.
2. Modifica contenido clínico únicamente en `assets/js/data.js`; modifica fórmulas en `assets/js/clinical.js` y añade o actualiza pruebas.
3. Registra la fuente, fecha y decisión en `docs/CONTENT_SOURCES.md`.
4. Actualiza `reviewedAt`, la versión de `package.json`, `CACHE_VERSION` en `sw.js` y `CHANGELOG.md`.
5. Ejecuta `npm run check`.
6. Abre un pull request con revisión clínica y técnica antes de fusionar a `main`.

La política de revisión completa está en [docs/CLINICAL_GOVERNANCE.md](docs/CLINICAL_GOVERNANCE.md).

## Privacidad

El simulador almacena su estado en `localStorage` del navegador. No envía información a un servidor. Aun así, no deben introducirse datos personales ni información clínica identificable. “Nueva sesión” elimina el registro local de la aplicación.

## Licencias y marcas

El código propio se distribuye bajo licencia MIT. Los nombres y marcas de terceros pertenecen a sus titulares. PALS es una marca de la American Heart Association; este proyecto no está afiliado ni respaldado por AHA o AAP. Los diagramas oficiales no se incluyen: la aplicación usa resúmenes originales y enlaza a las fuentes primarias.
