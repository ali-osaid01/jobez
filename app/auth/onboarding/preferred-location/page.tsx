"use client";

import OnboardingHeader from "@/components/forms/onboarding/header";
import PreferredLocationForm from "@/components/forms/onboarding/preferred-location/preferred-location-form";

export default function PreferredLocationPage() {
  return (
    <main className="min-h-screen bg-[#f4f6f8]">
      {/* ✅ Step 3 of 3 */}
      <OnboardingHeader step={3} title="Resume Upload" totalSteps={3} />

      <section className="flex flex-col items-center px-4 sm:px-6 py-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          What’s your preferred location?
        </h2>

        <div className="mt-8 w-full flex justify-center">
          <PreferredLocationForm />
        </div>
      </section>
    </main>
  );
}
