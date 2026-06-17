---
title: Añadir Contenido
description: Convenciones de frontmatter y campos por colección para guías, publicaciones y registros
tags:
  - content
  - markdown
  - frontmatter
status: evergreen
visibility: public
category: content
difficulty: beginner
order: 3
prerequisites:
  - getting-started
created: '2026-01-23'
updated: '2026-06-11'
machineTranslated: true
---

## Conceptos Básicos

Todo el contenido vive en la carpeta `content/` como archivos Markdown con frontmatter YAML.

```markdown
---
title: Mi Primera Publicación
description: Una idea rápida, por escrito
tags:
  - idea
  - design
status: seed
visibility: private
---

## El contenido en sí

Escribe tu contenido aquí usando Markdown.
```

## Campos Base (Todas las Colecciones)

Cada archivo de contenido comparte estos campos:

| Campo | Obligatorio | Predeterminado | Descripción |
|-------|-------------|----------------|-------------|
| `title` | Sí | - | Título para mostrar |
| `description` | No | - | Resumen breve |
| `tags` | No | `[]` | Etiquetas de categorización |
| `status` | No | `seed` | Etapa del ciclo de vida |
| `visibility` | No | `private` | Control de acceso |
| `created` | No | - | Fecha ISO |
| `updated` | No | - | Fecha ISO |

## Ciclo de Vida (Status)

El contenido crece por etapas:

| Status | Significado |
|--------|-------------|
| `seed` | Idea nueva, borrador |
| `sprout` | En desarrollo, tomando forma |
| `evergreen` | Maduro, mantenido |
| `wilted` | Desactualizado, necesita revisión |

## Niveles de Visibilidad

| Nivel | Quién Puede Ver |
|-------|-----------------|
| `private` | Solo el autor o administradores |
| `internal` | Cualquier usuario con sesión iniciada |
| `public` | Todos |

El modo de desarrollo omite las comprobaciones de visibilidad para que puedas previsualizar todo localmente.

## Campos por Colección

### Guías (`content/en/guides/`)

```yaml
---
title: Despliegue
category: deployment # getting-started | authentication | content | customization | deployment | other
difficulty: beginner # beginner | intermediate | advanced
order: 5
prerequisites:
  - getting-started
---
```

### Publicaciones (`content/en/posts/`)

```yaml
---
title: Hola Mundo
date: '2026-06-11'
author: Tu Nombre
---
```

### Registro de Tecnología (`content/tech/`)

```yaml
---
title: Nuxt
slug: nuxt
kind: framework
icon:
  provider: iconify
  name: simple-icons:nuxtdotjs
website: https://nuxt.com
---
```

## Organización de Archivos

```
content/
  en/
    guides/
      getting-started.md   # /guides/getting-started
    posts/
      hello-world.md       # /posts/hello-world
  es/
    guides/                # Traducciones al español (mismos nombres de archivo)
  tech/
    nuxt.md                # Las entradas de registro usan slugs
```

## Enlazar Contenido

Los registros usan slugs estables que otro contenido referencia:

```yaml
tech:
  - nuxt        # Referencia content/tech/nuxt.md
  - tailwind    # Referencia content/tech/tailwind.md
```

Mantén los slugs estables — renombrar uno rompe todas sus referencias.

## Contenido Multimedia

Enriquece tu contenido con componentes MDC:

- **[Diagramas Mermaid](/es/guides/mermaid-diagrams)** - Diagramas de flujo, secuencia, ERD
- **[Videos y Embeds Sociales](/es/guides/video-embeds)** - Videos de YouTube, publicaciones de Twitter/X

## Consejos

1. **Usa etiquetas con libertad** - Alimentan la búsqueda y los filtros
2. **Mantén los slugs estables** - Otro contenido los referencia
3. **Privado por defecto** - Hacer público debe ser intencional
4. **¿Añadir una colección completa?** - Consulta la [guía de Arquitectura](/es/guides/architecture#adding-a-collection)
