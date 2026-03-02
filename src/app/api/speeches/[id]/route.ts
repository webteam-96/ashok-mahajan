import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const speechId = parseInt(id, 10);

    if (isNaN(speechId)) {
      return NextResponse.json({ error: "Invalid speech ID" }, { status: 400 });
    }

    const speech = await prisma.speech.findUnique({
      where: { id: speechId },
    });

    if (!speech) {
      return NextResponse.json({ error: "Speech not found" }, { status: 404 });
    }

    return NextResponse.json(speech);
  } catch (error) {
    console.error("GET /api/speeches/[id] error:", error);
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
    const speechId = parseInt(id, 10);

    if (isNaN(speechId)) {
      return NextResponse.json({ error: "Invalid speech ID" }, { status: 400 });
    }

    const body = await request.json();
    const { title, content, eventName, date, published } = body;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (eventName !== undefined) updateData.eventName = eventName;
    if (date !== undefined) updateData.date = date ? new Date(date) : null;
    if (published !== undefined) updateData.published = published;

    const speech = await prisma.speech.update({
      where: { id: speechId },
      data: updateData,
    });

    return NextResponse.json(speech);
  } catch (error) {
    console.error("PUT /api/speeches/[id] error:", error);
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
    const speechId = parseInt(id, 10);

    if (isNaN(speechId)) {
      return NextResponse.json({ error: "Invalid speech ID" }, { status: 400 });
    }

    await prisma.speech.delete({
      where: { id: speechId },
    });

    return NextResponse.json({ message: "Speech deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/speeches/[id] error:", error);
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
    const speechId = parseInt(id, 10);
    if (isNaN(speechId)) {
      return NextResponse.json({ error: "Invalid speech ID" }, { status: 400 });
    }

    const body = await request.json();

    if (body._delete === true) {
      await prisma.speech.delete({ where: { id: speechId } });
      return NextResponse.json({ message: "Speech deleted successfully" });
    }

    const { title, content, eventName, date, published } = body;
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (eventName !== undefined) updateData.eventName = eventName;
    if (date !== undefined) updateData.date = date ? new Date(date) : null;
    if (published !== undefined) updateData.published = published;

    const speech = await prisma.speech.update({ where: { id: speechId }, data: updateData });
    return NextResponse.json(speech);
  } catch (error) {
    console.error("PATCH /api/speeches/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
