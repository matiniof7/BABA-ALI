const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

async function apiGet(path: string) {
  if (!API_BASE) throw new Error("API base not configured");
  const res = await fetch(`${API_BASE}/${path.replace(/^\//, '')}`);
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// If NEXT_PUBLIC_API_URL is set, use the Django API, otherwise fall back to existing drizzle DB (server-only)
let useApi = !!API_BASE;

if (!useApi) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { db } = require("@/db");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  var drizzleDb = db;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  var schema = require("@/db/schema");
  // Import operators when using drizzle
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  var drizzleOps = require("drizzle-orm");
}

export async function getActiveCategories() {
  if (useApi) {
    return apiGet("categories/");
  }
  const { categories } = schema;
  const { eq, asc } = drizzleOps;
  return drizzleDb.select().from(categories).where(eq(categories.isActive, true)).orderBy(asc(categories.displayOrder), asc(categories.name));
}

export async function getAllCategories() {
  if (useApi) return apiGet("categories/");
  const { categories } = schema;
  const { asc } = drizzleOps;
  return drizzleDb.select().from(categories).orderBy(asc(categories.displayOrder), asc(categories.name));
}

export async function getCategoryBySlug(slug: string) {
  if (useApi) {
    const categories = await apiGet(`categories/?slug=${encodeURIComponent(slug)}`);
    return (categories && categories.length && categories[0]) || null;
  }
  const { categories } = schema;
  const { and, eq } = drizzleOps;
  const result = await drizzleDb.select().from(categories).where(and(eq(categories.slug, slug), eq(categories.isActive, true))).limit(1);
  return result[0] || null;
}

export async function getCategoryById(id: number) {
  if (useApi) {
    const categories = await apiGet(`categories/?id=${id}`);
    return (categories && categories.length && categories[0]) || null;
  }
  const { categories } = schema;
  const { eq } = drizzleOps;
  const result = await drizzleDb.select().from(categories).where(eq(categories.id, id)).limit(1);
  return result[0] || null;
}

export async function getActiveProducts(categoryId?: number) {
  if (useApi) {
    const q = categoryId ? `products/?category_id=${categoryId}` : `products/`;
    return apiGet(q);
  }
  const { products, categories } = schema;
  const { eq, and, asc } = drizzleOps;
  if (categoryId) {
    return drizzleDb
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

  const { products: p, categories: c } = schema;
  const { eq: eq2, and: and2, asc: asc2 } = drizzleOps;
  return drizzleDb
    .select({
      id: p.id,
      name: p.name,
      slug: p.slug,
      categoryId: p.categoryId,
      description: p.description,
      image: p.image,
      price: p.price,
      unit: p.unit,
      weightOrVolume: p.weightOrVolume,
      isAvailable: p.isAvailable,
      isActive: p.isActive,
      isFeatured: p.isFeatured,
      displayOrder: p.displayOrder,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      categoryName: c.name,
      categorySlug: c.slug,
      categoryIcon: c.icon,
    })
    .from(p)
    .innerJoin(c, eq2(p.categoryId, c.id))
    .where(and2(eq2(p.isActive, true), eq2(c.isActive, true)))
    .orderBy(asc2(c.displayOrder), asc2(p.displayOrder), asc2(p.name));
}

export async function getFeaturedProducts() {
  if (useApi) return apiGet("products/?featured=1");
  const { products, categories } = schema;
  const { eq, and, asc } = drizzleOps;
  return drizzleDb
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
  if (useApi) return apiGet(`products/?search=${encodeURIComponent(query)}`);
  const { products, categories } = schema;
  const { eq, and, ilike, or, asc } = drizzleOps;
  const searchTerm = `%${query}%`;
  return drizzleDb
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
  if (useApi) return apiGet(`products/${encodeURIComponent(slug)}/`);
  const { products, categories } = schema;
  const { eq } = drizzleOps;
  const result = await drizzleDb
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
    .where(eq(products.slug, slug))
    .limit(1);
  return result[0] || null;
}

export async function getProductById(id: number) {
  if (useApi) {
    const arr = await apiGet(`products/?id=${id}`);
    return (arr && arr.length && arr[0]) || null;
  }
  const { products } = schema;
  const { eq } = drizzleOps;
  const result = await drizzleDb.select().from(products).where(eq(products.id, id)).limit(1);
  return result[0] || null;
}

export async function getAllProducts() {
  if (useApi) return apiGet("products/");
  const { products, categories } = schema;
  const { eq, asc } = drizzleOps;
  return drizzleDb
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
  if (useApi) return apiGet("site-settings/");
  const { siteSettings } = schema;
  const result = await drizzleDb.select().from(siteSettings).limit(1);
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
