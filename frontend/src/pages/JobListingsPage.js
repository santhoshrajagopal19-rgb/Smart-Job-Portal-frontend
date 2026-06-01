import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import JobCard from '../components/JobCard';
import { FiFilter, FiSearch } from 'react-icons/fi';

const JobListingsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: 'all',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page,
          limit: 10,
        });

        if (filters.search) params.append('search', filters.search);
        if (filters.location) params.append('location', filters.location);
        if (filters.jobType !== 'all') params.append('jobType', filters.jobType);

        const response = await apiClient.get(`/jobs?${params}`);
        setJobs(response.data.jobs);
        setTotalPages(response.data.pagination.pages);
        setError('');
      } catch (err) {
        setError('Failed to fetch jobs');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [page, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPage(1); // Reset to first page when filtering
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1">
        {/* Header */}
        <div className="bg-blue-600 text-white py-8">
          <div className="container mx-auto px-4 max-w-5xl">
            <h1 className="text-3xl font-bold mb-4">Job Listings</h1>
            <p className="text-blue-100">Find your next opportunity</p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 max-w-5xl py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="md:col-span-1">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg mb-4"
              >
                <FiFilter /> Filters
              </button>

              <div
                className={`bg-white p-4 rounded-lg shadow-md ${
                  !showFilters && 'hidden md:block'
                }`}
              >
                <h3 className="font-bold text-lg mb-4">Filters</h3>

                {/* Search */}
                <form onSubmit={handleSearch} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      placeholder="Job title..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      <FiSearch />
                    </button>
                  </div>
                </form>

                {/* Location Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="City..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {/* Job Type Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    name="jobType"
                    value={filters.jobType}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="all">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Jobs List */}
            <div className="md:col-span-3">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-gray-600 mt-2">Loading jobs...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No jobs found</p>
                  <p className="text-gray-500">Try adjusting your filters</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <JobCard key={job._id} job={job} />
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex justify-center gap-2 mt-8">
                    {page > 1 && (
                      <button
                        onClick={() => setPage(page - 1)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                      >
                        Previous
                      </button>
                    )}

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-4 py-2 rounded-lg transition ${
                          page === p
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}

                    {page < totalPages && (
                      <button
                        onClick={() => setPage(page + 1)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                      >
                        Next
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobListingsPage;
