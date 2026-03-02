import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const file = await prisma.mediaFile.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!file) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(file);
  } catch (error) {
    console.error("GET /api/media/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, file, fileType, mimeType, description, published } = body;

    if (!title || !file) {
      return NextResponse.json(
        { error: "Title and file are required" },
        { status: 400 }
      );
    }

    const updated = await prisma.mediaFile.update({
      where: { id: parseInt(id, 10) },
      data: {
        title,
        file,
        fileType: fileType ?? "document",
        mimeType: mimeType ?? null,
        description: description ?? null,
        published: published !== undefined ? published : true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/media/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.mediaFile.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/media/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const mediaId = parseInt(id, 10);
    const body = await request.json();

    if (body._delete === true) {
      await prisma.mediaFile.delete({ where: { id: mediaId } });
      return NextResponse.json({ success: true });
    }

    const { file, fileType, mimeType, description, published } = body;
    const updated = await prisma.mediaFile.update({
      where: { id: mediaId },
      data: {
        ...(file !== undefined && { file }),
        ...(fileType !== undefined && { fileType }),
        ...(mimeType !== undefined && { mimeType }),
        ...(description !== undefined && { description }),
        ...(published !== undefined && { published }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/media/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
