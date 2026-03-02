import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const postId = parseInt(id, 10);

    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const post = await prisma.blogPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("GET /api/posts/[id] error:", error);
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
    const postId = parseInt(id, 10);

    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
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

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
    if (category !== undefined) updateData.category = category;
    if (publishedDate !== undefined) updateData.publishedDate = new Date(publishedDate);
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle;
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription;
    if (published !== undefined) updateData.published = published;

    const post = await prisma.blogPost.update({
      where: { id: postId },
      data: updateData,
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("PUT /api/posts/[id] error:", error);
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
    const postId = parseInt(id, 10);

    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    await prisma.blogPost.delete({
      where: { id: postId },
    });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/posts/[id] error:", error);
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
    const postId = parseInt(id, 10);
    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const body = await request.json();

    if (body._delete === true) {
      await prisma.blogPost.delete({ where: { id: postId } });
      return NextResponse.json({ message: "Post deleted successfully" });
    }

    const { title, content, excerpt, featuredImage, category, publishedDate, seoTitle, seoDescription, published } = body;
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
    if (category !== undefined) updateData.category = category;
    if (publishedDate !== undefined) updateData.publishedDate = new Date(publishedDate);
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle;
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription;
    if (published !== undefined) updateData.published = published;

    const post = await prisma.blogPost.update({ where: { id: postId }, data: updateData });
    return NextResponse.json(post);
  } catch (error) {
    console.error("PATCH /api/posts/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
