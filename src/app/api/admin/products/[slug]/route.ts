import { NextResponse } from "next/server";
import { getProductBySlugRaw } from "@/lib/contentful";

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Handle "new" product case
    if (slug === "new") {
      return NextResponse.json({ 
        success: true, 
        data: null,
        isNew: true 
      });
    }

    // Fetch existing product
    const product = await getProductBySlugRaw(slug);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        data: product,
        isNew: false 
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error("API Error fetching product:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}
