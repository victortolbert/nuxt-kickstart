# Shared Utils

Pure utility functions used in both client and server contexts. Auto-imported;
also importable via `#shared/utils/*`.

## Key Files

| File                     | Purpose                                       |
| ------------------------ | --------------------------------------------- |
| `case.ts`                | Case transformation (kebab/pascal/label)      |
| `glossary.ts`            | Acronym detection + term lookup               |
| `abilities.ts`           | `nuxt-authorization` ability definitions      |
| `content-source.ts`      | Content source/path helpers                   |
| `email-validation.ts`    | Email validation                              |
| `token-detector.ts`      | Detect design-token formats                   |
| `token-parser.ts`        | Parse token files                             |
| `token-normalizer.ts`    | Normalize tokens to a common shape            |
| `token-name-converter.ts`| Convert token naming conventions              |
| `token-validator.ts`     | Validate token structures                     |

## Case Utilities

```ts
formatLabel('in-progress') // 'In Progress'
formatTag('raci')          // 'RACI' (detects acronym)
toKebabCase('InProgress')  // 'in-progress'
toPascalCase('in-progress')// 'InProgress'
```

## Authorization Abilities

Abilities (`isAdmin`, `canEdit`, `editContent`, `viewContent`, …) are defined
with `defineAbility` and checked via `nuxt-authorization`'s `allows` / server
`authorize`:

```ts
const canEditThis = await allows(editContent, content)
```

## Usage

```ts
import { formatLabel } from '#shared/utils/case'
import { isAcronym } from '#shared/utils/glossary'
```

## Learn More

- [Shared Directory](https://nuxt.com/docs/guide/directory-structure/shared)
