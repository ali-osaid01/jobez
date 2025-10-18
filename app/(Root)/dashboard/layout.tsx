"use client";

import React from "react";
import Navbar from "@/components/navbar"; // ✅ adjust the import path if needed

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ Navbar on top */}
      <Navbar />

      {/* ✅ Main content below */}
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}
