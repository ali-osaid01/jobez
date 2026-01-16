    // "use client";

    // import React from "react";
    // import { useRouter } from "next/navigation";
    // import { Controller, useForm } from "react-hook-form";
    // import { yupResolver } from "@hookform/resolvers/yup";
    // import { basicInformationSchema } from "./basic-information-validation";

    // // ✅ shadcn select
    // import {
    // Select,
    // SelectContent,
    // SelectItem,
    // SelectTrigger,
    // SelectValue,
    // } from "@/components/ui/select";

    // type BasicInformationValues = {
    // companyName: string;
    // websiteUrl: string;
    // industry: string;
    // headquartersLocation: string;
    // companySize: string;
    // };

    // const INDUSTRIES = [
    // "Technology",
    // "Healthcare",
    // "Finance",
    // "Retail",
    // "Manufacturing",
    // "Education",
    // "Hospitality",
    // "Other",
    // ];

    // const COMPANY_SIZES = [
    // "1-10 employees",
    // "11-50 employees",
    // "51-200 employees",
    // "201-500 employees",
    // "500+ employees",
    // ];

    // const labelCls = "block text-[15px] font-semibold text-[#111827]";
    // const inputCls =
    // "mt-2 w-full h-[48px] rounded-[14px] border border-[#E5E7EB] bg-white px-4 " +
    // "text-[15px] text-[#111827] placeholder:text-[#9CA3AF] outline-none " +
    // "focus:border-[#2F80FF] focus:ring-4 focus:ring-[#2F80FF]/10";

    // export default function BasicInformationForm() {
    // const router = useRouter();

    // const {
    //     register,
    //     handleSubmit,
    //     control,
    //     formState: { errors, isSubmitting },
    // } = useForm<BasicInformationValues>({
    //     resolver: yupResolver(basicInformationSchema),
    //     mode: "onChange",
    //     defaultValues: {
    //     companyName: "",
    //     websiteUrl: "",
    //     industry: "",
    //     headquartersLocation: "",
    //     companySize: "",
    //     },
    // });

    // const onSubmit = async (data: BasicInformationValues) => {
    //     console.log("Basic Information:", data);
    //     router.push("/auth/onboarding-company/company-branding");
    // };

    // return (
    //     <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[860px]">
    //     <div className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-5 sm:px-8 sm:py-7">
    //         <div className="space-y-6">
    //         {/* Company Name */}
    //         <div>
    //             <label className={labelCls}>
    //             Company Name <span className="text-red-500">*</span>
    //             </label>
    //             <input
    //             type="text"
    //             placeholder="ByteCorp"
    //             {...register("companyName")}
    //             className={inputCls}
    //             />
    //             {errors.companyName?.message && (
    //             <p className="mt-2 text-[12px] text-red-600">
    //                 {errors.companyName.message}
    //             </p>
    //             )}
    //         </div>

    //         {/* Website URL */}
    //         <div>
    //             <label className={labelCls}>
    //             Website URL <span className="text-red-500">*</span>
    //             </label>
    //             <input
    //             type="text"
    //             placeholder="https://www.bytecorp.ai"
    //             {...register("websiteUrl")}
    //             className={inputCls}
    //             />
    //             {errors.websiteUrl?.message && (
    //             <p className="mt-2 text-[12px] text-red-600">
    //                 {errors.websiteUrl.message}
    //             </p>
    //             )}
    //         </div>

    //         {/* ✅ Industry - shadcn Select (Responsive) */}
    //         <div>
    //             <label className={labelCls}>
    //             Industry <span className="text-red-500">*</span>
    //             </label>

    //             <Controller
    //             control={control}
    //             name="industry"
    //             render={({ field }) => (
    //                 <Select value={field.value} onValueChange={field.onChange}>
    //                 <SelectTrigger
    //                     className={[
    //                     inputCls,
    //                     "flex items-center justify-between",
    //                     "mt-2",
    //                     errors.industry ? "border-red-400 focus:border-red-400 focus:ring-red-500/10" : "",
    //                     ].join(" ")}
    //                 >
    //                     <SelectValue placeholder="Select an industry" />
    //                 </SelectTrigger>

    //                 <SelectContent className="max-h-[260px]">
    //                     {INDUSTRIES.map((x) => (
    //                     <SelectItem key={x} value={x}>
    //                         {x}
    //                     </SelectItem>
    //                     ))}
    //                 </SelectContent>
    //                 </Select>
    //             )}
    //             />

    //             {errors.industry?.message && (
    //             <p className="mt-2 text-[12px] text-red-600">
    //                 {errors.industry.message}
    //             </p>
    //             )}
    //         </div>

    //         {/* Headquarters Location */}
    //         <div>
    //             <label className={labelCls}>
    //             Headquarters Location <span className="text-red-500">*</span>
    //             </label>
    //             <input
    //             type="text"
    //             placeholder="PECHS Shahrah-e-faisal Karachi, Pakistan"
    //             {...register("headquartersLocation")}
    //             className={inputCls}
    //             />
    //             {errors.headquartersLocation?.message && (
    //             <p className="mt-2 text-[12px] text-red-600">
    //                 {errors.headquartersLocation.message}
    //             </p>
    //             )}
    //         </div>

    //         {/* ✅ Company size - shadcn Select (Responsive) */}
    //         <div>
    //             <label className={labelCls}>
    //             Company size <span className="text-red-500">*</span>
    //             </label>

    //             <Controller
    //             control={control}
    //             name="companySize"
    //             render={({ field }) => (
    //                 <Select value={field.value} onValueChange={field.onChange}>
    //                 <SelectTrigger
    //                     className={[
    //                     inputCls,
    //                     "flex items-center justify-between mt-2",
    //                     errors.companySize ? "border-red-400 focus:border-red-400 focus:ring-red-500/10" : "",
    //                     ].join(" ")}
    //                 >
    //                     <SelectValue placeholder="Select company size" />
    //                 </SelectTrigger>

    //                 <SelectContent className="max-h-[260px]">
    //                     {COMPANY_SIZES.map((x) => (
    //                     <SelectItem key={x} value={x}>
    //                         {x}
    //                     </SelectItem>
    //                     ))}
    //                 </SelectContent>
    //                 </Select>
    //             )}
    //             />

    //             {errors.companySize?.message && (
    //             <p className="mt-2 text-[12px] text-red-600">
    //                 {errors.companySize.message}
    //             </p>
    //             )}
    //         </div>
    //         </div>

    //     {/* Buttons */}
    // <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:gap-4">
    // {/* Back */}
    // <button
    //     type="button"
    //     onClick={() => router.back()}
    //     className="
    //     h-[52px]
    //     w-full sm:w-[140px]
    //     rounded-xl border border-[#E5E7EB] bg-white
    //     text-[14px] font-semibold text-[#111827]
    //     hover:bg-[#F9FAFB] transition
    //     inline-flex items-center justify-center gap-2
    //     "
    // >
    //     <span className="text-[18px] leading-none">‹</span> Back
    // </button>

    // {/* Start */}
    // <button
    //     type="submit"
    //     className="
    //     h-[52px]
    //     w-full sm:flex-1
    //     rounded-xl bg-[#2F80FF] hover:bg-[#256DDB]
    //     text-white text-[14px] font-semibold transition
    //     "
    // >
    //     {isSubmitting ? "Starting..." : "Start"}
    // </button>
    // </div>

    //     </div>
    //     </form>
    // );
    // }
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { basicInformationSchema } from "./basic-information-validation";

// ✅ shadcn select
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ✅ zustand store (tumhara onboarding store)
import { useOnboardingCompanyStore } from "@/store/onboarding-company.store";

type BasicInformationValues = {
  companyName: string;
  websiteUrl: string;
  industry: string;
  headquartersLocation: string; // form field name
  companySize: string;
};

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Retail",
  "Manufacturing",
  "Education",
  "Hospitality",
  "Other",
];

const COMPANY_SIZES = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "500+ employees",
];

const labelCls = "block text-[15px] font-semibold text-[#111827]";
const inputCls =
  "mt-2 w-full h-[48px] rounded-[14px] border border-[#E5E7EB] bg-white px-4 " +
  "text-[15px] text-[#111827] placeholder:text-[#9CA3AF] outline-none " +
  "focus:border-[#2F80FF] focus:ring-4 focus:ring-[#2F80FF]/10";

export default function BasicInformationForm() {
  const router = useRouter();

  // ✅ store read + action
  const basic = useOnboardingCompanyStore((s) => s.basic);
  const setBasic = useOnboardingCompanyStore((s) => s.setBasic);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BasicInformationValues>({
    resolver: yupResolver(basicInformationSchema),
    mode: "onChange",
    defaultValues: {
      companyName: "",
      websiteUrl: "",
      industry: "",
      headquartersLocation: "",
      companySize: "",
    },
  });

  // ✅ IMPORTANT: if user comes back, prefill from store
  useEffect(() => {
    reset({
      companyName: basic.companyName ?? "",
      websiteUrl: basic.websiteUrl ?? "",
      industry: basic.industry ?? "",
      headquartersLocation: basic.headquarters ?? "", // store key = headquarters
      companySize: basic.companySize ?? "",
    });
  }, [basic, reset]);

  const onSubmit = async (data: BasicInformationValues) => {
    // ✅ save in store (mapping fix)
    setBasic({
      companyName: data.companyName,
      websiteUrl: data.websiteUrl,
      industry: data.industry,
      headquarters: data.headquartersLocation, // store key = headquarters
      companySize: data.companySize,
    });

    router.push("/auth/onboarding-company/company-branding");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[860px]" noValidate>
      <div className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-5 sm:px-8 sm:py-7">
        <div className="space-y-6">
          {/* Company Name */}
          <div>
            <label className={labelCls}>
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="ByteCorp"
              {...register("companyName")}
              className={inputCls}
            />
            {errors.companyName?.message && (
              <p className="mt-2 text-[12px] text-red-600">{errors.companyName.message}</p>
            )}
          </div>

          {/* Website URL */}
          <div>
            <label className={labelCls}>
              Website URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="https://www.bytecorp.ai"
              {...register("websiteUrl")}
              className={inputCls}
            />
            {errors.websiteUrl?.message && (
              <p className="mt-2 text-[12px] text-red-600">{errors.websiteUrl.message}</p>
            )}
          </div>

          {/* Industry */}
          <div>
            <label className={labelCls}>
              Industry <span className="text-red-500">*</span>
            </label>

            <Controller
              control={control}
              name="industry"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className={[
                      inputCls,
                      "flex items-center justify-between mt-2",
                      errors.industry
                        ? "border-red-400 focus:border-red-400 focus:ring-red-500/10"
                        : "",
                    ].join(" ")}
                  >
                    <SelectValue placeholder="Select an industry" />
                  </SelectTrigger>

                  <SelectContent className="max-h-[260px]">
                    {INDUSTRIES.map((x) => (
                      <SelectItem key={x} value={x}>
                        {x}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {errors.industry?.message && (
              <p className="mt-2 text-[12px] text-red-600">{errors.industry.message}</p>
            )}
          </div>

          {/* Headquarters Location */}
          <div>
            <label className={labelCls}>
              Headquarters Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="PECHS Shahrah-e-faisal Karachi, Pakistan"
              {...register("headquartersLocation")}
              className={inputCls}
            />
            {errors.headquartersLocation?.message && (
              <p className="mt-2 text-[12px] text-red-600">
                {errors.headquartersLocation.message}
              </p>
            )}
          </div>

          {/* Company size */}
          <div>
            <label className={labelCls}>
              Company size <span className="text-red-500">*</span>
            </label>

            <Controller
              control={control}
              name="companySize"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className={[
                      inputCls,
                      "flex items-center justify-between mt-2",
                      errors.companySize
                        ? "border-red-400 focus:border-red-400 focus:ring-red-500/10"
                        : "",
                    ].join(" ")}
                  >
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>

                  <SelectContent className="max-h-[260px]">
                    {COMPANY_SIZES.map((x) => (
                      <SelectItem key={x} value={x}>
                        {x}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {errors.companySize?.message && (
              <p className="mt-2 text-[12px] text-red-600">{errors.companySize.message}</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="
              h-[52px] w-full sm:w-[140px]
              rounded-xl border border-[#E5E7EB] bg-white
              text-[14px] font-semibold text-[#111827]
              hover:bg-[#F9FAFB] transition
              inline-flex items-center justify-center gap-2
            "
          >
            <span className="text-[18px] leading-none">‹</span> Back
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="
              h-[52px] w-full sm:flex-1
              rounded-xl bg-[#2F80FF] hover:bg-[#256DDB]
              text-white text-[14px] font-semibold transition
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {isSubmitting ? "Starting..." : "Start"}
          </button>
        </div>
      </div>
    </form>
  );
}
