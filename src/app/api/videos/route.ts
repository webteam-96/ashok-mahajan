import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin") === "true";

    const session = admin ? await auth() : null;
    const where = admin && session ? {} : { published: true };

    const videos = await prisma.video.findMany({
      where,
      orderBy: admin && session ? { id: "desc" } : { date: "desc" },
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error("GET /api/videos error:", error);
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
    const { title, youtubeUrl, videoFile, thumbnail, date, published } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const video = await prisma.video.create({
      data: {
        title,
        youtubeUrl: youtubeUrl ?? null,
        videoFile: videoFile ?? null,
        thumbnail: thumbnail ?? null,
        date: date ? new Date(date) : null,
        published: published !== undefined ? published : true,
      },
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error("POST /api/videos error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
