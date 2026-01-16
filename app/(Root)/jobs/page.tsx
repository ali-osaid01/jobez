"use client";

import React, { useState } from "react";
import JobCard from "./components/JobCard";
import JobFilters from "./components/JobFilters";
import { jobs as jobsData } from "./Data/jobs";

export default function JobsPage() {
  const [filteredJobs, setFilteredJobs] = useState(jobsData);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Discover Jobs
      </h1>

      {/* ✅ Job Filters Section */}
      <JobFilters jobs={jobsData} setFilteredJobs={setFilteredJobs} />

      {/* ✅ Job Cards Section */}
      {filteredJobs.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-12">
          No jobs found matching your filters.
        </p>
      )}
    </div>
  );
}
