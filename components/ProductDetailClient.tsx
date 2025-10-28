'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, Minus, Plus, ShoppingCart, Heart, Sparkles } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { WishlistButton } from './WishlistButton';
import { ReviewForm } from './ReviewForm';
import { ReviewList } from './ReviewList';
import { formatPrice, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ProductDetailClientProps {
  product: any;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem, isLoading } = useCart();
  const router = useRouter();

  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / product.reviews.length
    : 0;

  const handleAddToCart = async () => {
    await addItem(product.id, quantity);
  };

  const handleVirtualTryOn = () => {
    router.push(`/products/${product.slug}/virtual-tryon`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images Section */}
        <div>
          <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-4">
            {product.images[selectedImage] && (
              <Image
                src={product.images[selectedImage].url}
                alt={product.images[selectedImage].alt || product.name}
                fill
                className="object-cover"
                priority
              />
            )}
          </div>
          
          {/* Thumbnail Gallery */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image: any, index: number) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-purple-600' : 'border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || product.name}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div>
          <nav className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            <Link href="/products" className="hover:text-purple-600">Products</Link>
            <span className="mx-2">/</span>
            <Link href={`/products?categoryId=${product.category.id}`} className="hover:text-purple-600">
              {product.category.name}
            </Link>
          </nav>

          <h1 className="text-3xl font-bold text-purple-600 mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= avgRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {avgRating.toFixed(1)} ({product.reviews.length} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <span className="text-green-600 dark:text-green-400 font-medium">In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-red-600 dark:text-red-400 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-2">Description</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{product.description}</p>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 border-x border-gray-300 dark:border-gray-600 min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={isLoading || product.stock === 0}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              {isLoading ? 'Adding...' : 'Add to Cart'}
            </button>
            
            <div className="flex gap-3">
              <button
                onClick={handleVirtualTryOn}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 flex items-center justify-center gap-2"
              >
                <Sparkles className="h-5 w-5" />
                Virtual Try-On
              </button>
              <WishlistButton 
                productId={product.id}
                className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                showLabel={false}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="font-semibold text-foreground mb-4">Product Details</h3>
            <dl className="space-y-2 text-sm">
              {product.sku && (
                <>
                  <dt className="inline text-gray-600 dark:text-gray-400">SKU:</dt>
                  <dd className="inline ml-2 text-foreground">{product.sku}</dd>
                  <br />
                </>
              )}
              <dt className="inline text-gray-600 dark:text-gray-400">Category:</dt>
              <dd className="inline ml-2 text-foreground">{product.category.name}</dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-foreground mb-8">Customer Reviews</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Review Form */}
          <div className="lg:col-span-1">
            <ReviewForm productId={product.id} />
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            <ReviewList reviews={product.reviews} />
          </div>
        </div>
      </div>
    </div>
  );
}
