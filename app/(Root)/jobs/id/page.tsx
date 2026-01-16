"use client";

import { useParams } from "next/navigation";
import { jobs } from "../Data/jobs"; // adjust if your path differs
import Link from "next/link";

export default function JobDetailsPage() {
  const { id } = useParams();
  const job = jobs.find((j) => j.id.toString() === id);

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <p>Job not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <Link href="/jobs" className="text-blue-600 hover:underline">
        ← Back to Jobs
      </Link>

      <div className="mt-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {job.title}
        </h1>
        <p className="text-gray-500 mb-4">{job.company}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
            {job.type}
          </span>
          {job.remote && (
            <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
              Remote
            </span>
          )}
          <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
            {job.location}
          </span>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-6">{job.description}</p>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h2 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
            Responsibilities
          </h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
            {job.responsibilities?.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
            Required Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {job.skills?.map((skill, i) => (
              <span
                key={i}
                className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm text-gray-500">Salary: {job.salary}</p>
          <p className="text-sm text-gray-500">Deadline: {job.deadline}</p>
        </div>

        <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium">
          Apply Now
        </button>
      </div>
    </div>
  );
}
