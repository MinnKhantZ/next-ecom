'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Edit2 } from 'lucide-react';

interface ProfileViewClientProps {
  onEditClick: () => void;
}

export default function ProfileViewClient({ onEditClick }: ProfileViewClientProps) {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      {/* Profile Picture Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Profile Picture</h3>
          <button
            onClick={onEditClick}
            className="flex items-center gap-2 px-3 py-1 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900 rounded-lg transition"
            aria-label="Edit profile"
            title="Edit profile"
          >
            <Edit2 className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Image Display */}
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 mb-4">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="Profile picture"
                  fill
                  className="rounded-full object-cover"
                  priority
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                  }}
                />
              ) : null}
              {!session?.user?.image && (
                <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Image Info */}
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              <strong>Current image:</strong>
            </p>
            {session?.user?.image ? (
              <p className="text-sm text-gray-700 dark:text-gray-300 break-all font-mono bg-gray-50 dark:bg-gray-700 p-2 rounded">
                {session.user.image}
              </p>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">No profile image set</p>
            )}
          </div>
        </div>
      </div>

      {/* Profile Information Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>

        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <div className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg bg-gray-50">
              {session?.user?.name || 'Not set'}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg bg-gray-50">
              {session?.user?.email || 'Not set'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
