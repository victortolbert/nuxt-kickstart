---
number: 1237
title: "[FEATURE]: return a object instead of a array if insert value is a object not array"
type: feature
state: open
created: 2023-09-16
url: "https://github.com/drizzle-team/drizzle-orm/issues/1237"
reactions: 160
comments: 32
labels: "[enhancement, qb/crud]"
---

# [FEATURE]: return a object instead of a array if insert value is a object not array

### Describe what you want

Hi, I want to create a row, so I code this.

```ts
const model = await this.db.drizzle
      .insert(schema.user)
      .values({
        authCode,
        ...userDto,
        password: hashSync(userDto.password, 10),
      })
      .returning()

return model[0]
```

I added a `.returning` to get the new model. But I got `model[]`, to I should destruct it first. `model[0]` is the data I want. But I insert just a single object, so the expected result should be an object, which can save one step of writing.

This is the expected behaviour.

```ts
const model = await this.db.drizzle
      .insert(schema.user)
      .values({
        authCode,
        ...userDto,
        password: hashSync(userDto.password, 10),
      })
      .returning()

return model
```

---

## Top Comments

**@spence** (+76):

Just destructure on response:
```ts
const [ model ] = await this.db.drizzle
      .insert(schema.user)
      .values({
        authCode,
        ...userDto,
        password: hashSync(userDto.password, 10),
      })
      .returning()

return model
```

**@Sapeiidw** (+37):

I truly hope they develop this feature; constantly having to destructure like this can be quite frustrating.

const [model]= await this.db.drizzle
      .insert(schema.user)
      .values({
        authCode,
        ...userDto,
        password: hashSync(userDto.password, 10),
      })
      .returning()
      
      const model = await this.db.drizzle
      .insert(schema.user)
      .values({
        authCode,
        ...userDto,
        password: hashSync(userDto.password, 10),
      })
      .returning().first()
      
      how about this
      

**@jhonsfran** (+9):

what about ?

```typescript
const  model  = await this.db.drizzle
      .insert(schema.user)
      .values({
        authCode,
        ...userDto,
        password: hashSync(userDto.password, 10),
      })
        .returning()
        .then((res) => res[0] ?? null)

return model
```