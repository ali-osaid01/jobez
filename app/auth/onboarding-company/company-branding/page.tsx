import CompanyOnboardingHeader from "@/components/forms/onboarding-company/header";
import CompanyBrandingForm from "@/components/forms/onboarding-company/company-branding/company-branding-form";

export default function CompanyBrandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Step 2/4 => 50% */}
      <CompanyOnboardingHeader step={2} total={4} />

      {/* tighter spacing + center like your SS2/SS3 */}
      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 pb-10 sm:pt-10 sm:pb-12">
        <div className="text-center">
          <h1 className="text-[34px] sm:text-[40px] font-bold tracking-tight text-[#111827] leading-[1.15]">
            Branding
          </h1>
          <p className="mt-2 text-[13px] sm:text-[14px] text-[#6B7280]">
            Upload your company logo and cover image
          </p>
        </div>

        {/* center form */}
        <div className="mt-5 flex justify-center">
          <CompanyBrandingForm />
        </div>
      </section>
    </main>
  );
}
