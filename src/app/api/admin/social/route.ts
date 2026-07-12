import { NextResponse } from "next/server";
import { getAllSocialPosts } from "@/lib/contentful";

export async function GET() {
  try {
    const socialPosts = await getAllSocialPosts();
    return NextResponse.json({ success: true, data: socialPosts });
  } catch (error: any) {
    console.error("API Error fetching social posts:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch social posts" },
      { status: 500 }
    );
  }
}
