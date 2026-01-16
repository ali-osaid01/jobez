import CompanyOnboardingHeader from "@/components/forms/onboarding-company/header";
import AboutCompanyForm from "@/components/forms/onboarding-company/about-your-company/about-your-company-form";

export default function AboutCompanyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Step 3 / 4 => 75% */}
      <CompanyOnboardingHeader step={3} totalSteps={4} />

      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="text-center">
          <h1 className="text-[34px] sm:text-[35px] font-bold tracking-tight text-[#111827] leading-[1.15]">
            About Your Company
          </h1>
          <p className="mt-2 text-[13px] sm:text-[14px] text-[#6B7280]">
            Share your company story & contact info
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <AboutCompanyForm />
        </div>
      </section>
    </main>
  );
}
