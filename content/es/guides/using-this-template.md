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

Después reemplaza la identidad que el paso de tokens deja intacta a propósito:

- el bloque `author` de `package.json`
- las URLs `repository`, `bugs` y `homepage`, construidas a partir del `owner/name` de GitHub que indiques
- `.github/FUNDING.yml`, que se elimina para que tu proyecto nunca solicite patrocinio para el autor de la plantilla

Los valores por defecto salen de tu propio `git config user.name`, `user.email`
y del remoto `origin`, así que pulsar enter cuatro veces suele bastar. Lo que
dejes en blanco se elimina en lugar de heredarse: mejor ningún autor que el de
otra persona.

Es idempotente — al re-ejecutarlo después de un renombrado no encuentra ocurrencias y no cambia nada.

## Lista Manual (después de init)

Esto es lo que `init` deliberadamente **no** toca: se encarga de los tokens del
nombre y de la identidad del autor, pero no puede escribir tu proyecto por ti.

- [ ] `README.md` — reescribe la introducción para tu proyecto
- [ ] `app/components/app/app-logo.vue` — el nombre es un wordmark de texto (`pnpm run init` lo renombra); dale estilo o añade un logotipo aquí
- [ ] `public/favicon.svg` / `favicon-dark.svg` — reemplaza los favicons
- [ ] `public/img/screenshots/kickstart/` — renombra el directorio con el slug de tu proyecto y reemplaza los SVG de ejemplo (nada los referencia todavía, así que es cosmético)
- [ ] `.env.1password` — apunta las referencias `op://` a tu propia bóveda o elimina el archivo y usa `.env` plano
- [ ] `content/en/posts/` — reemplaza las publicaciones de ejemplo
- [ ] Textos de la página de inicio y enlaces sociales (`app/pages/index.vue`, `app/layouts/landing.vue`, `app/components/landing/contact-section.vue`)

## Qué Eliminar

Esta plantilla es deliberadamente pequeña, así que queda poco por quitar. Lo que
hay:

- **El lab broadsheet** — elimina `app/pages/labs/`, su entrada en `content/navigation/03.labs.yml` y la excepción `/labs/broadsheet` en `app/middleware/app-auth.global.ts`
- **El registro de tecnología** — elimina `content/tech/`, `app/components/tech-badge.vue`, `app/utils/tech-config.ts` y `app/pages/tech/`. Lo referencian el layout por defecto y tres guías, así que revisa con grep antes de hacer commit
- **Un tema** — elimina su archivo CSS en `app/assets/css/themes/`, quítalo de `use-theme.ts` y de `shared/types/theme.ts`
- **Un idioma** — elimina `i18n/locales/<código>.json` y su carpeta `content/<código>/`, y quítalo del bloque `i18n` en `nuxt.config.ts`

**No elimines `server/utils/email.ts` ni `email-templates.ts`.** La autenticación
por contraseña está desactivada, así que el enlace mágico y el OTP dependen de
ellos: quitarlos haría imposible iniciar sesión.

Después de cualquier eliminación, ejecuta la verificación: `pnpm run lint:fix && pnpm run typecheck && pnpm exec vitest run`.

## Habilidades de Agente (Listo para Agentes)

La plantilla incluye un conjunto curado de habilidades de agente en `.claude/skills/` (usadas por Claude Code; portables a otros agentes). Tres grupos:

- **Habilidades del stack** — Nuxt, Vue, Nuxt UI, Tailwind, Drizzle, Zod, Better Auth, seguridad web, pruebas con Playwright. Se consultan automáticamente cuando un agente toca el código correspondiente.
- **Flujo de trabajo agéntico** — `improve-codebase-architecture`, `grill-me` / `grill-with-docs` (poner a prueba planes manteniendo `CONTEXT.md` y `docs/adr/`), `tdd`, `diagnose`, `prd`, flujos de incidencias.
- **Verbos de diseño** — `audit`, `harden`, `optimize`, `polish`, `animate` y compañía, para iterar sobre la calidad de la UI.

El glosario del dominio vive en `CONTEXT.md` y las decisiones registradas en `docs/adr/` — mantén ambos vivos a medida que crece tu proyecto; las habilidades de flujo de trabajo los leen y actualizan. Las habilidades que no quieras son simples directorios: elimínalas.

## Secretos

Los secretos de desarrollo se resuelven desde 1Password en tiempo de ejecución con `pnpm dev:op` (sin secretos en texto plano en disco). Crea una bóveda para tu proyecto, replica los nombres de los items referenciados en `.env.1password` y listo. También funciona `pnpm dev` plano con un archivo `.env`. Flujo completo: la guía [Secretos con 1Password](/es/guides/secrets-1password).
