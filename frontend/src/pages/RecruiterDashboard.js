import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiLogOut, FiPlus, FiEdit, FiTrash2, FiUsers, FiMapPin, FiMail, FiPhone, FiFileText } from 'react-icons/fi';

const statusOptions = ['applied', 'reviewing', 'shortlisted', 'rejected', 'selected'];

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { logout, isRecruiter } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobApplications, setJobApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsError, setApplicationsError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    jobType: 'Full-time',
    salary: { min: 0, max: 0, currency: 'USD' },
    skills: [],
    experience: '',
    qualifications: [],
  });
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (!isRecruiter) {
      navigate('/dashboard');
      return;
    }
    fetchJobs();
  }, [isRecruiter, navigate]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/jobs/recruiter/jobs');
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobApplications = async (job) => {
    try {
      setSelectedJob(job);
      setApplicationsLoading(true);
      setApplicationsError('');
      const response = await apiClient.get(`/applications/job/${job._id}/applications`);
      setJobApplications(response.data.applications);
    } catch (error) {
      setApplicationsError(error.response?.data?.message || 'Failed to load applicants');
      setJobApplications([]);
    } finally {
      setApplicationsLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('salary')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        salary: { ...prev.salary, [field]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/jobs', formData);
      alert('Job posted successfully!');
      setFormData({
        title: '',
        description: '',
        location: '',
        jobType: 'Full-time',
        salary: { min: 0, max: 0, currency: 'USD' },
        skills: [],
        experience: '',
        qualifications: [],
      });
      setShowForm(false);
      fetchJobs();
    } catch (error) {
      alert('Failed to post job');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await apiClient.delete(`/jobs/${jobId}`);
        alert('Job deleted successfully!');

        if (selectedJob?._id === jobId) {
          setSelectedJob(null);
          setJobApplications([]);
          setApplicationsError('');
        }

        fetchJobs();
      } catch (error) {
        alert('Failed to delete job');
      }
    }
  };

  const handleUpdateStatus = async (applicationId, status) => {
    try {
      await apiClient.patch(`/applications/${applicationId}/status`, { status });
      setJobApplications((prev) =>
        prev.map((application) =>
          application._id === applicationId
            ? { ...application, status }
            : application
        )
      );
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update application status');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-2">Loading dashboard...</p>
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
        <div className="container mx-auto px-4 max-w-7xl py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
              <p className="text-gray-600">Manage jobs and review the candidates who applied</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              <FiLogOut /> Logout
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 text-sm">Total Jobs Posted</p>
              <p className="text-3xl font-bold text-blue-600">{jobs.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 text-sm">Total Applications</p>
              <p className="text-3xl font-bold text-blue-600">
                {jobs.reduce((sum, job) => sum + job.applicationsCount, 0)}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 text-sm">Active Jobs</p>
              <p className="text-3xl font-bold text-blue-600">
                {jobs.filter((job) => job.isOpen).length}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              <FiPlus /> Post New Job
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Post a New Job</h2>
              <form onSubmit={handlePostJob} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="e.g., Senior Developer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="e.g., New York, USA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Type *
                    </label>
                    <select
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience Level *
                    </label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="e.g., 2-5 years"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Salary *
                    </label>
                    <input
                      type="number"
                      name="salary.min"
                      value={formData.salary.min}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="in thousands"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Salary *
                    </label>
                    <input
                      type="number"
                      name="salary.max"
                      value={formData.salary.max}
                      onChange={handleFormChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="in thousands"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                    rows="5"
                    placeholder="Job description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Skills *
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      placeholder="Add a skill..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    Post Job
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            <div className="xl:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">My Job Postings</h2>

                {jobs.length === 0 ? (
                  <p className="text-gray-600">No jobs posted yet. Post your first job!</p>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <div
                        key={job._id}
                        className={`border rounded-lg p-4 transition ${
                          selectedJob?._id === job._id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">{job.title}</h3>
                            <p className="text-gray-600">{job.location}</p>
                            <p className="text-gray-500 text-sm">
                              ${job.salary.min}k - ${job.salary.max}k • {job.jobType}
                            </p>
                            <p className="text-gray-500 text-sm mt-1">
                              Applicants: {job.applicationsCount}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                          <button
                            onClick={() => fetchJobApplications(job)}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                          >
                            <FiUsers /> View Applicants
                          </button>
                          <button
                            onClick={() => navigate(`/jobs/${job._id}`)}
                            className="flex items-center gap-2 bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition"
                          >
                            <FiEdit /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job._id)}
                            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                          >
                            <FiTrash2 /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="xl:col-span-3">
              <div className="bg-white rounded-lg shadow-md p-6 min-h-full">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Applicants</h2>
                    <p className="text-gray-600">
                      {selectedJob
                        ? `Candidates who applied for ${selectedJob.title}`
                        : 'Choose a job to see all candidate applications'}
                    </p>
                  </div>
                  {selectedJob && (
                    <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                      {jobApplications.length} applicant{jobApplications.length === 1 ? '' : 's'}
                    </span>
                  )}
                </div>

                {!selectedJob && (
                  <div className="border border-dashed border-gray-300 rounded-lg p-10 text-center text-gray-500">
                    Select a posted job, then click `View Applicants` to see candidate details.
                  </div>
                )}

                {selectedJob && applicationsLoading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <p className="text-gray-600 mt-2">Loading applicants...</p>
                    </div>
                  </div>
                )}

                {selectedJob && !applicationsLoading && applicationsError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {applicationsError}
                  </div>
                )}

                {selectedJob && !applicationsLoading && !applicationsError && jobApplications.length === 0 && (
                  <div className="border border-dashed border-gray-300 rounded-lg p-10 text-center text-gray-500">
                    No one has applied for this job yet.
                  </div>
                )}

                {selectedJob && !applicationsLoading && !applicationsError && jobApplications.length > 0 && (
                  <div className="space-y-5">
                    {jobApplications.map((application) => {
                      const candidate = application.candidateId || {};

                      return (
                        <div key={application._id} className="border border-gray-200 rounded-xl p-5">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{candidate.name || 'Candidate'}</h3>
                              <p className="text-gray-500 text-sm">
                                Applied on {new Date(application.appliedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                              </span>
                              <select
                                value={application.status}
                                onChange={(e) => handleUpdateStatus(application._id, e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                              >
                                {statusOptions.map((status) => (
                                  <option key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-gray-700">
                            <div className="flex items-center gap-2">
                              <FiMail className="text-blue-600" />
                              <span>{candidate.email || 'Email not provided'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FiPhone className="text-blue-600" />
                              <span>{candidate.phone || 'Phone not provided'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FiMapPin className="text-blue-600" />
                              <span>{candidate.location || 'Location not provided'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FiUsers className="text-blue-600" />
                              <span>
                                Joined{' '}
                                {candidate.createdAt
                                  ? new Date(candidate.createdAt).toLocaleDateString()
                                  : 'recently'}
                              </span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm font-semibold text-gray-800 mb-2">Profile Summary</p>
                            <p className="text-gray-600 text-sm">
                              {candidate.bio || 'No bio added by this candidate yet.'}
                            </p>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm font-semibold text-gray-800 mb-2">Skills</p>
                            <div className="flex flex-wrap gap-2">
                              {candidate.skills?.length ? (
                                candidate.skills.map((skill, index) => (
                                  <span
                                    key={`${application._id}-${skill}-${index}`}
                                    className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm"
                                  >
                                    {skill}
                                  </span>
                                ))
                              ) : (
                                <span className="text-sm text-gray-500">No skills added</span>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-50 rounded-lg p-4">
                              <p className="text-sm font-semibold text-gray-800 mb-2">Resume</p>
                              {application.resume || candidate.resume ? (
                                <a
                                  href={application.resume || candidate.resume}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                                >
                                  <FiFileText />
                                  View Resume
                                </a>
                              ) : (
                                <p className="text-sm text-gray-500">Resume not provided</p>
                              )}
                            </div>

                            <div className="bg-slate-50 rounded-lg p-4">
                              <p className="text-sm font-semibold text-gray-800 mb-2">Cover Letter</p>
                              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                {application.coverLetter || 'No cover letter submitted.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RecruiterDashboard;
