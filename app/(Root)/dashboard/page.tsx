"use client";

import React from "react";

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
      <h1 className="text-2xl font-semibold mb-4">
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
        <p className="text-sm text-gray-600">{profileCompletion}% complete</p>
      </div>

      {/* Dashboard Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
    </div>
  );
}
