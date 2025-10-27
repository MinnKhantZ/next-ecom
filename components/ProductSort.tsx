'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface ProductSortProps {
  currentSort: string;
  currentOrder: string;
}

export function ProductSort({ currentSort, currentOrder }: ProductSortProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-');
    const params = new URLSearchParams(searchParams);
    
    params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);
    
    router.push(`/products?${params.toString()}`);
  };

  return (
    <select
      value={`${currentSort}-${currentOrder}`}
      onChange={(e) => handleSortChange(e.target.value)}
      className="border border-gray-300 rounded-lg px-4 py-2 bg-white cursor-pointer focus:ring-2 focus:ring-purple-600 focus:border-transparent"
    >
      <option value="createdAt-desc">Newest First</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="name-asc">Name: A to Z</option>
      <option value="name-desc">Name: Z to A</option>
    </select>
  );
}
