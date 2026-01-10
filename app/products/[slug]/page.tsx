import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { ProductDetailClient } from '@/components/ProductDetailClient';
import type { Metadata } from 'next';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProduct(slug: string) {
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
    },
  });

  return product;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} - Fashion Store`,
    description: product.description.substring(0, 160),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  // Convert Decimal fields to numbers for client component
  const serializedProduct = {
    ...product,
    price: product.price.toNumber(),
    comparePrice: product.comparePrice?.toNumber() ?? null,
    costPrice: product.costPrice?.toNumber() ?? null,
  };

  return <ProductDetailClient product={serializedProduct} />;
}
