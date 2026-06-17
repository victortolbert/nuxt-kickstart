---
title: Syntax Highlighting
description: Code block examples for all supported programming languages
tags:
  - code
  - syntax
  - highlighting
  - reference
status: evergreen
visibility: public
category: content
difficulty: beginner
order: 10
prerequisites:
  - adding-content
created: '2026-01-23'
---

Kickstart supports syntax highlighting for 30+ languages via Shiki. This guide demonstrates each supported language with real-world code examples.

## Web Technologies

### JavaScript

```javascript
// Modern JavaScript with async/await
async function fetchUserData(userId) {
  const response = await fetch(`/api/users/${userId}`)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const user = await response.json()
  return {
    ...user,
    fullName: `${user.firstName} ${user.lastName}`,
    createdAt: new Date(user.createdAt)
  }
}

// Array methods and destructuring
const activeUsers = users
  .filter(({ status }) => status === 'active')
  .map(({ id, name, email }) => ({ id, name, email }))
  .sort((a, b) => a.name.localeCompare(b.name))
```

### TypeScript

```typescript
// Type definitions and generics
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
  createdAt: Date
}

type AsyncResult<T> = Promise<{ data: T; error: null } | { data: null; error: Error }>

async function fetchData<T>(url: string): AsyncResult<T> {
  try {
    const response = await fetch(url)
    const data: T = await response.json()
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error as Error }
  }
}

// Utility types
type UserWithoutId = Omit<User, 'id'>
type PartialUser = Partial<User>
type ReadonlyUser = Readonly<User>
```

### JSX

```jsx
// React component with hooks
import { useState, useEffect, useCallback } from 'react'

function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser(userId).then(setUser).finally(() => setLoading(false))
  }, [userId])

  const handleUpdate = useCallback(async (updates) => {
    const updated = await updateUser(userId, updates)
    setUser(updated)
  }, [userId])

  if (loading) return <Skeleton />

  return (
    <div className="user-profile">
      <Avatar src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.bio}</p>
      <Button onClick={() => handleUpdate({ followed: true })}>
        Follow
      </Button>
    </div>
  )
}
```

### TSX

```tsx
// TypeScript React component
import { FC, useState, useCallback } from 'react'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  children: React.ReactNode
}

const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  children,
}) => {
  const handleClick = useCallback(() => {
    if (!disabled && !loading && onClick) {
      onClick()
    }
  }, [disabled, loading, onClick])

  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled || loading}
      onClick={handleClick}
    >
      {loading ? <Spinner size={size} /> : children}
    </button>
  )
}

export default Button
```

### Vue

```vue
<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  modelValue: string
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Enter text...',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'submit': [value: string]
}>()

const inputRef = ref<HTMLInputElement>()
const isFocused = ref(false)

const hasValue = computed(() => props.modelValue.length > 0)

watch(() => props.modelValue, (newValue) => {
  console.log('Value changed:', newValue)
})

function handleSubmit() {
  if (hasValue.value) {
    emit('submit', props.modelValue)
  }
}
</script>

<template>
  <div class="input-wrapper" :class="{ focused: isFocused, disabled: disabled }">
    <input
      ref="inputRef"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @focus="isFocused = true"
      @blur="isFocused = false"
      @keydown.enter="handleSubmit"
    />
    <button v-if="hasValue" @click="handleSubmit">
      Submit
    </button>
  </div>
</template>

<style scoped>
.input-wrapper {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid var(--ui-border);
  border-radius: 0.25rem;
}

.input-wrapper.focused {
  border-color: var(--color-primary-500);
}
</style>
```

### Svelte

```svelte
<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte'
  import { fade, slide } from 'svelte/transition'

  export let items: string[] = []
  export let selected: string | null = null

  const dispatch = createEventDispatcher<{
    select: { item: string }
    remove: { item: string }
  }>()

  let isOpen = false

  function handleSelect(item: string) {
    selected = item
    isOpen = false
    dispatch('select', { item })
  }

  function handleRemove(item: string) {
    items = items.filter(i => i !== item)
    dispatch('remove', { item })
  }

  onMount(() => {
    console.log('Component mounted with', items.length, 'items')
  })
</script>

<div class="dropdown">
  <button on:click={() => isOpen = !isOpen}>
    {selected || 'Select an item'}
  </button>

  {#if isOpen}
    <ul transition:slide={{ duration: 200 }}>
      {#each items as item (item)}
        <li
          transition:fade
          class:selected={item === selected}
          on:click={() => handleSelect(item)}
        >
          {item}
          <button on:click|stopPropagation={() => handleRemove(item)}>×</button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .dropdown { position: relative; }
  ul { position: absolute; list-style: none; padding: 0; }
  .selected { font-weight: bold; }
</style>
```

### Astro

```astro
---
// Astro component with frontmatter
import Layout from '../layouts/Layout.astro'
import Card from '../components/Card.astro'

interface Props {
  title: string
  description?: string
}

const { title, description = 'Default description' } = Astro.props

const posts = await Astro.glob('../content/blog/*.md')
const sortedPosts = posts.sort((a, b) =>
  new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
)
---

<Layout title={title}>
  <main>
    <h1>{title}</h1>
    {description && <p class="description">{description}</p>}

    <section class="posts">
      {sortedPosts.map((post) => (
        <Card
          title={post.frontmatter.title}
          href={post.url}
          body={post.frontmatter.excerpt}
        />
      ))}
    </section>
  </main>
</Layout>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .posts {
    display: grid;
    gap: 1rem;
  }
</style>
```

### CSS

```css
/* Modern CSS with custom properties and container queries */
:root {
  --color-primary: oklch(0.7 0.15 264);
  --color-surface: oklch(0.98 0.01 264);
  --spacing-unit: 0.25rem;
  --radius-md: 0.5rem;
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.card {
  container-type: inline-size;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: calc(var(--spacing-unit) * 4);

  & .title {
    font-size: clamp(1rem, 3cqi, 1.5rem);
    font-weight: 600;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  }
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1rem;
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-surface: oklch(0.2 0.02 264);
  }
}
```

### PostCSS

```postcss
/* PostCSS with nesting and custom media */
@custom-media --mobile (max-width: 640px);
@custom-media --tablet (max-width: 1024px);

.navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: color-mix(in oklch, var(--bg) 90%, black);

  & .logo {
    font-size: 1.5rem;
    font-weight: bold;
  }

  & .menu {
    display: flex;
    gap: 1rem;

    @media (--mobile) {
      display: none;
    }

    & a {
      color: inherit;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  & .mobile-toggle {
    display: none;

    @media (--mobile) {
      display: block;
    }
  }
}
```

## Backend Languages

### Python

```python
# Python with type hints and async
from typing import Optional, List, TypeVar, Generic
from dataclasses import dataclass, field
from datetime import datetime
import asyncio
import aiohttp

T = TypeVar('T')

@dataclass
class User:
    id: str
    name: str
    email: str
    created_at: datetime = field(default_factory=datetime.now)
    roles: List[str] = field(default_factory=list)

    @property
    def is_admin(self) -> bool:
        return 'admin' in self.roles

class Repository(Generic[T]):
    def __init__(self):
        self._items: dict[str, T] = {}

    async def get(self, id: str) -> Optional[T]:
        return self._items.get(id)

    async def save(self, id: str, item: T) -> T:
        self._items[id] = item
        return item

async def fetch_users(base_url: str) -> List[User]:
    async with aiohttp.ClientSession() as session:
        async with session.get(f"{base_url}/users") as response:
            data = await response.json()
            return [User(**user) for user in data]

if __name__ == "__main__":
    users = asyncio.run(fetch_users("https://api.example.com"))
    admins = [u for u in users if u.is_admin]
    print(f"Found {len(admins)} admin users")
```

### Ruby

```ruby
# Ruby with modern syntax
class User
  attr_reader :id, :name, :email
  attr_accessor :roles

  def initialize(id:, name:, email:, roles: [])
    @id = id
    @name = name
    @email = email
    @roles = roles
    @created_at = Time.now
  end

  def admin?
    roles.include?('admin')
  end

  def to_h
    {
      id: id,
      name: name,
      email: email,
      roles: roles,
      created_at: @created_at.iso8601
    }
  end
end

class UserRepository
  def initialize
    @users = {}
  end

  def find(id)
    @users[id]
  end

  def save(user)
    @users[user.id] = user
  end

  def all
    @users.values
  end

  def admins
    all.select(&:admin?)
  end
end

# Usage with blocks
users = UserRepository.new
%w[alice bob charlie].each_with_index do |name, i|
  users.save(User.new(
    id: "user_#{i}",
    name: name.capitalize,
    email: "#{name}@example.com",
    roles: i.zero? ? ['admin'] : []
  ))
end

puts users.admins.map(&:name).join(', ')
```

### Java

```java
// Modern Java with records and pattern matching
package com.example.users;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

public sealed interface Result<T> permits Result.Success, Result.Failure {
    record Success<T>(T value) implements Result<T> {}
    record Failure<T>(String error) implements Result<T> {}
}

public record User(
    String id,
    String name,
    String email,
    List<String> roles,
    Instant createdAt
) {
    public User {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name cannot be blank");
        }
        if (roles == null) {
            roles = List.of();
        }
    }

    public boolean isAdmin() {
        return roles.contains("admin");
    }
}

public class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public CompletableFuture<Result<User>> findUser(String id) {
        return CompletableFuture.supplyAsync(() -> {
            Optional<User> user = repository.findById(id);
            return user
                .<Result<User>>map(Result.Success::new)
                .orElse(new Result.Failure<>("User not found"));
        });
    }

    public List<User> getAdmins() {
        return repository.findAll().stream()
            .filter(User::isAdmin)
            .toList();
    }
}
```

### C#

```csharp
// C# with records, pattern matching, and LINQ
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UserManagement;

public record User(
    string Id,
    string Name,
    string Email,
    IReadOnlyList<string> Roles,
    DateTime CreatedAt
) {
    public bool IsAdmin => Roles.Contains("admin");
}

public interface IUserRepository
{
    Task<User?> FindByIdAsync(string id);
    Task<IEnumerable<User>> GetAllAsync();
    Task SaveAsync(User user);
}

public class UserService
{
    private readonly IUserRepository _repository;

    public UserService(IUserRepository repository) => _repository = repository;

    public async Task<Result<User>> GetUserAsync(string id)
    {
        var user = await _repository.FindByIdAsync(id);
        return user switch
        {
            not null => Result<User>.Success(user),
            null => Result<User>.Failure("User not found")
        };
    }

    public async Task<IEnumerable<User>> GetAdminsAsync()
    {
        var users = await _repository.GetAllAsync();
        return users
            .Where(u => u.IsAdmin)
            .OrderBy(u => u.Name);
    }
}

public abstract record Result<T>
{
    public static Result<T> Success(T value) => new SuccessResult<T>(value);
    public static Result<T> Failure(string error) => new FailureResult<T>(error);
}

public record SuccessResult<T>(T Value) : Result<T>;
public record FailureResult<T>(string Error) : Result<T>;
```

### SQL

```sql
-- PostgreSQL with CTEs and window functions
WITH monthly_sales AS (
    SELECT
        product_id,
        DATE_TRUNC('month', order_date) AS month,
        SUM(quantity) AS total_quantity,
        SUM(quantity * unit_price) AS total_revenue
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE order_date >= CURRENT_DATE - INTERVAL '12 months'
    GROUP BY product_id, DATE_TRUNC('month', order_date)
),
ranked_products AS (
    SELECT
        p.id,
        p.name,
        p.category,
        ms.month,
        ms.total_revenue,
        ROW_NUMBER() OVER (
            PARTITION BY ms.month
            ORDER BY ms.total_revenue DESC
        ) AS rank,
        LAG(ms.total_revenue) OVER (
            PARTITION BY p.id
            ORDER BY ms.month
        ) AS prev_month_revenue
    FROM products p
    JOIN monthly_sales ms ON p.id = ms.product_id
)
SELECT
    name,
    category,
    month,
    total_revenue,
    rank,
    ROUND(
        (total_revenue - prev_month_revenue) / NULLIF(prev_month_revenue, 0) * 100,
        2
    ) AS growth_percent
FROM ranked_products
WHERE rank <= 10
ORDER BY month DESC, rank;

-- Create index for performance
CREATE INDEX CONCURRENTLY idx_orders_date_product
ON orders (order_date, product_id)
WHERE status = 'completed';
```

## DevOps & Configuration

### Bash

```bash
#!/bin/bash
# Deployment script with error handling

set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly APP_NAME="kickstart"
readonly DEPLOY_ENV="${1:-staging}"

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*"
}

error() {
    log "ERROR: $*" >&2
    exit 1
}

check_prerequisites() {
    command -v docker >/dev/null 2>&1 || error "Docker is required"
    command -v kubectl >/dev/null 2>&1 || error "kubectl is required"

    if [[ ! -f "${SCRIPT_DIR}/.env.${DEPLOY_ENV}" ]]; then
        error "Environment file not found: .env.${DEPLOY_ENV}"
    fi
}

build_image() {
    local tag="$1"
    log "Building Docker image: ${APP_NAME}:${tag}"

    docker build \
        --build-arg NODE_ENV=production \
        --tag "${APP_NAME}:${tag}" \
        --file "${SCRIPT_DIR}/Dockerfile" \
        "${SCRIPT_DIR}"
}

deploy() {
    local tag="$1"
    log "Deploying to ${DEPLOY_ENV}..."

    kubectl apply -f "${SCRIPT_DIR}/k8s/${DEPLOY_ENV}/" --recursive
    kubectl set image "deployment/${APP_NAME}" "${APP_NAME}=${APP_NAME}:${tag}"
    kubectl rollout status "deployment/${APP_NAME}" --timeout=300s
}

main() {
    check_prerequisites

    local git_sha
    git_sha="$(git rev-parse --short HEAD)"

    build_image "${git_sha}"
    deploy "${git_sha}"

    log "Deployment complete!"
}

main "$@"
```

### Docker

```docker
# Multi-stage Dockerfile for Node.js app
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# Dependencies stage
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN pnpm build

# Production stage
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nuxt

COPY --from=builder --chown=nuxt:nodejs /app/.output ./

USER nuxt

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "server/index.mjs"]
```

### YAML / YML

```yml
# GitHub Actions workflow
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Run linter
        run: bun run lint

      - name: Run tests
        run: bun run test

      - name: Type check
        run: bun run typecheck

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
```

### JSON

```json
{
  "$schema": "https://json.schemastore.org/package.json",
  "name": "kickstart",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "test": "vitest",
    "typecheck": "nuxt typecheck"
  },
  "dependencies": {
    "@nuxt/content": "^3.0.0",
    "@nuxt/ui": "^3.0.0",
    "nuxt": "^4.0.0",
    "vue": "^3.5.0"
  },
  "devDependencies": {
    "@nuxt/eslint": "^1.0.0",
    "@nuxt/test-utils": "^3.23.0",
    "typescript": "^5.0.0",
    "vitest": "^4.0.0"
  },
  "engines": {
    "node": ">=20.0.0"
  }
}
```

### XML

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>user-service</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <name>User Service</name>
    <description>User management microservice</description>

    <properties>
        <java.version>21</java.version>
        <spring-boot.version>3.2.0</spring-boot.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <version>${spring-boot.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
            <version>${spring-boot.version}</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

## Template Languages

### Handlebars

```handlebars
{{! User profile template }}
<div class="user-profile">
  <header class="profile-header">
    {{#if user.avatar}}
      <img src="{{user.avatar}}" alt="{{user.name}}'s avatar" class="avatar" />
    {{else}}
      <div class="avatar-placeholder">
        {{firstLetter user.name}}
      </div>
    {{/if}}

    <h1>{{user.name}}</h1>
    {{#if user.isAdmin}}
      <span class="badge badge-admin">Admin</span>
    {{/if}}
  </header>

  <section class="profile-stats">
    {{#each stats as |stat|}}
      <div class="stat">
        <span class="stat-value">{{formatNumber stat.value}}</span>
        <span class="stat-label">{{stat.label}}</span>
      </div>
    {{/each}}
  </section>

  {{#if user.posts.length}}
    <section class="recent-posts">
      <h2>Recent Posts</h2>
      <ul>
        {{#each user.posts}}
          <li>
            <a href="/posts/{{this.id}}">{{this.title}}</a>
            <time datetime="{{this.createdAt}}">
              {{formatDate this.createdAt "MMM d, yyyy"}}
            </time>
          </li>
        {{/each}}
      </ul>
    </section>
  {{else}}
    <p class="empty-state">No posts yet.</p>
  {{/if}}
</div>
```

### Blade (Laravel)

```blade
{{-- User dashboard view --}}
@extends('layouts.app')

@section('title', 'Dashboard')

@push('styles')
    <link rel="stylesheet" href="{{ asset('css/dashboard.css') }}">
@endpush

@section('content')
<div class="container">
    <header class="dashboard-header">
        <h1>Welcome, {{ $user->name }}</h1>

        @can('manage-users')
            <a href="{{ route('admin.users') }}" class="btn btn-primary">
                Manage Users
            </a>
        @endcan
    </header>

    @if (session('success'))
        <x-alert type="success" :message="session('success')" />
    @endif

    <div class="dashboard-grid">
        @forelse ($projects as $project)
            <x-project-card
                :project="$project"
                :show-actions="true"
            />
        @empty
            <div class="empty-state">
                <p>You don't have any projects yet.</p>
                <a href="{{ route('projects.create') }}">Create your first project</a>
            </div>
        @endforelse
    </div>

    {{ $projects->links() }}

    @isset($recentActivity)
        <section class="recent-activity">
            <h2>Recent Activity</h2>
            @include('partials.activity-feed', ['activities' => $recentActivity])
        </section>
    @endisset
</div>
@endsection

@push('scripts')
    <script src="{{ mix('js/dashboard.js') }}" defer></script>
@endpush
```

### Razor (ASP.NET)

```razor
@page "/users/{Id:int}"
@using MyApp.Models
@inject IUserService UserService

@if (user is null)
{
    <div class="loading">Loading...</div>
}
else
{
    <div class="user-profile">
        <header>
            <img src="@user.AvatarUrl" alt="@user.Name" />
            <h1>@user.Name</h1>
            @if (user.IsAdmin)
            {
                <span class="badge">Admin</span>
            }
        </header>

        <section class="stats">
            @foreach (var stat in user.Stats)
            {
                <div class="stat">
                    <span class="value">@stat.Value.ToString("N0")</span>
                    <span class="label">@stat.Label</span>
                </div>
            }
        </section>

        @if (user.Posts.Any())
        {
            <section class="posts">
                <h2>Recent Posts</h2>
                <ul>
                    @foreach (var post in user.Posts.Take(5))
                    {
                        <li>
                            <a href="/posts/@post.Id">@post.Title</a>
                            <time datetime="@post.CreatedAt.ToString("o")">
                                @post.CreatedAt.ToString("MMM d, yyyy")
                            </time>
                        </li>
                    }
                </ul>
            </section>
        }
    </div>
}

@code {
    [Parameter]
    public int Id { get; set; }

    private User? user;

    protected override async Task OnInitializedAsync()
    {
        user = await UserService.GetByIdAsync(Id);
    }
}
```

## Markup & Content

### MDC (Markdown Components)

````mdc
# Getting Started with Kickstart

This guide will help you set up your digital garden.

::note
Make sure you have Bun installed before proceeding.
::

## Installation

::code-group
  ```bash [bun]
  bun create nuxt-app my-garden
  cd my-garden
  bun install
  ```

  ```bash [npm]
  npx nuxi init my-garden
  cd my-garden
  npm install
  ```
::

## Configuration

::tabs
  ::tab{label="Basic"}
    The default configuration works for most use cases.
  ::

  ::tab{label="Advanced"}
    For custom setups, edit `nuxt.config.ts`:

    ```typescript
    export default defineNuxtConfig({
      modules: ['@nuxt/content'],
      content: {
        highlight: {
          theme: 'github-dark'
        }
      }
    })
    ```
  ::
::

::warning
**Breaking Change in v3.** The content module API has changed. See the [migration guide](/guides/migration).
::
````

### MDX

```mdx
import { Chart } from '../components/Chart'
import { Callout } from '../components/Callout'

export const meta = {
  title: 'Performance Analysis',
  author: 'Jane Doe',
  date: '2026-01-23'
}

# {meta.title}

By **{meta.author}** on {meta.date}

<Callout type="info">
  This analysis covers Q4 2025 performance metrics.
</Callout>

## Key Metrics

Our application saw significant improvements this quarter:

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| LCP | 2.8s | 1.2s | -57% |
| FID | 120ms | 45ms | -63% |
| CLS | 0.15 | 0.05 | -67% |

<Chart
  data={[
    { month: 'Oct', value: 2800 },
    { month: 'Nov', value: 1800 },
    { month: 'Dec', value: 1200 }
  ]}
  title="Largest Contentful Paint (ms)"
/>

## Recommendations

1. Continue optimizing images with `@nuxt/image`
2. Implement route-based code splitting
3. Add service worker for offline support

export default ({ children }) => (
  <article className="prose">{children}</article>
)
```

## Testing & Specs

### Gherkin (BDD)

```gherkin
# User authentication feature
Feature: User Authentication
  As a user
  I want to securely log in to my account
  So that I can access my personal content

  Background:
    Given the application is running
    And the database has been seeded with test users

  @smoke @critical
  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter "alice@example.com" as the email
    And I enter "SecurePass123!" as the password
    And I click the "Sign In" button
    Then I should be redirected to the dashboard
    And I should see "Welcome, Alice" in the header
    And I should receive a valid session cookie

  @security
  Scenario Outline: Failed login attempts are rate limited
    Given I am on the login page
    When I attempt to login <attempts> times with invalid credentials
    Then I should see a rate limit warning after 5 attempts
    And my account should be temporarily locked after 10 attempts

    Examples:
      | attempts |
      | 5        |
      | 10       |

  @regression
  Scenario: Password reset flow
    Given I am on the login page
    And I click "Forgot password?"
    When I enter "alice@example.com" as the email
    And I click "Send reset link"
    Then I should see "Check your email for reset instructions"
    And an email should be sent to "alice@example.com"
```

## Data & Config

### CSV

```csv
id,name,email,role,created_at,last_login
1,Alice Johnson,alice@example.com,admin,2025-01-15T10:30:00Z,2026-01-23T08:15:00Z
2,Bob Smith,bob@example.com,user,2025-02-20T14:45:00Z,2026-01-22T16:30:00Z
3,Charlie Brown,charlie@example.com,user,2025-03-10T09:00:00Z,2026-01-20T11:45:00Z
4,Diana Prince,diana@example.com,moderator,2025-04-05T11:20:00Z,2026-01-23T09:00:00Z
5,Edward Norton,edward@example.com,user,2025-05-12T16:10:00Z,2026-01-21T14:20:00Z
```

### Diff

```diff
--- a/nuxt.config.ts
+++ b/nuxt.config.ts
@@ -1,10 +1,15 @@
 export default defineNuxtConfig({
+  ssr: true,
+
   modules: [
     '@nuxt/eslint',
     '@nuxt/ui',
     '@nuxt/content',
+    '@nuxt/image',
+    '@nuxtjs/seo',
   ],

-  devtools: { enabled: true },
+  devtools: { enabled: process.env.NODE_ENV !== 'production' },
+
+  site: {
+    url: 'https://nuxt-kickstart.example.com',
+    name: 'Kickstart',
+  },
 })
```

### Regex

```regex
# Email validation pattern
^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$

# URL with optional protocol
^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$

# ISO 8601 datetime
^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})$

# Semantic version
^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(-((0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(\.(0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(\+([0-9a-zA-Z-]+(\.[0-9a-zA-Z-]+)*))?$

# Password strength (min 8 chars, uppercase, lowercase, number, special)
^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$
```

### HTTP

```http
### Get all users
GET https://api.example.com/v1/users
Authorization: Bearer {{access_token}}
Accept: application/json

### Create a new user
POST https://api.example.com/v1/users
Content-Type: application/json
Authorization: Bearer {{access_token}}

{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "role": "user"
}

### Update user
PATCH https://api.example.com/v1/users/123
Content-Type: application/json
Authorization: Bearer {{access_token}}

{
  "name": "Alice Smith"
}

### Delete user
DELETE https://api.example.com/v1/users/123
Authorization: Bearer {{access_token}}
```

## See Also

- [Adding Content](/guides/adding-content) - Learn the frontmatter schema
- [Customization & Theming](/guides/customization) - Theme configuration
- [Nuxt Content Documentation](https://content.nuxt.com) - Official docs
