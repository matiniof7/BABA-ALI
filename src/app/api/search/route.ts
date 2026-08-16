import { searchProducts, formatPrice } from "@/lib/queries";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  
  if (!q || q.length < 1) {
    return Response.json([]);
  }

  const results = await searchProducts(q);
  return Response.json(
    results.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      image: p.image,
      price: formatPrice(p.price),
      unit: p.unit,
      categoryName: p.categoryName,
      isAvailable: p.isAvailable,
    }))
  );
}
