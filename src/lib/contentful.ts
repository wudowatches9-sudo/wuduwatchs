import { supabaseAdmin } from "@/lib/supabase";
import { Product } from "@/types/product";

// Helper to transform Supabase product row to frontend Product type
function transformSupabaseProduct(row: any): Product {
  if (!row) {
    return null as any;
  }

  const price = Number(row.price || 0);
  const originalPrice = row.original_price ? Number(row.original_price) : undefined;

  return {
    id: row.id,
    name: row.name || "Unnamed Product",
    slug: row.slug || "",
    price: price,
    originalPrice: originalPrice,
    images: {
      main: row.main_image || "/images/placeholder.png",
      gallery: Array.isArray(row.gallery_images) ? row.gallery_images : [],
    },
    category: row.category || "uncategorized",
    subcategory: row.subcategory || "",
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    colors: Array.isArray(row.colors) ? row.colors : [],
    shortDescription: row.short_description || "",
    longDescription: row.long_description || "",
    sizingAndFit: row.sizing_and_fit || "",
    materialsAndCare: row.materials_and_care || "",
    stock: Number(row.stock || 0),
    isFeatured: !!row.is_featured,
    rating: Number(row.rating || 0),
    reviewCount: Number(row.review_count || 0),
    colorSwatches: Array.isArray(row.color_swatches) ? row.color_swatches : [],
    salePercentage:
      originalPrice && price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : undefined,
  };
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("is_featured", true)
      .limit(8);

    if (error) throw error;
    return (data || []).map(transformSupabaseProduct);
  } catch (error) {
    console.error("Error fetching featured products from Supabase:", error);
    return [];
  }
}

export async function getJustForYouProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("display_on_homepage", true);

    if (error) throw error;
    return (data || []).map(transformSupabaseProduct);
  } catch (error) {
    console.error("Error fetching just for you products from Supabase:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    return transformSupabaseProduct(data);
  } catch (error) {
    console.error(`Error fetching product by slug ${slug} from Supabase:`, error);
    return null;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*");

    if (error) throw error;
    return (data || []).map(transformSupabaseProduct);
  } catch (error) {
    console.error("Error fetching all products from Supabase:", error);
    return [];
  }
}

export async function getProductsByCollection(collectionHandle: string): Promise<Product[]> {
  try {
    if (collectionHandle.toLowerCase() === 'all') {
      return await getAllProducts();
    }

    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("category", collectionHandle.toLowerCase());

    if (error) throw error;
    return (data || []).map(transformSupabaseProduct);
  } catch (error) {
    console.error(`Error fetching products for collection ${collectionHandle} from Supabase:`, error);
    return [];
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .or(`name.ilike.%${query}%,category.ilike.%${query}%,short_description.ilike.%${query}%`);

    if (error) throw error;
    return (data || []).map(transformSupabaseProduct);
  } catch (error) {
    console.error(`Error searching products for query "${query}" from Supabase:`, error);
    return [];
  }
}

// Maps Supabase product row back to a Contentful entry-like shape for the admin edit forms
export async function getProductBySlugRaw(slug: string): Promise<any | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      sys: { id: data.id },
      fields: {
        name: data.name,
        slug: data.slug,
        price: data.price,
        originalPrice: data.original_price,
        mainImage: data.main_image,
        galleryImages: data.gallery_images,
        category: data.category,
        subcategory: data.subcategory,
        sizes: data.sizes,
        colors: data.colors,
        shortDescription: data.short_description,
        longDescription: data.long_description,
        sizingAndFit: data.sizing_and_fit,
        materialsAndCare: data.materials_and_care,
        stock: data.stock,
        isFeatured: data.is_featured,
        displayOnHomepage: data.display_on_homepage,
        rating: data.rating,
        reviewCount: data.review_count,
        colorSwatches: data.color_swatches,
      }
    };
  } catch (error) {
    console.error(`Error fetching raw product by slug ${slug} from Supabase:`, error);
    return null;
  }
}

export async function getAllFeaturedOffers() {
  try {
    const { data, error } = await supabaseAdmin
      .from("featured_offers")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data || []).map(row => ({
      id: row.id,
      title: row.title || "",
      ctaButtonText: row.cta_button_text || "",
      ctaLink: row.product_slug || "",
      image: row.image_url || "",
    }));
  } catch (error) {
    console.error("Error fetching featured offers from Supabase:", error);
    return [];
  }
}

export async function getFeaturedOfferById(id: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("featured_offers")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      title: data.title || "",
      ctaButtonText: data.cta_button_text || "",
      ctaLink: data.product_slug || "",
      image: data.image_url || "",
    };
  } catch (error) {
    console.error(`Error fetching offer ${id} from Supabase:`, error);
    return null;
  }
}

// Maps Supabase lookbook row to Contentful entry-like shape
export async function getLookbookData() {
  try {
    const { data, error } = await supabaseAdmin
      .from("lookbook")
      .select("*")
      .limit(1);

    if (error) throw error;
    if (!data || data.length === 0) return null;

    const row = data[0];
    return {
      sys: { id: row.id },
      fields: {
        title: row.title,
        subtitle: row.subtitle,
        ctaLink: row.cta_link,
        ctaButtonText: row.cta_button_text,
        backgroundImage: row.background_image,
      }
    };
  } catch (error) {
    console.error("Error fetching lookbook from Supabase:", error);
    return null;
  }
}

export async function getLookbookEntryRAW(): Promise<any | null> {
  return await getLookbookData();
}

export async function getAllSocialPosts() {
  try {
    const { data, error } = await supabaseAdmin
      .from("social_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []).map(row => ({
      id: row.id,
      image: row.image_url || "",
      postLink: row.post_link || "",
    }));
  } catch (error) {
    console.error("Error fetching social posts from Supabase:", error);
    return [];
  }
}

export async function getSocialPostById(id: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("social_posts")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      image: data.image_url || "",
      postLink: data.post_link || "",
    };
  } catch (error) {
    console.error(`Error fetching social post ${id} from Supabase:`, error);
    return null;
  }
}

export async function getAllCollections(): Promise<string[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("category");

    if (error) throw error;
    const categories = new Set<string>();
    (data || []).forEach(product => {
      if (product.category) {
        categories.add(product.category.toLowerCase());
      }
    });
    return Array.from(categories);
  } catch (error) {
    console.error("Error fetching collections from Supabase:", error);
    return [];
  }
}

// Fetch the desktop hero banner from Supabase (first one as fallback)
export async function getDesktopHeroBanner() {
  try {
    const banners = await getAllHeroBanners();
    return banners.length > 0 ? banners[0] : null;
  } catch (error) {
    console.error("Error fetching desktop banner fallback:", error);
    return null;
  }
}

// Fetch all hero banners from Supabase
export async function getAllHeroBanners() {
  try {
    const { data, error } = await supabaseAdmin
      .from("hero_banner")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data || []).map(row => ({
      id: row.id,
      title: "Hero Banner",
      ctaButtonText: row.cta_button_text || "",
      ctaLink: row.product_slug || "",
      image: row.image_url || "",
    }));
  } catch (error) {
    console.error("Error fetching all hero banners from Supabase:", error);
    return [];
  }
}

// Fetch single hero banner by ID
export async function getHeroBannerById(id: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from("hero_banner")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      title: "Hero Banner",
      ctaButtonText: data.cta_button_text || "",
      ctaLink: data.product_slug || "",
      image: data.image_url || "",
    };
  } catch (error) {
    console.error(`Error fetching hero banner ${id} from Supabase:`, error);
    return null;
  }
}
