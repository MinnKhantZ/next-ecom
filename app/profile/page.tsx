'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { User, MapPin, ShoppingBag, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import ProfileViewClient from '@/components/ProfileViewClient';
import ProfileEditClient from '@/components/ProfileEditClient';

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-purple-600 mb-8">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                      priority
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.style.display = 'none';
                      }}
                    />
                  ) : (
                    <User className="h-10 w-10 text-purple-600" />
                  )}
                </div>
                <h2 className="font-semibold text-foreground">{session.user.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{session.user.email}</p>
              </div>

              <nav className="space-y-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-3 text-purple-600 bg-purple-50 rounded-lg font-medium"
                >
                  <User className="h-5 w-5" />
                  Profile
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                >
                  <ShoppingBag className="h-5 w-5" />
                  My Orders
                </Link>
                <Link
                  href="/profile/addresses"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                >
                  <MapPin className="h-5 w-5" />
                  Addresses
                </Link>
                <Link
                  href="/profile/settings"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
                {(session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN') && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            {isEditing ? (
              <ProfileEditClient
                initialData={{
                  name: session.user.name || '',
                  email: session.user.email || '',
                  image: session.user.image || undefined,
                }}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <ProfileViewClient onEditClick={() => setIsEditing(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
