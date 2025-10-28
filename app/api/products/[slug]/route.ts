import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { cache } from '@/lib/redis';
import { authOptions } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Try cache first
    const cacheKey = `product:${slug}`;
    const cached = await cache.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: {
          orderBy: { position: 'asc' },
        },
        variants: {
          include: {
            options: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Cache for 10 minutes
    await cache.set(cacheKey, product, 600);

    return NextResponse.json(product);
  } catch (error) {
    console.error('Product detail error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const body = await req.json();

    const product = await prisma.product.update({
      where: { slug },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price,
        comparePrice: body.comparePrice,
        costPrice: body.costPrice,
        sku: body.sku,
        categoryId: body.categoryId,
        stock: body.stock,
        trackInventory: body.trackInventory,
        status: body.status,
        featured: body.featured,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
      },
      include: {
        category: true,
        images: true,
      },
    });

    // Invalidate cache
    await cache.del(`product:${slug}`);
    await cache.delPattern('products:*');

    return NextResponse.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slug: param } = await params;
    const body = await req.json();

    // Try to find product by slug first, if not found, try by ID
    let whereClause: any = { slug: param };
    
    // Check if param looks like an ID (CUID format)
    if (/^c[a-z0-9]{24}$/.test(param)) {
      // Try finding by ID first
      const productById = await prisma.product.findUnique({
        where: { id: param },
        select: { id: true, slug: true },
      });
      
      if (productById) {
        whereClause = { id: param };
      }
    }

    // First, get the old product to know its slug
    const oldProduct = await prisma.product.findUnique({
      where: whereClause,
      select: { slug: true },
    });

    if (!oldProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const updateData: any = {
      name: body.name,
      slug: body.slug,
      description: body.description,
      price: body.price,
      comparePrice: body.comparePrice,
      costPrice: body.costPrice,
      sku: body.sku,
      categoryId: body.categoryId,
      stock: body.stock,
      trackInventory: body.trackInventory ?? true,
      status: body.status,
      featured: body.featured,
      metaTitle: body.metaTitle,
      metaDescription: body.metaDescription,
    };

    // Handle images update if provided
    if (body.images && Array.isArray(body.images)) {
      updateData.images = {
        deleteMany: {},
        create: body.images.map((url: string, index: number) => ({
          url,
          position: index,
        })),
      };
    }

    const product = await prisma.product.update({
      where: whereClause,
      data: updateData,
      include: {
        category: true,
        images: {
          orderBy: { position: 'asc' },
        },
      },
    });

    // Invalidate cache
    await cache.del(`product:${oldProduct.slug}`);
    await cache.del(`product:${body.slug}`);
    await cache.delPattern('products:*');

    return NextResponse.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slug } = await params;

    await prisma.product.delete({
      where: { slug },
    });

    // Invalidate cache
    await cache.del(`product:${slug}`);
    await cache.delPattern('products:*');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
