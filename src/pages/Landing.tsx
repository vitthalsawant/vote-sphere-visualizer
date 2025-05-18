
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChartHorizontal, Check, PlusCircle, Sparkles, Target, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Landing = () => {
  // Animation effect for elements when the page loads
  useEffect(() => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('animate-fade-in');
      }, i * 100);
    });
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-16 md:py-28 px-4 bg-gradient-to-br from-sky-50 to-indigo-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="animate-on-scroll">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Create Interactive Polls with Beautiful Visualizations
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Engage your audience with interactive polls and get real-time insights with stunning 3D visualizations. Perfect for meetings, classrooms, or social gatherings.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-indigo-500 hover:bg-indigo-600">
                  <Link to="/dashboard">
                    <Zap className="mr-2 h-5 w-5" /> Get Started
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/create">
                    <PlusCircle className="mr-2 h-5 w-5" /> Create Poll
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative h-72 md:h-96 animate-on-scroll">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-lg transform rotate-3 opacity-20"></div>
              <div className="absolute inset-0 bg-white rounded-lg shadow-xl overflow-hidden flex items-center justify-center">
                <div className="p-6 text-center">
                  <BarChartHorizontal size={64} className="mx-auto mb-4 text-indigo-500" />
                  <h3 className="text-2xl font-semibold text-gray-800">Interactive Polls</h3>
                  <p className="mt-2 text-gray-600">Beautiful 3D visualizations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 animate-on-scroll">
            Why Choose Our <span className="text-indigo-500">Poll Creator</span>?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 animate-on-scroll bg-gradient-to-br from-sky-50 to-sky-100">
              <CardContent className="pt-6">
                <div className="p-3 bg-sky-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Zap className="h-7 w-7 text-sky-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-Time Results</h3>
                <p className="text-gray-600">
                  See votes coming in as they happen with our real-time updates feature.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 animate-on-scroll bg-gradient-to-br from-indigo-50 to-indigo-100">
              <CardContent className="pt-6">
                <div className="p-3 bg-indigo-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Sparkles className="h-7 w-7 text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Beautiful Visualizations</h3>
                <p className="text-gray-600">
                  Present your poll results with stunning 3D charts and visualizations.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 animate-on-scroll bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="pt-6">
                <div className="p-3 bg-purple-100 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Target className="h-7 w-7 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Sharing</h3>
                <p className="text-gray-600">
                  Share your polls with anyone via a simple link, no account required to vote.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6 animate-on-scroll">
            Ready to Create Your First Poll?
          </h2>
          <p className="text-lg mb-8 text-indigo-100 animate-on-scroll">
            Join thousands of users who are gathering insights with interactive polls.
          </p>
          <Button asChild size="lg" variant="secondary" className="animate-on-scroll">
            <Link to="/create">
              <PlusCircle className="mr-2 h-5 w-5" /> Create Poll Now
            </Link>
          </Button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 animate-on-scroll">
            How It <span className="text-indigo-500">Works</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center animate-on-scroll">
              <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center mb-4 text-sky-500 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create a Poll</h3>
              <p className="text-gray-600">
                Sign up and create your customized poll with multiple options in seconds.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center animate-on-scroll">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4 text-indigo-500 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Share with Others</h3>
              <p className="text-gray-600">
                Share your poll link with friends, colleagues, or your audience.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center animate-on-scroll">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4 text-purple-500 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Analyze Results</h3>
              <p className="text-gray-600">
                Watch real-time results with interactive visualizations and gain insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials or Features List */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 animate-on-scroll">
            Why Users <span className="text-indigo-500">Love Us</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-sky-50 to-indigo-50 p-6 rounded-lg shadow animate-on-scroll">
              <div className="flex items-start space-x-4">
                <Check className="text-green-500 h-6 w-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Easy to Use</h3>
                  <p className="text-gray-600 mt-2">
                    Create polls with our simple and intuitive interface in just a few clicks.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg shadow animate-on-scroll">
              <div className="flex items-start space-x-4">
                <Check className="text-green-500 h-6 w-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Real-Time Updates</h3>
                  <p className="text-gray-600 mt-2">
                    See results update instantly as participants cast their votes.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg shadow animate-on-scroll">
              <div className="flex items-start space-x-4">
                <Check className="text-green-500 h-6 w-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Interactive Visualization</h3>
                  <p className="text-gray-600 mt-2">
                    Explore poll results with our beautiful and interactive 3D visualizations.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-pink-50 to-sky-50 p-6 rounded-lg shadow animate-on-scroll">
              <div className="flex items-start space-x-4">
                <Check className="text-green-500 h-6 w-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Secure & Private</h3>
                  <p className="text-gray-600 mt-2">
                    Your data is secure and you control who has access to your polls.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button asChild className="bg-indigo-500 hover:bg-indigo-600 animate-on-scroll">
              <Link to="/dashboard">
                <BarChartHorizontal className="mr-2 h-5 w-5" /> View All Polls
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
