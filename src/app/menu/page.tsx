import { Metadata } from "next";
import {
  getActiveCategories,
  getActiveProducts,
  getSiteSettings,
  formatPrice,
  searchProducts,
  getProductsBySlugs,
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

// Assign varied card styles for editorial rhythm
function getCardStyle(index: number, featured: boolean): string {
  if (featured) return "featured-large";
  const patterns = ["", "ratio-square", "", "ratio-tall", "", ""];
  return patterns[index % patterns.length];
}

function ProductCard({ 
  product, 
  featured = false,
  index = 0 
}: { 
  product: ProductItem; 
  featured?: boolean;
  index?: number;
}) {
  const cardStyle = getCardStyle(index, featured);
  
  return (
    <Link
      href={`/product/${product.slug}`}
      className={`product-card ${cardStyle} ${!product.isAvailable ? "unavailable" : ""}`}
    >
      <div className="product-image">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="product-placeholder">◇</div>
        )}
      </div>
      <div className="product-body">
        <h3 className="product-name">{product.name}</h3>
        {product.description && (
          <p className="product-desc">{product.description}</p>
        )}
        <div className="product-meta">
          {product.weightOrVolume && (
            <span className="product-weight">{product.weightOrVolume}</span>
          )}
          {product.isAvailable ? (
            <span className="product-price">
              {formatPrice(product.price)}
              <span className="product-price-unit">{product.unit || "تومان"}</span>
            </span>
          ) : (
            <span className="product-unavailable">فعلاً موجود نیست</span>
          )}
        </div>
      </div>
    </Link>
  );
}

// SVG Icons
const SearchIcon = () => (
  <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="M21 21l-4.35-4.35"/>
  </svg>
);

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

// Best sellers product slugs in order
const BESTSELLERS_ICE_CREAM = [
  "bastani-nooni",
  "bastani-kasei", 
  "faloode",
  "faloode-bastani",
  "shir-moz",
  "bastani-qifi-koodak",
  "bastani-miveyi",
];

const BESTSELLERS_DAIRY = [
  "mast-mosir",
  "mast-bozorg",
  "mast-kochak",
  "doogh-kochak",
  "doogh-bozorg",
];

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const [settings, allCategories] = await Promise.all([
    getSiteSettings(),
    getActiveCategories(),
  ]);

  const searchQuery = params.q || "";

  let allProducts: ProductItem[];
  let bestsellersIceCream: ProductItem[] = [];
  let bestsellersDairy: ProductItem[] = [];

  if (searchQuery) {
    allProducts = await searchProducts(searchQuery);
  } else {
    const [products, iceCream, dairy] = await Promise.all([
      getActiveProducts(),
      getProductsBySlugs(BESTSELLERS_ICE_CREAM),
      getProductsBySlugs(BESTSELLERS_DAIRY),
    ]);
    allProducts = products;
    bestsellersIceCream = iceCream;
    bestsellersDairy = dairy;
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

  const showBestsellers = !searchQuery && (bestsellersIceCream.length > 0 || bestsellersDairy.length > 0);

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

      <main>
        {/* Hero */}
        <section className="hero container">
          <h1 className="hero-title">{settings.storeName}</h1>
          {settings.slogan && <p className="hero-slogan">{settings.slogan}</p>}
          <div className="divider">
            <span className="divider-dot"></span>
          </div>
        </section>

        <div className="container">
          {/* Search */}
          <div className="search-wrapper">
            <form method="get" action="/menu" className="search-container">
              <SearchIcon />
              <input
                type="search"
                name="q"
                className="search-input"
                placeholder="جستجو..."
                defaultValue={searchQuery}
                autoComplete="off"
                aria-label="جستجوی محصول"
              />
            </form>
          </div>

          {/* Category Navigation - Scroll to sections */}
          {!searchQuery && (
            <nav className="category-nav" aria-label="دسته‌بندی‌ها" id="categoryNav">
              <a href="#bestsellers" className="category-link" data-category="bestsellers">
                پرفروش‌ها
              </a>
              {allCategories.map((cat) => (
                <span key={cat.id} style={{ display: 'contents' }}>
                  <span className="category-separator">·</span>
                  <a
                    href={`#${cat.slug}`}
                    className="category-link"
                    data-category={cat.slug}
                  >
                    {cat.name}
                  </a>
                </span>
              ))}
            </nav>
          )}

          {/* Search Results Message */}
          {searchQuery && (
            <div className="search-results-msg">
              نتایج جستجو برای «{searchQuery}»
              <Link href="/menu">پاک کردن</Link>
            </div>
          )}

          {/* Bestsellers Section */}
          {showBestsellers && (
            <section className="bestsellers-section" id="bestsellers">
              <div className="section-header">
                <h2 className="section-title">پرفروش‌ترین‌ها</h2>
              </div>
              
              {/* Line 1: Ice Cream & Drinks */}
              {bestsellersIceCream.length > 0 && (
                <div className="bestsellers-row">
                  <span className="bestsellers-label">بستنی و نوشیدنی</span>
                  <div className="featured-scroll">
                    {bestsellersIceCream.map((product, i) => (
                      <ProductCard key={product.id} product={product} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {/* Line 2: Dairy */}
              {bestsellersDairy.length > 0 && (
                <div className="bestsellers-row">
                  <span className="bestsellers-label">لبنیات</span>
                  <div className="featured-scroll">
                    {bestsellersDairy.map((product, i) => (
                      <ProductCard key={product.id} product={product} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Products by Category */}
          {allProducts.length > 0 ? (
            searchQuery ? (
              // Search results
              <section className="section fade-in-up">
                <div className="product-grid">
                  {allProducts.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>
              </section>
            ) : (
              // All categories
              Array.from(productsByCategory.entries()).map(
                ([slug, { name, products: catProducts }], catIndex) => (
                  <section key={slug} className="section" id={slug}>
                    <div className="section-header">
                      <h2 className="section-title">{name}</h2>
                      <span className="section-subtitle">{catProducts.length} محصول</span>
                    </div>
                    <div className="product-grid">
                      {catProducts.map((product, i) => (
                        <ProductCard 
                          key={product.id} 
                          product={product} 
                          index={i}
                        />
                      ))}
                    </div>
                    
                    {/* Story block after second category */}
                    {catIndex === 1 && (
                      <div className="story-block">
                        <p className="story-block-title">طعم‌های اصیل ایرانی</p>
                        <p className="story-block-text">
                          با زعفران قائنات، پسته رفسنجان و گلاب کاشان
                        </p>
                      </div>
                    )}
                  </section>
                )
              )
            )
          ) : (
            <div className="no-results">
              <p className="no-results-text">
                {searchQuery
                  ? `محصولی با عنوان «${searchQuery}» یافت نشد.`
                  : "محصولی وجود ندارد."}
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
              <a href={`tel:${settings.phone}`} style={{ direction: "ltr" }}>
                {settings.phone}
              </a>
            )}
            {settings.address && <span>{settings.address}</span>}
            {settings.workingHours && <span>{settings.workingHours}</span>}
          </div>
          {settings.instagram && (
            <a
              href={settings.instagram.startsWith('http') ? settings.instagram : `https://instagram.com/${settings.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-instagram"
            >
              📷
            </a>
          )}
          <div className="footer-copyright">
            © {settings.storeName}
          </div>
        </div>
      </footer>

      {/* Scripts */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // Theme toggle
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

              // Category navigation - smooth scroll & active state
              var categoryLinks = document.querySelectorAll('.category-link');
              var sections = document.querySelectorAll('section[id]');
              
              // Click handler for smooth scroll
              categoryLinks.forEach(function(link) {
                link.addEventListener('click', function(e) {
                  e.preventDefault();
                  var targetId = this.getAttribute('href').substring(1);
                  var target = document.getElementById(targetId);
                  if (target) {
                    var headerOffset = 80;
                    var elementPosition = target.getBoundingClientRect().top;
                    var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                });
              });

              // Scroll spy - update active category
              function updateActiveCategory() {
                var scrollPos = window.scrollY + 120;
                var currentSection = null;
                
                sections.forEach(function(section) {
                  var sectionTop = section.offsetTop;
                  var sectionHeight = section.offsetHeight;
                  if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                  }
                });
                
                categoryLinks.forEach(function(link) {
                  var href = link.getAttribute('href');
                  if (href === '#' + currentSection) {
                    link.classList.add('active');
                  } else {
                    link.classList.remove('active');
                  }
                });
              }
              
              window.addEventListener('scroll', updateActiveCategory, { passive: true });
              updateActiveCategory();

              // Intersection Observer for fade-in animations
              var observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
              };
              
              var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                  if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                  }
                });
              }, observerOptions);
              
              document.querySelectorAll('.product-card, .section-header, .story-block').forEach(function(el) {
                el.classList.add('animate-on-scroll');
                observer.observe(el);
              });
            })();
          `,
        }}
      />
    </>
  );
}
