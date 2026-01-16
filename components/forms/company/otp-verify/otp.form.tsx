"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { companyOTPSchema, CompanyOTPFormValues } from "./otp.validation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function CompanyOTPForm() {
  const [verified, setVerified] = useState(false);

  const { control, handleSubmit, setValue, getValues } = useForm<CompanyOTPFormValues>({
    resolver: yupResolver(companyOTPSchema),
    defaultValues: { otp: ["", "", "", ""] },
  });

  const handleInputChange = (value: string, index: number) => {
    const otpValues = getValues("otp");
    otpValues[index] = value.slice(-1); // only 1 digit
    setValue("otp", otpValues);

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const onSubmit = (values: CompanyOTPFormValues) => {
    const otpCode = values.otp.join("");
    console.log("Company OTP Entered:", otpCode);
    if (otpCode === "1234") setVerified(true);
  };

  if (verified) {
    return (
      <div className="text-center bg-white border border-gray-100 rounded-2xl p-10 shadow-md">
        <Image
          src="/illustrations/mark.png"
          alt="Verified"
          width={100}
          height={100}
          className="mx-auto mb-4"
        />
        <h2 className="text-2xl font-semibold text-[#1E1E1E] mb-2">
          OTP Verified Successfully!
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Your company’s email has been verified. You can now reset your
          password securely.
        </p>
        <a
          href="/company/reset-password"
          className="inline-block bg-[#2D7DBF] text-white px-6 py-2 rounded-lg hover:bg-[#246AA5] transition"
        >
          Reset Password
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 border border-gray-100 bg-white rounded-2xl p-8 shadow-md"
    >
      {/* OTP Boxes */}
      <div className="flex justify-between gap-3">
        {[0, 1, 2, 3].map((index) => (
          <Controller
            key={index}
            name={`otp.${index}` as const}
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id={`otp-${index}`}
                maxLength={1}
                onChange={(e) => handleInputChange(e.target.value, index)}
                className="w-16 h-16 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-[#2D7DBF] focus:ring-0"
              />
            )}
          />
        ))}
      </div>

      <Button
        type="submit"
        className="w-full h-11 bg-[#2D7DBF] text-white hover:bg-[#246AA5] transition rounded-lg"
      >
        Verify OTP
      </Button>

      <p className="text-center text-sm text-gray-500">
        Didn’t receive the code?{" "}
        <a href="#" className="text-[#2D7DBF] font-medium hover:underline">
          Resend
        </a>
      </p>
    </form>
  );
}
