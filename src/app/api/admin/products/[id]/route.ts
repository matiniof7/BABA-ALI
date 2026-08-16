import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, parseInt(id)))
    .limit(1);

  if (!result[0]) {
    return Response.json({ error: "محصول یافت نشد" }, { status: 404 });
  }

  return Response.json(result[0]);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const result = await db
    .update(products)
    .set({
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
      updatedAt: new Date(),
    })
    .where(eq(products.id, parseInt(id)))
    .returning();

  if (!result[0]) {
    return Response.json({ error: "محصول یافت نشد" }, { status: 404 });
  }

  return Response.json(result[0]);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(products).where(eq(products.id, parseInt(id)));
  return Response.json({ success: true });
}
