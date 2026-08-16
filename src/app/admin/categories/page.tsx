import { db } from "@/db";
import { categories } from "@/db/schema";
import { asc } from "drizzle-orm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const allCategories = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.displayOrder), asc(categories.name));

  return (
    <div className="admin-layout">
      <nav className="admin-sidebar">
        <div className="admin-sidebar-brand">🍦 پنل مدیریت</div>
        <Link href="/admin" className="admin-nav-item">
          📊 داشبورد
        </Link>
        <Link href="/admin/categories" className="admin-nav-item active">
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
          <h1 className="admin-title">دسته‌بندی‌ها</h1>
          <Link href="/admin/categories/new" className="admin-btn admin-btn-primary">
            + افزودن دسته‌بندی
          </Link>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>آیکون</th>
              <th>نام</th>
              <th>اسلاگ</th>
              <th>ترتیب</th>
              <th>وضعیت</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {allCategories.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.icon || "—"}</td>
                <td style={{ fontWeight: 500 }}>{cat.name}</td>
                <td style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>
                  {cat.slug}
                </td>
                <td>{cat.displayOrder}</td>
                <td>
                  <span
                    className={`admin-badge ${
                      cat.isActive ? "admin-badge-green" : "admin-badge-red"
                    }`}
                  >
                    {cat.isActive ? "فعال" : "غیرفعال"}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "var(--space-2)" }}>
                    <Link
                      href={`/admin/categories/${cat.id}/edit`}
                      className="admin-btn admin-btn-secondary"
                    >
                      ویرایش
                    </Link>
                    <form action={`/api/admin/categories/${cat.id}`} method="POST">
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger"
                        data-delete-category={cat.id}
                      >
                        حذف
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {allCategories.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "var(--space-8)", color: "var(--text-tertiary)" }}>
                  هیچ دسته‌بندی وجود ندارد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.querySelectorAll('[data-delete-category]').forEach(function(btn) {
              btn.addEventListener('click', function() {
                if (confirm('آیا از حذف این دسته‌بندی مطمئن هستید؟')) {
                  var id = btn.getAttribute('data-delete-category');
                  fetch('/api/admin/categories/' + id, { method: 'DELETE' })
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
