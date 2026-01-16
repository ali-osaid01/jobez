"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resumeUploadSchema } from "./resume-upload-validation";
import { FiUploadCloud } from "react-icons/fi";
import { useRouter } from "next/navigation";

type ResumeFormValues = {
  file: FileList;
};

export default function ResumeUploadForm() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<ResumeFormValues>({
    resolver: yupResolver(resumeUploadSchema),
    mode: "onSubmit",
  });

  const [fileName, setFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  const canContinue = useMemo(() => fileName.length > 0, [fileName]);

  const onSubmit = (data: ResumeFormValues) => {
    const file = data.file?.[0];
    if (!file) return;

    console.log("Uploaded file:", file);

    // ✅ Upload success ke baad next page
    router.push("/auth/onboarding/profile-summary");
  };

  const handleDropFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    setFileName(file.name);
    setValue("file", files as FileList, { shouldValidate: true });
    clearErrors("file");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-4xl" noValidate>
      <label
        htmlFor="resume_file"
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleDropFiles(e.dataTransfer.files);
        }}
        className={[
          "block w-full rounded-xl border-2 border-dashed transition",
          "bg-[#e6e6e6]/80 hover:bg-[#e6e6e6]",
          "px-4 sm:px-6",
          "py-16 sm:py-20 md:py-24",
          "cursor-pointer select-none",
          isDragging ? "border-blue-500" : "border-gray-400",
          errors.file ? "border-red-400" : "",
        ].join(" ")}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <FiUploadCloud className="text-blue-600 text-3xl" />
          </div>

          <p className="text-base sm:text-lg font-medium text-gray-900">
            Drag and drop your resume here
          </p>
          <p className="mt-1 text-xs sm:text-sm text-gray-600">
            or click to browse files
          </p>
          <p className="mt-2 text-xs sm:text-sm text-gray-700">
            PDF or DOCX (max 10MB)
          </p>

          {fileName ? (
            <p className="mt-4 text-sm font-medium text-green-700 break-all">
              {fileName}
            </p>
          ) : null}
        </div>

        <Controller
          name="file"
          control={control}
          render={({ field }) => (
            <input
              id="resume_file"
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                field.onChange(e.target.files);
                setFileName(e.target.files?.[0]?.name || "");
                clearErrors("file");
              }}
            />
          )}
        />
      </label>

      {errors.file?.message ? (
        <p className="mt-3 text-sm text-red-600 text-center">
          {errors.file.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!canContinue}
        className={[
          "mt-8 w-full h-12 rounded-full font-medium text-base transition",
          canContinue
            ? "bg-[#34A1CD] hover:bg-[#2E92BA] text-white"
            : "bg-gray-300 text-gray-600 cursor-not-allowed",
        ].join(" ")}
      >
        Continue to Profile Setup
      </button>

      <div className="mt-4 flex items-center gap-3 text-gray-600 text-sm">
        <div className="flex -space-x-3">
          <Image
            src="/logo/pro1.png"
            alt="user 1"
            width={28}
            height={28}
            className="rounded-full border border-white"
          />
          <Image
            src="/logo/pro2.png"
            alt="user 2"
            width={28}
            height={28}
            className="rounded-full border border-white"
          />
          <Image
            src="/logo/pro3.png"
            alt="user 3"
            width={28}
            height={28}
            className="rounded-full border border-white"
          />
        </div>

        <span>Trusted by 1,000,000+ job seekers</span>
      </div>
    </form>
  );
}
