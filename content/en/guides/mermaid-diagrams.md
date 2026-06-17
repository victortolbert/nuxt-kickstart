---
title: Mermaid Diagrams
description: Create flowcharts, sequence diagrams, and more using Mermaid syntax in your content.
category: content
difficulty: beginner
order: 30
status: evergreen
visibility: public
tags:
  - mermaid
  - diagrams
  - content
---

Kickstart supports [Mermaid](https://mermaid.js.org/) diagrams directly in your markdown content. Mermaid lets you create diagrams and visualizations using text-based definitions.

## Basic Usage

Use standard markdown code fences with `mermaid` as the language:

````md
```mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Do something]
    B -->|No| D[Do something else]
```
````

## Flowchart Example

```mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Celebrate!]
    B -->|No| D[Debug]
    D --> E[Check logs]
    E --> F[Fix issue]
    F --> B
```

## Sequence Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant S as Server
    participant D as Database

    U->>C: Click button
    C->>S: API request
    S->>D: Query data
    D-->>S: Return results
    S-->>C: JSON response
    C-->>U: Update UI
```

## Class Diagram

```mermaid
classDiagram
    class User {
        +String name
        +String email
        +login()
        +logout()
    }
    class Project {
        +String title
        +String status
        +addTask()
        +complete()
    }
    class Task {
        +String description
        +Boolean done
        +toggle()
    }
    User "1" --> "*" Project : owns
    Project "1" --> "*" Task : contains
```

## State Diagram

```mermaid
stateDiagram-v2
    [*] --> Seed
    Seed --> Sprout : Develop
    Sprout --> Evergreen : Mature
    Evergreen --> Wilted : Outdated
    Wilted --> Sprout : Refresh
    Wilted --> [*] : Archive
```

## Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ PROJECT : creates
    USER ||--o{ NOTE : writes
    PROJECT ||--|{ TASK : contains
    PROJECT }o--o{ TECH : uses
    NOTE }o--o{ TAG : has
```

## Gantt Chart

```mermaid
gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Planning
    Research           :done,    p1, 2024-01-01, 7d
    Design             :done,    p2, after p1, 5d
    section Development
    Backend API        :active,  d1, after p2, 14d
    Frontend UI        :         d2, after p2, 14d
    Integration        :         d3, after d1, 7d
    section Launch
    Testing            :         t1, after d3, 5d
    Deploy             :         t2, after t1, 2d
```

## Pie Chart

```mermaid
pie showData
    title Tech Stack Distribution
    "Vue/Nuxt" : 45
    "TypeScript" : 30
    "CSS" : 15
    "Other" : 10
```

## Git Graph

```mermaid
gitGraph
    commit id: "Initial"
    branch develop
    checkout develop
    commit id: "Feature A"
    commit id: "Feature B"
    checkout main
    merge develop id: "Release v1"
    branch hotfix
    commit id: "Bugfix"
    checkout main
    merge hotfix id: "v1.0.1"
```

## Theme Support

Diagrams automatically adapt to your current color mode (light/dark). Switch themes to see the diagrams update.

## Tips

- Keep diagrams simple and focused on one concept
- Use meaningful labels for nodes
- Test complex diagrams in the [Mermaid Live Editor](https://mermaid.live/)
- Diagrams are print-friendly and will render in PDFs
