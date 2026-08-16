import { db } from "@/db";
import { categories } from "@/db/schema";
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
    .from(categories)
    .where(eq(categories.id, parseInt(id)))
    .limit(1);

  if (!result[0]) {
    return Response.json({ error: "دسته‌بندی یافت نشد" }, { status: 404 });
  }

  return Response.json(result[0]);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { name, slug, icon, isActive, displayOrder } = body;

  const result = await db
    .update(categories)
    .set({
      name,
      slug,
      icon: icon || null,
      isActive: isActive !== false,
      displayOrder: displayOrder || 0,
      updatedAt: new Date(),
    })
    .where(eq(categories.id, parseInt(id)))
    .returning();

  if (!result[0]) {
    return Response.json({ error: "دسته‌بندی یافت نشد" }, { status: 404 });
  }

  return Response.json(result[0]);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  await db.delete(categories).where(eq(categories.id, parseInt(id)));
  return Response.json({ success: true });
}
