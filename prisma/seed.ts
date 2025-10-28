import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123456', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fashionstore.com' },
    update: {},
    create: {
      email: 'admin@fashionstore.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'mens-clothing' },
      update: {},
      create: {
        name: "Men's Clothing",
        slug: 'mens-clothing',
        description: 'Fashion for men',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'womens-clothing' },
      update: {},
      create: {
        name: "Women's Clothing",
        slug: 'womens-clothing',
        description: 'Fashion for women',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'accessories' },
      update: {},
      create: {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Bags, watches, and more',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'shoes' },
      update: {},
      create: {
        name: 'Shoes',
        slug: 'shoes',
        description: 'Footwear for all occasions',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'jewelry' },
      update: {},
      create: {
        name: 'Jewelry',
        slug: 'jewelry',
        description: 'Elegant jewelry pieces',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'hats-caps' },
      update: {},
      create: {
        name: 'Hats & Caps',
        slug: 'hats-caps',
        description: 'Headwear and accessories',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'sportswear' },
      update: {},
      create: {
        name: 'Sportswear',
        slug: 'sportswear',
        description: 'Athletic and performance wear',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'beauty-personal-care' },
      update: {},
      create: {
        name: 'Beauty & Personal Care',
        slug: 'beauty-personal-care',
        description: 'Skincare, makeup, and grooming products',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'kids-clothing' },
      update: {},
      create: {
        name: "Kids' Clothing",
        slug: 'kids-clothing',
        description: 'Fashion for children',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'activewear' },
      update: {},
      create: {
        name: 'Activewear',
        slug: 'activewear',
        description: 'Comfortable clothing for fitness and movement',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'swimwear' },
      update: {},
      create: {
        name: 'Swimwear',
        slug: 'swimwear',
        description: 'Swimsuits and beachwear',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'formal-wear' },
      update: {},
      create: {
        name: 'Formal Wear',
        slug: 'formal-wear',
        description: 'Suits, dresses, and formal attire',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'winter-clothing' },
      update: {},
      create: {
        name: 'Winter Clothing',
        slug: 'winter-clothing',
        description: 'Coats, jackets, and cold weather gear',
      },
    }),
  ]);

  console.log('✅ Created categories:', categories.length);

  // Create sample products
  const products = await Promise.all([
    // Men's Clothing
    prisma.product.upsert({
      where: { slug: 'classic-white-tshirt' },
      update: {},
      create: {
        name: 'Classic White T-Shirt',
        slug: 'classic-white-tshirt',
        description: 'A timeless white t-shirt made from premium cotton',
        price: 29.99,
        comparePrice: 39.99,
        sku: 'TS-WHT-001',
        stock: 100,
        categoryId: categories[0].id,
        status: 'ACTIVE',
        featured: true,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
              alt: 'White T-Shirt',
              position: 0,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'slim-fit-jeans' },
      update: {},
      create: {
        name: 'Slim Fit Jeans',
        slug: 'slim-fit-jeans',
        description: 'Comfortable slim fit jeans perfect for everyday wear',
        price: 79.99,
        comparePrice: 99.99,
        sku: 'JN-SLM-001',
        stock: 75,
        categoryId: categories[0].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1542272604-787c3835535d',
              alt: 'Slim Fit Jeans',
              position: 0,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'casual-polo-shirt' },
      update: {},
      create: {
        name: 'Casual Polo Shirt',
        slug: 'casual-polo-shirt',
        description: 'Breathable cotton polo shirt for casual occasions',
        price: 45.99,
        sku: 'PL-CLS-001',
        stock: 60,
        categoryId: categories[0].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d',
              alt: 'Polo Shirt',
              position: 0,
            },
          ],
        },
      },
    }),
    // Women's Clothing
    prisma.product.upsert({
      where: { slug: 'elegant-black-dress' },
      update: {},
      create: {
        name: 'Elegant Black Dress',
        slug: 'elegant-black-dress',
        description: 'Perfect for any occasion, this black dress is a wardrobe essential',
        price: 89.99,
        comparePrice: 120.00,
        sku: 'DR-BLK-001',
        stock: 50,
        categoryId: categories[1].id,
        status: 'ACTIVE',
        featured: true,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
              alt: 'Black Dress',
              position: 0,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'floral-summer-dress' },
      update: {},
      create: {
        name: 'Floral Summer Dress',
        slug: 'floral-summer-dress',
        description: 'Light and airy floral dress perfect for summer days',
        price: 65.99,
        comparePrice: 85.99,
        sku: 'DR-FLR-001',
        stock: 40,
        categoryId: categories[1].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1',
              alt: 'Floral Dress',
              position: 0,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'high-waisted-leggings' },
      update: {},
      create: {
        name: 'High-Waisted Leggings',
        slug: 'high-waisted-leggings',
        description: 'Comfortable and stylish leggings for active lifestyle',
        price: 39.99,
        sku: 'LG-HW-001',
        stock: 80,
        categoryId: categories[1].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1506629905607-0b5b8b5e4b8b',
              alt: 'Leggings',
              position: 0,
            },
          ],
        },
      },
    }),
    // Accessories
    prisma.product.upsert({
      where: { slug: 'leather-messenger-bag' },
      update: {},
      create: {
        name: 'Leather Messenger Bag',
        slug: 'leather-messenger-bag',
        description: 'Handcrafted leather messenger bag for the modern professional',
        price: 149.99,
        sku: 'BAG-LTR-001',
        stock: 25,
        categoryId: categories[2].id,
        status: 'ACTIVE',
        featured: true,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
              alt: 'Leather Bag',
              position: 0,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'minimalist-watch' },
      update: {},
      create: {
        name: 'Minimalist Watch',
        slug: 'minimalist-watch',
        description: 'Elegant minimalist watch with stainless steel band',
        price: 199.99,
        comparePrice: 249.99,
        sku: 'WCH-MIN-001',
        stock: 30,
        categoryId: categories[2].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314',
              alt: 'Minimalist Watch',
              position: 0,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'silk-scarf' },
      update: {},
      create: {
        name: 'Silk Scarf',
        slug: 'silk-scarf',
        description: 'Luxurious silk scarf with elegant patterns',
        price: 79.99,
        sku: 'SCF-SLK-001',
        stock: 45,
        categoryId: categories[2].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1601762603339-fd61e28b698a',
              alt: 'Silk Scarf',
              position: 0,
            },
          ],
        },
      },
    }),
    // Shoes
    prisma.product.upsert({
      where: { slug: 'classic-white-sneakers' },
      update: {},
      create: {
        name: 'Classic White Sneakers',
        slug: 'classic-white-sneakers',
        description: 'Timeless white sneakers that go with everything',
        price: 89.99,
        comparePrice: 119.99,
        sku: 'SN-WHT-001',
        stock: 70,
        categoryId: categories[3].id,
        status: 'ACTIVE',
        featured: true,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772',
              alt: 'White Sneakers',
              position: 0,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'black-leather-boots' },
      update: {},
      create: {
        name: 'Black Leather Boots',
        slug: 'black-leather-boots',
        description: 'Stylish leather boots for any season',
        price: 159.99,
        sku: 'BT-LTR-001',
        stock: 35,
        categoryId: categories[3].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f',
              alt: 'Leather Boots',
              position: 0,
            },
          ],
        },
      },
    }),
    // Jewelry
    prisma.product.upsert({
      where: { slug: 'gold-hoop-earrings' },
      update: {},
      create: {
        name: 'Gold Hoop Earrings',
        slug: 'gold-hoop-earrings',
        description: 'Elegant gold hoop earrings that add sophistication',
        price: 129.99,
        comparePrice: 159.99,
        sku: 'ER-GH-001',
        stock: 55,
        categoryId: categories[4].id,
        status: 'ACTIVE',
        featured: true,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908',
              alt: 'Gold Hoop Earrings',
              position: 0,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'silver-necklace' },
      update: {},
      create: {
        name: 'Silver Necklace',
        slug: 'silver-necklace',
        description: 'Delicate silver necklace with pendant',
        price: 89.99,
        sku: 'NK-SLV-001',
        stock: 40,
        categoryId: categories[4].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446',
              alt: 'Silver Necklace',
              position: 0,
            },
          ],
        },
      },
    }),
    // Hats & Caps
    prisma.product.upsert({
      where: { slug: 'baseball-cap' },
      update: {},
      create: {
        name: 'Baseball Cap',
        slug: 'baseball-cap',
        description: 'Classic baseball cap with adjustable strap',
        price: 24.99,
        sku: 'CP-BSB-001',
        stock: 90,
        categoryId: categories[5].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b',
              alt: 'Baseball Cap',
              position: 0,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'wide-brim-hat' },
      update: {},
      create: {
        name: 'Wide Brim Hat',
        slug: 'wide-brim-hat',
        description: 'Elegant wide brim hat perfect for sun protection',
        price: 49.99,
        comparePrice: 69.99,
        sku: 'HT-WBR-001',
        stock: 25,
        categoryId: categories[5].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
              alt: 'Wide Brim Hat',
              position: 0,
            },
          ],
        },
      },
    }),
    // Sportswear
    prisma.product.upsert({
      where: { slug: 'running-shorts' },
      update: {},
      create: {
        name: 'Performance Running Shorts',
        slug: 'running-shorts',
        description: 'Lightweight, moisture-wicking running shorts for optimal performance',
        price: 34.99,
        sku: 'RS-PRF-001',
        stock: 65,
        categoryId: categories[6].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1506629905607-0b5b8b5e4b8b',
              alt: 'Running Shorts',
              position: 0,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'sports-bra' },
      update: {},
      create: {
        name: 'High-Impact Sports Bra',
        slug: 'sports-bra',
        description: 'Supportive sports bra perfect for high-intensity workouts',
        price: 42.99,
        comparePrice: 55.99,
        sku: 'SB-HI-001',
        stock: 45,
        categoryId: categories[6].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
              alt: 'Sports Bra',
              position: 0,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'basketball-jersey' },
      update: {},
      create: {
        name: 'Basketball Jersey',
        slug: 'basketball-jersey',
        description: 'Professional basketball jersey with breathable fabric',
        price: 59.99,
        sku: 'BJ-PRO-001',
        stock: 30,
        categoryId: categories[6].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4',
              alt: 'Basketball Jersey',
              position: 0,
            },
          ],
        },
      },
    }),
    // Beauty & Personal Care
    prisma.product.upsert({
      where: { slug: 'facial-moisturizer' },
      update: {},
      create: {
        name: 'Hydrating Facial Moisturizer',
        slug: 'facial-moisturizer',
        description: 'Daily moisturizer that nourishes and hydrates the skin',
        price: 28.99,
        comparePrice: 39.99,
        sku: 'FM-HYD-001',
        stock: 80,
        categoryId: categories[7].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03',
              alt: 'Facial Moisturizer',
              position: 0,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'lipstick-set' },
      update: {},
      create: {
        name: 'Matte Lipstick Set',
        slug: 'lipstick-set',
        description: 'Set of 5 long-lasting matte lipsticks in various shades',
        price: 49.99,
        sku: 'LS-MAT-001',
        stock: 40,
        categoryId: categories[7].id,
        status: 'ACTIVE',
        featured: true,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa',
              alt: 'Lipstick Set',
              position: 0,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'hair-serum' },
      update: {},
      create: {
        name: 'Argan Oil Hair Serum',
        slug: 'hair-serum',
        description: 'Nourishing hair serum that tames frizz and adds shine',
        price: 24.99,
        sku: 'HS-ARG-001',
        stock: 55,
        categoryId: categories[7].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9',
              alt: 'Hair Serum',
              position: 0,
            },
          ],
        },
      },
    }),
    // Kids' Clothing
    prisma.product.upsert({
      where: { slug: 'kids-t-shirt' },
      update: {},
      create: {
        name: 'Kids Graphic T-Shirt',
        slug: 'kids-t-shirt',
        description: 'Fun graphic t-shirt for kids with soft, comfortable fabric',
        price: 16.99,
        comparePrice: 22.99,
        sku: 'KT-GRF-001',
        stock: 75,
        categoryId: categories[8].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1503944168849-c1246463cd50',
              alt: 'Kids T-Shirt',
              position: 0,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'kids-jeans' },
      update: {},
      create: {
        name: 'Kids Denim Jeans',
        slug: 'kids-jeans',
        description: 'Durable denim jeans perfect for active kids',
        price: 29.99,
        sku: 'KJ-DEN-001',
        stock: 50,
        categoryId: categories[8].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1544568100-847a948585b9',
              alt: 'Kids Jeans',
              position: 0,
            },
          ],
        },
      },
    }),
    // Activewear
    prisma.product.upsert({
      where: { slug: 'yoga-pants' },
      update: {},
      create: {
        name: 'High-Waisted Yoga Pants',
        slug: 'yoga-pants',
        description: 'Comfortable yoga pants with excellent stretch and support',
        price: 49.99,
        comparePrice: 64.99,
        sku: 'YP-HW-001',
        stock: 60,
        categoryId: categories[9].id,
        status: 'ACTIVE',
        featured: true,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1506629905607-0b5b8b5e4b8b',
              alt: 'Yoga Pants',
              position: 0,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'compression-shirt' },
      update: {},
      create: {
        name: 'Moisture-Wicking Compression Shirt',
        slug: 'compression-shirt',
        description: 'Technical compression shirt for intense workouts',
        price: 39.99,
        sku: 'CS-MWK-001',
        stock: 45,
        categoryId: categories[9].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
              alt: 'Compression Shirt',
              position: 0,
            },
          ],
        },
      },
    }),
    // Swimwear
    prisma.product.upsert({
      where: { slug: 'bikini-set' },
      update: {},
      create: {
        name: 'Floral Bikini Set',
        slug: 'bikini-set',
        description: 'Beautiful floral bikini perfect for beach days',
        price: 69.99,
        comparePrice: 89.99,
        sku: 'BS-FLR-001',
        stock: 35,
        categoryId: categories[10].id,
        status: 'ACTIVE',
        featured: true,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c',
              alt: 'Bikini Set',
              position: 0,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'swim-trunks' },
      update: {},
      create: {
        name: 'Quick-Dry Swim Trunks',
        slug: 'swim-trunks',
        description: 'Comfortable swim trunks with quick-dry technology',
        price: 34.99,
        sku: 'ST-QD-001',
        stock: 55,
        categoryId: categories[10].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1471115853179-bb1d604434e0',
              alt: 'Swim Trunks',
              position: 0,
            },
          ],
        },
      },
    }),
    // Formal Wear
    prisma.product.upsert({
      where: { slug: 'mens-suit' },
      update: {},
      create: {
        name: 'Classic Navy Suit',
        slug: 'mens-suit',
        description: 'Tailored navy suit perfect for business and formal occasions',
        price: 299.99,
        comparePrice: 399.99,
        sku: 'MS-NAV-001',
        stock: 20,
        categoryId: categories[11].id,
        status: 'ACTIVE',
        featured: true,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
              alt: 'Mens Suit',
              position: 0,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'cocktail-dress' },
      update: {},
      create: {
        name: 'Elegant Cocktail Dress',
        slug: 'cocktail-dress',
        description: 'Sophisticated cocktail dress for special occasions',
        price: 149.99,
        sku: 'CD-ELG-001',
        stock: 25,
        categoryId: categories[11].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
              alt: 'Cocktail Dress',
              position: 0,
            },
          ],
        },
      },
    }),
    // Winter Clothing
    prisma.product.upsert({
      where: { slug: 'wool-coat' },
      update: {},
      create: {
        name: 'Wool Blend Coat',
        slug: 'wool-coat',
        description: 'Warm wool blend coat perfect for cold weather',
        price: 189.99,
        comparePrice: 249.99,
        sku: 'WC-WBL-001',
        stock: 30,
        categoryId: categories[12].id,
        status: 'ACTIVE',
        featured: true,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f',
              alt: 'Wool Coat',
              position: 0,
            },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'fleece-jacket' },
      update: {},
      create: {
        name: 'Fleece Jacket',
        slug: 'fleece-jacket',
        description: 'Lightweight fleece jacket for everyday cold weather protection',
        price: 79.99,
        sku: 'FJ-LW-001',
        stock: 50,
        categoryId: categories[12].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5',
              alt: 'Fleece Jacket',
              position: 0,
            },
          ],
        },
      },
    }),
  ]);

  console.log('✅ Created sample products:', products.length);

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
