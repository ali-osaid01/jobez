"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { HiCheck } from "react-icons/hi";

const steps = [
  { title: "Basic info", subtitle: "Company details" },
  { title: "Branding", subtitle: "Company Logo & cover image" },
  { title: "About & HR contact", subtitle: "Mission & contact info" },
  { title: "Review & Publish", subtitle: "Final verification" },
];

export default function CompleteYourCompanyProfilePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <section className="w-full max-w-xl flex flex-col items-center py-10">
        {/* Heading (SS1 size) */}
        <h1 className="text-center font-extrabold text-[#0F172A] leading-tight text-3xl sm:text-4xl">
          Complete your <br className="hidden sm:block" />
          company Profile
        </h1>

        <p className="mt-2 text-center text-gray-500 text-sm sm:text-base max-w-md">
          This helps candidates learn about your company and improves job visibility.
        </p>

        {/* Card (SS1 width + padding) */}
        <div className="mt-8 w-full rounded-2xl border border-gray-200 bg-white px-6 py-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-6">
            Onboarding steps
          </p>

          <ul className="space-y-6">
            {steps.map((step, idx) => (
              <li key={idx} className="flex items-center gap-4">
                {/* SS1 icon: ring + inner fill */}
                <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 rounded-full border-[3px] border-[#3399FF]" />
                  <div className="absolute w-7 h-7 rounded-full bg-[#E6F0FF]" />
                  <HiCheck className="relative w-5 h-5 text-[#3399FF]" aria-hidden="true" />
                </div>

                <div>
                  <p className="text-base font-semibold text-[#0F172A]">
                    {step.title}
                  </p>
                  <p className="text-sm text-gray-500">{step.subtitle}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Button (SS1 width + height) */}
        <button
          type="button"
          onClick={() => router.push("/auth/onboarding-company/basic-information")}
          className="mt-6 w-full h-12 rounded-2xl bg-[#3399FF] text-white font-medium
                     hover:bg-[#2A85E6] transition-colors
                     focus:outline-none focus:ring-2 focus:ring-[#3399FF]/40"
        >
          Start
        </button>
      </section>
    </main>
  );
}
