import { db } from "@/db";
import { categories, products, siteSettings } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [catCount] = await db.select({ count: sql<number>`count(*)` }).from(categories);
  const [prodCount] = await db.select({ count: sql<number>`count(*)` }).from(products);
  const [activeCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(eq(products.isActive, true));
  const [featuredCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(eq(products.isFeatured, true));
  const [unavailableCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(eq(products.isAvailable, false));

  return (
    <div className="admin-layout">
      <nav className="admin-sidebar">
        <div className="admin-sidebar-brand">🍦 پنل مدیریت</div>
        <Link href="/admin" className="admin-nav-item active">
          📊 داشبورد
        </Link>
        <Link href="/admin/categories" className="admin-nav-item">
          📁 دسته‌بندی‌ها
        </Link>
        <Link href="/admin/products" className="admin-nav-item">
          📦 محصولات
        </Link>
        <Link href="/admin/settings" className="admin-nav-item">
          ⚙️ تنظیمات
        </Link>
        <Link href="/menu" className="admin-nav-item" target="_blank">
          🌐 مشاهده منو
        </Link>
      </nav>

      <main className="admin-main">
        <div className="admin-header">
          <h1 className="admin-title">داشبورد</h1>
        </div>

        <div className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-label">دسته‌بندی‌ها</div>
            <div className="admin-stat-value">{Number(catCount.count)}</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-label">کل محصولات</div>
            <div className="admin-stat-value">{Number(prodCount.count)}</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-label">فعال</div>
            <div className="admin-stat-value">{Number(activeCount.count)}</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-label">پیشنهاد ویژه</div>
            <div className="admin-stat-value">{Number(featuredCount.count)}</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-label">ناموجود</div>
            <div className="admin-stat-value">{Number(unavailableCount.count)}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
          <Link href="/admin/categories" className="admin-btn admin-btn-primary">
            📁 مدیریت دسته‌بندی‌ها
          </Link>
          <Link href="/admin/products" className="admin-btn admin-btn-primary">
            📦 مدیریت محصولات
          </Link>
          <Link href="/admin/settings" className="admin-btn admin-btn-secondary">
            ⚙️ تنظیمات فروشگاه
          </Link>
        </div>
      </main>
    </div>
  );
}
