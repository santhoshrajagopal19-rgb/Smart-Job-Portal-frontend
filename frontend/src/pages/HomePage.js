import React from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiUsers, FiBriefcase, FiTrendingUp } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-5xl font-bold mb-4">Find Your Dream Job Today</h1>
          <p className="text-xl mb-8 text-blue-100">
            Connect with top employers and unlock your career potential
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/jobs"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Browse Jobs
            </Link>
            <Link
              to="/register"
              className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition border-2 border-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <p className="text-gray-600">Active Jobs</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">5K+</div>
              <p className="text-gray-600">Companies</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
              <p className="text-gray-600">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <FiSearch className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Smart Search</h3>
              <p className="text-gray-600">
                Find jobs using advanced filters like skills, location, and salary
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <FiBriefcase className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Easy Applications</h3>
              <p className="text-gray-600">
                Apply for jobs with a single click using your profile information
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <FiUsers className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Direct Connections</h3>
              <p className="text-gray-600">
                Connect directly with recruiters and companies for better opportunities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg mb-8 text-blue-100">
            Join thousands of candidates who have found their perfect job
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition inline-block"
          >
            Register Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
