"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordSchema, ForgotPasswordFormValues } from "./forgot.validation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ForgotForm() {
  const [success, setSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    console.log("Forgot Password Values:", values);
    // TODO: API call yahan ayegi
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="text-center bg-white border border-gray-100 rounded-2xl p-10 shadow-md">
        <Image
          src="/illustrations/career-growth.svg"
          alt="Success"
          width={140}
          height={140}
          className="mx-auto mb-4"
        />
        <h2 className="text-2xl font-semibold text-[#1E1E1E] mb-2">
          OTP Sent Successfully
        </h2>
        <p className="text-gray-600 text-sm">
          Check your email for the OTP to reset your password.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 border border-gray-100 bg-white rounded-2xl p-8 shadow-md"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <Input
          type="email"
          placeholder="Enter your registered email"
          {...form.register("email")}
          className={`h-11 ${form.formState.errors.email ? "border-red-500" : ""}`}
        />
        {form.formState.errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-11 bg-[#2D7DBF] text-white hover:bg-[#246AA5] transition rounded-lg"
      >
        Send OTP
      </Button>

      <p className="text-center text-gray-500 text-sm">
        Remembered your password?{" "}
        <a
          href="/auth/login"
          className="text-[#2D7DBF] hover:underline font-medium"
        >
          Login here
        </a>
      </p>
    </form>
  );
}
