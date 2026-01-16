"use client";

import OnboardingHeader from "@/components/forms/onboarding/header";
import DesiredRoleForm from "@/components/forms/onboarding/desired-role/desired-role-form";

export default function DesiredRolePage() {
  return (
    <main className="min-h-screen bg-[#f4f6f8]">
      {/* ✅ HEADER (Step 2 of 3) */}
      <OnboardingHeader step={2} title="Resume Upload" totalSteps={3} />

      {/* ✅ PAGE CONTENT (same compact layout like 1st screenshot) */}
      <section className="flex flex-col items-center px-4 sm:px-6 py-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          What’s your desired role?
        </h2>

        {/* (optional) 1st screenshot me subtitle almost nahi tha, isliye small rakha */}
        <p className="text-gray-500 text-sm mt-2 max-w-xl">
          This helps us personalize jobs and recommendations for you.
        </p>

        <div className="mt-8 w-full flex justify-center">
          <DesiredRoleForm />
        </div>
      </section>
    </main>
  );
}
