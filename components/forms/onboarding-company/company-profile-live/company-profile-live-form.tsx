"use client";

import React from "react";
import { FiCheck, FiArrowRight } from "react-icons/fi";

export default function CompanyProfileLiveForm() {
  return (
    <div className="mx-auto w-full max-w-[980px]">
      {/* Center content like Image 1 (no big outer card) */}
      <div className="flex flex-col items-center text-center">
        {/* Icon (double ring) */}
        <div className="mt-2 flex items-center justify-center">

          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#EAF2FF]">
            <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full border-2 border-[#2F80FF]">
              <FiCheck className="text-[#2F80FF]" size={22} />
            </div>
          </div>
        </div>

      {/* Title */}
<h1
  className="
    mt-5
    text-[#111827]
    font-extrabold
    leading-[1.15]
    text-[26px]
    sm:text-[34px]
    lg:text-[38px]
  "
>
  Your Company Profile
  <br className="hidden sm:block" />
  is Live!
</h1>


        {/* Subtitle */}
        <p className="mt-3 max-w-[720px] text-[#6B7280] text-[14px] sm:text-[16px] leading-relaxed">
          You can now create job posts and attract candidates. Your profile is
          visible to job seekers worldwide.
        </p>

        {/* Next Steps card (only this card exists in Image 1) */}
        <div className="mt-7 w-full max-w-[420px] rounded-2xl border border-[#E5E7EB] bg-white px-6 py-5 text-left">
          <p className="text-center text-[13px] font-semibold text-[#111827]">
            Next Steps
          </p>

          <ul className="mt-4 space-y-4">
            <li className="flex items-start gap-3">
              <span className="mt-[2px] flex h-6 w-6 items-center justify-center rounded-full border border-[#2F80FF] bg-[#EAF2FF] text-[#2F80FF]">
                <FiCheck size={14} />
              </span>
              <span className="text-[13px] text-[#6B7280]">
                Post your first job listing
              </span>
            </li>

            <li className="flex items-start gap-3">
              <span className="mt-[2px] flex h-6 w-6 items-center justify-center rounded-full border border-[#2F80FF] bg-[#EAF2FF] text-[#2F80FF]">
                <FiCheck size={14} />
              </span>
              <span className="text-[13px] text-[#6B7280]">
                Review incoming applications
              </span>
            </li>

            <li className="flex items-start gap-3">
              <span className="mt-[2px] flex h-6 w-6 items-center justify-center rounded-full border border-[#2F80FF] bg-[#EAF2FF] text-[#2F80FF]">
                <FiCheck size={14} />
              </span>
              <span className="text-[13px] text-[#6B7280]">
                Connect with top candidates
              </span>
            </li>
          </ul>
        </div>

        {/* Single button (NO ROUTING, NO LINK, NO ACTION) */}
        <div className="mt-6 w-full max-w-[420px]">
          <button
            type="button"
            onClick={() => {}}
            className="
              h-[46px] w-full
              rounded-lg
              bg-[#2F80FF] text-white
              text-[13px] font-semibold
              hover:bg-[#256DDB]
              transition
              inline-flex items-center justify-center gap-2
            "
          >
            Go to Employer Dashboard <FiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
