---
title: Primeros Pasos
description: Crea un proyecto desde la plantilla y pon en marcha el servidor de desarrollo en minutos
tags:
  - setup
  - quickstart
status: evergreen
visibility: public
category: getting-started
difficulty: beginner
order: 1
created: '2026-01-23'
updated: '2026-06-11'
machineTranslated: true
---

## ¿Qué es Kickstart?

Kickstart (`nuxt-kickstart`) es un starter empresarial opinado y centrado en el contenido, construido sobre Nuxt 4 y Nuxt Content v3. Incluye autenticación sin contraseña, panel de administración, subsistema de correo, ejemplos en tiempo real, herramientas de tokens de diseño, siete temas e i18n ya configurados — para que los proyectos nuevos empiecen con los cimientos decididos.

## Requisitos Previos

- Node.js v24 (ver `.nvmrc`)
- [pnpm](https://pnpm.io/) (el único gestor de paquetes soportado)
- Git
- Un editor de código (se recomienda VS Code)

## Configuración Rápida

```bash
# 1. Crea tu repositorio desde la plantilla en GitHub y clónalo
git clone <url-de-tu-repositorio>
cd <tu-proyecto>

# 2. Instala las dependencias (postinstall ejecuta nuxt prepare + db:init)
pnpm install

# 3. Renombra los tokens de la plantilla a tu proyecto
pnpm run init

# 4. Configura el entorno
cp .env.example .env
# Edita .env: define BETTER_AUTH_SECRET (32+ caracteres)
# Genera uno con: openssl rand -base64 32

# 5. Inicia el desarrollo
pnpm dev
```

Visita `http://localhost:3000`.

Consulta [Usar Esta Plantilla](/es/guides/using-this-template) para ver qué renombra `pnpm run init` y la lista de tareas manuales que le sigue.

## Qué Está Funcionando

- **Sitio público** — página de inicio, [Guías](/es/guides), [Blog](/es/posts) y el [Registro de tecnología](/es/tech)
- **Área de la app** (`/app`) — panel autenticado
- **Panel de administración** (`/app/admin`) — gestión de usuarios, editor de contenido, sistema de correo, papelera

Las funciones de autenticación (enlace mágico, OTP, OAuth) necesitan variables de entorno adicionales — consulta la [guía de Autenticación](/es/guides/authentication).

## Próximos Pasos

1. [Usar Esta Plantilla](/es/guides/using-this-template) — completa el renombrado y elimina lo que no necesites
2. [Arquitectura](/es/guides/architecture) — recorrido por los directorios y convenciones
3. [Añadir Contenido](/es/guides/adding-content) — trabaja con las colecciones de contenido
4. [Personalización](/es/guides/customization) — temas y apariencia
5. [Despliegue](/es/guides/deployment) — publícalo
