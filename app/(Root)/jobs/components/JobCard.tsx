"use client";

import { motion } from "framer-motion";
import { Bookmark, Brain } from "lucide-react";
import Link from "next/link";


export default function JobCard({ job }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-lg p-5 flex flex-col justify-between overflow-hidden"
    >
      {/* Bookmark Button */}
      <button
        className="absolute top-3 right-3 bg-white dark:bg-gray-800 shadow-sm p-2 rounded-full hover:bg-blue-50 z-20"
        aria-label="Save Job"
      >
        <Bookmark className="w-5 h-5 text-blue-600" />
      </button>

      {/* Job Info */}
      <div className="flex flex-col gap-1 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {job.title}
        </h3>
        <p className="text-sm text-gray-600">{job.company}</p>
        <p className="text-sm text-gray-500">{job.location}</p>

        {/* 💰 Salary Range */}
        {job.salary && (
          <p className="text-sm font-medium text-green-600 mt-1">
            💰 {job.salary}
          </p>
        )}
      </div>

      {/* Tech Stack */}
      {job.skills && (
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium px-3 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Tags Section */}
      <div className="flex flex-wrap items-center gap-2 mt-auto pt-2 border-t border-gray-200 dark:border-gray-700">
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
          {job.type}
        </span>

        {job.remote && (
          <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
            Remote
          </span>
        )}

        {/* 🧠 AI Interview Tag */}
        {job.aiInterview && (
          <span className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
            <Brain className="w-3 h-3" /> AI Interview
          </span>
        )}

        {/* 🎯 Match */}
        {job.match && (
          <span className="ml-auto bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
            Match: {job.match}%
          </span>
        )}
      </div>

      {/* Apply Now Button */}
       <Link
        href={`/jobs/${job.id}`}
        className="mt-auto inline-block text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
        Apply Now
      </Link>
    </motion.div>
  );
}
