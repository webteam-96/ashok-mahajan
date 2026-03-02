import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const awardId = parseInt(id, 10);

    if (isNaN(awardId)) {
      return NextResponse.json({ error: "Invalid award ID" }, { status: 400 });
    }

    const award = await prisma.award.findUnique({
      where: { id: awardId },
    });

    if (!award) {
      return NextResponse.json({ error: "Award not found" }, { status: 404 });
    }

    return NextResponse.json(award);
  } catch (error) {
    console.error("GET /api/awards/[id] error:", error);
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
    const awardId = parseInt(id, 10);

    if (isNaN(awardId)) {
      return NextResponse.json({ error: "Invalid award ID" }, { status: 400 });
    }

    const body = await request.json();
    const { title, image, description, year, order, published } = body;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (image !== undefined) updateData.image = image;
    if (description !== undefined) updateData.description = description;
    if (year !== undefined) updateData.year = year ? parseInt(year, 10) : null;
    if (order !== undefined) updateData.order = parseInt(order, 10);
    if (published !== undefined) updateData.published = published;

    const award = await prisma.award.update({
      where: { id: awardId },
      data: updateData,
    });

    return NextResponse.json(award);
  } catch (error) {
    console.error("PUT /api/awards/[id] error:", error);
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
    const awardId = parseInt(id, 10);

    if (isNaN(awardId)) {
      return NextResponse.json({ error: "Invalid award ID" }, { status: 400 });
    }

    await prisma.award.delete({
      where: { id: awardId },
    });

    return NextResponse.json({ message: "Award deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/awards/[id] error:", error);
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
    const awardId = parseInt(id, 10);
    if (isNaN(awardId)) {
      return NextResponse.json({ error: "Invalid award ID" }, { status: 400 });
    }

    const body = await request.json();

    if (body._delete === true) {
      await prisma.award.delete({ where: { id: awardId } });
      return NextResponse.json({ message: "Award deleted successfully" });
    }

    const { title, image, description, year, order, published } = body;
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (image !== undefined) updateData.image = image;
    if (description !== undefined) updateData.description = description;
    if (year !== undefined) updateData.year = year ? parseInt(year, 10) : null;
    if (order !== undefined) updateData.order = parseInt(order, 10);
    if (published !== undefined) updateData.published = published;

    const award = await prisma.award.update({ where: { id: awardId }, data: updateData });
    return NextResponse.json(award);
  } catch (error) {
    console.error("PATCH /api/awards/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
