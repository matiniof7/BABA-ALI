import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { categories, products, siteSettings } from "./schema";

async function seed() {
  const pool = new Pool({
    connectionString: "postgresql://postgres:postgres@127.0.0.1:5432/app_db",
  });
  const db = drizzle(pool);

  // Clear existing data
  await db.delete(products);
  await db.delete(categories);
  await db.delete(siteSettings);

  // Insert site settings
  await db.insert(siteSettings).values({
    storeName: "یخبندان",
    slogan: "تازه، خنک، خوشمزه",
    phone: "۰۲۱-۱۲۳۴۵۶۷۸",
    address: "تهران، خیابان ولیعصر، پلاک ۱۲۳",
    instagram: "yakhbandan_shop",
    workingHours: "هر روز ۱۰ صبح تا ۱۱ شب",
    shortDescription: "بهترین لبنیات و بستنی‌های سنتی",
  });

  // Insert categories
  const categoryData = [
    { name: "بستنی", slug: "bastani", displayOrder: 1 },
    { name: "فالوده", slug: "faloode", displayOrder: 2 },
    { name: "نوشیدنی", slug: "noshidani", displayOrder: 3 },
    { name: "لبنیات", slug: "labaniat", displayOrder: 4 },
    { name: "محصولات سنتی", slug: "sonnati", displayOrder: 5 },
  ];

  const insertedCategories = await db
    .insert(categories)
    .values(categoryData)
    .returning();

  const catMap: Record<string, number> = {};
  for (const cat of insertedCategories) {
    catMap[cat.slug] = cat.id;
  }

  // Insert products
  const productData = [
    // ===== بستنی =====
    {
      name: "بستنی سنتی نونی",
      slug: "bastani-nooni",
      categoryId: catMap["bastani"],
      description: "بستنی سنتی زعفرانی با نان تازه",
      image: "/images/bastani-sonnati.jpg",
      price: 85000,
      weightOrVolume: "۱ عدد",
      isFeatured: true,
      displayOrder: 1,
    },
    {
      name: "بستنی سنتی کاسه‌ای",
      slug: "bastani-kasei",
      categoryId: catMap["bastani"],
      description: "بستنی سنتی زعفرانی در کاسه با تزیین پسته",
      image: "/images/bastani-sonnati.jpg",
      price: 95000,
      weightOrVolume: "۱ کاسه",
      isFeatured: true,
      displayOrder: 2,
    },
    {
      name: "بستنی کیلویی",
      slug: "bastani-kiloyi",
      categoryId: catMap["bastani"],
      description: "بستنی سنتی زعفرانی، مناسب مهمانی",
      image: "/images/bastani-sonnati.jpg",
      price: 450000,
      weightOrVolume: "۱ کیلوگرم",
      displayOrder: 3,
    },
    {
      name: "بستنی نیم‌کیلویی",
      slug: "bastani-nim-kiloyi",
      categoryId: catMap["bastani"],
      description: "بستنی سنتی زعفرانی، اندازه خانوادگی",
      image: "/images/bastani-sonnati.jpg",
      price: 240000,
      weightOrVolume: "۵۰۰ گرم",
      displayOrder: 4,
    },
    {
      name: "بستنی میوه‌ای",
      slug: "bastani-miveyi",
      categoryId: catMap["bastani"],
      description: "بستنی با طعم میوه‌های فصل",
      image: "/images/bastani-shokolati.jpg",
      price: 65000,
      weightOrVolume: "۱ اسکوپ",
      displayOrder: 5,
    },
    {
      name: "بستنی قیفی",
      slug: "bastani-qifi",
      categoryId: catMap["bastani"],
      description: "بستنی در قیف ترد و خوشمزه",
      image: "/images/bastani-shokolati.jpg",
      price: 75000,
      weightOrVolume: "۱ عدد",
      isFeatured: true,
      displayOrder: 6,
    },
    {
      name: "بستنی قیفی کودک",
      slug: "bastani-qifi-koodak",
      categoryId: catMap["bastani"],
      description: "بستنی قیفی کوچک مخصوص کودکان",
      image: "/images/bastani-shokolati.jpg",
      price: 45000,
      weightOrVolume: "۱ عدد",
      displayOrder: 7,
    },

    // ===== فالوده =====
    {
      name: "فالوده",
      slug: "faloode",
      categoryId: catMap["faloode"],
      description: "فالوده شیرازی اصیل با آب‌لیمو",
      image: "/images/faloode-bastani.jpg",
      price: 70000,
      weightOrVolume: "کوچک",
      displayOrder: 1,
    },
    {
      name: "فالوده بزرگ",
      slug: "faloode-bozorg",
      categoryId: catMap["faloode"],
      description: "فالوده شیرازی اصیل، سایز بزرگ",
      image: "/images/faloode-bastani.jpg",
      price: 95000,
      weightOrVolume: "بزرگ",
      displayOrder: 2,
    },
    {
      name: "فالوده بستنی",
      slug: "faloode-bastani",
      categoryId: catMap["faloode"],
      description: "فالوده شیرازی همراه با بستنی سنتی",
      image: "/images/faloode-bastani.jpg",
      price: 85000,
      weightOrVolume: "کوچک",
      isFeatured: true,
      displayOrder: 3,
    },
    {
      name: "فالوده بستنی بزرگ",
      slug: "faloode-bastani-bozorg",
      categoryId: catMap["faloode"],
      description: "فالوده شیرازی با بستنی سنتی، سایز بزرگ",
      image: "/images/faloode-bastani.jpg",
      price: 120000,
      weightOrVolume: "بزرگ",
      isFeatured: true,
      displayOrder: 4,
    },

    // ===== نوشیدنی =====
    {
      name: "شیرموز",
      slug: "shir-moz",
      categoryId: catMap["noshidani"],
      description: "شیرموز تازه با موز رسیده",
      image: "/images/majoon-makhsoos.jpg",
      price: 85000,
      weightOrVolume: "۱ لیوان",
      isFeatured: true,
      displayOrder: 1,
    },
    {
      name: "شیرموز انبه",
      slug: "shir-moz-anbe",
      categoryId: catMap["noshidani"],
      description: "ترکیب شیرموز با انبه تازه",
      image: "/images/majoon-makhsoos.jpg",
      price: 95000,
      weightOrVolume: "۱ لیوان",
      displayOrder: 2,
    },
    {
      name: "شیر انبه",
      slug: "shir-anbe",
      categoryId: catMap["noshidani"],
      description: "شیر تازه با انبه رسیده",
      image: "/images/majoon-makhsoos.jpg",
      price: 90000,
      weightOrVolume: "۱ لیوان",
      displayOrder: 3,
    },

    // ===== لبنیات =====
    {
      name: "ماست ساده کوچک",
      slug: "mast-kochak",
      categoryId: catMap["labaniat"],
      description: "ماست محلی پرچرب",
      image: "/images/doogh-sonnati.jpg",
      price: 45000,
      weightOrVolume: "۲۵۰ گرم",
      displayOrder: 1,
    },
    {
      name: "ماست ساده بزرگ",
      slug: "mast-bozorg",
      categoryId: catMap["labaniat"],
      description: "ماست محلی پرچرب، سایز بزرگ",
      image: "/images/doogh-sonnati.jpg",
      price: 75000,
      weightOrVolume: "۵۰۰ گرم",
      displayOrder: 2,
    },
    {
      name: "ماست موسیر کیلویی",
      slug: "mast-mosir",
      categoryId: catMap["labaniat"],
      description: "ماست با موسیر تازه، عالی برای کباب",
      image: "/images/doogh-sonnati.jpg",
      price: 180000,
      weightOrVolume: "۱ کیلوگرم",
      isFeatured: true,
      displayOrder: 3,
    },

    // ===== محصولات سنتی =====
    {
      name: "کشک مایع",
      slug: "kashk-maye",
      categoryId: catMap["sonnati"],
      description: "کشک مایع خانگی و سنتی",
      image: "/images/doogh-sonnati.jpg",
      price: 120000,
      weightOrVolume: "۵۰۰ گرم",
      displayOrder: 1,
    },
    {
      name: "کشک خشک",
      slug: "kashk-khoshk",
      categoryId: catMap["sonnati"],
      description: "کشک خشک سنتی",
      image: "/images/doogh-sonnati.jpg",
      price: 150000,
      weightOrVolume: "۲۵۰ گرم",
      displayOrder: 2,
    },
    {
      name: "کشک قراقروتی",
      slug: "kashk-qara-qoroot",
      categoryId: catMap["sonnati"],
      description: "کشک با طعم قراقروت اصیل",
      image: "/images/doogh-sonnati.jpg",
      price: 140000,
      weightOrVolume: "۲۵۰ گرم",
      displayOrder: 3,
    },
    {
      name: "قراقروت",
      slug: "qara-qoroot",
      categoryId: catMap["sonnati"],
      description: "قراقروت سنتی ترش",
      image: "/images/doogh-sonnati.jpg",
      price: 95000,
      weightOrVolume: "۲۵۰ گرم",
      displayOrder: 4,
    },
    {
      name: "قراقروت تمشک",
      slug: "qara-qoroot-tameshk",
      categoryId: catMap["sonnati"],
      description: "قراقروت با طعم تمشک",
      image: "/images/doogh-sonnati.jpg",
      price: 110000,
      weightOrVolume: "۲۵۰ گرم",
      displayOrder: 5,
    },
    {
      name: "لواشک",
      slug: "lavashak",
      categoryId: catMap["sonnati"],
      description: "لواشک خانگی ترش و شیرین",
      image: "/images/doogh-sonnati.jpg",
      price: 85000,
      weightOrVolume: "۱۰۰ گرم",
      displayOrder: 6,
    },
    {
      name: "روغن حیوانی",
      slug: "roghan-heyvani",
      categoryId: catMap["sonnati"],
      description: "روغن حیوانی خالص و سنتی",
      image: "/images/doogh-sonnati.jpg",
      price: 350000,
      weightOrVolume: "۵۰۰ گرم",
      displayOrder: 7,
    },
  ];

  await db.insert(products).values(productData);

  console.log("✅ Seed completed successfully!");
  console.log(`   - ${categoryData.length} categories`);
  console.log(`   - ${productData.length} products`);

  await pool.end();
}

seed().catch(console.error);
