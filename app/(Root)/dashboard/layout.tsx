"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Jobs", path: "/dashboard/jobs" },
    { name: "Applications", path: "/dashboard/applications" },
    { name: "Profile", path: "/dashboard/profile" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-8 text-blue-600">JobEZ</h2>
        <nav className="space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                pathname === item.path
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-blue-50"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        {/* Top Navbar */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-800">
            Candidate Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">👋 Hi, Syed</span>
            <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600">
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
}
