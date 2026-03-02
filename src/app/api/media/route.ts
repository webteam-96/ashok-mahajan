import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin") === "true";

    const session = admin ? await auth() : null;
    const where = admin && session ? {} : { published: true };

    const files = await prisma.mediaFile.findMany({
      where,
      orderBy: admin && session ? { id: "desc" } : { createdAt: "desc" },
    });

    return NextResponse.json(files);
  } catch (error) {
    console.error("GET /api/media error:", error);
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
    const { title, file, fileType, mimeType, description, published } = body;

    if (!file) {
      return NextResponse.json(
        { error: "File is required" },
        { status: 400 }
      );
    }

    const mediaFile = await prisma.mediaFile.create({
      data: {
        title: title || null,
        file,
        fileType: fileType ?? "document",
        mimeType: mimeType ?? null,
        description: description ?? null,
        published: published !== undefined ? published : true,
      },
    });

    return NextResponse.json(mediaFile, { status: 201 });
  } catch (error) {
    console.error("POST /api/media error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
