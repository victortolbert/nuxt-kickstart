---
title: TypeScript
slug: typescript
status: evergreen
visibility: public
description: A strongly typed programming language that builds on JavaScript
  with static type checking.
tags:
  - javascript
  - types
  - language
  - static-analysis
website: https://www.typescriptlang.org/
icon:
  provider: iconify
  name: logos:typescript-icon
created: '2026-01-23'
updated: '2026-02-01'
category: programming-language
ecosystem: javascript
displayName: TypeScript
---

## Interfaces vs Types in TypeScript

- <https://stackoverflow.com/a/52682220>

### 1. Objects / Functions

Both can be used to describe the shape of an object or a function signature. But the syntax differs.

#### Interface

```ts
interface Point {
  x: number
  y: number
}

interface SetPoint {
  (x: number, y: number): void
}
```

#### Type alias

```ts
type Point = {
  x: number
  y: number
}

type SetPoint = (x: number, y: number) => void
```

### 2. Other Types

Unlike an interface, the type alias can also be used for other types such as primitives, unions, and tuples.

```typescript
// primitive
type Name = string

// object
type PartialPointX = { x: number; }
type PartialPointY = { y: number; }

// union
type PartialPoint = PartialPointX | PartialPointY

// tuple
type Data = [number, string]
```

### 3. Extend

Both can be extended, but again, the syntax differs. Additionally, note that an interface and type alias are not mutually exclusive. An interface can extend a type alias, and vice versa.

#### Interface extends interface

```ts
interface PartialPointX { x: number }
interface Point extends PartialPointX { y: number }
```

#### Type alias extends type alias

```ts
type PartialPointX = { x: number }
type Point = PartialPointX & { y: number }
```

#### Interface extends type alias

```ts
type PartialPointX = { x: number }
interface Point extends PartialPointX { y: number }
```

#### Type alias extends interface

```ts
interface PartialPointX { x: number }
type Point = PartialPointX & { y: number }
```

### 4. Implements

A class can implement an interface or type alias, both in the same exact way. Note however that a class and interface are considered static blueprints. Therefore, they can not implement / extend a type alias that names a union type.

```ts
interface Point {
  x: number
  y: number
}

class SomePoint implements Point {
  x = 1
  y = 2
}

type Point2 = {
  x: number
  y: number
}


class SomePoint2 implements Point2 {
  x = 1
  y = 2
}

type PartialPoint = { x: number } | { y: number }

// FIXME: can not implement a union type
class SomePartialPoint implements PartialPoint {
  x = 1
  y = 2
}
```

### 5. Declaration merging

Unlike a type alias, an interface can be defined multiple times, and will be treated as a single interface (with members of all declarations being merged).

```ts
// These two declarations become:
interface Point { x: number, y: number }
interface Point { x: number }
interface Point { y: number }

const point: Point = { x: 1, y: 2 }
```
