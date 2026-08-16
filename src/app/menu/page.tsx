import { Metadata } from "next";
import {
  getActiveCategories,
  getActiveProducts,
  getFeaturedProducts,
  getSiteSettings,
  formatPrice,
  searchProducts,
} from "@/lib/queries";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `${settings.storeName} | منوی دیجیتال`,
    description: settings.shortDescription || `منوی دیجیتال ${settings.storeName}`,
    openGraph: {
      title: `${settings.storeName} | منوی دیجیتال`,
      description: settings.shortDescription || `منوی دیجیتال ${settings.storeName}`,
      type: "website",
      locale: "fa_IR",
    },
  };
}

type ProductItem = {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  description: string | null;
  image: string | null;
  price: number;
  unit: string | null;
  weightOrVolume: string | null;
  isAvailable: boolean;
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
  categoryName: string;
  categorySlug: string;
  categoryIcon?: string | null;
};

function ProductCard({ product }: { product: ProductItem }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className={`product-card fade-in ${!product.isAvailable ? "unavailable" : ""}`}
    >
      <div className="product-card-image">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="product-card-placeholder">🍦</div>
        )}
        {product.isFeatured && (
          <span className="product-card-badge badge-featured">پیشنهاد ویژه</span>
        )}
        {!product.isAvailable && (
          <span className="product-card-badge badge-unavailable">ناموجود</span>
        )}
      </div>
      <div className="product-card-body">
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-desc">
          {product.description || ""}
        </p>
        <div className="product-card-footer">
          {product.weightOrVolume && (
            <span className="product-card-weight">{product.weightOrVolume}</span>
          )}
          <div className="product-card-price">
            {formatPrice(product.price)}
            <span className="product-card-price-unit">{product.unit || "تومان"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const [settings, allCategories, featuredProducts] = await Promise.all([
    getSiteSettings(),
    getActiveCategories(),
    getFeaturedProducts(),
  ]);

  const activeCategory = params.category || null;
  const searchQuery = params.q || "";

  let allProducts: ProductItem[];

  if (searchQuery) {
    allProducts = await searchProducts(searchQuery);
  } else {
    const selectedCategory = activeCategory
      ? allCategories.find((c) => c.slug === activeCategory)
      : null;
    allProducts = await getActiveProducts(selectedCategory?.id);
  }

  // Group products by category
  const productsByCategory = new Map<string, { name: string; icon: string | null; products: ProductItem[] }>();
  for (const product of allProducts) {
    const key = product.categorySlug;
    if (!productsByCategory.has(key)) {
      productsByCategory.set(key, {
        name: product.categoryName,
        icon: product.categoryIcon || null,
        products: [],
      });
    }
    productsByCategory.get(key)!.products.push(product);
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

      <main>
        {/* Hero */}
        <section className="hero">
          <h1 className="hero-title">{settings.storeName}</h1>
          {settings.slogan && <p className="hero-slogan">{settings.slogan}</p>}
        </section>

        <div className="container">
          {/* Search */}
          <div className="search-wrapper">
            <form method="get" action="/menu" className="search-container">
              {activeCategory && (
                <input type="hidden" name="category" value={activeCategory} />
              )}
              <span className="search-icon">🔍</span>
              <input
                type="search"
                name="q"
                className="search-input"
                placeholder="جستجوی محصول..."
                defaultValue={searchQuery}
                autoComplete="off"
                aria-label="جستجوی محصول"
              />
              {searchQuery && (
                <Link
                  href={activeCategory ? `/menu?category=${activeCategory}` : "/menu"}
                  className="search-clear visible"
                >
                  ✕
                </Link>
              )}
            </form>
          </div>

          {/* Categories */}
          {!searchQuery && (
            <nav className="categories-wrapper" aria-label="دسته‌بندی‌ها">
              <div className="categories-scroll">
                <Link
                  href="/menu"
                  className={`category-chip ${!activeCategory ? "active" : ""}`}
                >
                  همه
                </Link>
                {allCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/menu?category=${cat.slug}`}
                    className={`category-chip ${activeCategory === cat.slug ? "active" : ""}`}
                  >
                    {cat.icon && <span className="category-chip-icon">{cat.icon}</span>}
                    {cat.name}
                  </Link>
                ))}
              </div>
            </nav>
          )}

          {/* Search Results Message */}
          {searchQuery && (
            <div style={{ marginBottom: "var(--space-5)" }}>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                نتایج جستجو برای «{searchQuery}»
                <Link
                  href="/menu"
                  style={{
                    color: "var(--accent)",
                    marginRight: "var(--space-3)",
                    fontWeight: 500,
                  }}
                >
                  پاک کردن
                </Link>
              </p>
            </div>
          )}

          {/* Featured Products */}
          {!searchQuery && !activeCategory && featuredProducts.length > 0 && (
            <section className="section">
              <div className="section-header">
                <span className="section-icon">⭐</span>
                <h2 className="section-title">پیشنهاد ویژه</h2>
              </div>
              <div className="featured-scroll">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

          {/* Products by Category */}
          {allProducts.length > 0 ? (
            activeCategory || searchQuery ? (
              <section className="section">
                {activeCategory && !searchQuery && (() => {
                  const firstCat = productsByCategory.values().next().value;
                  return firstCat ? (
                    <div className="section-header">
                      <span className="section-icon">
                        {firstCat.icon || "📦"}
                      </span>
                      <h2 className="section-title">
                        {firstCat.name}
                      </h2>
                      <span className="section-count">
                        {allProducts.length} محصول
                      </span>
                    </div>
                  ) : null;
                })()}
                <div className="product-grid">
                  {allProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            ) : (
              Array.from(productsByCategory.entries()).map(
                ([slug, { name, icon, products: catProducts }]) => (
                  <section key={slug} className="section" id={`cat-${slug}`}>
                    <div className="section-header">
                      <span className="section-icon">{icon || "📦"}</span>
                      <h2 className="section-title">{name}</h2>
                      <span className="section-count">
                        {catProducts.length} محصول
                      </span>
                    </div>
                    <div className="product-grid">
                      {catProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </section>
                )
              )
            )
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <p className="no-results-text">
                {searchQuery
                  ? `محصولی با عنوان «${searchQuery}» یافت نشد.`
                  : "محصولی در این دسته‌بندی وجود ندارد."}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">{settings.storeName}</div>
          <div className="footer-info">
            {settings.phone && (
              <div className="footer-info-item">
                <span className="footer-info-icon">📞</span>
                <a href={`tel:${settings.phone}`} style={{ direction: "ltr" }}>
                  {settings.phone}
                </a>
              </div>
            )}
            {settings.address && (
              <div className="footer-info-item">
                <span className="footer-info-icon">📍</span>
                <span>{settings.address}</span>
              </div>
            )}
            {settings.workingHours && (
              <div className="footer-info-item">
                <span className="footer-info-icon">🕐</span>
                <span>{settings.workingHours}</span>
              </div>
            )}
          </div>
          {settings.instagram && (
            <a
              href={`https://instagram.com/${settings.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-instagram"
            >
              📸 {settings.instagram}@
            </a>
          )}
          <div className="footer-copyright">
            © {settings.storeName} — منوی دیجیتال
          </div>
        </div>
      </footer>

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
