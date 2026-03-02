import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const imageId = parseInt(id, 10);

    if (isNaN(imageId)) {
      return NextResponse.json({ error: "Invalid gallery image ID" }, { status: 400 });
    }

    const image = await prisma.galleryImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return NextResponse.json({ error: "Gallery image not found" }, { status: 404 });
    }

    return NextResponse.json(image);
  } catch (error) {
    console.error("GET /api/gallery/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const imageId = parseInt(id, 10);

    if (isNaN(imageId)) {
      return NextResponse.json({ error: "Invalid gallery image ID" }, { status: 400 });
    }

    const body = await request.json();
    const { title, image, caption, album, order, published } = body;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (image !== undefined) updateData.image = image;
    if (caption !== undefined) updateData.caption = caption;
    if (album !== undefined) updateData.album = album;
    if (order !== undefined) updateData.order = parseInt(order, 10);
    if (published !== undefined) updateData.published = published;

    const galleryImage = await prisma.galleryImage.update({
      where: { id: imageId },
      data: updateData,
    });

    return NextResponse.json(galleryImage);
  } catch (error) {
    console.error("PUT /api/gallery/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const imageId = parseInt(id, 10);

    if (isNaN(imageId)) {
      return NextResponse.json({ error: "Invalid gallery image ID" }, { status: 400 });
    }

    await prisma.galleryImage.delete({
      where: { id: imageId },
    });

    return NextResponse.json({ message: "Gallery image deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/gallery/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const imageId = parseInt(id, 10);
    if (isNaN(imageId)) {
      return NextResponse.json({ error: "Invalid gallery image ID" }, { status: 400 });
    }

    const body = await request.json();

    if (body._delete === true) {
      await prisma.galleryImage.delete({ where: { id: imageId } });
      return NextResponse.json({ message: "Gallery image deleted successfully" });
    }

    const { title, image, caption, album, order, published } = body;
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (image !== undefined) updateData.image = image;
    if (caption !== undefined) updateData.caption = caption;
    if (album !== undefined) updateData.album = album;
    if (order !== undefined) updateData.order = parseInt(order, 10);
    if (published !== undefined) updateData.published = published;

    const galleryImage = await prisma.galleryImage.update({ where: { id: imageId }, data: updateData });
    return NextResponse.json(galleryImage);
  } catch (error) {
    console.error("PATCH /api/gallery/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
