"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [settings, setSettings] = useState({
    storeName: "",
    logo: "",
    slogan: "",
    phone: "",
    address: "",
    instagram: "",
    workingHours: "",
    shortDescription: "",
  });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings({
          storeName: data.storeName || "",
          logo: data.logo || "",
          slogan: data.slogan || "",
          phone: data.phone || "",
          address: data.address || "",
          instagram: data.instagram || "",
          workingHours: data.workingHours || "",
          shortDescription: data.shortDescription || "",
        });
        setFetching(false);
      })
      .catch(() => {
        setError("خطا در بارگذاری");
        setFetching(false);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        setError("خطا در ذخیره تنظیمات");
        setLoading(false);
        return;
      }

      setSuccess("تنظیمات با موفقیت ذخیره شد.");
      setLoading(false);
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
        <Link href="/admin/products" className="admin-nav-item">📦 محصولات</Link>
        <Link href="/admin/settings" className="admin-nav-item active">⚙️ تنظیمات</Link>
        <Link href="/menu" className="admin-nav-item" target="_blank">🌐 مشاهده منو</Link>
      </nav>

      <main className="admin-main">
        <div className="admin-header">
          <h1 className="admin-title">تنظیمات فروشگاه</h1>
        </div>

        {error && <div className="admin-alert admin-alert-error">{error}</div>}
        {success && (
          <div className="admin-alert admin-alert-success">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="admin-form-group">
            <label className="admin-form-label">نام فروشگاه</label>
            <input
              className="admin-form-input"
              value={settings.storeName}
              onChange={(e) =>
                setSettings({ ...settings, storeName: e.target.value })
              }
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">شعار</label>
            <input
              className="admin-form-input"
              value={settings.slogan}
              onChange={(e) =>
                setSettings({ ...settings, slogan: e.target.value })
              }
              placeholder="تازه، خنک، خوشمزه"
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">آدرس لوگو</label>
            <input
              className="admin-form-input"
              value={settings.logo}
              onChange={(e) =>
                setSettings({ ...settings, logo: e.target.value })
              }
              placeholder="/images/logo.png"
              style={{ direction: "ltr" }}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">شماره تماس</label>
            <input
              className="admin-form-input"
              value={settings.phone}
              onChange={(e) =>
                setSettings({ ...settings, phone: e.target.value })
              }
              placeholder="۰۲۱-۱۲۳۴۵۶۷۸"
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">آدرس</label>
            <textarea
              className="admin-form-textarea"
              value={settings.address}
              onChange={(e) =>
                setSettings({ ...settings, address: e.target.value })
              }
              placeholder="تهران، خیابان ولیعصر..."
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Instagram Username</label>
            <input
              className="admin-form-input"
              value={settings.instagram}
              onChange={(e) =>
                setSettings({ ...settings, instagram: e.target.value })
              }
              placeholder="yakhbandan_shop"
              style={{ direction: "ltr" }}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">ساعت کاری</label>
            <input
              className="admin-form-input"
              value={settings.workingHours}
              onChange={(e) =>
                setSettings({ ...settings, workingHours: e.target.value })
              }
              placeholder="هر روز ۱۰ صبح تا ۱۱ شب"
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">توضیح کوتاه</label>
            <textarea
              className="admin-form-textarea"
              value={settings.shortDescription}
              onChange={(e) =>
                setSettings({ ...settings, shortDescription: e.target.value })
              }
              placeholder="بهترین لبنیات و بستنی‌های سنتی و مدرن"
            />
          </div>
          <div className="admin-form-actions">
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={loading}
            >
              {loading ? "در حال ذخیره..." : "ذخیره تنظیمات"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
