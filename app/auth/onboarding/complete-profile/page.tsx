"use client";

import OnboardingHeader from "@/components/forms/onboarding/header";
import CompleteProfileSuccess from "@/components/forms/onboarding/complete-profile/complete-profile-success";

export default function CompleteProfilePage() {
  return (
    <main className="min-h-screen bg-[#f4f6f8]">
      {/* Last screen: no steps, no title */}
      <OnboardingHeader title="" showProgress={false} />  {/* Updated here to remove the progress bar */}

      <section className="flex flex-col items-center px-4 sm:px-6 py-14 text-center">
        <CompleteProfileSuccess />
      </section>
    </main>
  );
}
