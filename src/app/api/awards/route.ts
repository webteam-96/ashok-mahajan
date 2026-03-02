import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin") === "true";

    // Admin requests (authenticated) return all awards including unpublished
    const session = admin ? await auth() : null;
    const where = admin && session ? {} : { published: true };

    const awards = await prisma.award.findMany({
      where,
      orderBy: admin && session ? { id: "desc" } : [{ order: "asc" }, { year: "desc" }],
    });

    return NextResponse.json(awards);
  } catch (error) {
    console.error("GET /api/awards error:", error);
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
    const { title, image, description, year, order, published } = body;

    if (!image) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    const award = await prisma.award.create({
      data: {
        title: title || null,
        image,
        description: description ?? null,
        year: year ? parseInt(year, 10) : null,
        order: order !== undefined ? parseInt(order, 10) : 0,
        published: published !== undefined ? published : true,
      },
    });

    return NextResponse.json(award, { status: 201 });
  } catch (error) {
    console.error("POST /api/awards error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
