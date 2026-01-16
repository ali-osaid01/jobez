"use client";

import React from "react";
import CompanyOnboardingHeader from "@/components/forms/onboarding-company/header";
import BasicInformationForm from "@/components/forms/onboarding-company/basic-information/basic-information-form";

export default function BasicInformationPage() {
  return (
    <main className="min-h-screen bg-[#F4F6F8]">
      <CompanyOnboardingHeader step={1} totalSteps={4} />

      {/* Container exactly like your screenshots: content starts right under header */}
      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* ✅ Desktop pe center, mobile pe left (aapke ss jaisa) */}
        <div className="w-full max-w-[860px] mx-auto text-left sm:text-center">
          <h1 className="text-[34px] sm:text-[40px] font-bold tracking-tight text-[#111827] leading-[1.15]">
            Basic Information
          </h1>

          <p className="mt-2 text-[15px] sm:text-[16px] text-[#6B7280] leading-[24px]">
            Tell us about your company
          </p>
        </div>

        <div className="mt-4 sm:mt-6 flex justify-center">
          <BasicInformationForm />
        </div>
      </section>
    </main>
  );
}
