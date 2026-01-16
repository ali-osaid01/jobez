"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { companyResetSchema, CompanyResetFormValues } from "./reset.validation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function CompanyResetForm() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<CompanyResetFormValues>({
    resolver: yupResolver(companyResetSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = (values: CompanyResetFormValues) => {
    console.log("Company Reset Password Values:", values);
    setSuccess(true);
    setTimeout(() => router.push("/company/login"), 1200);
  };

  if (success) {
    return (
      <div className="text-center bg-white border border-gray-100 rounded-2xl p-10 shadow-md">
        <Image
          src="/illustrations/success.png"
          alt="Success"
          width={140}
          height={140}
          className="mx-auto mb-4"
        />
        <h2 className="text-2xl font-semibold text-[#1E1E1E] mb-2">
          Password Reset Successfully!
        </h2>
        <p className="text-gray-600 text-sm">
          Redirecting you to Company Login...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 border border-gray-100 bg-white rounded-2xl p-8 shadow-md"
    >
      {/* New Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          New Password
        </label>
        <div className="relative">
          <Input
            type={showNew ? "text" : "password"}
            placeholder="Enter new password"
            {...form.register("newPassword")}
            className={`h-11 pr-24 ${
              form.formState.errors.newPassword ? "border-red-500" : ""
            }`}
          />
          <button
            type="button"
            onClick={() => setShowNew((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
          >
            {showNew ? "Hide" : "Show"}
          </button>
        </div>
        {form.formState.errors.newPassword && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.newPassword.message}
          </p>
        )}
        <ul className="text-[12px] text-slate-500 mt-2 leading-5">
          <li>• At least 8 characters</li>
          <li>• Uppercase, lowercase, number & special character</li>
        </ul>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <Input
            type={showConfirm ? "text" : "password"}
            placeholder="Re-enter your password"
            {...form.register("confirmPassword")}
            className={`h-11 pr-24 ${
              form.formState.errors.confirmPassword ? "border-red-500" : ""
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
          >
            {showConfirm ? "Hide" : "Show"}
          </button>
        </div>
        {form.formState.errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-11 bg-[#2D7DBF] text-white hover:bg-[#246AA5] transition rounded-lg"
      >
        Reset Password
      </Button>

      <p className="text-center text-gray-500 text-sm">
        Remembered your password?{" "}
        <a
          href="/company/login"
          className="text-[#2D7DBF] hover:underline font-medium"
        >
          Log in
        </a>
      </p>
    </form>
  );
}
