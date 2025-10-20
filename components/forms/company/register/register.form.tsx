"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { companyRegisterSchema } from "./register.validation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedinIn } from "react-icons/fa";

type CompanyRegisterFormValues = z.infer<typeof companyRegisterSchema>;

export default function CompanyRegisterForm() {
  const [isFreelancer, setIsFreelancer] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyRegisterFormValues>({
    resolver: zodResolver(companyRegisterSchema),
  });

  const onSubmit = (data: CompanyRegisterFormValues) =>
    console.log("Company Signup Data:", { ...data, isFreelancer });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 transition-all duration-300"
    >
      {/* Freelancer toggle */}
      <label className="flex items-start gap-3 text-gray-700 text-sm font-medium cursor-pointer select-none">
        <input
          type="checkbox"
          checked={isFreelancer}
          onChange={() => setIsFreelancer(!isFreelancer)}
          className="w-5 h-5 mt-0.5 accent-[#2CA0E2] border-gray-300 rounded"
        />
        <span>
          Not affiliated with any company{" "}
          <span className="text-gray-500">(Independent Contractor)</span>
        </span>
      </label>

      {/* Company Fields */}
      {!isFreelancer && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                {...register("companyName")}
                placeholder="Company Name"
                className="h-11"
              />
              {errors.companyName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            <div>
              <Input
                {...register("industry")}
                placeholder="Industry Type"
                className="h-11"
              />
              {errors.industry && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.industry.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                {...register("companyPhone")}
                placeholder="Company Phone"
                className="h-11"
              />
              {errors.companyPhone && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.companyPhone.message}
                </p>
              )}
            </div>

            <div>
              <Input
                {...register("companyWebsite")}
                placeholder="Company Website"
                className="h-11"
              />
              {errors.companyWebsite && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.companyWebsite.message}
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Common Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Input
            {...register("employeeFirst")}
            placeholder="First Name"
            className="h-11"
          />
          {errors.employeeFirst && (
            <p className="text-xs text-red-500 mt-1">
              {errors.employeeFirst.message}
            </p>
          )}
        </div>
        <div>
          <Input
            {...register("employeeLast")}
            placeholder="Last Name"
            className="h-11"
          />
          {errors.employeeLast && (
            <p className="text-xs text-red-500 mt-1">
              {errors.employeeLast.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Input
          {...register("email")}
          type="email"
          placeholder="Work Email"
          className="h-11"
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="h-11"
        />
        {errors.password && (
          <p className="text-xs text-red-500 mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Terms + Submit */}
      <p className="text-xs text-center text-gray-500">
        By signing up you agree to our{" "}
        <a href="#" className="text-[#2CA0E2] hover:underline">
          Terms and Conditions
        </a>{" "}
        and{" "}
        <a href="#" className="text-[#2CA0E2] hover:underline">
          Privacy Policy
        </a>
        .
      </p>

      <Button
        type="submit"
        className="w-full bg-[#2CA0E2] hover:bg-[#2184c5] text-white rounded-full py-3 font-semibold shadow-md transition-all duration-200 hover:shadow-lg"
      >
        {isFreelancer ? "Sign up as Freelancer" : "Register Company"}
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <a
          href="/company/login"
          className="text-[#2CA0E2] hover:underline font-medium"
        >
          Log in
        </a>
      </p>

      {/* Divider */}
      <div className="flex items-center gap-3 my-4">
        <div className="h-px bg-gray-200 flex-1" />
        <span className="text-gray-400 text-sm">Or register with</span>
        <div className="h-px bg-gray-200 flex-1" />
      </div>

      {/* Social Buttons */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-2 border border-gray-300 rounded-full py-2.5 text-sm hover:bg-gray-50 transition"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>

        <button
          type="button"
          className="flex items-center justify-center gap-2 border border-gray-300 rounded-full py-2.5 text-sm hover:bg-gray-50 transition"
        >
          <FaLinkedinIn className="text-[#0077B5] text-lg" />
          Continue with LinkedIn
        </button>
      </div>
    </form>
  );
}
