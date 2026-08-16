import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  icon: varchar("icon", { length: 50 }),
  isActive: boolean("is_active").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),
  description: text("description"),
  image: varchar("image", { length: 1024 }),
  price: integer("price").notNull(), // in toman
  unit: varchar("unit", { length: 50 }).default("تومان"),
  weightOrVolume: varchar("weight_or_volume", { length: 100 }),
  isAvailable: boolean("is_available").notNull().default(true),
  isActive: boolean("is_active").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  storeName: varchar("store_name", { length: 255 }).notNull().default("لبنیات و بستنی"),
  logo: varchar("logo", { length: 1024 }),
  slogan: varchar("slogan", { length: 500 }),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  instagram: varchar("instagram", { length: 255 }),
  workingHours: varchar("working_hours", { length: 255 }),
  shortDescription: text("short_description"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
