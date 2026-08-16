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
    shortDescription: "بهترین لبنیات و بستنی‌های سنتی و مدرن",
  });

  // Insert categories
  const categoryData = [
    { name: "بستنی", slug: "bastani", icon: "🍨", displayOrder: 1 },
    { name: "لبنیات", slug: "labaniat", icon: "🥛", displayOrder: 2 },
    { name: "آبمیوه", slug: "abmive", icon: "🍊", displayOrder: 3 },
    { name: "نوشیدنی سرد", slug: "noshidani-sard", icon: "🧊", displayOrder: 4 },
    { name: "نوشیدنی گرم", slug: "noshidani-garm", icon: "☕", displayOrder: 5 },
    { name: "دسر", slug: "deser", icon: "🍮", displayOrder: 6 },
    { name: "معجون", slug: "majoon", icon: "🥤", displayOrder: 7 },
    { name: "فالوده", slug: "faloode", icon: "🍧", displayOrder: 8 },
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
    {
      name: "بستنی سنتی",
      slug: "bastani-sonnati",
      categoryId: catMap["bastani"],
      description: "بستنی سنتی زعفرانی با خلال پسته و خامه تازه",
      price: 120000,
      weightOrVolume: "۱۵۰ گرم",
      isFeatured: true,
      displayOrder: 1,
    },
    {
      name: "بستنی شکلاتی",
      slug: "bastani-shokolati",
      categoryId: catMap["bastani"],
      description: "بستنی شکلاتی غلیظ با تکه‌های شکلات بلژیکی",
      price: 135000,
      weightOrVolume: "۱۵۰ گرم",
      isFeatured: true,
      displayOrder: 2,
    },
    {
      name: "بستنی زعفرانی",
      slug: "bastani-zaferani",
      categoryId: catMap["bastani"],
      description: "بستنی زعفرانی اصل با زعفران درجه یک قائنات",
      price: 140000,
      weightOrVolume: "۱۵۰ گرم",
      displayOrder: 3,
    },
    {
      name: "بستنی وانیلی",
      slug: "bastani-vanili",
      categoryId: catMap["bastani"],
      description: "بستنی وانیلی با اسانس وانیل طبیعی ماداگاسکار",
      price: 110000,
      weightOrVolume: "۱۵۰ گرم",
      displayOrder: 4,
    },
    {
      name: "بستنی پسته‌ای",
      slug: "bastani-pestei",
      categoryId: catMap["bastani"],
      description: "بستنی پسته‌ای با پسته‌های تازه رفسنجان",
      price: 160000,
      weightOrVolume: "۱۵۰ گرم",
      isFeatured: true,
      displayOrder: 5,
    },
    {
      name: "فالوده بستنی",
      slug: "faloode-bastani",
      categoryId: catMap["faloode"],
      description: "فالوده سنتی شیرازی همراه با بستنی وانیلی",
      price: 130000,
      weightOrVolume: "۲۰۰ گرم",
      isFeatured: true,
      displayOrder: 1,
    },
    {
      name: "فالوده شیرازی",
      slug: "faloode-shirazi",
      categoryId: catMap["faloode"],
      description: "فالوده اصل شیرازی با آب‌لیمو تازه",
      price: 95000,
      weightOrVolume: "۲۰۰ گرم",
      displayOrder: 2,
    },
    {
      name: "شیرموز",
      slug: "shir-moz",
      categoryId: catMap["majoon"],
      description: "شیرموز تازه با موز رسیده و شیر پرچرب",
      price: 85000,
      weightOrVolume: "۳۰۰ میلی‌لیتر",
      displayOrder: 1,
    },
    {
      name: "معجون مخصوص",
      slug: "majoon-makhsoos",
      categoryId: catMap["majoon"],
      description: "ترکیب موز، توت‌فرنگی، عسل و بستنی وانیلی",
      price: 145000,
      weightOrVolume: "۴۰۰ میلی‌لیتر",
      isFeatured: true,
      displayOrder: 2,
    },
    {
      name: "آب پرتقال طبیعی",
      slug: "ab-porteqal",
      categoryId: catMap["abmive"],
      description: "آب پرتقال تازه و طبیعی بدون شکر افزوده",
      price: 75000,
      weightOrVolume: "۳۰۰ میلی‌لیتر",
      displayOrder: 1,
    },
    {
      name: "آب هویج",
      slug: "ab-havij",
      categoryId: catMap["abmive"],
      description: "آب هویج تازه و طبیعی بدون مواد نگهدارنده",
      price: 70000,
      weightOrVolume: "۳۰۰ میلی‌لیتر",
      displayOrder: 2,
    },
    {
      name: "آب انار",
      slug: "ab-anar",
      categoryId: catMap["abmive"],
      description: "آب انار طبیعی از انارهای ترش و شیرین ساوه",
      price: 95000,
      weightOrVolume: "۳۰۰ میلی‌لیتر",
      displayOrder: 3,
    },
    {
      name: "آیس کافی",
      slug: "ice-coffee",
      categoryId: catMap["noshidani-sard"],
      description: "قهوه سرد با شیر و یخ، همراه با بستنی وانیلی",
      price: 110000,
      weightOrVolume: "۳۵۰ میلی‌لیتر",
      isFeatured: true,
      displayOrder: 1,
    },
    {
      name: "لیموناد",
      slug: "limonad",
      categoryId: catMap["noshidani-sard"],
      description: "لیموناد خانگی با لیموترش تازه و نعنا",
      price: 65000,
      weightOrVolume: "۳۰۰ میلی‌لیتر",
      displayOrder: 2,
    },
    {
      name: "قهوه ترک",
      slug: "qahve-tork",
      categoryId: catMap["noshidani-garm"],
      description: "قهوه ترک سنتی با دانه‌های تازه آسیاب شده",
      price: 65000,
      weightOrVolume: "۱ فنجان",
      displayOrder: 1,
    },
    {
      name: "شکلات داغ",
      slug: "shokolat-dagh",
      categoryId: catMap["noshidani-garm"],
      description: "شکلات داغ غلیظ با شکلات بلژیکی و خامه",
      price: 95000,
      weightOrVolume: "۱ فنجان",
      displayOrder: 2,
    },
    {
      name: "ماست محلی",
      slug: "mast-mahalli",
      categoryId: catMap["labaniat"],
      description: "ماست پرچرب محلی تهیه شده از شیر تازه",
      price: 55000,
      weightOrVolume: "۲۵۰ گرم",
      displayOrder: 1,
    },
    {
      name: "دوغ سنتی",
      slug: "doogh-sonnati",
      categoryId: catMap["labaniat"],
      description: "دوغ سنتی با نعنا و گلاب",
      price: 45000,
      weightOrVolume: "۳۰۰ میلی‌لیتر",
      displayOrder: 2,
    },
    {
      name: "کشک محلی",
      slug: "kashk-mahalli",
      categoryId: catMap["labaniat"],
      description: "کشک خانگی و محلی با طعم اصیل",
      price: 85000,
      weightOrVolume: "۲۵۰ گرم",
      displayOrder: 3,
    },
    {
      name: "پاناکوتا",
      slug: "panna-cotta",
      categoryId: catMap["deser"],
      description: "پاناکوتای ایتالیایی با سس توت‌فرنگی",
      price: 105000,
      weightOrVolume: "۱ عدد",
      displayOrder: 1,
    },
    {
      name: "تیرامیسو",
      slug: "tiramisu",
      categoryId: catMap["deser"],
      description: "تیرامیسوی اصیل ایتالیایی با قهوه اسپرسو",
      price: 125000,
      weightOrVolume: "۱ عدد",
      isFeatured: true,
      displayOrder: 2,
    },
  ];

  await db.insert(products).values(productData);

  console.log("✅ Seed completed successfully!");
  console.log(`   - ${categoryData.length} categories`);
  console.log(`   - ${productData.length} products`);
  console.log(`   - 1 site settings`);

  await pool.end();
}

seed().catch(console.error);
