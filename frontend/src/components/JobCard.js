import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiDollarSign, FiBriefcase, FiHeart } from 'react-icons/fi';

const JobCard = ({ job, onBookmarkChange }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = (e) => {
    e.preventDefault();
    setIsBookmarked(!isBookmarked);
    if (onBookmarkChange) {
      onBookmarkChange(job._id);
    }
  };

  return (
    <Link
      to={`/jobs/${job._id}`}
      className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
          <p className="text-gray-600 text-sm">
            {job.postedBy.company || job.postedBy.name}
          </p>
        </div>
        <button
          onClick={handleBookmark}
          className="text-gray-400 hover:text-red-500 transition"
        >
          {isBookmarked ? (
            <FiHeart size={20} fill="currentColor" />
          ) : (
            <FiHeart size={20} />
          )}
        </button>
      </div>

      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{job.description}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <FiMapPin size={16} />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <FiBriefcase size={16} />
          <span>{job.jobType}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <FiDollarSign size={16} />
          <span>${job.salary.min}k-${job.salary.max}k</span>
        </div>
        <div className="text-gray-600 text-sm">
          {job.applicationsCount} applicants
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {job.skills.slice(0, 3).map((skill, idx) => (
          <span
            key={idx}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs"
          >
            {skill}
          </span>
        ))}
        {job.skills.length > 3 && (
          <span className="text-gray-600 text-xs px-3 py-1">
            +{job.skills.length - 3} more
          </span>
        )}
      </div>
    </Link>
  );
};

export default JobCard;
