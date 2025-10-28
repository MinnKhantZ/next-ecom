'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import { formatPrice, formatDateTime } from '@/lib/utils';

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchOrders();
    }
  }, [session]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'PROCESSING':
        return <Package className="h-5 w-5 text-blue-600" />;
      case 'SHIPPED':
        return <Truck className="h-5 w-5 text-purple-600" />;
      case 'DELIVERED':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!session) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-600 mb-2">My Orders</h1>
          <p className="text-gray-600 dark:text-gray-400">Track and manage your orders</p>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-foreground">
                          Order #{order.orderNumber}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Placed on {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                      <p className="text-xl font-bold text-foreground">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="space-y-3">
                    {order.items.slice(0, 3).map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{item.product.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Qty: {item.quantity} × {formatPrice(item.price)}
                          </p>
                        </div>
                        <p className="font-medium text-foreground">
                          {formatPrice(item.total)}
                        </p>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        +{order.items.length - 3} more item(s)
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex flex-col md:flex-row gap-3 md:justify-between md:items-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {order.trackingNumber && (
                        <p>Tracking: <span className="font-medium text-foreground">{order.trackingNumber}</span></p>
                      )}
                      <p className="mt-1">
                        Payment: <span className={`font-medium ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {order.paymentStatus}
                        </span>
                      </p>
                    </div>
                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-block text-center bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No orders yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Start shopping to see your orders here</p>
            <Link
              href="/products"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-semibold"
            >
              Start Shopping
            </Link>
          </div>
        )}

        <div className="mt-6">
          <Link
            href="/profile"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            ← Back to Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
