"use client";

import React from "react";

type Props = {
  step: number;
  // ✅ accept both names to avoid mismatch bugs
  totalSteps?: number;
  total?: number;
};

export default function CompanyOnboardingHeader({ step, totalSteps, total }: Props) {
  const resolvedTotal = totalSteps ?? total ?? 1; // ✅ whichever is provided
  const safeTotal = resolvedTotal > 0 ? resolvedTotal : 1;
  const safeStep = Math.min(Math.max(step, 1), safeTotal);
  const percent = Math.round((safeStep / safeTotal) * 100);

  return (
    <header className="w-full bg-white border-b border-[#E5E7EB]">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between text-[14px] text-[#111827]">
          <span className="font-medium">
            Step {safeStep} of {safeTotal}
          </span>
          <span className="font-medium">{percent}%</span>
        </div>

        <div className="mt-2">
          <div className="h-[4px] w-full rounded-full bg-[#E5E7EB] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#2F80FF] transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
