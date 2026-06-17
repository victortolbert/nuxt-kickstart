---
title: Contribuir con Traducciones
description: Aprende cómo contribuir traducciones a Kickstart y ayudar a hacer el contenido accesible en múltiples idiomas.
category: getting-started
difficulty: beginner
order: 10
status: sprout
visibility: public
machineTranslated: true
tags:
  - i18n
  - translation
  - contributing
---

# Contribuir con Traducciones

Kickstart admite múltiples idiomas para hacer el contenido accesible a una audiencia más amplia. Esta guía explica cómo contribuir traducciones y ayudar a expandir nuestro contenido multilingüe.

## Idiomas Admitidos

Kickstart actualmente admite los siguientes idiomas:

| Código | Idioma | Nombre Nativo |
|--------|--------|---------------|
| `en` | Inglés | English (predeterminado) |
| `es` | Español | Español |
| `fr` | Francés | Français |
| `de` | Alemán | Deutsch |
| `kn` | Canarés | ಕನ್ನಡ |

## Estructura de Directorios

El contenido está organizado por idioma en el directorio `content/`:

```
content/
  en/                    # Inglés (predeterminado)
    guides/
    projects/
    milestones/
  es/                    # Español
    guides/
  fr/                    # Francés
    guides/
  de/                    # Alemán
    guides/
  kn/                    # Canarés
    guides/
```

## Crear una Traducción

### 1. Encontrar Contenido para Traducir

Navega por el directorio `content/en/` para encontrar contenido que te gustaría traducir. Comienza con guías más cortas y de alto impacto.

### 2. Crear el Archivo Traducido

Crea un nuevo archivo en el directorio de idioma correspondiente con la misma ruta:

```bash
# Fuente en inglés
content/en/guides/getting-started.md

# Traducción al español
content/es/guides/getting-started.md
```

### 3. Copiar y Traducir

1. Copia el frontmatter del inglés
2. Traduce el título y la descripción
3. Agrega `machineTranslated: true` si usas traducción automática
4. Traduce el contenido del cuerpo

### Ejemplo de Frontmatter

```yaml
---
title: Primeros Pasos
description: Aprende cómo empezar con Kickstart.
machineTranslated: true  # Agrega esto para traducciones automáticas
category: getting-started
difficulty: beginner
order: 1
status: sprout
visibility: public
tags:
  - getting-started
---
```

## Calidad de Traducción

### Traducciones Automáticas

Si estás usando herramientas de IA o traducción automática:

1. **Márcalo**: Agrega `machineTranslated: true` al frontmatter
2. **Revísalo**: Verifica el contexto y la precisión técnica
3. **Actualiza después**: Elimina la marca después de la revisión humana

### Lista de Verificación de Calidad

- [ ] Los términos técnicos son precisos
- [ ] Los ejemplos de código no han cambiado
- [ ] Los enlaces siguen siendo válidos
- [ ] El formato se mantiene
- [ ] El contexto cultural es apropiado

## Contribuir a través de GitHub

1. Haz fork del repositorio
2. Crea una nueva rama: `git checkout -b translate/es/getting-started`
3. Agrega tu traducción
4. Envía un Pull Request
5. Solicita revisión de un hablante nativo si es posible

## ¿Necesitas Ayuda?

- Únete a nuestras discusiones comunitarias
- Etiqueta las traducciones para revisión en tu PR
- Comienza con contenido más corto para ganar confianza

¡Gracias por ayudar a hacer Kickstart accesible para más personas!
