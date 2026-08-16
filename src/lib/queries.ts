import { db } from "@/db";
import { categories, products, siteSettings } from "@/db/schema";
import { eq, and, asc, ilike, or, desc } from "drizzle-orm";

export async function getActiveCategories() {
  return db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(asc(categories.displayOrder), asc(categories.name));
}

export async function getAllCategories() {
  return db
    .select()
    .from(categories)
    .orderBy(asc(categories.displayOrder), asc(categories.name));
}

export async function getCategoryBySlug(slug: string) {
  const result = await db
    .select()
    .from(categories)
    .where(and(eq(categories.slug, slug), eq(categories.isActive, true)))
    .limit(1);
  return result[0] || null;
}

export async function getCategoryById(id: number) {
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);
  return result[0] || null;
}

export async function getActiveProducts(categoryId?: number) {
  if (categoryId) {
    return db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        categoryId: products.categoryId,
        description: products.description,
        image: products.image,
        price: products.price,
        unit: products.unit,
        weightOrVolume: products.weightOrVolume,
        isAvailable: products.isAvailable,
        isActive: products.isActive,
        isFeatured: products.isFeatured,
        displayOrder: products.displayOrder,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        categoryName: categories.name,
        categorySlug: categories.slug,
        categoryIcon: categories.icon,
      })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(
        and(
          eq(products.isActive, true),
          eq(products.categoryId, categoryId),
          eq(categories.isActive, true)
        )
      )
      .orderBy(asc(products.displayOrder), asc(products.name));
  }

  return db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      categoryId: products.categoryId,
      description: products.description,
      image: products.image,
      price: products.price,
      unit: products.unit,
      weightOrVolume: products.weightOrVolume,
      isAvailable: products.isAvailable,
      isActive: products.isActive,
      isFeatured: products.isFeatured,
      displayOrder: products.displayOrder,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
      categoryIcon: categories.icon,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.isActive, true), eq(categories.isActive, true)))
    .orderBy(asc(categories.displayOrder), asc(products.displayOrder), asc(products.name));
}

export async function getFeaturedProducts() {
  return db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      categoryId: products.categoryId,
      description: products.description,
      image: products.image,
      price: products.price,
      unit: products.unit,
      weightOrVolume: products.weightOrVolume,
      isAvailable: products.isAvailable,
      isActive: products.isActive,
      isFeatured: products.isFeatured,
      displayOrder: products.displayOrder,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
      categoryIcon: categories.icon,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(products.isActive, true),
        eq(products.isFeatured, true),
        eq(categories.isActive, true)
      )
    )
    .orderBy(asc(products.displayOrder));
}

export async function searchProducts(query: string) {
  const searchTerm = `%${query}%`;
  return db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      categoryId: products.categoryId,
      description: products.description,
      image: products.image,
      price: products.price,
      unit: products.unit,
      weightOrVolume: products.weightOrVolume,
      isAvailable: products.isAvailable,
      isActive: products.isActive,
      isFeatured: products.isFeatured,
      displayOrder: products.displayOrder,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
      categoryIcon: categories.icon,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(products.isActive, true),
        eq(categories.isActive, true),
        or(
          ilike(products.name, searchTerm),
          ilike(products.description, searchTerm)
        )
      )
    )
    .orderBy(asc(products.displayOrder));
}

export async function getProductBySlug(slug: string) {
  const result = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      categoryId: products.categoryId,
      description: products.description,
      image: products.image,
      price: products.price,
      unit: products.unit,
      weightOrVolume: products.weightOrVolume,
      isAvailable: products.isAvailable,
      isActive: products.isActive,
      isFeatured: products.isFeatured,
      displayOrder: products.displayOrder,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
      categoryIcon: categories.icon,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.slug, slug), eq(products.isActive, true)))
    .limit(1);
  return result[0] || null;
}

export async function getProductById(id: number) {
  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  return result[0] || null;
}

export async function getAllProducts() {
  return db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      categoryId: products.categoryId,
      description: products.description,
      image: products.image,
      price: products.price,
      unit: products.unit,
      weightOrVolume: products.weightOrVolume,
      isAvailable: products.isAvailable,
      isActive: products.isActive,
      isFeatured: products.isFeatured,
      displayOrder: products.displayOrder,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(asc(categories.displayOrder), asc(products.displayOrder));
}

export async function getSiteSettings() {
  const result = await db.select().from(siteSettings).limit(1);
  return (
    result[0] || {
      id: 0,
      storeName: "لبنیات و بستنی",
      slogan: "تازه، خنک، خوشمزه",
      phone: null,
      address: null,
      instagram: null,
      workingHours: null,
      shortDescription: null,
      logo: null,
      updatedAt: new Date(),
    }
  );
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fa-IR").format(price);
}

export async function getProductsBySlugs(slugs: string[]) {
  const allProducts = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      categoryId: products.categoryId,
      description: products.description,
      image: products.image,
      price: products.price,
      unit: products.unit,
      weightOrVolume: products.weightOrVolume,
      isAvailable: products.isAvailable,
      isActive: products.isActive,
      isFeatured: products.isFeatured,
      displayOrder: products.displayOrder,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
      categoryIcon: categories.icon,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.isActive, true), eq(categories.isActive, true)));

  // Sort by the order of slugs provided
  const slugOrder = new Map(slugs.map((slug, index) => [slug, index]));
  return allProducts
    .filter((p) => slugs.includes(p.slug))
    .sort((a, b) => (slugOrder.get(a.slug) ?? 99) - (slugOrder.get(b.slug) ?? 99));
}
