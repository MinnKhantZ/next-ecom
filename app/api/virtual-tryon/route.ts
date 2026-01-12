import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export const runtime = 'nodejs';

const OPENAI_IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1.5';

export async function POST(request: NextRequest) {
  try {
    const WINDOW_SECONDS = 60 * 60; // 1 hour
    const MAX_GENERATIONS = 2; // allowed images per window (global)
    const REDIS_KEY = 'virtual-tryon:count';

    // Claim a slot (atomic with Redis). If Redis unavailable, use in-memory global fallback.
    let claimed = false;
    if (redis) {
      const count = await redis.incr(REDIS_KEY);
      if (count === 1) {
        await redis.expire(REDIS_KEY, WINDOW_SECONDS);
      }
      if (count > MAX_GENERATIONS) {
        // Over the limit — decrement our increment immediately and return 429
        await redis.decr(REDIS_KEY);
        const ttl = await redis.ttl(REDIS_KEY);
        return NextResponse.json({ error: 'Rate limit exceeded. Try again later.', retry_after: ttl }, { status: 429 });
      }
      claimed = true;
    } else {
      const g = globalThis as any;
      if (!g.__virtualTryon) g.__virtualTryon = { start: Date.now(), count: 0 };
      const now = Date.now();
      if (now - g.__virtualTryon.start > WINDOW_SECONDS * 1000) {
        g.__virtualTryon = { start: now, count: 0 };
      }
      g.__virtualTryon.count += 1;
      if (g.__virtualTryon.count > MAX_GENERATIONS) {
        g.__virtualTryon.count -= 1;
        const retry_after = Math.ceil((g.__virtualTryon.start + WINDOW_SECONDS * 1000 - now) / 1000);
        return NextResponse.json({ error: 'Rate limit exceeded. Try again later.', retry_after }, { status: 429 });
      }
      claimed = true;
    }

    const formData = await request.formData();
    const userImage = formData.get('userImage') as File;
    const productImage = formData.get('productImage') as File;

    if (!userImage) {
      return NextResponse.json(
        { error: 'User image is required' },
        { status: 400 }
      );
    }

    if (!productImage) {
      return NextResponse.json(
        { error: 'Product image is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    const prompt =
      'You are a professional fashion photo editor.\n' +
      'Use IMAGE 1 as the base photo of the person, preserving identity, face, body proportions, pose, and background.\n' +
      'Use IMAGE 2 as the reference for the clothing/product to apply onto the person.\n\n' +
      'Task: Create a photorealistic result where the person in IMAGE 1 is wearing/using the item from IMAGE 2.\n\n' +
      'Requirements:\n' +
      '- Keep the same person and same scene from IMAGE 1 (no background changes).\n' +
      '- Apply the product from IMAGE 2 with realistic fit, scale, folds, texture, and material.\n' +
      '- Match lighting, shadows, and perspective from IMAGE 1.\n' +
      '- Do not add extra accessories, text, logos, or watermarks.\n' +
      '- Output should look like a natural photo.';

    const apiBody = new FormData();
    apiBody.append('model', OPENAI_IMAGE_MODEL);
    apiBody.append('prompt', prompt);
    apiBody.append('size', '1024x1024');
    apiBody.append('quality', 'low');
    apiBody.append('output_format', 'png');
    apiBody.append('n', '1');
    // Multiple reference images are supported by GPT Image models via image[]
    apiBody.append('image[]', userImage, userImage.name || 'user-image');
    apiBody.append('image[]', productImage, productImage.name || 'product-image');

    const openaiResponse = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: apiBody,
    });

    const result = await openaiResponse.json().catch(() => null);

    if (!openaiResponse.ok) {
      const message = result?.error?.message || 'OpenAI image request failed';
      return NextResponse.json({ error: message }, { status: openaiResponse.status });
    }

    const generatedImageBase64: string | null = result?.data?.[0]?.b64_json ?? null;
    const outputFormat: string = result?.output_format || 'png';
    const generatedMimeType = outputFormat === 'jpg' ? 'image/jpeg' : `image/${outputFormat}`;

    if (!generatedImageBase64) {
      // Release claimed slot since generation failed
      if (claimed) {
        if (redis) {
          try { await redis.decr(REDIS_KEY); } catch (e) { /* ignore */ }
        } else {
          const g = globalThis as any;
          if (g.__virtualTryon && g.__virtualTryon.count > 0) g.__virtualTryon.count -= 1;
        }
      }
      return NextResponse.json(
        { error: 'Failed to generate try-on image. The model did not return an image.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      image: `data:${generatedMimeType};base64,${generatedImageBase64}`,
      model: OPENAI_IMAGE_MODEL,
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
