import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BASE_COUNT = 23000;

async function getPrisma() {
  try {
    const { prisma } = await import('@/lib/prisma');
    return prisma;
  } catch {
    return null;
  }
}

export async function POST() {
  try {
    const prisma = await getPrisma();
    if (!prisma) return NextResponse.json({ count: BASE_COUNT });
    const current = await prisma.siteSetting.findUnique({ where: { key: 'visitor_count' } });
    const count = current ? parseInt(current.value, 10) + 1 : BASE_COUNT + 1;
    await prisma.siteSetting.upsert({
      where: { key: 'visitor_count' },
      update: { value: String(count) },
      create: { key: 'visitor_count', value: String(count) },
    });
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: BASE_COUNT });
  }
}

export async function GET() {
  try {
    const prisma = await getPrisma();
    if (!prisma) return NextResponse.json({ count: BASE_COUNT });
    const current = await prisma.siteSetting.findUnique({ where: { key: 'visitor_count' } });
    const count = current ? parseInt(current.value, 10) : BASE_COUNT;
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: BASE_COUNT });
  }
}
