import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div>
            <h3 className="font-bold text-lg mb-3">JobPortal</h3>
            <p className="text-gray-400 text-sm">
              Find your dream job and connect with top employers worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-3">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="/" className="hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/jobs" className="hover:text-white transition">
                  Browse Jobs
                </a>
              </li>
              <li>
                <a href="/register" className="hover:text-white transition">
                  Register
                </a>
              </li>
            </ul>
          </div>

          {/* For Candidates */}
          <div>
            <h3 className="font-bold text-lg mb-3">For Candidates</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="/jobs" className="hover:text-white transition">
                  Search Jobs
                </a>
              </li>
              <li>
                <a href="/dashboard" className="hover:text-white transition">
                  My Applications
                </a>
              </li>
              <li>
                <a href="/register" className="hover:text-white transition">
                  Create Profile
                </a>
              </li>
            </ul>
          </div>

          {/* For Recruiters */}
          <div>
            <h3 className="font-bold text-lg mb-3">For Recruiters</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="/register" className="hover:text-white transition">
                  Post Job
                </a>
              </li>
              <li>
                <a href="/recruiter-dashboard" className="hover:text-white transition">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/jobs" className="hover:text-white transition">
                  Browse Candidates
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 mb-8" />

        {/* Bottom */}
        <div className="text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} JobPortal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
