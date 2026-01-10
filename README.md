# Fashion E-commerce Platform 🛍️

A modern, full-stack e-commerce platform built specifically for fashion companies using cutting-edge technologies.

![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![Redis](https://img.shields.io/badge/Redis-Cache-red)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

## ✨ Features

### 🛒 Customer Experience
- **Product Browsing**: Advanced filtering, sorting, and search with grid/list views
- **Product Details**: Image gallery, variants, reviews, and related products
- **Shopping Cart**: Real-time cart management with quantity controls
- **Secure Checkout**: 3-step checkout (shipping, payment, review)
- **User Authentication**: Email/password and OAuth (Google, GitHub)
- **Order Tracking**: Complete order history with status timeline and tracking numbers
- **User Profile**: Account management with order history and saved addresses
- **Address Management**: Save multiple addresses with default selection
- **Product Reviews**: Customer reviews with star ratings
- **Virtual Try-On**: AI-powered try-on using OpenAI image model (upload photo, see products on you)
- **Wishlist**: Save favorite products for later
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop

### 🔧 Admin Features
- **Admin Dashboard**: Overview with key metrics (products, orders, revenue)
- **Product Management**: Full CRUD operations with search and filters
- **Inventory Tracking**: Real-time stock management and status updates
- **Order Management**: Process orders, update status, and add tracking numbers
- **Order Details**: View customer info, shipping address, and payment status
- **Role-Based Access**: Protected admin routes for ADMIN and SUPER_ADMIN roles
- **Quick Actions**: Easy navigation to manage products, orders, and categories

### ⚡ Technical Highlights
- **Server-Side Rendering**: Fast page loads with Next.js 15 App Router
- **Type Safety**: End-to-end TypeScript for reliability
- **Database Caching**: Redis for improved performance
- **Optimized Images**: Next.js Image component for fast loading
- **Protected Routes**: Middleware-based authentication
- **Form Validation**: Zod schemas for data integrity
- **SEO Optimized**: Meta tags and semantic HTML

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (React 19), TypeScript, Tailwind CSS v4
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Caching**: Redis (ioredis)
- **Authentication**: NextAuth.js with Prisma adapter
- **AI Integration**: OpenAI image model for Virtual Try-On feature
- **Validation**: Zod
- **Icons**: Lucide React
- **Build Tool**: Turbopack

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18 or higher
- **npm** or **yarn**
- **PostgreSQL** database (local or cloud - Railway, Supabase, Neon)
- **Redis** server (local or cloud - Upstash, Redis Cloud)
- **Git**

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd next-ecom
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create `.env` file from example:

```bash
cp .env.example .env
```

**Required environment variables:**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/fashion_ecom"

# Redis
REDIS_URL="redis://localhost:6379"

# NextAuth (Generate secret with: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Optional OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Virtual Try-On (OpenAI)
OPENAI_API_KEY="your-openai-api-key"
OPENAI_IMAGE_MODEL="gpt-image-1"  # Optional override
```

### 4. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### 5. Start Development Server

```bash
npm run dev
```

Visit **http://localhost:5000** 🎉

## Default Admin Credentials

After running the database seed, you can login with these admin credentials:

```
Email: admin@fashionstore.com
Password: admin123456
```

⚠️ **Remember to change this password in production!**

## 📁 Project Structure

```
next-ecom/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── auth/         # Authentication routes
│   │   ├── products/     # Product CRUD
│   │   ├── cart/         # Shopping cart
│   │   ├── orders/       # Order management
│   │   ├── categories/   # Category management
│   │   ├── addresses/    # Address management
│   │   ├── reviews/      # Product reviews
│   │   └── virtual-tryon/# AI virtual try-on
│   ├── products/         # Product listing & detail pages
│   │   └── [slug]/       # Product detail with virtual try-on
│   ├── cart/             # Shopping cart page
│   ├── checkout/         # Checkout flow
│   ├── auth/             # Sign in/up pages
│   ├── profile/          # User profile & addresses
│   ├── orders/           # Order history
│   ├── admin/            # Admin dashboard
│   ├── layout.tsx        # Root layout with providers
│   ├── page.tsx          # Homepage
│   └── globals.css       # Global styles
├── components/            # Reusable components
│   ├── Header.tsx        # Navigation header
│   ├── Footer.tsx        # Site footer
│   ├── ProductCard.tsx   # Product card component
│   ├── ProductGrid.tsx   # Product grid layout
│   ├── VirtualTryOnClient.tsx # AI try-on component
│   ├── WishlistButton.tsx # Wishlist functionality
│   └── Providers.tsx     # Context providers
├── contexts/             # React contexts
│   ├── CartContext.tsx   # Cart state management
│   └── WishlistContext.tsx # Wishlist state management
├── lib/                  # Utilities and configs
│   ├── prisma.ts        # Prisma client singleton
│   ├── redis.ts         # Redis client & cache helpers
│   ├── auth.ts          # NextAuth configuration
│   ├── utils.ts         # Helper functions
│   └── validations.ts   # Zod validation schemas
├── prisma/
│   └── schema.prisma    # Database schema
├── types/               # TypeScript definitions
│   ├── index.ts
│   └── next-auth.d.ts
├── middleware.ts        # Route protection
└── .env.example         # Environment template
```

## 🗄️ Database Schema

### Core Models

- **User**: Customer accounts with role-based access
- **Product**: Product catalog with variants, images, and tags
- **Category**: Hierarchical category structure
- **Order**: Order management with status tracking
- **OrderItem**: Individual items in orders
- **Cart**: Shopping cart items
- **Wishlist**: Saved items
- **Review**: Product reviews and ratings
- **Address**: Shipping and billing addresses

### Relationships

- Products belong to categories
- Products have multiple images and variants
- Users have addresses, orders, cart items, and reviews
- Orders contain order items linked to products

See `prisma/schema.prisma` for the complete schema.

## 🔐 Authentication & Authorization

### Supported Auth Methods

1. **Credentials**: Email and password
2. **Google OAuth**: Sign in with Google
3. **GitHub OAuth**: Sign in with GitHub

### User Roles

- `CUSTOMER`: Standard user (default)
- `ADMIN`: Can manage products and orders
- `SUPER_ADMIN`: Full system access

### Protected Routes

- `/profile/*` - User profile pages
- `/orders/*` - Order history
- `/checkout` - Checkout process
- `/admin/*` - Admin dashboard (Admin only)

## 📡 API Documentation

### Product Endpoints

```typescript
GET    /api/products              // List products (with filters)
GET    /api/products/[slug]       // Get product details
POST   /api/products              // Create product (Admin)
PUT    /api/products/[slug]       // Update product (Admin)
DELETE /api/products/[slug]       // Delete product (Admin)
```

### Cart Endpoints

```typescript
GET    /api/cart                  // Get cart items
POST   /api/cart                  // Add to cart
PATCH  /api/cart                  // Update quantity
DELETE /api/cart                  // Remove item
```

### Order Endpoints

```typescript
GET    /api/orders                // List orders
POST   /api/orders                // Create order (checkout)
GET    /api/orders/[id]           // Get order details
PATCH  /api/orders/[id]           // Update order (Admin)
```

### Virtual Try-On Endpoints

```typescript
POST   /api/virtual-tryon         // Generate virtual try-on image (multipart/form-data)
```

## 🎨 Styling Guidelines

### Tailwind CSS v4

The project uses Tailwind CSS v4 with custom configuration:

- **Colors**: Purple primary theme with gray accents
- **Fonts**: Geist Sans and Geist Mono
- **Responsive**: Mobile-first breakpoints (sm, md, lg)
- **Dark Mode**: System preference-based

### Component Patterns

```tsx
// Button example
<button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
  Click Me
</button>

// Card example
<div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
  {/* Content */}
</div>
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Environment Variables for Production

Ensure these are set in your deployment platform:

- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `NEXTAUTH_URL`: Your production URL
- `NEXTAUTH_SECRET`: Production secret
- `OPENAI_API_KEY`: OpenAI API key (for Virtual Try-On)
- OAuth credentials (if using)

### Database Migrations

```bash
# Production migration
npx prisma migrate deploy
```

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server (port 5000)
npm run build        # Build for production
npm start            # Start production server
npm run db:generate  # Generate Prisma Client
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
npm run db:reset     # Reset database
```

## 📊 Performance Optimizations

- **Redis Caching**: Products and categories cached for faster loads
- **Image Optimization**: Next.js Image component with WebP
- **Server Components**: Reduced JavaScript bundle size
- **Code Splitting**: Automatic route-based splitting
- **Turbopack**: Ultra-fast bundling in development

## 🛡️ Security Best Practices

- Password hashing with bcrypt
- JWT-based session management
- CSRF protection
- SQL injection prevention via Prisma
- Input validation with Zod
- Protected API routes
- Environment variable management

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Common Issues

**Prisma Client not found:**
```bash
npx prisma generate
```

**Database connection failed:**
- Check DATABASE_URL format
- Ensure PostgreSQL is running
- Verify credentials

**Redis errors:**
- Ensure Redis server is running
- Check REDIS_URL format

**Build errors:**
```bash
rm -rf .next node_modules
npm install
npm run build
```

## 📞 Support

For help and questions:
- Open an [Issue](https://github.com/your-repo/issues)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma for the excellent ORM
- Vercel for hosting platform
- Tailwind CSS for the utility-first CSS framework

---

**Built with ❤️ for modern fashion e-commerce**
