"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";

import { FiInfo, FiUpload } from "react-icons/fi";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  reviewAndPublishSchema,
  ReviewAndPublishValues,
} from "./review-&-publish-validation";

import { useOnboardingCompanyStore } from "@/store/onboarding-company.store";

// ✅ WRAP updated to prevent overflow on mobile
const WRAP = "mx-auto w-full max-w-[650px] px-4 sm:px-0";

const H1 =
  "text-center text-[34px] sm:text-[40px] font-extrabold text-[#111827] leading-tight";
const SUB = "mt-2 text-center text-[14px] text-[#6B7280]";

const SECTION_TITLE = "text-[14px] font-semibold text-[#111827]";
const GRID = "mt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-10";
const K = "text-[12px] text-[#6B7280]";
const V = "mt-1 text-[13px] font-semibold text-[#111827] break-words";

const EDIT_BTN =
  "h-[36px] px-4 rounded-lg border border-[#E5E7EB] bg-white text-[13px] font-semibold text-[#111827] hover:bg-[#F9FAFB] inline-flex items-center gap-2";

const BTN_PRIMARY =
  "h-[48px] w-full sm:flex-1 rounded-xl bg-[#2F80FF] text-white text-[14px] font-semibold hover:bg-[#256DDB] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2";

const BTN_BACK =
  "h-[48px] w-full sm:w-[120px] rounded-xl border border-[#E5E7EB] bg-white text-[14px] font-semibold text-[#111827] hover:bg-[#F9FAFB] flex items-center justify-center gap-1";

export default function ReviewAndPublishForm() {
  const router = useRouter();

  // ✅ local hydration state
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const persistApi = (useOnboardingCompanyStore as any).persist;

    if (persistApi?.hasHydrated?.()) {
      setHydrated(true);
      return;
    }

    const unsub = persistApi?.onFinishHydration?.(() => setHydrated(true));
    return () => unsub?.();
  }, []);

  const basic = useOnboardingCompanyStore((s) => s.basic);
  const branding = useOnboardingCompanyStore((s) => s.branding);
  const aboutHr = useOnboardingCompanyStore((s) => s.aboutHr);

  const defaults: ReviewAndPublishValues = useMemo(
    () => ({
      companyName: basic.companyName || "",
      websiteUrl: basic.websiteUrl || "",
      industry: basic.industry || "",
      headquarters: (basic as any).headquarters || (basic as any).headquartersLocation || "",
      companySize: basic.companySize || "",

      logoDataUrl: branding.logoDataUrl || "",
      coverDataUrl: branding.coverDataUrl || "",

      mission: aboutHr.mission || "",
      values: aboutHr.values || "",
      culture: aboutHr.culture || "",

      hrName: aboutHr.hrName || "",
      hrEmail: aboutHr.hrEmail || "",
      hrPhone: aboutHr.hrPhone || "",
    }),
    [basic, branding, aboutHr]
  );

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<ReviewAndPublishValues>({
    resolver: yupResolver(reviewAndPublishSchema),
    mode: "onSubmit",
    defaultValues: defaults,
  });

  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  const isReady = useMemo(() => {
    return Boolean(
      defaults.companyName &&
        defaults.websiteUrl &&
        defaults.industry &&
        defaults.headquarters &&
        defaults.companySize &&
        defaults.logoDataUrl &&
        defaults.coverDataUrl &&
        defaults.mission &&
        defaults.values &&
        defaults.culture &&
        defaults.hrName &&
        defaults.hrEmail &&
        defaults.hrPhone
    );
  }, [defaults]);

  const [published, setPublished] = useState(false);

 const onPublish = async (_data: ReviewAndPublishValues) => {
  try {
    setPublished(true);

    // optional: fake delay for UX
    await new Promise((res) => setTimeout(res, 600));

    // ✅ SUCCESS → redirect to live screen
    router.push("/auth/onboarding-company/company-profile-live");
  } catch (error) {
    console.error("Publish failed", error);
  }
};

  // ✅ hydration loading
  if (!hydrated) {
    return (
      <div className={WRAP}>
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8">
          <p className="text-[14px] font-semibold text-[#111827]">Loading...</p>
          <p className="mt-2 text-[13px] text-[#6B7280]">
            Please wait while we load your onboarding data.
          </p>
        </div>
      </div>
    );
  }

  // ✅ if data missing show helper
  if (!isReady) {
    return (
      <div className={WRAP}>
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8">
          <p className="text-[14px] font-semibold text-[#111827]">
            Please complete onboarding steps first
          </p>
          <p className="mt-2 text-[13px] text-[#6B7280]">
            Review &amp; Publish needs data from previous screens.
          </p>

          <div className="mt-5 flex flex-col sm:flex-row gap-3 w-full">
            <button
              type="button"
              className={BTN_BACK}
              onClick={() =>
                router.push("/auth/onboarding-company/basic-information")
              }
            >
              Go to Basic Info
            </button>
            <button
              type="button"
              className={BTN_PRIMARY}
              onClick={() =>
                router.push("/auth/onboarding-company/company-branding")
              }
            >
              Go to Branding
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={WRAP}>
      <h1 className={H1}>Review &amp; Publish</h1>
      <p className={SUB}>Verify everything looks good before going live</p>

      {/* ✅ INFO BOX exact like screenshot */}
      <div
        className="
          mt-6
          flex items-start gap-3
          rounded-2xl
          bg-[#EAF2FF]
          px-4 py-3
          text-[#2563EB]
          text-[13px]
          leading-relaxed
        "
      >
        <div className="mt-[2px] flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-white">
          <FiInfo size={14} />
        </div>

        <p className="max-w-full">
          Your company profile will go{" "}
          <span className="font-semibold">LIVE</span> after publishing. You can
          edit it anytime from your{" "}
          <span className="font-semibold ">
            dashboard
          </span>
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onPublish)}
        className="mt-6 space-y-5"
        noValidate
      >
        {/* Basic Information */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <CardTitle className={SECTION_TITLE}>Basic Information</CardTitle>
            <button
              type="button"
              className={EDIT_BTN}
              onClick={() =>
                router.push("/auth/onboarding-company/basic-information")
              }
            >
              <Pencil size={14} /> Edit
            </button>
          </CardHeader>

          <CardContent>
            <div className={GRID}>
              <div>
                <p className={K}>Company Name</p>
                <p className={V}>{defaults.companyName}</p>
              </div>

              <div>
                <p className={K}>Website URL</p>
                <p className={V}>{defaults.websiteUrl}</p>
              </div>

              <div>
                <p className={K}>Industry</p>
                <p className={V}>{defaults.industry}</p>
              </div>

              <div>
                <p className={K}>Headquarters</p>
                <p className={V}>{defaults.headquarters}</p>
              </div>

              <div>
                <p className={K}>Company size</p>
                <p className={V}>{defaults.companySize}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Branding */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <CardTitle className={SECTION_TITLE}>Branding</CardTitle>
            <button
              type="button"
              className={EDIT_BTN}
              onClick={() =>
                router.push("/auth/onboarding-company/company-branding")
              }
            >
              <Pencil size={14} /> Edit
            </button>
          </CardHeader>

          <CardContent className="space-y-5">
            <div>
              <p className={K}>Company Logo</p>
              <div className="mt-3 relative h-[88px] w-[88px] rounded-xl overflow-hidden border border-[#E5E7EB] bg-white">
                <Image
                  src={defaults.logoDataUrl}
                  alt="Company logo"
                  fill
                  sizes="88px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>

            <div>
              <p className={K}>Cover Image</p>
              <div className="mt-3 relative h-[110px] w-full rounded-xl overflow-hidden border border-[#E5E7EB] bg-white">
                <Image
                  src={defaults.coverDataUrl}
                  alt="Cover image"
                  fill
                  sizes="(max-width: 768px) 100vw, 650px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Company */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <CardTitle className={SECTION_TITLE}>About Company</CardTitle>
            <button
              type="button"
              className={EDIT_BTN}
              onClick={() =>
                router.push("/auth/onboarding-company/about-your-company")
              }
            >
              <Pencil size={14} /> Edit
            </button>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <p className={K}>Mission</p>
              <p className="mt-1 text-[13px] text-[#111827] break-words whitespace-pre-wrap">
                {defaults.mission}
              </p>
            </div>

            <Separator />

            <div>
              <p className={K}>Values</p>
              <p className="mt-1 text-[13px] text-[#111827] break-words whitespace-pre-wrap">
                {defaults.values}
              </p>
            </div>

            <Separator />

            <div>
              <p className={K}>Work Culture</p>
              <p className="mt-1 text-[13px] text-[#111827] break-words whitespace-pre-wrap">
                {defaults.culture}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <CardTitle className={SECTION_TITLE}>Contact Information</CardTitle>
            <button
              type="button"
              className={EDIT_BTN}
              onClick={() =>
                router.push("/auth/onboarding-company/about-your-company")
              }
            >
              <Pencil size={14} /> Edit
            </button>
          </CardHeader>

          <CardContent>
            <div className={GRID}>
              <div>
                <p className={K}>Name</p>
                <p className={V}>{defaults.hrName}</p>
              </div>

              <div>
                <p className={K}>Email</p>
                <p className={V}>{defaults.hrEmail}</p>
              </div>

              <div>
                <p className={K}>Phone No.</p>
                <p className={V}>{defaults.hrPhone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3 w-full">
          <button type="button" onClick={() => router.back()} className={BTN_BACK}>
            ‹ Back
          </button>

         <button
  type="submit"
  disabled={isSubmitting || published}
  className={BTN_PRIMARY}
>
  {published ? "Published" : isSubmitting ? "Publishing..." : "Publish Profile"}
</button>

        </div>
      </form>
    </div>
  );
}
