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
  ]);

  console.log('✅ Created categories:', categories.length);

  // Create sample products
  const products = await Promise.all([
    prisma.product.create({
      data: {
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
    prisma.product.create({
      data: {
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
    prisma.product.create({
      data: {
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
