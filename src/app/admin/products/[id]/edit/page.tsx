"use client";

import Link from "next/link";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

type Category = {
  id: number;
  name: string;
};

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [product, setProduct] = useState({
    name: "",
    slug: "",
    categoryId: 0,
    description: "",
    image: "",
    price: 0,
    unit: "تومان",
    weightOrVolume: "",
    displayOrder: 0,
    isAvailable: true,
    isActive: true,
    isFeatured: false,
  });

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/products/${id}`).then((r) => r.json()),
      fetch("/api/admin/categories").then((r) => r.json()),
    ])
      .then(([prodData, catData]) => {
        setProduct({
          name: prodData.name || "",
          slug: prodData.slug || "",
          categoryId: prodData.categoryId || 0,
          description: prodData.description || "",
          image: prodData.image || "",
          price: prodData.price || 0,
          unit: prodData.unit || "تومان",
          weightOrVolume: prodData.weightOrVolume || "",
          displayOrder: prodData.displayOrder || 0,
          isAvailable: prodData.isAvailable !== false,
          isActive: prodData.isActive !== false,
          isFeatured: prodData.isFeatured === true,
        });
        setCategoriesList(catData);
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
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "خطا در ویرایش");
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

  if (fetching)
    return (
      <div className="admin-layout">
        <main className="admin-main" style={{ marginLeft: 240 }}>
          Loading...
        </main>
      </div>
    );

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
          <h1 className="admin-title">ویرایش: {product.name}</h1>
          <Link href="/admin/products" className="admin-btn admin-btn-secondary">
            ← بازگشت
          </Link>
        </div>

        {error && <div className="admin-alert admin-alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-group">
            <label className="admin-form-label">نام محصول *</label>
            <input
              className="admin-form-input"
              required
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">اسلاگ (Slug) *</label>
            <input
              className="admin-form-input"
              required
              value={product.slug}
              onChange={(e) => setProduct({ ...product, slug: e.target.value })}
              style={{ direction: "ltr" }}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">دسته‌بندی *</label>
            <select
              className="admin-form-select"
              required
              value={product.categoryId}
              onChange={(e) =>
                setProduct({
                  ...product,
                  categoryId: parseInt(e.target.value),
                })
              }
            >
              <option value="">انتخاب کنید</option>
              {categoriesList.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">توضیحات</label>
            <textarea
              className="admin-form-textarea"
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">آدرس تصویر</label>
            <input
              className="admin-form-input"
              value={product.image}
              onChange={(e) =>
                setProduct({ ...product, image: e.target.value })
              }
              style={{ direction: "ltr" }}
            />
            {product.image && (
              <img
                src={product.image}
                alt="Preview"
                className="admin-form-image-preview"
              />
            )}
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">قیمت (تومان) *</label>
            <input
              type="number"
              className="admin-form-input"
              required
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: parseInt(e.target.value) || 0 })
              }
              style={{ direction: "ltr" }}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">واحد</label>
            <input
              className="admin-form-input"
              value={product.unit}
              onChange={(e) =>
                setProduct({ ...product, unit: e.target.value })
              }
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">وزن / حجم</label>
            <input
              className="admin-form-input"
              value={product.weightOrVolume}
              onChange={(e) =>
                setProduct({ ...product, weightOrVolume: e.target.value })
              }
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">ترتیب نمایش</label>
            <input
              type="number"
              className="admin-form-input"
              value={product.displayOrder}
              onChange={(e) =>
                setProduct({
                  ...product,
                  displayOrder: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>
          <div
            className="admin-form-group"
            style={{
              display: "flex",
              gap: "var(--space-5)",
              flexWrap: "wrap",
            }}
          >
            <label className="admin-form-checkbox">
              <input
                type="checkbox"
                checked={product.isActive}
                onChange={(e) =>
                  setProduct({ ...product, isActive: e.target.checked })
                }
              />
              <span>فعال</span>
            </label>
            <label className="admin-form-checkbox">
              <input
                type="checkbox"
                checked={product.isAvailable}
                onChange={(e) =>
                  setProduct({ ...product, isAvailable: e.target.checked })
                }
              />
              <span>موجود</span>
            </label>
            <label className="admin-form-checkbox">
              <input
                type="checkbox"
                checked={product.isFeatured}
                onChange={(e) =>
                  setProduct({ ...product, isFeatured: e.target.checked })
                }
              />
              <span>پیشنهاد ویژه</span>
            </label>
          </div>
          <div className="admin-form-actions">
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={loading}
            >
              {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
            <Link
              href="/admin/products"
              className="admin-btn admin-btn-secondary"
            >
              انصراف
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
