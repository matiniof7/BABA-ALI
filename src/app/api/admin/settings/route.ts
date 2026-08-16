import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await db.select().from(siteSettings).limit(1);
  return Response.json(
    result[0] || {
      storeName: "لبنیات و بستنی",
      slogan: "",
      phone: "025-34433415",
      address: "قم، روستای ورجان، روبروی سنگبری، لبنیات و بستنی بابا علی",
      instagram: "https://www.instagram.com/baba_ali_verjan?igsh=MW84bHN3Y2o2ZnU4cw==",
      workingHours: "",
      shortDescription: "",
      logo: "",
    }
  );
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const existing = await db.select().from(siteSettings).limit(1);

  if (existing[0]) {
    const result = await db
      .update(siteSettings)
      .set({
        storeName: body.storeName || "لبنیات و بستنی",
        logo: body.logo || null,
        slogan: body.slogan || null,
        phone: body.phone || null,
        address: body.address || null,
        instagram: body.instagram || null,
        workingHours: body.workingHours || null,
        shortDescription: body.shortDescription || null,
        updatedAt: new Date(),
      })
      .where(eq(siteSettings.id, existing[0].id))
      .returning();
    return Response.json(result[0]);
  } else {
    const result = await db
      .insert(siteSettings)
      .values({
        storeName: body.storeName || "لبنیات و بستنی",
        logo: body.logo || null,
        slogan: body.slogan || null,
        phone: body.phone || null,
        address: body.address || null,
        instagram: body.instagram || null,
        workingHours: body.workingHours || null,
        shortDescription: body.shortDescription || null,
      })
      .returning();
    return Response.json(result[0], { status: 201 });
  }
}
