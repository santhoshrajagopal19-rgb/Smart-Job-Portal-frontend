import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FiMenu, FiX, FiBriefcase } from 'react-icons/fi';

const Navbar = () => {
  const { user, isAuthenticated, logout, isCandidate, isRecruiter, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to={isAuthenticated ? '/home' : '/login'} className="flex items-center gap-2 text-blue-600 font-bold text-xl">
            <FiBriefcase size={28} />
            JobPortal
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/home" className="text-gray-700 hover:text-blue-600 transition">
              Home
            </Link>
            <Link to="/jobs" className="text-gray-700 hover:text-blue-600 transition">
              Jobs
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to={
                    isCandidate
                      ? '/dashboard'
                      : isRecruiter
                      ? '/recruiter-dashboard'
                      : isAdmin
                      ? '/admin-dashboard'
                      : '/home'
                  }
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link
              to="/home"
              className="block text-gray-700 hover:text-blue-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/jobs"
              className="block text-gray-700 hover:text-blue-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Jobs
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to={
                    isCandidate
                      ? '/dashboard'
                      : isRecruiter
                      ? '/recruiter-dashboard'
                      : isAdmin
                      ? '/admin-dashboard'
                      : '/home'
                  }
                  className="block text-gray-700 hover:text-blue-600 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-blue-600 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
