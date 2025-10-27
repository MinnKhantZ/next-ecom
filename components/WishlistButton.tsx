'use client';

import { Heart } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';

interface WishlistButtonProps {
  productId: string;
  className?: string;
  showLabel?: boolean;
}

export function WishlistButton({ productId, className = '', showLabel = false }: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFavorite = isInWishlist(productId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(productId);
      }}
      className={`group transition-all ${className}`}
      aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={`h-5 w-5 transition-all ${
          isFavorite
            ? 'fill-red-500 text-red-500'
            : 'text-gray-400 group-hover:text-red-500'
        }`}
      />
      {showLabel && (
        <span className="ml-2 text-sm">
          {isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </button>
  );
}
