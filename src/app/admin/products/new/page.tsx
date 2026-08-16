"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Category = {
  id: number;
  name: string;
};

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategoriesList(data))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      categoryId: parseInt(formData.get("categoryId") as string),
      description: formData.get("description") as string,
      image: formData.get("image") as string,
      price: parseInt(formData.get("price") as string),
      unit: (formData.get("unit") as string) || "تومان",
      weightOrVolume: formData.get("weightOrVolume") as string,
      displayOrder: parseInt(formData.get("displayOrder") as string) || 0,
      isAvailable: formData.get("isAvailable") === "on",
      isActive: formData.get("isActive") === "on",
      isFeatured: formData.get("isFeatured") === "on",
    };

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "خطا در ایجاد محصول");
        setLoading(false);
        return;
      }

      router.push("/admin/products");
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
        <Link href="/admin/categories" className="admin-nav-item">📁 دسته‌بندی‌ها</Link>
        <Link href="/admin/products" className="admin-nav-item active">📦 محصولات</Link>
        <Link href="/admin/settings" className="admin-nav-item">⚙️ تنظیمات</Link>
        <Link href="/menu" className="admin-nav-item" target="_blank">🌐 مشاهده منو</Link>
      </nav>

      <main className="admin-main">
        <div className="admin-header">
          <h1 className="admin-title">محصول جدید</h1>
          <Link href="/admin/products" className="admin-btn admin-btn-secondary">← بازگشت</Link>
        </div>

        {error && <div className="admin-alert admin-alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-group">
            <label className="admin-form-label">نام محصول *</label>
            <input name="name" className="admin-form-input" required placeholder="مثلاً: بستنی سنتی" />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">اسلاگ (Slug) *</label>
            <input name="slug" className="admin-form-input" required placeholder="مثلاً: bastani-sonnati" style={{ direction: "ltr" }} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">دسته‌بندی *</label>
            <select name="categoryId" className="admin-form-select" required>
              <option value="">انتخاب کنید</option>
              {categoriesList.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">توضیحات</label>
            <textarea name="description" className="admin-form-textarea" placeholder="توضیحات محصول..." />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">آدرس تصویر</label>
            <input name="image" className="admin-form-input" placeholder="/images/product.jpg" style={{ direction: "ltr" }} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">قیمت (تومان) *</label>
            <input name="price" type="number" className="admin-form-input" required placeholder="120000" style={{ direction: "ltr" }} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">واحد</label>
            <input name="unit" className="admin-form-input" defaultValue="تومان" />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">وزن / حجم</label>
            <input name="weightOrVolume" className="admin-form-input" placeholder="۱۵۰ گرم" />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">ترتیب نمایش</label>
            <input name="displayOrder" type="number" className="admin-form-input" defaultValue="0" />
          </div>
          <div className="admin-form-group" style={{ display: "flex", gap: "var(--space-5)", flexWrap: "wrap" }}>
            <label className="admin-form-checkbox">
              <input name="isActive" type="checkbox" defaultChecked />
              <span>فعال</span>
            </label>
            <label className="admin-form-checkbox">
              <input name="isAvailable" type="checkbox" defaultChecked />
              <span>موجود</span>
            </label>
            <label className="admin-form-checkbox">
              <input name="isFeatured" type="checkbox" />
              <span>پیشنهاد ویژه</span>
            </label>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
              {loading ? "در حال ذخیره..." : "ذخیره"}
            </button>
            <Link href="/admin/products" className="admin-btn admin-btn-secondary">انصراف</Link>
          </div>
        </form>
      </main>
    </div>
  );
}
