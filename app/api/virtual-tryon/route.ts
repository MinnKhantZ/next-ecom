import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userImage = formData.get('userImage') as File;
    const productName = formData.get('productName') as string;
    const productCategory = formData.get('productCategory') as string;
    const productDescription = formData.get('productDescription') as string;

    if (!userImage) {
      return NextResponse.json(
        { error: 'User image is required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    // Convert image to base64
    const arrayBuffer = await userImage.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');

    // Get the model - using gemini-2.0-flash-exp for image generation
    // Note: Update to 'gemini-2.5-flash-image' when available in your region
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image' });

    // Create the prompt for virtual try-on
    const prompt = `Create a photorealistic image showing the person in the provided photo wearing or using ${productName}. 

Product Details:
- Category: ${productCategory}
- Description: ${productDescription}

Instructions:
- Preserve the person's facial features, body proportions, and pose exactly as they appear in the original photo
- Realistically add the ${productName} to the person in a natural way
- Match the lighting, shadows, and perspective of the original photo
- Ensure the product looks natural and properly fitted/positioned on the person
- Maintain the original background and environment
- The final image should look like a professional product photography shot
- High resolution and photorealistic quality`;

    // Prepare the image part
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: userImage.type,
      },
    };

    // Generate the image with virtual try-on
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    
    // Extract the generated image from the response
    const parts = response.candidates?.[0]?.content?.parts || [];
    
    let generatedImageBase64 = null;
    let generatedText = null;

    for (const part of parts) {
      if ('inlineData' in part && part.inlineData) {
        generatedImageBase64 = part.inlineData.data;
      }
      if ('text' in part && part.text) {
        generatedText = part.text;
      }
    }

    if (!generatedImageBase64) {
      return NextResponse.json(
        { error: 'Failed to generate try-on image. The model did not return an image.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      image: `data:image/png;base64,${generatedImageBase64}`,
      text: generatedText,
    });

  } catch (error) {
    console.error('Virtual try-on error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate virtual try-on image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
