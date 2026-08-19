---
title: Usar Esta Plantilla
description: Convierte nuxt-kickstart en tu proyecto — el script de inicialización, los tokens a renombrar y qué eliminar
tags:
  - setup
  - template
status: evergreen
visibility: public
category: getting-started
difficulty: beginner
order: 0
created: '2026-06-11'
machineTranslated: true
---

## El Flujo

1. En GitHub, haz clic en **Use this template** y crea tu repositorio
2. Clónalo y ejecuta `pnpm install`
3. Ejecuta `pnpm run init`
4. Revisa el diff y haz commit
5. `pnpm dev` — la aplicación arranca en `http://localhost:3000`

`pnpm install` ejecuta `nuxt prepare` y crea la base de datos SQLite local, así
que el paso 5 funciona en un clon recién creado **sin archivo `.env`**. El
contenido, los temas, i18n y estas guías se renderizan. El inicio de sesión es
lo único que requiere configuración: copia `.env.example` a `.env` y define
`BETTER_AUTH_SECRET` (32+ caracteres, `openssl rand -base64 32`) más las
credenciales de un proveedor cuando quieras autenticación. Consulta
[Primeros Pasos](/guides/getting-started) para el recorrido completo.

## Qué Hace `pnpm run init`

El script (`scripts/init.ts`) pide el nombre kebab-case de tu proyecto, el nombre para mostrar, la URL del sitio y el nombre del paquete npm, y luego reescribe los tokens de la plantilla en todos los archivos de texto rastreados:

| Token | Se convierte en | Dónde aparece |
| --- | --- | --- |
| `nuxt-kickstart.example.com` | el host de tu sitio | configuración del sitio, imágenes OG, docs |
| `@victortolbert/nuxt-kickstart` | el nombre de tu paquete | `package.json` |
| `nuxt-kickstart` | tu nombre kebab-case | referencias al repositorio, docs |
| `kickstart-theme`, `kickstart-locale`, … | `<tu-nombre>-theme`, … | claves de localStorage/cookies |
| `Kickstart` | tu nombre para mostrar | textos de UI, plantillas de correo, títulos |

Es idempotente — al re-ejecutarlo después de un renombrado no encuentra ocurrencias y no cambia nada.

## Lista Manual (después de init)

Esto es lo que `init` deliberadamente **no** toca: reescribe los tokens del
nombre de la plantilla, no la identidad del autor de la plantilla.

- [ ] `package.json` — reemplaza el bloque `author` (nombre / email / url). Todavía no hay campo `repository`; añade uno que apunte a tu repositorio
- [ ] `.github/FUNDING.yml` — apunta a los patrocinadores del autor de la plantilla; cámbialo o elimínalo
- [ ] `README.md` — reescribe la introducción para tu proyecto
- [ ] `app/components/app/app-logo.vue` — el nombre es un wordmark de texto (`pnpm run init` lo renombra); dale estilo o añade un logotipo aquí
- [ ] `public/favicon.svg` / `favicon-dark.svg` — reemplaza los favicons
- [ ] `public/img/screenshots/kickstart/` — renombra el directorio con el slug de tu proyecto y reemplaza los SVG de ejemplo (nada los referencia todavía, así que es cosmético)
- [ ] `maizzle.config.ts.bak` — archivo de respaldo suelto en la plantilla; se puede eliminar
- [ ] `.env.1password` — apunta las referencias `op://` a tu propia bóveda o elimina el archivo y usa `.env` plano
- [ ] `content/en/posts/` — reemplaza las publicaciones de ejemplo
- [ ] Textos de la página de inicio y enlaces sociales (`app/pages/index.vue`, `app/layouts/landing.vue`, `app/components/landing/contact-section.vue`)

## Qué Eliminar

Todo lo opcional está diseñado para poder quitarse:

- **Apps de ejemplo** (podcast, marcador) — elimina `app/pages/examples/`, los esquemas `examples/`, sus carpetas de contenido y las rutas `server/api/{examples,scoreboard}` relacionadas
- **Subsistema de correo** — elimina los esquemas `systems/email`, `content/email-*/`, `server/api/email/` y las páginas de administración de correo
- **Herramienta de tokens de diseño** — elimina `app/components/tokens/`, `lib/style-dictionary/` y `server/api/tokens/`
- **Un tema** — elimina su archivo CSS en `app/assets/css/themes/`, quítalo de `use-theme.ts` y de `shared/types/theme.ts`

Después de cualquier eliminación, ejecuta la verificación: `pnpm run lint:fix && pnpm run typecheck && pnpm run test`.

## Secretos

Los secretos de desarrollo se resuelven desde 1Password en tiempo de ejecución con `pnpm dev:op` (sin secretos en texto plano en disco). Crea una bóveda para tu proyecto, replica los nombres de los items referenciados en `.env.1password` y listo. También funciona `pnpm dev` plano con un archivo `.env`. Flujo completo: la guía [Secretos con 1Password](/es/guides/secrets-1password).
