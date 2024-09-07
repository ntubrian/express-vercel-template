import { integer, pgEnum, pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';
export const statusEnum = pgEnum('status', ['reviewing', 'accepted', 'rejected']);
export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  email: text('email').notNull().unique(),
});
export const postsTable = pgTable('posts_table', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});
export const proposalsTable = pgTable('proposals_table', {
  id: uuid('id').defaultRandom().primaryKey(),
  description: text('description').notNull(),
  image: text('image').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  author: text('author').notNull(),
  status: statusEnum('status').default("reviewing"),
})
export const activitiesTable = pgTable('activities_table', {
  id: uuid('id').defaultRandom().primaryKey(),
  proposalId: uuid('proposal_id').notNull()
  .references(() => proposalsTable.id, { onDelete: 'cascade' }),
  description: text('description').notNull(),
  image: text('image').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;
export type InsertProposal = typeof proposalsTable.$inferInsert;
export type SelectProposal = typeof proposalsTable.$inferSelect;
export type InsertActivity = typeof activitiesTable.$inferInsert;
export type SelectActivity = typeof activitiesTable.$inferSelect;