---
number: 4856
title: Validator for custom query
category: Q&A
created: 2025-08-14
url: "https://github.com/drizzle-team/drizzle-orm/discussions/4856"
upvotes: 1
comments: 0
answered: false
---

# Validator for custom query

I'm wondering how to make a validator for a custom query. For example, I have a function that pulls from three tables using inner joins, but find myself needing to write a validator manually and making sure it matches close enough to my database. I believe the answer is making a function that will return a drizzle query, running a createInsertSchema on that object, then be able to execute that object elsewhere to get the results.

Maybe something like this
```ts
const getNoteQuery = () => database
    .select({
      addedDate: notesTable.addedDate,
      author: notesTable.caller,
      authorName: employees.fullName,
      id: notesTable.id,
  ...
      locationUpdated: prospectTable.location_updated,
      locationX: prospectTable.location_x,
      locationY: prospectTable.location_y,
    })
    .from(notesTable)
    .innerJoin(prospectTable, eq(prospectTable.id, notesTable.prospect))
    .innerJoin(employees, eq(employees.userName, notesTable.caller))
    .innerJoin(
      zipCodes,
      eq(zipCodes.zipCode, prospectTable.building_addressZipCode),
    )
    .$dynamic();

export const updateNoteSchema = createUpdateSchema(getNoteQuery);

export const getNote = async (id: number) => {
	return getNoteQuery().where(eq(notesTable.id, id));
}
```...