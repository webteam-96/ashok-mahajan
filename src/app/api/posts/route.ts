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
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = parseInt(searchParams.get("limit") ?? "10", 10);
    const slug = searchParams.get("slug");

    // Return single post by slug
    if (slug) {
      const post = await prisma.blogPost.findUnique({
        where: { slug },
      });

      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }

      return NextResponse.json(post);
    }

    const where: Record<string, unknown> = { published: true };

    if (category) {
      where.category = category;
    }

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedDate: "desc" },
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/posts error:", error);
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
    const {
      title,
      content,
      excerpt,
      featuredImage,
      category,
      publishedDate,
      seoTitle,
      seoDescription,
      published,
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Generate unique slug
    let slug = generateSlug(title);
    const existingPost = await prisma.blogPost.findUnique({ where: { slug } });
    if (existingPost) {
      slug = `${slug}-${Date.now()}`;
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt ?? null,
        featuredImage: featuredImage ?? null,
        category: category ?? "blog",
        publishedDate: publishedDate ? new Date(publishedDate) : new Date(),
        seoTitle: seoTitle ?? null,
        seoDescription: seoDescription ?? null,
        published: published !== undefined ? published : true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
