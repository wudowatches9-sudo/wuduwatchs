const fs = require('fs');
const path = require('path');
const contentful = require('contentful');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim();
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      } else if (val.startsWith("'") && val.endsWith("'")) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_DELIVERY_API_ACCESS_TOKEN || process.env.CONTENTFUL_ACCESS_TOKEN;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local");
  process.exit(1);
}

if (!spaceId || !accessToken) {
  console.error("❌ Error: CONTENTFUL_SPACE_ID and CONTENTFUL_DELIVERY_API_ACCESS_TOKEN must be set in .env.local");
  process.exit(1);
}

console.log("Connecting to Contentful and Supabase...");
const contentfulClient = contentful.createClient({
  space: spaceId,
  accessToken: accessToken,
});

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateProducts() {
  console.log("Migrating Products...");
  const entries = await contentfulClient.getEntries({
    content_type: 'product',
    limit: 1000,
  });

  console.log(`Found ${entries.items.length} products in Contentful.`);

  for (const entry of entries.items) {
    const fields = entry.fields;
    const id = entry.sys.id;

    const payload = {
      id: id,
      name: fields.name || "Unnamed Product",
      slug: fields.slug || "",
      price: Number(fields.price || 0),
      original_price: fields.originalPrice ? Number(fields.originalPrice) : null,
      main_image: fields.mainImage || "/images/placeholder.png",
      gallery_images: fields.galleryImages || [],
      category: fields.category || "uncategorized",
      subcategory: fields.subcategory || "",
      sizes: fields.sizes || [],
      colors: fields.colors || [],
      short_description: fields.shortDescription || "",
      long_description: fields.longDescription || "",
      sizing_and_fit: fields.sizingAndFit || "",
      materials_and_care: fields.materialsAndCare || "",
      stock: Number(fields.stock || 0),
      is_featured: !!fields.isFeatured,
      display_on_homepage: !!fields.displayOnHomepage,
      rating: Number(fields.rating || 0),
      review_count: Number(fields.reviewCount || 0),
      color_swatches: fields.colorSwatches || [],
      created_at: entry.sys.createdAt,
      updated_at: entry.sys.updatedAt,
    };

    const { error } = await supabase.from('products').upsert(payload);
    if (error) {
      console.error(`❌ Failed to upsert product ${payload.slug}:`, error.message);
    } else {
      console.log(`✅ Migrated product: ${payload.slug}`);
    }
  }
}

async function migrateLookbook() {
  console.log("Migrating Lookbook...");
  const entries = await contentfulClient.getEntries({
    content_type: 'lookbook',
    limit: 10,
  });

  console.log(`Found ${entries.items.length} lookbook entries in Contentful.`);

  for (const entry of entries.items) {
    const fields = entry.fields;
    const payload = {
      id: entry.sys.id,
      title: fields.title || "",
      subtitle: fields.subtitle || "",
      cta_link: fields.ctaLink || "",
      cta_button_text: fields.ctaButtonText || "",
      background_image: fields.backgroundImage || "",
      created_at: entry.sys.createdAt,
      updated_at: entry.sys.updatedAt,
    };

    const { error } = await supabase.from('lookbook').upsert(payload);
    if (error) {
      console.error(`❌ Failed to upsert lookbook:`, error.message);
    } else {
      console.log(`✅ Migrated lookbook: ${payload.title}`);
    }
  }
}

async function migrateSocialPosts() {
  console.log("Migrating Social Posts...");
  const entries = await contentfulClient.getEntries({
    content_type: 'socialPost',
    limit: 100,
  });

  console.log(`Found ${entries.items.length} social posts in Contentful.`);

  for (const entry of entries.items) {
    const fields = entry.fields;
    const payload = {
      id: entry.sys.id,
      image_url: fields.image || "",
      post_link: fields.postLink || "",
      created_at: entry.sys.createdAt,
      updated_at: entry.sys.updatedAt,
    };

    const { error } = await supabase.from('social_posts').upsert(payload);
    if (error) {
      console.error(`❌ Failed to upsert social post ${payload.id}:`, error.message);
    } else {
      console.log(`✅ Migrated social post: ${payload.id}`);
    }
  }
}

async function migrateOffers() {
  console.log("Migrating Offers...");
  const entries = await contentfulClient.getEntries({
    content_type: 'featuredOffer',
    limit: 100,
  });

  console.log(`Found ${entries.items.length} offers in Contentful.`);

  for (const entry of entries.items) {
    // If it's the special desktop_banner we exclude it from normal list, but migrate it
    const fields = entry.fields;
    const id = entry.sys.id;
    
    // We parse the CTA link. If it contains a URL, we keep it as product slug
    let slug = fields.ctaLink || "";
    if (slug.includes('/products/')) {
      slug = slug.split('/products/')[1];
    }

    const payload = {
      id: id,
      title: fields.title || "",
      cta_button_text: fields.ctaButtonText || "Shop Now",
      product_slug: slug,
      image_url: fields.image || "",
      created_at: entry.sys.createdAt,
      updated_at: entry.sys.updatedAt,
    };

    if (id === 'desktop_banner') {
      const { error } = await supabase.from('hero_banner').upsert({
        id: 'desktop_banner',
        product_slug: payload.product_slug,
        image_url: payload.image_url,
        cta_button_text: payload.cta_button_text,
        created_at: payload.created_at,
        updated_at: payload.updated_at
      });
      if (error) {
        console.error(`❌ Failed to upsert desktop banner in hero_banner table:`, error.message);
      } else {
        console.log(`✅ Migrated desktop banner to hero_banner table.`);
      }
    } else {
      const { error } = await supabase.from('featured_offers').upsert(payload);
      if (error) {
        console.error(`❌ Failed to upsert offer ${payload.id}:`, error.message);
      } else {
        console.log(`✅ Migrated offer: ${payload.title}`);
      }
    }
  }
}

async function run() {
  try {
    await migrateProducts();
    await migrateLookbook();
    await migrateSocialPosts();
    await migrateOffers();
    console.log("🎉 Migration completed successfully!");
  } catch (err) {
    console.error("❌ Migration failed with error:", err);
  }
}

run();
