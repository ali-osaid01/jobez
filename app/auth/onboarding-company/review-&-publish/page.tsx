import CompanyOnboardingHeader from "@/components/forms/onboarding-company/header";
import ReviewAndPublishForm from "@/components/forms/onboarding-company/review-&-publish/review-&-publish-form";

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <CompanyOnboardingHeader step={4} totalSteps={4} />

      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <ReviewAndPublishForm />
      </main>
    </div>
  );
}
