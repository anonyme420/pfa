import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Plane, Hotel, Target, DollarSign, Smartphone, Bot } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8 mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900">
              Plan Your Perfect Trip in Minutes
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet your AI travel assistant. Chat naturally about where you want to go, and get
              personalized itineraries, flight recommendations, and hidden gems all tailored to
              your style and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium text-lg"
              >
                Start Planning Now
              </Link>
              <Link
                href="#"
                className="px-8 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-lg"
              >
                Watch Demo
              </Link>
            </div>
          </div>

          {/* Hero Image Placeholder */}
          
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Discover What TravelAI Can Do
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition">
              <Plane className="w-10 h-10 mb-4 text-blue-500" />
              <h3 className="text-xl font-bold mb-3 text-gray-900">Smart Flight Search</h3>
              <p className="text-gray-600">
                Get personalized flight recommendations across all major airlines with price
                comparisons and instant bookings.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition">
              <Hotel className="w-10 h-10 mb-4 text-blue-500" />
              <h3 className="text-xl font-bold mb-3 text-gray-900">Accommodation Matching</h3>
              <p className="text-gray-600">
                Find the perfect place to stay based on your preferences, budget, and location with
                real reviews and instant booking.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition">
              <Target className="w-10 h-10 mb-4 text-blue-500" />
              <h3 className="text-xl font-bold mb-3 text-gray-900">AI Itinerary Builder</h3>
              <p className="text-gray-600">
                Get a detailed day-by-day itinerary with activities, restaurants, and attractions
                curated specifically for you.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition">
              <DollarSign className="w-10 h-10 mb-4 text-blue-500" />
              <h3 className="text-xl font-bold mb-3 text-gray-900">Smart Budget Planning</h3>
              <p className="text-gray-600">
                Get transparent cost breakdowns and optimize your spending without sacrificing
                quality or experience.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition">
              <Smartphone className="w-10 h-10 mb-4 text-blue-500" />
              <h3 className="text-xl font-bold mb-3 text-gray-900">Mobile Ready</h3>
              <p className="text-gray-600">
                Access all your travel plans on the go with our fully responsive mobile app. Stay
                connected anywhere, anytime.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition">
              <Bot className="w-10 h-10 mb-4 text-blue-500" />
              <h3 className="text-xl font-bold mb-3 text-gray-900">AI Chat Assistance</h3>
              <p className="text-gray-600">
                Chat naturally with our AI about anything travel-related. Get instant answers and
                personalized recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">How It Works</h2>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white font-bold">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Tell Us Your Plans</h3>
                <p className="text-gray-600">
                  Chat with our AI about your destination, dates, budget, and travel style. The
                  more details you share, the better our recommendations.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white font-bold">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">AI Generates Itinerary</h3>
                <p className="text-gray-600">
                  Our AI analyzes millions of travel data points to create the perfect itinerary
                  tailored to your preferences and constraints.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white font-bold">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Customize & Finalize</h3>
                <p className="text-gray-600">
                  Review, tweak, and personalize every detail. Adjust activities, hotels, and
                  timings until it's perfect for you.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-700 text-white font-bold">
                  4
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Book & Travel</h3>
                <p className="text-gray-600">
                  Book flights, hotels, and activities directly through our integrated booking
                  partner. Carry your itinerary with you and explore!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-500 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold">Ready to Plan Your Next Adventure?</h2>
          <p className="text-xl opacity-90">
            Join thousands of travelers who are planning smarter trips with TravelAI
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-3 bg-white text-blue-500 rounded-lg hover:bg-gray-100 transition font-medium text-lg"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
