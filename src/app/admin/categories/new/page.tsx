"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      icon: formData.get("icon") as string,
      displayOrder: parseInt(formData.get("displayOrder") as string) || 0,
      isActive: formData.get("isActive") === "on",
    };

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "خطا در ایجاد دسته‌بندی");
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
          <h1 className="admin-title">دسته‌بندی جدید</h1>
          <Link href="/admin/categories" className="admin-btn admin-btn-secondary">← بازگشت</Link>
        </div>

        {error && <div className="admin-alert admin-alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-group">
            <label className="admin-form-label">نام *</label>
            <input name="name" className="admin-form-input" required placeholder="مثلاً: بستنی" />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">اسلاگ (Slug) *</label>
            <input name="slug" className="admin-form-input" required placeholder="مثلاً: bastani" style={{ direction: "ltr" }} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">آیکون (Emoji)</label>
            <input name="icon" className="admin-form-input" placeholder="مثلاً: 🍨" />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">ترتیب نمایش</label>
            <input name="displayOrder" type="number" className="admin-form-input" defaultValue="0" />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-checkbox">
              <input name="isActive" type="checkbox" defaultChecked />
              <span>فعال</span>
            </label>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
              {loading ? "در حال ذخیره..." : "ذخیره"}
            </button>
            <Link href="/admin/categories" className="admin-btn admin-btn-secondary">انصراف</Link>
          </div>
        </form>
      </main>
    </div>
  );
}
