import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin") === "true";

    const session = admin ? await auth() : null;
    const where = admin && session ? {} : { published: true };

    const speeches = await prisma.speech.findMany({
      where,
      orderBy: admin && session ? { id: "desc" } : { date: "desc" },
    });

    return NextResponse.json(speeches);
  } catch (error) {
    console.error("GET /api/speeches error:", error);
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
    const { title, content, eventName, date, published } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Generate unique slug
    let slug = generateSlug(title);
    const existingSpeech = await prisma.speech.findUnique({ where: { slug } });
    if (existingSpeech) {
      slug = `${slug}-${Date.now()}`;
    }

    const speech = await prisma.speech.create({
      data: {
        title,
        slug,
        content,
        eventName: eventName ?? null,
        date: date ? new Date(date) : null,
        published: published !== undefined ? published : true,
      },
    });

    return NextResponse.json(speech, { status: 201 });
  } catch (error) {
    console.error("POST /api/speeches error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
