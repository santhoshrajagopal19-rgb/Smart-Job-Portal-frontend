import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiLogOut, FiEdit, FiSave, FiX } from 'react-icons/fi';

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isCandidate } = useAuth();

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: [],
    resume: '',
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [applications, setApplications] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (!isCandidate) {
      navigate('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        const profileRes = await apiClient.get('/users/profile');
        setProfileData(profileRes.data.user);

        const appRes = await apiClient.get('/applications/candidate/applications');
        setApplications(appRes.data.applications);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isCandidate, navigate]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !profileData.skills.includes(skillInput.trim())) {
      setProfileData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSaveProfile = async () => {
    try {
      await apiClient.put('/users/profile', profileData);
      alert('Profile updated successfully!');
      setEditingProfile(false);
    } catch (error) {
      alert('Failed to update profile');
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
        <div className="container mx-auto px-4 max-w-5xl py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full mx-auto flex items-center justify-center text-2xl font-bold mb-2">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-xl font-bold">{user?.name}</h2>
                  <p className="text-gray-600 text-sm">{user?.email}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2">
              {/* Profile Section */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">My Profile</h2>
                  {!editingProfile && (
                    <button
                      onClick={() => setEditingProfile(true)}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      <FiEdit /> Edit
                    </button>
                  )}
                </div>

                {editingProfile ? (
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={profileData.name}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={profileData.phone || ''}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={profileData.location || ''}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bio
                        </label>
                        <textarea
                          name="bio"
                          value={profileData.bio || ''}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                          rows="3"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Resume URL
                        </label>
                        <input
                          type="text"
                          name="resume"
                          value={profileData.resume || ''}
                          onChange={handleProfileChange}
                          placeholder="https://example.com/resume.pdf"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Skills
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
                        {profileData.skills.map((skill, idx) => (
                          <div
                            key={idx}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="hover:text-red-600"
                            >
                              <FiX />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={handleSaveProfile}
                        className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                      >
                        <FiSave /> Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingProfile(false)}
                        className="flex items-center gap-2 bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                      >
                        <FiX /> Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-3">
                    <p>
                      <span className="font-semibold">Email:</span> {profileData.email}
                    </p>
                    <p>
                      <span className="font-semibold">Phone:</span> {profileData.phone || 'Not added'}
                    </p>
                    <p>
                      <span className="font-semibold">Location:</span> {profileData.location || 'Not added'}
                    </p>
                    <p>
                      <span className="font-semibold">Bio:</span> {profileData.bio || 'No bio'}
                    </p>
                    <p>
                      <span className="font-semibold">Resume:</span>{' '}
                      {profileData.resume ? (
                        <a
                          href={profileData.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Resume
                        </a>
                      ) : (
                        'Not added'
                      )}
                    </p>
                    <div>
                      <span className="font-semibold">Skills:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profileData.skills.length > 0 ? (
                          profileData.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-600">No skills added</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Applications Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">My Applications</h2>

                {applications.length === 0 ? (
                  <p className="text-gray-600">No applications yet. Start applying to jobs!</p>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div
                        key={app._id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">{app.jobId.title}</h3>
                            <p className="text-gray-600 text-sm">
                              Applied: {new Date(app.appliedAt).toLocaleDateString()}
                            </p>
                            <p className="text-gray-500 text-sm">
                              {app.jobId.location} • {app.jobId.jobType}
                            </p>
                          </div>
                          <span
                            className={`px-4 py-1 rounded-full text-sm font-semibold ${
                              app.status === 'selected'
                                ? 'bg-green-100 text-green-800'
                                : app.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : app.status === 'shortlisted'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
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

export default CandidateDashboard;
