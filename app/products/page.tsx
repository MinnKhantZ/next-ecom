import { ProductGrid } from '@/components/ProductGrid';
import { ProductSort } from '@/components/ProductSort';
import { ProductSearch } from '@/components/ProductSearch';
import prisma from '@/lib/prisma';
import Link from 'next/link';

interface SearchParams {
  page?: string;
  categoryId?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  sortOrder?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const pageSize = 12;
  const skip = (page - 1) * pageSize;

  const where: any = {
    status: 'ACTIVE',
  };

  if (params.categoryId) {
    where.categoryId = params.categoryId;
  }

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: 'insensitive' } },
      { description: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice) where.price.gte = parseFloat(params.minPrice);
    if (params.maxPrice) where.price.lte = parseFloat(params.maxPrice);
  }

  const sortBy = params.sortBy || 'createdAt';
  const sortOrder = (params.sortOrder || 'desc') as 'asc' | 'desc';

  let orderBy: any = {};
  if (sortBy === 'price') {
    orderBy.price = sortOrder;
  } else if (sortBy === 'name') {
    orderBy.name = sortOrder;
  } else {
    orderBy.createdAt = sortOrder;
  }

  const [productsRaw, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: {
          orderBy: { position: 'asc' },
          take: 1,
        },
        _count: {
          select: { reviews: true },
        },
      },
      orderBy,
      skip,
      take: pageSize,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    }),
  ]);

  // Convert Decimal fields to numbers for client components
  const products = productsRaw.map(product => ({
    ...product,
    price: product.price.toNumber(),
    comparePrice: product.comparePrice?.toNumber() ?? null,
    costPrice: product.costPrice?.toNumber() ?? null,
  }));

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className={`block py-2 px-3 rounded ${
                    !params.categoryId ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  All Products ({total})
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/products?categoryId=${category.id}`}
                    className={`block py-2 px-3 rounded ${
                      params.categoryId === category.id
                        ? 'bg-purple-100 text-purple-700'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category.name} ({category._count.products})
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold text-purple-600">Products</h1>
            
            <div className="flex gap-3 w-full md:w-auto">
              <ProductSearch initialValue={params.search} />
              <ProductSort currentSort={sortBy} currentOrder={sortOrder} />
            </div>
          </div>

          {/* Active Filters */}
          {(params.search || params.categoryId) && (
            <div className="mb-4 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
              {params.search && (
                <Link
                  href={`/products?${params.categoryId ? `categoryId=${params.categoryId}` : ''}`}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200"
                >
                  Search: {params.search}
                  <span className="text-lg leading-none">×</span>
                </Link>
              )}
              {params.categoryId && (
                <Link
                  href={`/products?${params.search ? `search=${params.search}` : ''}`}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200"
                >
                  Category
                  <span className="text-lg leading-none">×</span>
                </Link>
              )}
            </div>
          )}

          <ProductGrid products={products} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const paginationParams = new URLSearchParams();
                paginationParams.set('page', pageNum.toString());
                if (params.categoryId) paginationParams.set('categoryId', params.categoryId);
                if (params.search) paginationParams.set('search', params.search);
                if (params.minPrice) paginationParams.set('minPrice', params.minPrice);
                if (params.maxPrice) paginationParams.set('maxPrice', params.maxPrice);
                if (params.sortBy) paginationParams.set('sortBy', params.sortBy);
                if (params.sortOrder) paginationParams.set('sortOrder', params.sortOrder);
                
                return (
                  <Link
                    key={pageNum}
                    href={`/products?${paginationParams.toString()}`}
                    className={`px-4 py-2 rounded ${
                      pageNum === page
                        ? 'bg-purple-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
