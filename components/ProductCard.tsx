import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { WishlistButton } from './WishlistButton';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number | null;
    images: { url: string; alt: string | null }[];
    category: {
      name: string;
    };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = product.comparePrice
    ? calculateDiscount(Number(product.price), Number(product.comparePrice))
    : 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        {product.images[0] && (
          <Image
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </div>
        )}
        <div className="absolute top-2 left-2">
          <WishlistButton productId={product.id} className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:shadow-lg" />
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
          {product.category.name}
        </p>
        <h3 className="font-medium text-foreground mb-2 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && (
            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
