import { NextResponse } from "next/server";
import { getAllFeaturedOffers } from "@/lib/contentful";

export async function GET() {
  try {
    const offers = await getAllFeaturedOffers();
    return NextResponse.json({ success: true, data: offers });
  } catch (error: any) {
    console.error("API Error fetching offers:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch offers" },
      { status: 500 }
    );
  }
}
