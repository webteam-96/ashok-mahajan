import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany();

    // Return as a key-value object
    const settingsMap = settings.reduce(
      (acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      },
      {} as Record<string, string>
    );

    return NextResponse.json(settingsMap);
  } catch (error) {
    console.error("GET /api/settings error:", error);
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
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: "Key and value are required" },
        { status: 400 }
      );
    }

    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });

    return NextResponse.json(setting, { status: 200 });
  } catch (error) {
    console.error("POST /api/settings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
