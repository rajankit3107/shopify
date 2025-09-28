import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ShoppingBag, Shield, Truck, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-24 overflow-hidden">
        <div className="container mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-12 relative z-10">
          <div className="lg:w-1/2 space-y-8">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
              Your One-Stop{" "}
              <span className="text-indigo-200">E-commerce Solution</span>
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 max-w-xl leading-relaxed drop-shadow">
              Join thousands of vendors and customers on our platform. 
              Sell your products or find amazing deals from trusted sellers.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-100 px-8 py-4 text-lg shadow-lg">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 px-8 py-4 text-lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-12 -left-12 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-12 -right-12 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="bg-white/20 rounded-xl p-6 h-36 flex items-center justify-center hover:scale-105 transform transition-all duration-300">
                      <div className="w-16 h-16 bg-white/30 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Why Choose Shopify</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to start selling online or find the perfect products
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<ShoppingBag className="h-10 w-10 text-indigo-600" />}
              title="Easy to Use"
              description="Intuitive interface for both vendors and customers"
            />
            <FeatureCard 
              icon={<Shield className="h-10 w-10 text-indigo-600" />}
              title="Secure Payments"
              description="Integrated with trusted payment gateways"
            />
            <FeatureCard 
              icon={<Truck className="h-10 w-10 text-indigo-600" />}
              title="Fast Delivery"
              description="Efficient order processing and shipping"
            />
            <FeatureCard 
              icon={<Users className="h-10 w-10 text-indigo-600" />}
              title="Community"
              description="Join our growing community of sellers and buyers"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hear from our satisfied users
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="Shopify has transformed my small business. I've been able to reach customers worldwide!"
              author="Sarah Johnson"
              role="Vendor"
            />
            <TestimonialCard 
              quote="The platform is so easy to use. I found exactly what I was looking for at a great price."
              author="Michael Chen"
              role="Customer"
            />
            <TestimonialCard 
              quote="The analytics tools have helped me understand my customers better and grow my sales."
              author="Priya Patel"
              role="Vendor"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-6 drop-shadow">Ready to Get Started?</h2>
          <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto drop-shadow">
            Join our platform today and experience the future of online shopping
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-100 px-8 py-4 text-lg shadow-lg">
                Create Account
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 px-8 py-4 text-lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl">
      <CardContent className="p-8 text-center">
        <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}

function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl">
      <CardContent className="p-8">
        <p className="text-gray-700 mb-6 italic">"{quote}"</p>
        <div className="flex items-center">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
            {author.charAt(0)}
          </div>
          <div className="ml-3">
            <p className="font-semibold text-gray-900">{author}</p>
            <p className="text-gray-500 text-sm">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
