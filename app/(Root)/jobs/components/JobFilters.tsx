"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X } from "lucide-react";

export default function JobFilters({ jobs, setFilteredJobs }) {
  const [filters, setFilters] = useState({
    type: "",
    location: "",
    search: "",
    minSalary: "",
    maxSalary: "",
    experience: "",
  });

  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const applyFilters = () => {
    let filtered = jobs;

    if (filters.search) {
      const term = filters.search.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(term) ||
          j.company.toLowerCase().includes(term)
      );
    }

    if (filters.type)
      filtered = filtered.filter((j) =>
        j.type.toLowerCase().includes(filters.type.toLowerCase())
      );

    if (filters.location)
      filtered = filtered.filter((j) =>
        j.location.toLowerCase().includes(filters.location.toLowerCase())
      );

    if (filters.experience)
      filtered = filtered.filter((j) =>
        j.experience.toLowerCase().includes(filters.experience.toLowerCase())
      );

    if (filters.minSalary || filters.maxSalary) {
      const parseSalary = (salary) =>
        Number(salary.replace(/[^0-9]/g, "")) || 0;
      filtered = filtered.filter((j) => {
        const [min, max] = j.salary.split("-").map((s) => parseSalary(s));
        return (
          (!filters.minSalary || max >= parseInt(filters.minSalary)) &&
          (!filters.maxSalary || min <= parseInt(filters.maxSalary))
        );
      });
    }

    setFilteredJobs(filtered);
    setShowFilters(false); // close after applying (mobile UX)
  };

  const clearFilters = () => {
    setFilters({
      type: "",
      location: "",
      search: "",
      minSalary: "",
      maxSalary: "",
      experience: "",
    });
    setFilteredJobs(jobs);
  };

  return (
    <div className="mb-6">
      {/* 🔘 Mobile Button */}
      {isMobile && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            <Filter size={18} />
            Filters
          </button>
        </div>
      )}

      {/* 💻 Desktop Filters or 📱 Mobile Dropdown */}
      <AnimatePresence>
        {(!isMobile || showFilters) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`bg-white rounded-2xl p-5 shadow-md border ${
              isMobile ? "fixed top-0 left-0 w-full h-full z-50 overflow-y-auto" : ""
            }`}
          >
            {isMobile && (
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <X size={22} />
                </button>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-end">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium mb-1">Search</label>
                <input
                  type="text"
                  placeholder="Title or company..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 w-full"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Karachi"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters({ ...filters, location: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 w-full"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium mb-1">Job Type</label>
                <select
                  value={filters.type}
                  onChange={(e) =>
                    setFilters({ ...filters, type: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 w-full"
                >
                  <option value="">All</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium mb-1">Experience</label>
                <select
                  value={filters.experience}
                  onChange={(e) =>
                    setFilters({ ...filters, experience: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 w-full"
                >
                  <option value="">All</option>
                  <option value="0-1 years">0-1 years</option>
                  <option value="1-3 years">1-3 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
              </div>

              {/* Salary */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:gap-2">
                <div className="flex flex-col w-full">
                  <label className="block text-sm font-medium mb-1">
                    Min Salary (PKR)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 50000"
                    value={filters.minSalary}
                    onChange={(e) =>
                      setFilters({ ...filters, minSalary: e.target.value })
                    }
                    className="border rounded-lg px-3 py-2 w-full"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label className="block text-sm font-medium mb-1">
                    Max Salary (PKR)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 150000"
                    value={filters.maxSalary}
                    onChange={(e) =>
                      setFilters({ ...filters, maxSalary: e.target.value })
                    }
                    className="border rounded-lg px-3 py-2 w-full"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex flex-wrap gap-3 justify-end">
              <button
                onClick={applyFilters}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className="text-gray-600 underline hover:text-gray-800"
              >
                Clear All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
