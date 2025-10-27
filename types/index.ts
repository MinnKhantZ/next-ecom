import { User, Product, Category, Order, OrderItem, CartItem, Address, Review } from '@prisma/client';

export type { User, Product, Category, Order, OrderItem, CartItem, Address, Review };

export interface ProductWithDetails extends Product {
  category: Category;
  images: { id: string; url: string; alt: string | null }[];
  reviews: Review[];
  _count?: {
    reviews: number;
  };
}

export interface OrderWithDetails extends Order {
  items: (OrderItem & {
    product: Product;
  })[];
  shippingAddress: Address;
  billingAddress: Address | null;
}

export interface CartItemWithProduct extends CartItem {
  product: Product & {
    images: { url: string; alt: string | null }[];
  };
}

export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  role: string;
  image?: string | null;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  tags?: string[];
  status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  featured?: boolean;
  sortBy?: 'price' | 'name' | 'createdAt' | 'popular';
  sortOrder?: 'asc' | 'desc';
}
