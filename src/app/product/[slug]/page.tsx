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

// SVG Icons
const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="5"/>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

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
            {settings.storeName}
          </Link>
          <div className="header-actions">
            <button
              className="theme-toggle"
              id="themeToggle"
              aria-label="تغییر تم"
              type="button"
            >
              <span id="sunIcon"><SunIcon /></span>
              <span id="moonIcon" style={{ display: 'none' }}><MoonIcon /></span>
            </button>
          </div>
        </div>
      </header>

      <main className="container product-detail">
        <Link href="/menu" className="product-detail-back">
          ← بازگشت به منو
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
        </div>

        <div className="product-detail-price">
          {formatPrice(product.price)}
          <span className="product-detail-price-unit">
            {product.unit || "تومان"}
          </span>
        </div>

        {!product.isAvailable && (
          <div className="product-detail-unavailable">
            فعلاً موجود نیست
          </div>
        )}
      </main>

      {/* Theme Toggle Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var toggle = document.getElementById('themeToggle');
              var sunIcon = document.getElementById('sunIcon');
              var moonIcon = document.getElementById('moonIcon');
              function updateIcons() {
                var isDark = document.documentElement.classList.contains('dark');
                sunIcon.style.display = isDark ? 'block' : 'none';
                moonIcon.style.display = isDark ? 'none' : 'block';
              }
              updateIcons();
              toggle.addEventListener('click', function() {
                document.documentElement.classList.toggle('dark');
                var isDark = document.documentElement.classList.contains('dark');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
                updateIcons();
              });
            })();
          `,
        }}
      />
    </>
  );
}
