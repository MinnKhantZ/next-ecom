import Link from 'next/link';
import { ProductGrid } from '@/components/ProductGrid';
import prisma from '@/lib/prisma';

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: {
      featured: true,
      status: 'ACTIVE',
    },
    include: {
      category: true,
      images: {
        orderBy: { position: 'asc' },
        take: 1,
      },
    },
    take: 8,
  });

  return products.map(product => ({
    ...product,
    price: product.price.toNumber(),
    comparePrice: product.comparePrice?.toNumber() || null,
  }));
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Fashion Store
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100">
            Discover the latest trends in fashion
          </p>
          <Link
            href="/products"
            className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-foreground">Featured Products</h2>
          <Link
            href="/products"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            View All →
          </Link>
        </div>
        {featuredProducts.length > 0 ? (
          <ProductGrid products={featuredProducts} />
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">No featured products available yet.</p>
            <p className="text-sm text-gray-400 mt-2">
              Products will appear here once added by administrators.
            </p>
          </div>
        )}
      </section>

      {/* Categories Preview */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Men', 'Women', 'Accessories', 'Sale'].map((category) => (
              <Link
                key={category}
                href={`/products?category=${category.toLowerCase()}`}
                className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 text-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <h3 className="text-xl font-semibold text-foreground">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
            <p className="text-gray-600 dark:text-gray-400">On orders over $100</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">↩️</div>
            <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
            <p className="text-gray-600 dark:text-gray-400">30-day return policy</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
            <p className="text-gray-600 dark:text-gray-400">100% secure transactions</p>
          </div>
        </div>
      </section>
    </div>
  );
}
