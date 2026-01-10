import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

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
    // Classic tan male trench coat
    prisma.product.upsert({
      where: { slug: 'classic-tan-trench-coat' },
      update: {},
      create: {
        name: 'Classic Tan Trench Coat',
        slug: 'classic-tan-trench-coat',
        description: 'Timeless tan trench coat perfect for transitional weather',
        price: 199.99,
        comparePrice: 249.99,
        sku: 'TC-TAN-001',
        stock: 30,
        categoryId: categories[12].id,
        status: 'ACTIVE',
        featured: true,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop',
              alt: 'Classic tan male trench coat displayed on a hanger',
              position: 0,
            },
          ],
        },
      },
    }),
    // Folded blue cotton t-shirts
    prisma.product.upsert({
      where: { slug: 'folded-blue-cotton-t-shirts' },
      update: {},
      create: {
        name: 'Folded Blue Cotton T-Shirts',
        slug: 'folded-blue-cotton-t-shirts',
        description: 'Pack of comfortable blue cotton t-shirts, neatly folded',
        price: 39.99,
        sku: 'TS-BLU-001',
        stock: 100,
        categoryId: categories[0].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000&auto=format&fit=crop',
              alt: 'Folded blue cotton t-shirts in a minimalist stack',
              position: 0,
            },
          ],
        },
      },
    }),
    // Close-up of blue denim jeans
    prisma.product.upsert({
      where: { slug: 'blue-denim-jeans-texture' },
      update: {},
      create: {
        name: 'Blue Denim Jeans',
        slug: 'blue-denim-jeans-texture',
        description: 'Classic blue denim jeans with detailed texture and pockets',
        price: 79.99,
        comparePrice: 99.99,
        sku: 'JN-BLU-001',
        stock: 75,
        categoryId: categories[0].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1000&auto=format&fit=crop',
              alt: 'Close-up of blue denim jeans texture and pockets',
              position: 0,
            },
          ],
        },
      },
    }),
    // Luxury white and gold fashion sneakers
    prisma.product.upsert({
      where: { slug: 'luxury-white-gold-sneakers' },
      update: {},
      create: {
        name: 'Luxury White and Gold Fashion Sneakers',
        slug: 'luxury-white-gold-sneakers',
        description: 'Premium white and gold fashion sneakers for style and comfort',
        price: 149.99,
        comparePrice: 189.99,
        sku: 'SN-WHG-001',
        stock: 50,
        categoryId: categories[3].id,
        status: 'ACTIVE',
        featured: true,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1000&auto=format&fit=crop',
              alt: 'Luxury white and gold fashion sneakers',
              position: 0,
            },
          ],
        },
      },
    }),
    // Black leather biker jacket
    prisma.product.upsert({
      where: { slug: 'black-leather-biker-jacket' },
      update: {},
      create: {
        name: 'Black Leather Biker Jacket',
        slug: 'black-leather-biker-jacket',
        description: 'Edgy black leather biker jacket with silver zippers',
        price: 179.99,
        sku: 'JK-BLK-001',
        stock: 40,
        categoryId: categories[0].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop',
              alt: 'Black leather biker jacket with silver zippers',
              position: 0,
            },
          ],
        },
      },
    }),
    // White graphic sweatshirt
    prisma.product.upsert({
      where: { slug: 'white-graphic-sweatshirt' },
      update: {},
      create: {
        name: 'White Graphic Sweatshirt',
        slug: 'white-graphic-sweatshirt',
        description: 'White sweatshirt with minimalist mountain design',
        price: 59.99,
        comparePrice: 79.99,
        sku: 'SW-WHT-001',
        stock: 60,
        categoryId: categories[0].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop',
              alt: 'White graphic sweatshirt with a minimalist mountain design',
              position: 0,
            },
          ],
        },
      },
    }),
    // Basic white crewneck t-shirt
    prisma.product.upsert({
      where: { slug: 'basic-white-crewneck-t-shirt' },
      update: {},
      create: {
        name: 'Basic White Crewneck T-Shirt',
        slug: 'basic-white-crewneck-t-shirt',
        description: 'Essential basic white crewneck t-shirt made from organic cotton',
        price: 29.99,
        sku: 'TS-WHT-001',
        stock: 120,
        categoryId: categories[0].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop',
              alt: 'Basic white crewneck t-shirt made from organic cotton',
              position: 0,
            },
          ],
        },
      },
    }),
    // Tan leather luxury handbag
    prisma.product.upsert({
      where: { slug: 'tan-leather-luxury-handbag' },
      update: {},
      create: {
        name: 'Tan Leather Luxury Handbag',
        slug: 'tan-leather-luxury-handbag',
        description: 'Elegant tan leather handbag with gold hardware',
        price: 249.99,
        sku: 'HB-TAN-001',
        stock: 25,
        categoryId: categories[2].id,
        status: 'ACTIVE',
        featured: true,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
              alt: 'Tan leather luxury handbag with gold hardware',
              position: 0,
            },
          ],
        },
      },
    }),
    // Bohemian style summer dress
    prisma.product.upsert({
      where: { slug: 'bohemian-summer-dress' },
      update: {},
      create: {
        name: 'Bohemian Summer Dress',
        slug: 'bohemian-summer-dress',
        description: 'Beautiful bohemian style summer dress with floral patterns',
        price: 69.99,
        comparePrice: 89.99,
        sku: 'DR-BOH-001',
        stock: 45,
        categoryId: categories[1].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop',
              alt: 'Bohemian style summer dress with floral patterns',
              position: 0,
            },
          ],
        },
      },
    }),
    // Selection of men's dress shirts
    prisma.product.upsert({
      where: { slug: 'mens-dress-shirts-collection' },
      update: {},
      create: {
        name: 'Men\'s Dress Shirts Collection',
        slug: 'mens-dress-shirts-collection',
        description: 'Curated selection of premium men\'s dress shirts',
        price: 89.99,
        sku: 'SH-MDS-001',
        stock: 80,
        categoryId: categories[0].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1000&auto=format&fit=crop',
              alt: 'Selection of men\'s dress shirts on a wooden rack',
              position: 0,
            },
          ],
        },
      },
    }),
    // Matching gray tracksuit
    prisma.product.upsert({
      where: { slug: 'gray-tracksuit-set' },
      update: {},
      create: {
        name: 'Gray Tracksuit Set',
        slug: 'gray-tracksuit-set',
        description: 'Comfortable matching gray tracksuit with hoodie and joggers',
        price: 99.99,
        comparePrice: 129.99,
        sku: 'TS-GRY-001',
        stock: 55,
        categoryId: categories[6].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=1000&auto=format&fit=crop',
              alt: 'Matching gray tracksuit with hoodie and joggers',
              position: 0,
            },
          ],
        },
      },
    }),
    // Two basic black t-shirts
    prisma.product.upsert({
      where: { slug: 'basic-black-t-shirts-pack' },
      update: {},
      create: {
        name: 'Basic Black T-Shirts Pack',
        slug: 'basic-black-t-shirts-pack',
        description: 'Pack of two basic black t-shirts, neatly folded',
        price: 39.99,
        sku: 'TS-BLK-001',
        stock: 90,
        categoryId: categories[0].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1000&auto=format&fit=crop',
              alt: 'Two basic black t-shirts neatly folded',
              position: 0,
            },
          ],
        },
      },
    }),
    // Casual white knit sweater
    prisma.product.upsert({
      where: { slug: 'casual-white-knit-sweater' },
      update: {},
      create: {
        name: 'Casual White Knit Sweater',
        slug: 'casual-white-knit-sweater',
        description: 'Comfortable casual white knit sweater',
        price: 79.99,
        sku: 'SW-WKN-001',
        stock: 65,
        categoryId: categories[0].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1000&auto=format&fit=crop',
              alt: 'Casual white knit sweater draped over a chair',
              position: 0,
            },
          ],
        },
      },
    }),
    // Variety of colorful clothes
    prisma.product.upsert({
      where: { slug: 'colorful-clothing-collection' },
      update: {},
      create: {
        name: 'Colorful Clothing Collection',
        slug: 'colorful-clothing-collection',
        description: 'Vibrant collection of colorful clothes for every occasion',
        price: 149.99,
        sku: 'CL-COL-001',
        stock: 30,
        categoryId: categories[2].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=1000&auto=format&fit=crop',
              alt: 'Variety of colorful clothes hanging on a retail rack',
              position: 0,
            },
          ],
        },
      },
    }),
    // High-waisted blue denim shorts
    prisma.product.upsert({
      where: { slug: 'high-waisted-blue-denim-shorts' },
      update: {},
      create: {
        name: 'High-Waisted Blue Denim Shorts',
        slug: 'high-waisted-blue-denim-shorts',
        description: 'Stylish high-waisted blue denim shorts for summer',
        price: 49.99,
        comparePrice: 64.99,
        sku: 'SH-BDS-001',
        stock: 70,
        categoryId: categories[0].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?q=80&w=1000&auto=format&fit=crop',
              alt: 'High-waisted blue denim shorts for summer',
              position: 0,
            },
          ],
        },
      },
    }),
    // Urban style oversized black hoodie
    prisma.product.upsert({
      where: { slug: 'oversized-black-hoodie' },
      update: {},
      create: {
        name: 'Oversized Black Hoodie',
        slug: 'oversized-black-hoodie',
        description: 'Urban style oversized black hoodie for casual wear',
        price: 69.99,
        sku: 'HD-OBK-001',
        stock: 55,
        categoryId: categories[0].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1000&auto=format&fit=crop',
              alt: 'Urban style oversized black hoodie',
              position: 0,
            },
          ],
        },
      },
    }),
    // Stack of colorful woolen sweaters
    prisma.product.upsert({
      where: { slug: 'colorful-woolen-sweaters' },
      update: {},
      create: {
        name: 'Colorful Woolen Sweaters',
        slug: 'colorful-woolen-sweaters',
        description: 'Stack of cozy colorful woolen sweaters',
        price: 89.99,
        sku: 'SW-CWL-001',
        stock: 50,
        categoryId: categories[0].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop',
              alt: 'Stack of colorful woolen sweaters',
              position: 0,
            },
          ],
        },
      },
    }),
    // Black cotton t-shirt
    prisma.product.upsert({
      where: { slug: 'black-cotton-t-shirt' },
      update: {},
      create: {
        name: 'Black Cotton T-Shirt',
        slug: 'black-cotton-t-shirt',
        description: 'Simple black cotton t-shirt on a dark background',
        price: 29.99,
        sku: 'TS-BCT-001',
        stock: 100,
        categoryId: categories[0].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop',
              alt: 'Black cotton t-shirt on a dark background',
              position: 0,
            },
          ],
        },
      },
    }),
    // Collection of men's folded t-shirts
    prisma.product.upsert({
      where: { slug: 'mens-folded-t-shirts-collection' },
      update: {},
      create: {
        name: 'Men\'s Folded T-Shirts Collection',
        slug: 'mens-folded-t-shirts-collection',
        description: 'Collection of men\'s folded t-shirts in earth tones',
        price: 59.99,
        sku: 'TS-MFT-001',
        stock: 75,
        categoryId: categories[0].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=1000&auto=format&fit=crop',
              alt: 'Collection of men\'s folded t-shirts in earth tones',
              position: 0,
            },
          ],
        },
      },
    }),
    // Graphic t-shirt with urban street art
    prisma.product.upsert({
      where: { slug: 'urban-street-art-t-shirt' },
      update: {},
      create: {
        name: 'Urban Street Art T-Shirt',
        slug: 'urban-street-art-t-shirt',
        description: 'Graphic t-shirt featuring urban street art design',
        price: 39.99,
        sku: 'TS-USA-001',
        stock: 80,
        categoryId: categories[0].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop',
              alt: 'Graphic t-shirt with urban street art design',
              position: 0,
            },
          ],
        },
      },
    }),
    // Colorful patterned women's sandals
    prisma.product.upsert({
      where: { slug: 'colorful-patterned-sandals' },
      update: {},
      create: {
        name: 'Colorful Patterned Sandals',
        slug: 'colorful-patterned-sandals',
        description: 'Vibrant colorful patterned women\'s sandals',
        price: 49.99,
        sku: 'SD-CPS-001',
        stock: 60,
        categoryId: categories[3].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop',
              alt: 'Colorful patterned women\'s sandals',
              position: 0,
            },
          ],
        },
      },
    }),
    // Close-up of white designer running shoes
    prisma.product.upsert({
      where: { slug: 'white-designer-running-shoes' },
      update: {},
      create: {
        name: 'White Designer Running Shoes',
        slug: 'white-designer-running-shoes',
        description: 'Premium white designer running shoes for performance',
        price: 159.99,
        sku: 'SH-WDR-001',
        stock: 40,
        categoryId: categories[3].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop',
              alt: 'Close-up of white designer running shoes',
              position: 0,
            },
          ],
        },
      },
    }),
    // White button-up shirt
    prisma.product.upsert({
      where: { slug: 'white-button-up-shirt' },
      update: {},
      create: {
        name: 'White Button-Up Shirt',
        slug: 'white-button-up-shirt',
        description: 'Classic white button-up shirt made from premium linen',
        price: 59.99,
        comparePrice: 79.99,
        sku: 'SH-WBU-001',
        stock: 85,
        categoryId: categories[0].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000&auto=format&fit=crop',
              alt: 'White button-up shirt made from premium linen',
              position: 0,
            },
          ],
        },
      },
    }),
    // Red evening gown
    prisma.product.upsert({
      where: { slug: 'red-evening-gown' },
      update: {},
      create: {
        name: 'Red Evening Gown',
        slug: 'red-evening-gown',
        description: 'Elegant red evening gown for formal occasions',
        price: 199.99,
        sku: 'GN-RED-001',
        stock: 20,
        categoryId: categories[1].id,
        status: 'ACTIVE',
        featured: true,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1000&auto=format&fit=crop',
              alt: 'Red evening gown for formal occasions',
              position: 0,
            },
          ],
        },
      },
    }),
    // White high-top canvas sneakers
    prisma.product.upsert({
      where: { slug: 'white-high-top-canvas-sneakers' },
      update: {},
      create: {
        name: 'White High-Top Canvas Sneakers',
        slug: 'white-high-top-canvas-sneakers',
        description: 'Classic white high-top canvas sneakers',
        price: 79.99,
        comparePrice: 99.99,
        sku: 'SN-WHT-001',
        stock: 65,
        categoryId: categories[3].id,
        status: 'ACTIVE',
        featured: false,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?q=80&w=1000&auto=format&fit=crop',
              alt: 'White high-top canvas sneakers on a wooden floor',
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
