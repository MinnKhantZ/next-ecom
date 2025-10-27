import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { cache } from '@/lib/redis';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    // Try cache first
    const cacheKey = 'categories:all';
    const cached = await cache.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
        children: {
          include: {
            _count: {
              select: { products: true },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    // Cache for 30 minutes
    await cache.set(cacheKey, categories, 1800);

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();

    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        image: body.image,
        parentId: body.parentId,
      },
    });

    // Invalidate cache
    await cache.del('categories:all');

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
