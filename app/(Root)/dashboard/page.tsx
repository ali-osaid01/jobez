"use client";

import React from "react";
import { FeaturedCompanies } from "@/components/FeaturedCompanies";

export default function DashboardPage() {
  const profileCompletion = 70;

  const widgets = [
    { title: "Recommended Jobs", content: "3 new jobs match your skills" },
    { title: "Deadlines", content: "1 application due tomorrow" },
    { title: "Interview Tasks", content: "2 pending technical tasks" },
    { title: "Recent Activity", content: "Last login: 2 days ago" },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Greeting */}
      <h1 className="text-2xl font-bold mb-4">
        Welcome back, <span className="text-blue-600">Syed!</span>
      </h1>
{/* Profile Completeness Section */}
<div className="bg-white shadow-md rounded-2xl p-6 max-w-md mb-8">
  <h2 className="text-lg font-medium mb-2">Profile Completeness</h2>
  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
    <div
      className="bg-blue-500 h-3 rounded-full"
      style={{ width: `${profileCompletion}%` }}
    ></div>
  </div>
  <p className="text-sm text-gray-600 mb-4">{profileCompletion}% complete</p>

  {/* Edit Profile Button */}
  <button
    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-4"
    onClick={() => {
      window.location.href = "/profile/edit";
    }}
  >
    Edit Your Profile
  </button>

  {/* Upload Resume */}
  <div className="mt-2">
    <label className="block mb-1 text-sm font-medium text-gray-700">
      Upload Resume
    </label>
    <input
      type="file"
      accept=".pdf,.doc,.docx"
      className="w-full text-sm text-gray-600
                 file:mr-4 file:py-2 file:px-4
                 file:rounded-full file:border-0
                 file:text-sm file:font-semibold
                 file:bg-blue-50 file:text-blue-700
                 hover:file:bg-blue-100
                 cursor-pointer"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          console.log("Selected file:", file);
          // Add your upload handling logic here
        }
      }}
    />
  </div>
</div>

      {/* Dashboard Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {widgets.map((widget, index) => (
          <div
            key={index}
            className="bg-white shadow-sm rounded-2xl p-5 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-2">{widget.title}</h3>
            <p className="text-gray-600 text-sm">{widget.content}</p>
          </div>
        ))}
      </div>

      {/* Featured Companies Section */}
      <FeaturedCompanies />
    </div>
  );
}
