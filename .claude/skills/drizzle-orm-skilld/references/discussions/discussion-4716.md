---
number: 4716
title: Overload on field
category: Q&A
created: 2025-07-06
url: "https://github.com/drizzle-team/drizzle-orm/discussions/4716"
upvotes: 1
comments: 1
answered: true
---

# Overload on field

Hi,
I have an application build with nextjs/zod/drizzle(version 0.44.0) where i do some insert into a mysql database with the following query:
`    await db.insert(user_sport_results).values({
                     schemaId: validationResult.data.schemaId,
                     trainingId: exercise.id,
                     weight: set.weight,
                     repeats: set.repeats,
                     sets: set.id,
                     difficulty: set.difficulty,
                     userid: session!.user!.id,
                     indexId: validationResult.data!.indexId,
                     created: convertTimestamp(validationResult.data.startData),
                     createdate: CreationTime,
                     updatedate: CreationTime
                 }
            ...

---

## Accepted Answer

Found the solution to apply the schema on the array and that fixes my issue