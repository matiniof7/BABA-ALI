import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const allCategories = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.displayOrder), asc(categories.name));
  return Response.json(allCategories);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, slug, icon, isActive, displayOrder } = body;

  if (!name || !slug) {
    return Response.json({ error: "نام و اسلاگ الزامی است" }, { status: 400 });
  }

  const result = await db
    .insert(categories)
    .values({
      name,
      slug,
      icon: icon || null,
      isActive: isActive !== false,
      displayOrder: displayOrder || 0,
    })
    .returning();

  return Response.json(result[0], { status: 201 });
}
