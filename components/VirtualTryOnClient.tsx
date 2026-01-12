'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Sparkles, Loader2, Download, Share2 } from 'lucide-react';

interface VirtualTryOnPageProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    images: Array<{ url: string }>;
    category: {
      name: string;
    };
  };
}

export function VirtualTryOnClient({ product }: VirtualTryOnPageProps) {
  const router = useRouter();
  const [userImage, setUserImage] = useState<File | null>(null);
  const [userImagePreview, setUserImagePreview] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }

      setUserImage(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateTryOn = async () => {
    if (!userImage) {
      setError('Please upload your photo first');
      return;
    }

    if (!product.images?.[0]?.url) {
      setError('This product does not have an image for try-on');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const formData = new FormData();
      formData.append('userImage', userImage);

      // Fetch product image and attach as second input image
      const productImageResponse = await fetch(product.images[0].url);
      if (!productImageResponse.ok) {
        throw new Error('Failed to load product image for try-on');
      }
      const productImageBlob = await productImageResponse.blob();
      const productImageFile = new File(
        [productImageBlob],
        `product-${product.slug || product.id}.png`,
        { type: productImageBlob.type || 'image/png' }
      );
      formData.append('productImage', productImageFile);

      const response = await fetch('/api/virtual-tryon', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate try-on image');
      }

      if (data.success && data.image) {
        setGeneratedImage(data.image);
      } else {
        throw new Error('No image was generated');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `virtual-tryon-${product.slug}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!generatedImage) return;

    try {
      // Convert base64 to blob
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const file = new File([blob], `virtual-tryon-${product.slug}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Virtual Try-On: ${product.name}`,
          text: `Check out how I look in ${product.name}!`,
          files: [file],
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob,
          }),
        ]);
        alert('Image copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
      setError('Failed to share image');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Product
          </button>
          <div className="flex items-start gap-6">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
              {product.images[0] && (
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Virtual Try-On</h1>
              <p className="text-xl text-muted-foreground">{product.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                See how this {product.category.name.toLowerCase()} looks on you
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Upload */}
          <div className="space-y-6">
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Your Photo
              </h2>
              
              <div className="space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                >
                  {userImagePreview ? (
                    <div className="relative w-full aspect-[3/4] max-w-md mx-auto">
                      <Image
                        src={userImagePreview}
                        alt="Your photo"
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="py-12">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium mb-2">Click to upload your photo</p>
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {userImagePreview && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 px-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    Change Photo
                  </button>
                )}
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-2">Tips for best results:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use a clear, well-lit photo</li>
                  <li>• Face the camera directly</li>
                  <li>• Avoid busy backgrounds</li>
                  <li>• Full body or upper body shots work best</li>
                </ul>
              </div>
            </div>

            <button
              onClick={handleGenerateTryOn}
              disabled={!userImage || isGenerating}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Your Try-On...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Virtual Try-On
                </>
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
          </div>

          {/* Right Panel - Result */}
          <div className="space-y-6">
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Your Virtual Try-On
              </h2>

              <div className="border-2 border-dashed rounded-lg p-8 min-h-[500px] flex items-center justify-center">
                {isGenerating ? (
                  <div className="text-center">
                    <Loader2 className="w-16 h-16 mx-auto mb-4 text-primary animate-spin" />
                    <p className="text-lg font-medium">Generating your virtual try-on...</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      This may take 10-30 seconds
                    </p>
                  </div>
                ) : generatedImage ? (
                  <div className="w-full">
                    <div className="relative w-full aspect-[3/4] max-w-md mx-auto">
                      <Image
                        src={generatedImage}
                        alt="Virtual try-on result"
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Your virtual try-on will appear here</p>
                    <p className="text-sm mt-2">Upload your photo and click generate</p>
                  </div>
                )}
              </div>

              {generatedImage && !isGenerating && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex-1 py-3 px-4 border rounded-lg font-medium hover:bg-muted/50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              )}
            </div>

            {generatedImage && (
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Note:</strong> This is an AI-generated visualization. Actual fit and appearance may vary. 
                  For accurate sizing, please refer to our size guide.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
