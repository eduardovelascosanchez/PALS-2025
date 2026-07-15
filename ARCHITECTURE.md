# Arquitectura

## Decisión principal

La aplicación usa HTML, CSS y módulos JavaScript sin framework ni proceso de compilación. Esta elección reduce dependencias, hace auditable el contenido clínico y permite publicar exactamente el mismo árbol de archivos en GitHub Pages.

## Componentes

| Archivo | Responsabilidad |
| --- | --- |
| `index.html` | Semántica, navegación y contenedores de vistas. |
| `assets/css/styles.css` | Diseño responsivo, accesibilidad visual e impresión. |
| `assets/js/data.js` | Contenido clínico, escenarios, metadatos y fuentes. |
| `assets/js/clinical.js` | Cálculos puros, límites, cronómetro y ventana 3–5 min. |
| `assets/js/app.js` | Renderizado, eventos, persistencia local e instalación PWA. |
| `sw.js` | Caché de la carcasa, navegación offline y actualización. |
| `manifest.webmanifest` | Instalación, iconos, alcance y accesos directos. |

## Datos y privacidad

No hay backend, telemetría ni llamadas clínicas a servicios externos. La única escritura es el estado de simulación en `localStorage`. Las fuentes oficiales son enlaces salientes y no se precachean.

## Compatibilidad con GitHub Pages

- Todas las rutas internas son relativas.
- El service worker construye URLs desde `self.registration.scope`.
- `start_url`, `scope` e `id` usan `./`.
- `.nojekyll` evita transformaciones de Jekyll.
- `404.html` devuelve al inicio del repositorio cuando la aplicación vive bajo `github.io`.

## Estrategia offline

Durante la instalación se guarda la carcasa completa. Las navegaciones intentan primero la red y caen a `index.html`; los recursos estáticos usan caché primero. Cada versión cambia `CACHE_VERSION`, elimina cachés anteriores y muestra un aviso cuando una nueva versión queda en espera.

## Extensión futura

Nuevos algoritmos deben añadirse como objetos en `ALGORITHMS`. Los cálculos nuevos deben implementarse como funciones puras, acompañarse de pruebas y evitar depender de la interfaz. Si se incorpora contenido protegido, debe enlazarse a la fuente en vez de copiar figuras o páginas.
