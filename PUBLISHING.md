# Publicación y operación

## Primera publicación

### 1. Preparar GitHub

- Crear un repositorio vacío, público o privado según la cuenta y la política institucional.
- Definir `main` como rama predeterminada.
- Sustituir `@tu-usuario` en `.github/CODEOWNERS`.
- Proteger `main` y exigir, como mínimo, una aprobación antes de fusionar.

### 2. Subir el proyecto

```bash
git init
git add .
git commit -m "feat: publicar Guía PALS 2025 PWA"
git branch -M main
git remote add origin https://github.com/USUARIO/pals-2025-pwa.git
git push -u origin main
```

### 3. Activar Pages

En el repositorio, abrir **Settings → Pages** y seleccionar **GitHub Actions** como fuente. El workflow `.github/workflows/pages.yml` valida el proyecto y publica solo si las pruebas pasan.

### 4. Verificar el despliegue

- Abrir la URL publicada y recorrer las cinco vistas.
- Calcular 5 kg, 18 kg y 100 kg; comparar contra las pruebas unitarias.
- Abrir DevTools → Application y confirmar manifiesto, service worker e iconos.
- Recargar una vez, activar modo sin conexión y volver a abrir la app.
- Instalar en Android/Chrome y agregar a inicio en iOS/Safari.
- Confirmar que los enlaces oficiales se abren únicamente cuando existe conexión.

## Dominios personalizados

GitHub Pages permite añadir un dominio en **Settings → Pages → Custom domain**. Configura HTTPS obligatorio. Las rutas relativas de esta PWA funcionan tanto en `usuario.github.io/repositorio/` como en un dominio propio.

## Reversión

Si una versión publicada contiene un error clínico:

1. Crear inmediatamente un pull request que revierta el commit afectado.
2. Marcar el error y su impacto en `CHANGELOG.md`.
3. Incrementar la versión y `CACHE_VERSION`; esto fuerza la sustitución controlada del caché.
4. Fusionar tras una revisión clínica abreviada pero documentada.
5. Confirmar que la nueva versión aparece en un dispositivo que tenía la PWA instalada.

No se debe reescribir el historial de `main` ni eliminar etiquetas de versiones publicadas.

## Lista de verificación por versión

- [ ] Fuentes primarias vigentes y enlaces funcionales.
- [ ] Aprobación del responsable clínico.
- [ ] Revisión independiente de todas las fórmulas modificadas.
- [ ] `npm run check` sin errores.
- [ ] Versión sincronizada en `package.json` y `sw.js`.
- [ ] `reviewedAt` y `CHANGELOG.md` actualizados.
- [ ] Prueba en pantalla móvil y escritorio.
- [ ] Prueba de instalación y modo sin conexión.
- [ ] Confirmación del despliegue de GitHub Pages.
