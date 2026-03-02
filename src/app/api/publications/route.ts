import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin") === "true";

    const session = admin ? await auth() : null;
    const where = admin && session ? {} : { published: true };

    const publications = await prisma.publication.findMany({
      where,
      orderBy: admin && session ? { id: "desc" } : { year: "desc" },
    });

    return NextResponse.json(publications);
  } catch (error) {
    console.error("GET /api/publications error:", error);
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
    const { title, description, coverImage, pdfFile, year, published } = body;

    if (!coverImage && !pdfFile) {
      return NextResponse.json(
        { error: "Cover image or PDF file is required" },
        { status: 400 }
      );
    }

    const publication = await prisma.publication.create({
      data: {
        title: title || null,
        description: description ?? null,
        coverImage: coverImage ?? null,
        pdfFile: pdfFile ?? null,
        year: year ? parseInt(year, 10) : null,
        published: published !== undefined ? published : true,
      },
    });

    return NextResponse.json(publication, { status: 201 });
  } catch (error) {
    console.error("POST /api/publications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
