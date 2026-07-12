const fs = require('fs');
const path = require('path');
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

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local");
  process.exit(1);
}

console.log("Connecting to Supabase...");
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const sampleProducts = [
  {
    id: "prod_royal_oak",
    name: "Audemars Piguet Royal Oak",
    slug: "royal-oak-automatic",
    price: 4500000,
    original_price: 4800000,
    main_image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800",
    gallery_images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800"
    ],
    category: "automatic",
    subcategory: "luxury",
    sizes: ["39mm", "41mm"],
    colors: ["Steel Blue", "Silver dial", "Gold"],
    short_description: "Iconic octagonal bezel luxury sports watch with blue tapisserie dial.",
    long_description: "The Audemars Piguet Royal Oak is a masterpiece of watch design. Featuring the signature octagonal bezel with hexagonal screws, an integrated steel bracelet, and the beautiful 'Grande Tapisserie' dial, it represents the pinnacle of luxury sports watch craftsmanship.",
    sizing_and_fit: "Standard 41mm case sits comfortably on wrists from 6.5 to 7.5 inches. Intergrated bracelet wears slightly larger than sizing suggests.",
    materials_and_care: "Hand-finished stainless steel case, anti-reflective sapphire crystal, caliber 4302 automatic movement. Water-resistant up to 50 meters.",
    stock: 5,
    is_featured: true,
    display_on_homepage: true,
    rating: 5,
    review_count: 14,
    color_swatches: [
      { name: "Steel Blue", hex: "#1e3a8a" },
      { name: "Silver dial", hex: "#e2e8f0" },
      { name: "Gold", hex: "#eab308" }
    ]
  },
  {
    id: "prod_submariner",
    name: "Rolex Submariner Date",
    slug: "rolex-submariner-date",
    price: 1800000,
    original_price: 1950000,
    main_image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
    gallery_images: [
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800"
    ],
    category: "automatic",
    subcategory: "diver",
    sizes: ["41mm"],
    colors: ["Black Dial"],
    short_description: "The reference among divers watches, combining robust design with premium steel finish.",
    long_description: "Rolex Submariner is the quintessential diver's timepiece. Known for its Cerachrom ceramic bezel insert, legible Chromalight display, and signature Oyster bracelet, it is equally at home underwater or under a suit sleeve.",
    sizing_and_fit: "41mm case diameter with Oystersteel link adjustment for custom fit.",
    materials_and_care: "Oystersteel, scratch-resistant sapphire crystal with Cyclops lens, caliber 3235 automatic movement. Water resistant to 300 meters (1000 ft).",
    stock: 8,
    is_featured: true,
    display_on_homepage: true,
    rating: 4.8,
    review_count: 32,
    color_swatches: [
      { name: "Black Dial", hex: "#09090b" }
    ]
  },
  {
    id: "prod_speedmaster",
    name: "Omega Speedmaster Moonwatch",
    slug: "omega-speedmaster-professional",
    price: 950000,
    original_price: 1050000,
    main_image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800",
    gallery_images: [],
    category: "chronograph",
    subcategory: "space",
    sizes: ["42mm"],
    colors: ["Black Dial"],
    short_description: "The legendary chronograph watch worn during the NASA lunar landings.",
    long_description: "Worn by astronauts in space, the Omega Speedmaster Professional is one of the most famous chronographs in history. Featuring the black dial, tachymeter bezel scale, and driven by the manual-wind master chronometer movement.",
    sizing_and_fit: "42mm case with classic 20mm lug width.",
    materials_and_care: "Stainless steel case, Hesalite or Sapphire crystal options, caliber 3861 manual-wind movement. 50 meters water resistant.",
    stock: 12,
    is_featured: true,
    display_on_homepage: true,
    rating: 4.9,
    review_count: 24,
    color_swatches: [
      { name: "Black Dial", hex: "#09090b" }
    ]
  },
  {
    id: "prod_minimalist",
    name: "Minimalist Classic Quartz",
    slug: "minimalist-classic-quartz",
    price: 18000,
    original_price: 25000,
    main_image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800",
    gallery_images: [],
    category: "quartz",
    subcategory: "classic",
    sizes: ["36mm", "40mm"],
    colors: ["White dial & Tan Leather", "Black dial & Black Leather"],
    short_description: "Sleek and minimalist quartz watch with genuine leather strap.",
    long_description: "Designed for day-to-day sophistication, this minimalist timepiece features a thin stainless steel case, mineral crystal dome, and a reliable Japanese quartz movement.",
    sizing_and_fit: "Slim 7mm case profile makes it sit perfectly under cuffs.",
    materials_and_care: "Stainless steel, hardened mineral crystal, genuine calf leather. Wipe clean with dry cloth.",
    stock: 50,
    is_featured: false,
    display_on_homepage: true,
    rating: 4.5,
    review_count: 8,
    color_swatches: [
      { name: "White dial & Tan Leather", hex: "#d97706" },
      { name: "Black dial & Black Leather", hex: "#18181b" }
    ]
  }
];

const sampleOffers = [
  {
    id: "offer_submariner",
    title: "The Ultimate Diver's Timepiece",
    cta_button_text: "Shop Submariner",
    product_slug: "rolex-submariner-date",
    image_url: "/images/rolex_submariner_banner.png"
  },
  {
    id: "offer_speedmaster",
    title: "Worn On The Moon - Omega Speedmaster",
    cta_button_text: "Explore Speedmaster",
    product_slug: "omega-speedmaster-professional",
    image_url: "/images/omega_speedmaster_banner.png"
  },
  {
    id: "offer_royal_oak",
    title: "Precision. Craftsmanship. Timeless Design.",
    cta_button_text: "Shop Royal Oak",
    product_slug: "royal-oak-automatic",
    image_url: "/images/ap_royal_oak_banner.png"
  }
];

const sampleLookbook = {
  id: "lookbook_entry",
  title: "The Heritage Collection",
  subtitle: "Blending modern precision with timeless horology architecture.",
  cta_link: "/collections/automatic",
  cta_button_text: "View The Collection",
  background_image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=1200"
};

const sampleHeroBanners = [
  {
    id: "banner_royal_oak",
    product_slug: "royal-oak-automatic",
    image_url: "/images/ap_royal_oak_banner.png",
    cta_button_text: "Shop Royal Oak"
  },
  {
    id: "banner_submariner",
    product_slug: "rolex-submariner-date",
    image_url: "/images/rolex_submariner_banner.png",
    cta_button_text: "Shop Submariner"
  },
  {
    id: "banner_speedmaster",
    product_slug: "omega-speedmaster-professional",
    image_url: "/images/omega_speedmaster_banner.png",
    cta_button_text: "Explore Speedmaster"
  }
];

const sampleSocialPosts = [
  {
    id: "social_post_1",
    image_url: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=400",
    post_link: "https://instagram.com"
  },
  {
    id: "social_post_2",
    image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400",
    post_link: "https://instagram.com"
  },
  {
    id: "social_post_3",
    image_url: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=400",
    post_link: "https://instagram.com"
  }
];

async function seed() {
  try {
    console.log("Seeding products...");
    for (const p of sampleProducts) {
      const { error } = await supabase.from('products').upsert({
        ...p,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      console.log(`- Product: ${p.name} seeded.`);
    }

    console.log("Seeding featured offers...");
    for (const offer of sampleOffers) {
      const { error } = await supabase.from('featured_offers').upsert({
        ...offer,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      console.log(`- Offer: ${offer.title} seeded.`);
    }

    console.log("Seeding lookbook...");
    const { error: lbError } = await supabase.from('lookbook').upsert({
      ...sampleLookbook,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    if (lbError) throw lbError;
    console.log("- Lookbook seeded.");

    console.log("Cleaning old desktop_banner and seeding multiple hero banners...");
    await supabase.from('hero_banner').delete().eq('id', 'desktop_banner');
    
    for (const banner of sampleHeroBanners) {
      const { error: hbError } = await supabase.from('hero_banner').upsert({
        ...banner,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      if (hbError) throw hbError;
      console.log(`- Hero Banner: ${banner.id} seeded.`);
    }
    console.log("- Hero Banners seeded.");

    console.log("Seeding social posts...");
    for (const post of sampleSocialPosts) {
      const { error } = await supabase.from('social_posts').upsert({
        ...post,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      console.log(`- Social post: ${post.id} seeded.`);
    }

    console.log("🎉 Database seeded successfully!");
  } catch (err) {
    console.error("❌ Seeding failed with error:", err.message);
  }
}

seed();
