'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Check, AlertCircle, X } from 'lucide-react';

interface ProfileFormData {
  name: string;
  email: string;
  image?: string | null;
}

interface ProfileEditClientProps {
  initialData?: {
    name: string;
    email: string;
    image?: string;
  };
  onCancel: () => void;
}

export default function ProfileEditClient({ initialData, onCancel }: ProfileEditClientProps) {
  const { data: session, update: updateSession } = useSession();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: initialData?.name || session?.user?.name || '',
    email: initialData?.email || session?.user?.email || '',
    image: (initialData?.image as string) || (session?.user?.image as string) || undefined,
  });
  
  const [previewImage, setPreviewImage] = useState<string | null>(
    (initialData?.image as string) || (session?.user?.image as string) || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setIsDirty(true);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      image: url || undefined,
    }));
    
    // Update preview if URL is valid
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      setPreviewImage(url);
    } else if (!url) {
      setPreviewImage(null);
    }
    
    setIsDirty(true);
    setErrorMessage('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setErrorMessage('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      // Validate name
      if (!formData.name.trim()) {
        setErrorMessage('Please enter your full name');
        setIsLoading(false);
        return;
      }

      // Validate image URL if provided
      if (formData.image && !formData.image.trim().startsWith('http')) {
        setErrorMessage('Please enter a valid image URL (must start with http:// or https://)');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          image: formData.image ? formData.image.trim() : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Failed to update profile');
        setIsLoading(false);
        return;
      }

      // Update session
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          name: data.name,
          email: data.email,
          image: data.image,
        },
      });

      setSuccessMessage('Profile updated successfully!');
      setIsDirty(false);
      
      // Close edit mode after success
      setTimeout(() => {
        setSuccessMessage('');
        onCancel();
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('An error occurred while updating your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Profile Picture</h3>
        
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Image Preview */}
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 mb-4">
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Profile preview"
                  fill
                  className="rounded-full object-cover"
                  priority
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                  }}
                />
              ) : (
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

          {/* Image URL Info */}
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              <strong>Image formats:</strong> JPG, PNG, WebP, GIF
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Recommended:</strong> Use a valid image URL (http:// or https://)
            </p>
          </div>
        </div>
      </div>

      {/* Profile Information Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-800 dark:text-green-200">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-sm text-red-800 dark:text-red-200">{errorMessage}</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Profile Image URL */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Profile Image URL
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image || ''}
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Leave empty to remove profile image</p>
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              placeholder="Enter your email address"
              required
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            disabled={!isDirty || isLoading}
            className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setFormData({
                name: initialData?.name || session?.user?.name || '',
                email: initialData?.email || session?.user?.email || '',
                image: (initialData?.image as string) || (session?.user?.image as string) || undefined,
              });
              setPreviewImage((initialData?.image as string) || (session?.user?.image as string) || null);
              setIsDirty(false);
              setSuccessMessage('');
              setErrorMessage('');
            }}
            disabled={!isDirty}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Close
          </button>
        </div>
      </form>
    </div>
  );
}
