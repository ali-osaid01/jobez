"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { profileSummarySchema } from "./profile-summary-validation";
import { FiCheckCircle, FiX } from "react-icons/fi";
import { FaReact, FaNodeJs } from "react-icons/fa";

type ProfileSummaryValues = {
  name: string;
  currentRole: string;
  topSkills: string[];
  experienceYears: string;
};

const skillIconMap: Record<string, ReactNode> = {
  react: <FaReact className="text-sky-500" />,
  "node js": <FaNodeJs className="text-green-600" />,
  node: <FaNodeJs className="text-green-600" />,
};

export default function ProfileSummaryForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<ProfileSummaryValues>({
    resolver: yupResolver(profileSummarySchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      currentRole: "",
      topSkills: [],
      experienceYears: "",
    },
  });

  const [skillInput, setSkillInput] = useState("");
  const skills = watch("topSkills") || [];

  const addSkill = () => {
    const value = skillInput.trim();
    if (!value) return;

    const exists = skills.some((s) => s.toLowerCase() === value.toLowerCase());
    if (exists) {
      setSkillInput("");
      return;
    }

    setValue("topSkills", [...skills, value], { shouldValidate: true });
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setValue(
      "topSkills",
      skills.filter((s) => s !== skill),
      { shouldValidate: true }
    );
  };

  const onSubmit = (data: ProfileSummaryValues) => {
  console.log("Profile summary:", data);

  // ✅ Next navigation -> Desired Role
  router.push("/auth/onboarding/desired-role");
};


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl">
      {/* SUCCESS BOX */}
      <div className="w-full rounded-xl border border-blue-200 bg-blue-50 px-4 py-4 flex gap-3 items-start">
        <FiCheckCircle className="text-blue-500 text-xl mt-[2px]" />
        <div>
          <p className="text-sm font-semibold text-gray-900">
            Resume uploaded successfully
          </p>
          <p className="text-xs text-gray-600 mt-1">
            JOBEZ has analyzed your resume and extracted key information
          </p>
        </div>
      </div>

      {/* TITLE */}
      <h3 className="mt-6 text-base font-semibold text-gray-900">
        Summary of your Profile
      </h3>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
          <label className="block text-xs text-gray-500 mb-1">Name</label>
          <input
            className="w-full outline-none text-sm font-medium text-gray-900"
            placeholder="Enter your name"
            {...register("name")}
          />
          {errors.name?.message && (
            <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Current Role */}
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3">
          <label className="block text-xs text-gray-500 mb-1">
            Current Role
          </label>
          <input
            className="w-full outline-none text-sm font-medium text-gray-900"
            placeholder="e.g. Backend Developer"
            {...register("currentRole")}
          />
          {errors.currentRole?.message && (
            <p className="text-xs text-red-600 mt-1">
              {errors.currentRole.message}
            </p>
          )}
        </div>

        {/* Top Skills */}
        <div className="md:col-span-2 rounded-xl border border-gray-200 bg-white px-4 py-3">
          <label className="block text-xs text-gray-500 mb-2">
            Top Skills
          </label>

          <div className="flex flex-wrap gap-2 mb-3">
            {skills.length ? (
              skills.map((skill) => {
                const key = skill.toLowerCase();
                return (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-800 border border-gray-200"
                  >
                    {skillIconMap[key] ?? (
                      <span className="w-2 h-2 rounded-full bg-gray-400" />
                    )}
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-gray-500 hover:text-gray-700"
                      aria-label={`Remove ${skill}`}
                    >
                      <FiX size={14} />
                    </button>
                  </span>
                );
              })
            ) : (
              <span className="text-sm text-gray-400">
                Type a skill and press Enter
              </span>
            )}
          </div>

          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
            className="w-full outline-none text-sm text-gray-700"
            placeholder="Type a skill and press Enter (e.g. React)"
          />

          {errors.topSkills?.message && (
            <p className="text-xs text-red-600 mt-1">
              {errors.topSkills.message as string}
            </p>
          )}
        </div>

        {/* Experience */}
        <div className="md:col-span-2 rounded-xl border border-gray-200 bg-white px-4 py-3">
          <label className="block text-xs text-gray-500 mb-1">
            Experience
          </label>
          <input
            className="w-full outline-none text-sm font-medium text-gray-900"
            placeholder="e.g. 2 years, 6 months"
            {...register("experienceYears")}
          />
          {errors.experienceYears?.message && (
            <p className="text-xs text-red-600 mt-1">
              {errors.experienceYears.message}
            </p>
          )}
        </div>
      </div>

      {/* BUTTON */}
      <button
        type="submit"
        disabled={!isValid}
className={[
  "mt-6 w-full h-12 rounded-full font-medium text-base transition",
  isValid
    ? "bg-[#34A1CD] hover:bg-[#2E92BA] text-white"
    : "bg-gray-300 text-gray-600 cursor-not-allowed",
].join(" ")}

      >
        Continue to Profile Setup
      </button>

      {/* TRUST */}
      <div className="mt-4 flex items-center gap-3 text-gray-500 text-sm">
        <div className="flex -space-x-3">
          <Image src="/logo/pro1.png" alt="u1" width={28} height={28} className="rounded-full border border-white" />
          <Image src="/logo/pro2.png" alt="u2" width={28} height={28} className="rounded-full border border-white" />
          <Image src="/logo/pro3.png" alt="u3" width={28} height={28} className="rounded-full border border-white" />
        </div>
        <span>Trusted by 1,000,000+ job seekers</span>
      </div>
    </form>
  );
}
