import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const videoId = parseInt(id, 10);

    if (isNaN(videoId)) {
      return NextResponse.json({ error: "Invalid video ID" }, { status: 400 });
    }

    const video = await prisma.video.findUnique({
      where: { id: videoId },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error("GET /api/videos/[id] error:", error);
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
    const videoId = parseInt(id, 10);

    if (isNaN(videoId)) {
      return NextResponse.json({ error: "Invalid video ID" }, { status: 400 });
    }

    const body = await request.json();
    const { title, youtubeUrl, videoFile, thumbnail, date, published } = body;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (youtubeUrl !== undefined) updateData.youtubeUrl = youtubeUrl;
    if (videoFile !== undefined) updateData.videoFile = videoFile;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (date !== undefined) updateData.date = date ? new Date(date) : null;
    if (published !== undefined) updateData.published = published;

    const video = await prisma.video.update({
      where: { id: videoId },
      data: updateData,
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error("PUT /api/videos/[id] error:", error);
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
    const videoId = parseInt(id, 10);

    if (isNaN(videoId)) {
      return NextResponse.json({ error: "Invalid video ID" }, { status: 400 });
    }

    await prisma.video.delete({
      where: { id: videoId },
    });

    return NextResponse.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/videos/[id] error:", error);
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
    const videoId = parseInt(id, 10);
    if (isNaN(videoId)) {
      return NextResponse.json({ error: "Invalid video ID" }, { status: 400 });
    }

    const body = await request.json();

    if (body._delete === true) {
      await prisma.video.delete({ where: { id: videoId } });
      return NextResponse.json({ message: "Video deleted successfully" });
    }

    const { title, youtubeUrl, videoFile, thumbnail, date, published } = body;
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (youtubeUrl !== undefined) updateData.youtubeUrl = youtubeUrl;
    if (videoFile !== undefined) updateData.videoFile = videoFile;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (date !== undefined) updateData.date = date ? new Date(date) : null;
    if (published !== undefined) updateData.published = published;

    const video = await prisma.video.update({ where: { id: videoId }, data: updateData });
    return NextResponse.json(video);
  } catch (error) {
    console.error("PATCH /api/videos/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
