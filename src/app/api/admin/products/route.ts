import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
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
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(asc(categories.displayOrder), asc(products.displayOrder));

  return Response.json(allProducts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.name || !body.slug || !body.categoryId || body.price === undefined) {
    return Response.json(
      { error: "نام، اسلاگ، دسته‌بندی و قیمت الزامی است" },
      { status: 400 }
    );
  }

  const result = await db
    .insert(products)
    .values({
      name: body.name,
      slug: body.slug,
      categoryId: body.categoryId,
      description: body.description || null,
      image: body.image || null,
      price: body.price,
      unit: body.unit || "تومان",
      weightOrVolume: body.weightOrVolume || null,
      isAvailable: body.isAvailable !== false,
      isActive: body.isActive !== false,
      isFeatured: body.isFeatured === true,
      displayOrder: body.displayOrder || 0,
    })
    .returning();

  return Response.json(result[0], { status: 201 });
}
