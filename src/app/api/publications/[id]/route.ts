import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const publicationId = parseInt(id, 10);

    if (isNaN(publicationId)) {
      return NextResponse.json({ error: "Invalid publication ID" }, { status: 400 });
    }

    const publication = await prisma.publication.findUnique({
      where: { id: publicationId },
    });

    if (!publication) {
      return NextResponse.json({ error: "Publication not found" }, { status: 404 });
    }

    return NextResponse.json(publication);
  } catch (error) {
    console.error("GET /api/publications/[id] error:", error);
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
    const publicationId = parseInt(id, 10);

    if (isNaN(publicationId)) {
      return NextResponse.json({ error: "Invalid publication ID" }, { status: 400 });
    }

    const body = await request.json();
    const { title, description, coverImage, pdfFile, year, published } = body;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (pdfFile !== undefined) updateData.pdfFile = pdfFile;
    if (year !== undefined) updateData.year = year ? parseInt(String(year), 10) : null;
    if (published !== undefined) updateData.published = published;

    const publication = await prisma.publication.update({
      where: { id: publicationId },
      data: updateData,
    });

    return NextResponse.json(publication);
  } catch (error) {
    console.error("PUT /api/publications/[id] error:", error);
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
    const publicationId = parseInt(id, 10);

    if (isNaN(publicationId)) {
      return NextResponse.json({ error: "Invalid publication ID" }, { status: 400 });
    }

    await prisma.publication.delete({
      where: { id: publicationId },
    });

    return NextResponse.json({ message: "Publication deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/publications/[id] error:", error);
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
    const publicationId = parseInt(id, 10);
    if (isNaN(publicationId)) {
      return NextResponse.json({ error: "Invalid publication ID" }, { status: 400 });
    }

    const body = await request.json();

    if (body._delete === true) {
      await prisma.publication.delete({ where: { id: publicationId } });
      return NextResponse.json({ message: "Publication deleted successfully" });
    }

    const { title, description, coverImage, pdfFile, year, published } = body;
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (pdfFile !== undefined) updateData.pdfFile = pdfFile;
    if (year !== undefined) updateData.year = year ? parseInt(String(year), 10) : null;
    if (published !== undefined) updateData.published = published;

    const publication = await prisma.publication.update({ where: { id: publicationId }, data: updateData });
    return NextResponse.json(publication);
  } catch (error) {
    console.error("PATCH /api/publications/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
