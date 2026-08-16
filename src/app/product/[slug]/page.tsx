import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getSiteSettings, formatPrice } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "محصول یافت نشد" };
  }
  const settings = await getSiteSettings();
  return {
    title: `${product.name} | ${settings.storeName}`,
    description: product.description || `${product.name} - ${settings.storeName}`,
    openGraph: {
      title: `${product.name} | ${settings.storeName}`,
      description: product.description || `${product.name} - ${settings.storeName}`,
      images: product.image ? [product.image] : [],
      type: "website",
      locale: "fa_IR",
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSiteSettings(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="container header-inner">
          <Link href="/menu" className="header-brand">
            <span className="header-brand-icon">🍦</span>
            <span>{settings.storeName}</span>
          </Link>
          <button
            className="theme-toggle"
            id="themeToggle"
            aria-label="تغییر تم"
            type="button"
          >
            <span id="themeIcon">☀️</span>
          </button>
        </div>
      </header>

      <main className="container product-detail fade-in">
        <Link href="/menu" className="product-detail-back">
          → بازگشت به منو
        </Link>

        {product.image && (
          <div className="product-detail-image">
            <img src={product.image} alt={product.name} />
          </div>
        )}

        <h1 className="product-detail-name">{product.name}</h1>

        {product.description && (
          <p className="product-detail-desc">{product.description}</p>
        )}

        <div className="product-detail-meta">
          {product.weightOrVolume && (
            <div className="product-detail-meta-item">
              <span className="product-detail-meta-label">وزن / حجم</span>
              <span className="product-detail-meta-value">
                {product.weightOrVolume}
              </span>
            </div>
          )}
          <div className="product-detail-meta-item">
            <span className="product-detail-meta-label">دسته‌بندی</span>
            <span className="product-detail-meta-value">
              {product.categoryName}
            </span>
          </div>
          <div className="product-detail-meta-item">
            <span className="product-detail-meta-label">وضعیت</span>
            <span
              className="product-detail-meta-value"
              style={{
                color: product.isAvailable
                  ? "var(--success)"
                  : "var(--error)",
              }}
            >
              {product.isAvailable ? "موجود" : "فعلاً موجود نیست"}
            </span>
          </div>
        </div>

        <div className="product-detail-price">
          {formatPrice(product.price)}
          <span className="product-detail-price-unit">
            {product.unit || "تومان"}
          </span>
        </div>

        {!product.isAvailable && (
          <div className="product-detail-unavailable">
            ⚠ فعلاً موجود نیست
          </div>
        )}
      </main>

      {/* Theme Toggle Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var toggle = document.getElementById('themeToggle');
              var icon = document.getElementById('themeIcon');
              function updateIcon() {
                var isDark = document.documentElement.classList.contains('dark');
                icon.textContent = isDark ? '☀️' : '🌙';
              }
              updateIcon();
              toggle.addEventListener('click', function() {
                document.documentElement.classList.toggle('dark');
                var isDark = document.documentElement.classList.contains('dark');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
                updateIcon();
              });
            })();
          `,
        }}
      />
    </>
  );
}
