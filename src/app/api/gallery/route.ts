import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const album = searchParams.get("album");
    const admin = searchParams.get("admin") === "true";

    const where: Record<string, unknown> = {};
    if (album) {
      where.album = album;
    }

    const session = admin ? await auth() : null;

    const images = await prisma.galleryImage.findMany({
      where,
      orderBy: admin && session ? { id: "desc" } : { order: "asc" },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error("GET /api/gallery error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, image, caption, album, order, published } = body;

    if (!image) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    const galleryImage = await prisma.galleryImage.create({
      data: {
        title: title || null,
        image,
        caption: caption ?? null,
        album: album ?? null,
        order: order !== undefined ? parseInt(order, 10) : 0,
        published: published !== undefined ? published : true,
      },
    });

    return NextResponse.json(galleryImage, { status: 201 });
  } catch (error) {
    console.error("POST /api/gallery error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
