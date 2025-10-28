import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Fashion Store',
  description: 'Learn more about our fashion store and our commitment to quality and style',
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-purple-600 mb-6">About Us</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          We're passionate about bringing you the latest fashion trends and timeless styles
          that make you feel confident and beautiful.
        </p>
      </div>

      {/* Our Story */}
      <section className="mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 md:p-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
          <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400">
            <p className="mb-4">
              Founded in 2024, Fashion Store began with a simple mission: to make high-quality,
              stylish fashion accessible to everyone. What started as a small boutique has grown
              into a thriving online destination for fashion enthusiasts around the world.
            </p>
            <p className="mb-4">
              We believe that fashion is more than just clothing—it's a form of self-expression,
              a way to showcase your personality and boost your confidence. That's why we carefully
              curate our collection to include pieces that are both on-trend and timeless, ensuring
              you'll find something you love every time you visit.
            </p>
            <p>
              Our team of fashion experts scours the globe to bring you the best styles from
              emerging designers and established brands alike. We're committed to quality,
              sustainability, and exceptional customer service.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Quality First</h3>
            <p className="text-gray-600 dark:text-gray-400">
              We source only the finest materials and work with trusted manufacturers to ensure
              every piece meets our high standards.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Sustainability</h3>
            <p className="text-gray-600 dark:text-gray-400">
              We're committed to reducing our environmental impact through sustainable practices
              and eco-friendly packaging.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Customer Focus</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your satisfaction is our priority. We offer hassle-free returns, fast shipping,
              and dedicated customer support.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="mb-16">
        <div className="bg-purple-600 rounded-lg p-12 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-purple-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-purple-100">Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-purple-100">Brands</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-purple-100">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section>
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Meet Our Team</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Our dedicated team of fashion experts and customer service professionals work tirelessly
          to bring you the best shopping experience possible.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Sarah Johnson', role: 'Founder & CEO', initials: 'SJ' },
            { name: 'Michael Chen', role: 'Head of Design', initials: 'MC' },
            { name: 'Emily Rodriguez', role: 'Customer Success', initials: 'ER' },
          ].map((member) => (
            <div key={member.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
              <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">{member.initials}</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-1">{member.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
