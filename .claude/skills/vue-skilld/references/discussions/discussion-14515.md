---
number: 14515
title: keep-alive缓存。多个路由使用同一个组件 缓存存在问题
category: Help/Questions
created: 2026-03-04
url: "https://github.com/orgs/vuejs/discussions/14515"
upvotes: 1
comments: 3
answered: false
---

# keep-alive缓存。多个路由使用同一个组件 缓存存在问题

这是我的代码 `  <router-view v-slot="{ Component, route }">
        <transition name="fade-transform" mode="out-in" @after-enter="resizeScroll" @after-leave="resizeScroll">
          <keep-alive>
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
        </transition>
      </router-view>`
控制台提示错误`runtime-dom.esm-bundler.js:51 Uncaught (in promise) TypeError: Cannot read properties of null (reading 'parentNode')`
对于多个路由对应同一个组件通过query进行控制时 如何进行有效的缓存

---

## Top Comments

**@l246804**:

可以试试我的组件 vue-router-better-view :eyes: 通过 `cacheBy` 精准控制缓存的组件

**@wowoName** (+1):

@l246804  好使 感谢

**@beishuangzz**:

keep-alive是根据组件name进行缓存的, 如果是同一个组件需要缓存多份, 建议把组件动态封装一层, 设置不同的name