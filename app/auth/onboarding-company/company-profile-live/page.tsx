import React from "react";
import CompanyOnboardingHeader from "@/components/forms/onboarding-company/header";
import CompanyProfileLiveForm from "@/components/forms/onboarding-company/company-profile-live/company-profile-live-form";

export default function CompanyProfileLivePage() {
  return (
    <main className="min-h-screen bg-white">
      <CompanyOnboardingHeader step={4} totalSteps={4} />

      {/* No extra border container – just clean centered layout */}
     <section className="mx-auto w-full px-4 py-4 sm:py-6">

        <div className="mx-auto w-full max-w-[980px]">
          <CompanyProfileLiveForm />
        </div>
      </section>
    </main>
  );
}
