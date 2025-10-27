'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Package, CheckCircle, Truck, MapPin } from 'lucide-react';
import { formatPrice, formatDateTime } from '@/lib/utils';
import Image from 'next/image';

export default function OrderDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const success = searchParams.get('success') === 'true';

  useEffect(() => {
    if (session && params.id) {
      fetchOrder();
    }
  }, [session, params.id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
          <Link href="/orders" className="text-purple-600 hover:text-purple-700">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-green-900 mb-1">
                  Order Placed Successfully!
                </h3>
                <p className="text-green-800">
                  Thank you for your order. We'll send you a confirmation email shortly.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Order #{order.orderNumber}
              </h1>
              <p className="text-gray-600">Placed on {formatDateTime(order.createdAt)}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
              order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
              order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {order.status}
            </span>
          </div>

          {/* Order Status Timeline */}
          <div className="mt-6 flex items-center justify-between">
            {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((status, idx) => {
              const isCompleted = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].indexOf(order.status) >= idx;
              return (
                <div key={status} className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isCompleted ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : <div className="w-2 h-2 bg-current rounded-full" />}
                  </div>
                  {idx < 3 && (
                    <div className={`flex-1 h-1 ${isCompleted ? 'bg-purple-600' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product.images[0] && (
                    <Image
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm text-gray-600">
                    Price: {formatPrice(item.price)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatPrice(item.total)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
            </div>
            <div className="text-gray-600">
              <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p className="mt-2">
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
              </p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">
                  {Number(order.shippingCost) === 0 ? 'FREE' : formatPrice(order.shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">{formatPrice(order.tax)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-semibold text-gray-900">{formatPrice(order.total)}</span>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-sm text-gray-600">
                  Payment Status: <span className={`font-medium ${
                    order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'
                  }`}>{order.paymentStatus}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            href="/orders"
            className="flex-1 text-center border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 font-medium"
          >
            Back to Orders
          </Link>
          <Link
            href="/products"
            className="flex-1 text-center bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
