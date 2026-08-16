import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import Link from "next/link";
import { formatPrice } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const allProducts = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      categoryId: products.categoryId,
      image: products.image,
      price: products.price,
      isAvailable: products.isAvailable,
      isActive: products.isActive,
      isFeatured: products.isFeatured,
      displayOrder: products.displayOrder,
      categoryName: categories.name,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(asc(categories.displayOrder), asc(products.displayOrder));

  return (
    <div className="admin-layout">
      <nav className="admin-sidebar">
        <div className="admin-sidebar-brand">🍦 پنل مدیریت</div>
        <Link href="/admin" className="admin-nav-item">📊 داشبورد</Link>
        <Link href="/admin/categories" className="admin-nav-item">📁 دسته‌بندی‌ها</Link>
        <Link href="/admin/products" className="admin-nav-item active">📦 محصولات</Link>
        <Link href="/admin/settings" className="admin-nav-item">⚙️ تنظیمات</Link>
        <Link href="/menu" className="admin-nav-item" target="_blank">🌐 مشاهده منو</Link>
      </nav>

      <main className="admin-main">
        <div className="admin-header">
          <h1 className="admin-title">محصولات ({allProducts.length})</h1>
          <Link href="/admin/products/new" className="admin-btn admin-btn-primary">
            + افزودن محصول
          </Link>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>تصویر</th>
                <th>نام</th>
                <th>دسته‌بندی</th>
                <th>قیمت</th>
                <th>ترتیب</th>
                <th>وضعیت</th>
                <th>موجودی</th>
                <th>ویژه</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {allProducts.map((prod) => (
                <tr key={prod.id}>
                  <td>
                    {prod.image ? (
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="admin-table-thumb"
                      />
                    ) : (
                      <div
                        className="admin-table-thumb"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.2rem",
                        }}
                      >
                        🍦
                      </div>
                    )}
                  </td>
                  <td style={{ fontWeight: 500 }}>{prod.name}</td>
                  <td>{prod.categoryName}</td>
                  <td style={{ direction: "ltr", textAlign: "right" }}>
                    {formatPrice(prod.price)} تومان
                  </td>
                  <td>{prod.displayOrder}</td>
                  <td>
                    <span className={`admin-badge ${prod.isActive ? "admin-badge-green" : "admin-badge-red"}`}>
                      {prod.isActive ? "فعال" : "غیرفعال"}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${prod.isAvailable ? "admin-badge-green" : "admin-badge-red"}`}>
                      {prod.isAvailable ? "موجود" : "ناموجود"}
                    </span>
                  </td>
                  <td>
                    {prod.isFeatured && (
                      <span className="admin-badge admin-badge-blue">⭐ ویژه</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "var(--space-2)" }}>
                      <Link href={`/admin/products/${prod.id}/edit`} className="admin-btn admin-btn-secondary">
                        ویرایش
                      </Link>
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger"
                        data-delete-product={prod.id}
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {allProducts.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "var(--space-8)", color: "var(--text-tertiary)" }}>
                    هیچ محصولی وجود ندارد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.querySelectorAll('[data-delete-product]').forEach(function(btn) {
              btn.addEventListener('click', function() {
                if (confirm('آیا از حذف این محصول مطمئن هستید؟')) {
                  var id = btn.getAttribute('data-delete-product');
                  fetch('/api/admin/products/' + id, { method: 'DELETE' })
                    .then(function() { window.location.reload(); });
                }
              });
            });
          `,
        }}
      />
    </div>
  );
}
