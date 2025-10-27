import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { cache } from '@/lib/redis';
import { authOptions } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Delete existing images if new ones are provided
    if (body.images) {
      await prisma.productImage.deleteMany({
        where: { productId: params.id },
      });
    }

    const product = await prisma.product.update({
      where: { id: params.id },
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
        images: body.images ? {
          create: body.images.map((url: string, index: number) => ({
            url,
            position: index,
          })),
        } : undefined,
      },
      include: {
        category: true,
        images: true,
      },
    });

    // Invalidate cache
    await cache.delPattern('products:*');
    await cache.del(`product:${body.slug}`);

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
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get product slug for cache invalidation
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      select: { slug: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete product (cascade will handle images, cart items, etc.)
    await prisma.product.delete({
      where: { id: params.id },
    });

    // Invalidate cache
    await cache.delPattern('products:*');
    await cache.del(`product:${product.slug}`);

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
