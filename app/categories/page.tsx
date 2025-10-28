import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Categories - Fashion Store',
  description: 'Browse all product categories in our fashion store',
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
      products: {
        where: {
          status: 'ACTIVE',
        },
        include: {
          images: {
            orderBy: { position: 'asc' },
            take: 1,
          },
        },
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-purple-600 mb-4">Shop by Category</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Explore our diverse collection of fashion items organized by category
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?categoryId=${category.id}`}
            className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative h-64 bg-gray-200 dark:bg-gray-700 overflow-hidden">
              {category.products[0]?.images[0] ? (
                <Image
                  src={category.products[0].images[0].url}
                  alt={category.products[0].images[0].alt || category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <svg
                    className="w-20 h-20 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-2 group-hover:text-purple-600 transition-colors">
                {category.name}
              </h2>
              
              {category.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {category.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {category._count.products} {category._count.products === 1 ? 'Product' : 'Products'}
                </span>
                <span className="text-purple-600 font-medium group-hover:text-purple-700">
                  Browse →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No categories available</p>
        </div>
      )}
    </div>
  );
}
