import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
export const statusEnum = pgEnum("status", [
  "reviewing",
  "accepted",
  "rejected",
]);
export const usersTable = pgTable("users_table", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  email: text("email").notNull().unique(),
});
export const postsTable = pgTable("posts_table", {
  id: uuid("id").defaultRandom().primaryKey(),
  activityId: uuid("activity_id")
    .notNull()
    .references(() => activitiesTable.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  image: text("image").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
export const proposalsTable = pgTable("proposals_table", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  status: statusEnum("status").default("reviewing"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
export const activitiesTable = pgTable("activities_table", {
  id: uuid("id").defaultRandom().primaryKey(),

  // proposalId: uuid("proposal_id") // 去掉
  //   .notNull()
  //   .references(() => proposalsTable.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  image: text("image").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
export const commentsTable = pgTable("comments_table", {
  id: uuid("id").defaultRandom().primaryKey(),
  postId: uuid("post_id")
    .notNull()
    .references(() => postsTable.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
export const likesTable = pgTable(
  "likes_table",
  {
    id: uuid("id").notNull().defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id),
    postId: uuid("post_id")
      .notNull()
      .references(() => postsTable.id),
  },
  (table) => ({
    unq: unique().on(table.userId, table.postId),
  })
);
export const visitsTable = pgTable(
  "visits_table",
  {
    id: uuid("id").notNull().defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id),
    spotId: serial("spot_id").notNull(),
    visitedAt: timestamp("visited_at").notNull().defaultNow(),
  },
  (table) => ({
    unq: unique().on(table.userId, table.spotId),
  })
);
export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;
export type PatchPost = typeof postsTable.$inferSelect;
export type InsertProposal = typeof proposalsTable.$inferInsert;
export type SelectProposal = typeof proposalsTable.$inferSelect;
export type InsertActivity = typeof activitiesTable.$inferInsert;
export type SelectActivity = typeof activitiesTable.$inferSelect;
export type InsertComment = typeof commentsTable.$inferInsert;
export type SelectComment = typeof commentsTable.$inferSelect;
export type InsertLike = typeof likesTable.$inferInsert;
export type SelectLike = typeof likesTable.$inferSelect;
export type InsertVisit = typeof visitsTable.$inferInsert;
export type SelectVisit = typeof visitsTable.$inferSelect;
