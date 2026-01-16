"use client";

import OnboardingHeader from "@/components/forms/onboarding/header";
import ResumeUploadForm from "@/components/forms/onboarding/resume-upload/resume-upload-form";

export default function ResumeUploadPage() {
  return (
    <main className="min-h-screen bg-[#f4f6f8]">
      {/* HEADER */}
      <OnboardingHeader step={1} title="Resume Upload" totalSteps={3} />

      {/* CONTENT */}
      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Let’s get started – upload your resume
          </h2>

          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-500 max-w-2xl mx-auto">
            We’ll extract your skills, experience, and preferences to find the
            best opportunities for you.
          </p>
        </div>

        <div className="mt-8 sm:mt-12 flex justify-center">
          <ResumeUploadForm />
        </div>
      </section>
    </main>
  );
}
