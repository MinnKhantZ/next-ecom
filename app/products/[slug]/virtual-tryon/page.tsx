import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { VirtualTryOnClient } from '@/components/VirtualTryOnClient';
import type { Metadata } from 'next';

interface VirtualTryOnPageProps {
  params: {
    slug: string;
  };
}

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: {
        orderBy: { position: 'asc' },
      },
    },
  });

  return product;
}

export async function generateMetadata({ params }: VirtualTryOnPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);
  
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `Virtual Try-On: ${product.name} - Fashion Store`,
    description: `Try on ${product.name} virtually using AI. See how it looks on you before you buy.`,
  };
}

export default async function VirtualTryOnPage({ params }: VirtualTryOnPageProps) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  // Convert Decimal fields to numbers for client component
  const serializedProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price.toNumber(),
    images: product.images,
    category: product.category,
  };

  return <VirtualTryOnClient product={serializedProduct} />;
}
