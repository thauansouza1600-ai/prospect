import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  username: text('username').notNull(),
  phone: text('phone').notNull(),
  bio: text('bio'),
  origin: text('origin'),
  createdAt: timestamp('created_at').defaultNow(),
});

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;