import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiMapPin, FiDollarSign, FiBriefcase, FiCalendar, FiHeart } from 'react-icons/fi';

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isCandidate } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await apiClient.get(`/jobs/${jobId}`);
        setJob(response.data.job);
      } catch (err) {
        setError('Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleApply = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isCandidate) {
      alert('Only candidates can apply for jobs');
      return;
    }

    try {
      setApplying(true);
      const userProfile = await apiClient.get('/users/profile');
      const resume = userProfile.data.user.resume;

      if (!resume) {
        alert('Please add your resume to your profile before applying');
        navigate('/dashboard');
        return;
      }

      await apiClient.post(`/applications/${jobId}/apply`, {
        resume,
        coverLetter,
      });

      alert('Application submitted successfully!');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply for job');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-2">Loading job details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-lg">{error || 'Job not found'}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <div className="container mx-auto px-4 max-w-4xl py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-8">
                {/* Header */}
                <div className="mb-6">
                  <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                  <p className="text-gray-600">{job.postedBy.company || job.postedBy.name}</p>
                </div>

                {/* Job Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b">
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-600">Location</p>
                      <p className="font-semibold">{job.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiBriefcase className="text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-600">Type</p>
                      <p className="font-semibold">{job.jobType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiDollarSign className="text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-600">Salary</p>
                      <p className="font-semibold">
                        ${job.salary.min}k - ${job.salary.max}k
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-600">Experience</p>
                      <p className="font-semibold">{job.experience}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-3">Description</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {job.description}
                  </p>
                </div>

                {/* Skills Required */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-3">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Qualifications */}
                {job.qualifications.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-3">Qualifications</h2>
                    <ul className="list-disc list-inside text-gray-700">
                      {job.qualifications.map((qual, idx) => (
                        <li key={idx}>{qual}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* About Company */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-bold mb-3">About Company</h2>
                  <p className="text-gray-700">{job.postedBy.name}</p>
                  <p className="text-gray-600 text-sm mt-2">
                    Email: {job.postedBy.email}
                  </p>
                  {job.postedBy.phone && (
                    <p className="text-gray-600 text-sm">
                      Phone: {job.postedBy.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - Application Form */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <form onSubmit={handleApply}>
                  <h2 className="text-xl font-bold mb-4">Apply Now</h2>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Letter (Optional)
                    </label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Tell the recruiter why you're a great fit..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                      rows="4"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={applying || !isAuthenticated}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {applying ? 'Applying...' : 'Apply Now'}
                  </button>

                  {!isAuthenticated && (
                    <p className="text-sm text-gray-600 text-center mt-2">
                      Please login to apply
                    </p>
                  )}
                </form>

                {/* Stats */}
                <div className="mt-6 pt-6 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {job.applicationsCount}
                    </p>
                    <p className="text-gray-600 text-sm">Applicants</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobDetailsPage;
