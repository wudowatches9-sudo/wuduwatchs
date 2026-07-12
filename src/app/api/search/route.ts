import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/contentful";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ success: false, error: "Query parameter is required" }, { status: 400 });
  }

  try {
    const products = await searchProducts(query);
    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    console.error("API Error searching products:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to search products" },
      { status: 500 }
    );
  }
}
