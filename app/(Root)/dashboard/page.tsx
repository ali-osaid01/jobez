"use client"

import Link from "next/link"
import { Bookmark, Zap, TrendingUp, ArrowRight } from "lucide-react"
import { FeaturedCompanies } from "@/components/FeaturedCompanies"

import { DashboardStats } from "@/app/(Root)/dashboard/components/dashboard-stats"
import { ProfileProgress } from "@/app/(Root)/dashboard/components/ProfileProgress"

const recentApplications = [
  {
    id: 1,
    company: "TechCorp",
    role: "Senior Frontend Engineer",
    status: "Interview Scheduled",
    date: "2 days ago",
  },
  {
    id: 2,
    company: "StartupXYZ",
    role: "Full Stack Engineer",
    status: "Under Review",
    date: "1 week ago",
  },
  {
    id: 3,
    company: "Innovation Labs",
    role: "AI Interview Coach",
    status: "Application Sent",
    date: "2 weeks ago",
  },
]

const suggestedJobs = [
  {
    id: 1,
    company: "TechCorp",
    logo: "TC",
    title: "Senior Frontend Engineer",
    location: "San Francisco, CA",
    match: 95,
  },
  {
    id: 2,
    company: "CloudSystems",
    logo: "CS",
    title: "DevOps Engineer",
    location: "Remote",
    match: 92,
  },
  {
    id: 3,
    company: "DataViz Inc",
    logo: "DV",
    title: "Data Scientist",
    location: "Seattle, WA",
    match: 88,
  },
]

export default function DashboardPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      
      {/* ================= HEADER ================= */}
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Welcome back, <span className="text-[#009DFF]">Syed!👋</span>
        </h1>
        <p className="text-muted-foreground">
          Here's your job search dashboard and personalized recommendations.
        </p>
      </header>

      {/* ================= PROFILE PROGRESS ================= */}
      <ProfileProgress />

      {/* ================= STATS ================= */}
      <section className="mt-8">
        <DashboardStats />
      </section>

      {/* ================= MAIN GRID ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

        {/* ===== LEFT COLUMN ===== */}
        <div className="lg:col-span-2 space-y-6">

          {/* Recent Applications */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                Recent Applications
              </h2>
              <Link href="/applications" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition"
                >
                  <div>
                    <p className="font-medium text-foreground">{app.role}</p>
                    <p className="text-sm text-muted-foreground">{app.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-primary mb-1">
                      {app.status}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {app.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Interview Prep */}
          <div className="bg-[#009DFF]/20 border border-primary/20 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={30} className="text-[#009DFF]" />
                  <h3 className="font-semibold text-foreground">
                    AI Interview Prep 
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Prepare for your upcoming interviews with AI-powered coaching and feedback.
                </p>
                <button className="px-4 py-2 bg-[#009DFF] text-primary-foreground rounded-lg text-sm font-medium hover:bg-[#0086DB]/90 transition">
                  Start Prep Session
                </button>
              </div>
            </div>
          </div>
        </div>
        

        {/* ===== RIGHT COLUMN ===== */}
        <aside className="space-y-6">

          {/* Suggested Jobs */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">For You</h2>
              <TrendingUp size={18} className="text-primary" />
            </div>

            <div className="space-y-3">
              {suggestedJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="block p-3 border border-border rounded-lg hover:border-primary/50 hover:bg-muted/50 transition group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center text-xs font-bold text-primary">
                        {job.logo}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition">
                          {job.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {job.company}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-primary">
                      {job.match}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {job.location}
                  </p>
                </Link>
              ))}
            </div>

            <Link
              href="/jobs"
              className="w-full mt-4 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-border transition flex items-center justify-center gap-2"
            >
              Explore all jobs <ArrowRight size={16} />
            </Link>
          </div>
        </aside>
      </section>
       {/* ================= FEATURED COMPANIES (NEW) ================= */}
      <section className="mt-12">
        <FeaturedCompanies />
      </section>
    </main>
  )
}
