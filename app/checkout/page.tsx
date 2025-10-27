'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { Check, CreditCard, MapPin, Package } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Fetch addresses on mount
  useState(() => {
    if (session?.user) {
      fetch('/api/addresses')
        .then((res) => res.json())
        .then((data) => {
          setAddresses(data);
          const defaultAddr = data.find((a: any) => a.isDefault);
          if (defaultAddr) {
            setSelectedShippingAddress(defaultAddr.id);
          }
        });
    }
  });

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to checkout</h2>
          <Link
            href="/auth/signin"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <Link
            href="/products"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = total;
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.1;
  const orderTotal = subtotal + shipping + tax;

  const handlePlaceOrder = async () => {
    if (!selectedShippingAddress) {
      alert('Please select a shipping address');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddressId: selectedShippingAddress,
          billingAddressId: selectedShippingAddress,
          paymentMethod,
          notes: '',
        }),
      });

      if (res.ok) {
        const order = await res.json();
        await clearCart();
        router.push(`/orders/${order.id}?success=true`);
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[
              { num: 1, label: 'Shipping', icon: MapPin },
              { num: 2, label: 'Payment', icon: CreditCard },
              { num: 3, label: 'Review', icon: Package },
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      step >= s.num
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step > s.num ? <Check className="h-6 w-6" /> : <s.icon className="h-6 w-6" />}
                  </div>
                  <span className="text-sm mt-2">{s.label}</span>
                </div>
                {idx < 2 && (
                  <div
                    className={`w-24 h-1 mx-4 ${
                      step > s.num ? 'bg-purple-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Address */}
            {step === 1 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
                
                {addresses.length > 0 ? (
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`block p-4 border-2 rounded-lg cursor-pointer ${
                          selectedShippingAddress === addr.id
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          value={addr.id}
                          checked={selectedShippingAddress === addr.id}
                          onChange={(e) => setSelectedShippingAddress(e.target.value)}
                          className="mr-3"
                        />
                        <span className="font-medium">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                        <p className="text-sm text-gray-600 ml-6 mt-1">
                          {addr.addressLine1}, {addr.city}, {addr.state} {addr.postalCode}
                        </p>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No saved addresses found</p>
                    <Link
                      href="/profile/addresses"
                      className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Add an address
                    </Link>
                  </div>
                )}

                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedShippingAddress}
                  className="mt-6 w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
                
                <div className="space-y-3">
                  <label className="block p-4 border-2 rounded-lg cursor-pointer border-purple-600 bg-purple-50">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span className="font-medium">Credit/Debit Card</span>
                    <p className="text-sm text-gray-600 ml-6 mt-1">
                      Pay securely with your card (Demo mode)
                    </p>
                  </label>

                  <label className="block p-4 border-2 rounded-lg cursor-pointer border-gray-200">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span className="font-medium">Cash on Delivery</span>
                    <p className="text-sm text-gray-600 ml-6 mt-1">
                      Pay when you receive your order
                    </p>
                  </label>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Review Order</h2>
                
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 py-3 border-b">
                      <div className="text-sm">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="font-medium">
                          {formatPrice(Number(item.product.price) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">{formatPrice(tax)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(orderTotal)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p className="flex items-center gap-2 mb-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Secure checkout
                </p>
                <p className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Free returns within 30 days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
