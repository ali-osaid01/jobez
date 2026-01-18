"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface ProfileProgressProps {
  progress?: number // 0 - 100
}

export function ProfileProgress({ progress = 65 }: ProfileProgressProps) {
  return (
    <section className="mt-6">
      <div className="relative bg-card border border-border rounded-xl p-6 md:p-8">

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground">
              Profile Completion
            </p>
            <span className="text-sm font-semibold text-primary">
              {progress}%
            </span>
          </div>

          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#009DFF] to-[#0086DB]/70 transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Link
            href="/profile"
            className="inline-flex items-center justify-center rounded-full bg-[#009DFF] px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-[#0086DB]/90 transition"
          >
            Edit your profile
          </Link>
           <Link
            href="/profile"
            className="inline-flex items-center justify-center rounded-full border border-[#009DFF] px-6 py-3 text-sm font-medium text-[#009DFF] hover:bg-[#0086DB]/5 transition"
          >
            Upload Your Resume
          </Link>

          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Browse profile tips
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
