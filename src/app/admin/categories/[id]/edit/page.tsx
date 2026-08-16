"use client";

import Link from "next/link";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

export default function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState({
    name: "",
    slug: "",
    icon: "",
    displayOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    fetch(`/api/admin/categories/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCategory({
          name: data.name || "",
          slug: data.slug || "",
          icon: data.icon || "",
          displayOrder: data.displayOrder || 0,
          isActive: data.isActive !== false,
        });
        setFetching(false);
      })
      .catch(() => {
        setError("خطا در بارگذاری");
        setFetching(false);
      });
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "خطا در ویرایش");
        setLoading(false);
        return;
      }

      router.push("/admin/categories");
      router.refresh();
    } catch {
      setError("خطا در ارتباط با سرور");
      setLoading(false);
    }
  }

  if (fetching) return <div className="admin-layout"><main className="admin-main" style={{ marginLeft: 240 }}>Loading...</main></div>;

  return (
    <div className="admin-layout">
      <nav className="admin-sidebar">
        <div className="admin-sidebar-brand">🍦 پنل مدیریت</div>
        <Link href="/admin" className="admin-nav-item">📊 داشبورد</Link>
        <Link href="/admin/categories" className="admin-nav-item active">📁 دسته‌بندی‌ها</Link>
        <Link href="/admin/products" className="admin-nav-item">📦 محصولات</Link>
        <Link href="/admin/settings" className="admin-nav-item">⚙️ تنظیمات</Link>
        <Link href="/menu" className="admin-nav-item" target="_blank">🌐 مشاهده منو</Link>
      </nav>

      <main className="admin-main">
        <div className="admin-header">
          <h1 className="admin-title">ویرایش دسته‌بندی: {category.name}</h1>
          <Link href="/admin/categories" className="admin-btn admin-btn-secondary">← بازگشت</Link>
        </div>

        {error && <div className="admin-alert admin-alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-group">
            <label className="admin-form-label">نام *</label>
            <input
              className="admin-form-input"
              required
              value={category.name}
              onChange={(e) => setCategory({ ...category, name: e.target.value })}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">اسلاگ (Slug) *</label>
            <input
              className="admin-form-input"
              required
              value={category.slug}
              onChange={(e) => setCategory({ ...category, slug: e.target.value })}
              style={{ direction: "ltr" }}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">آیکون (Emoji)</label>
            <input
              className="admin-form-input"
              value={category.icon}
              onChange={(e) => setCategory({ ...category, icon: e.target.value })}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">ترتیب نمایش</label>
            <input
              type="number"
              className="admin-form-input"
              value={category.displayOrder}
              onChange={(e) => setCategory({ ...category, displayOrder: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-checkbox">
              <input
                type="checkbox"
                checked={category.isActive}
                onChange={(e) => setCategory({ ...category, isActive: e.target.checked })}
              />
              <span>فعال</span>
            </label>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
              {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
            <Link href="/admin/categories" className="admin-btn admin-btn-secondary">انصراف</Link>
          </div>
        </form>
      </main>
    </div>
  );
}
