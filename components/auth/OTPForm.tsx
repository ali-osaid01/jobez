"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface OTPFormProps {
  userType?: "candidate" | "company";
}

export default function OTPForm({ userType = "candidate" }: OTPFormProps) {
  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    console.log(`${userType} OTP:`, otpValue);
    // Handle OTP verification logic here
  };

  const handleResend = () => {
    console.log("Resending OTP...");
    // Handle resend OTP logic here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* OTP Input Fields */}
      <div className="flex justify-center gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#34A1CD] focus:ring-2 focus:ring-[#34A1CD]/20 outline-none transition"
          />
        ))}
      </div>

      {/* Info Text */}
      <p className="text-center text-sm text-gray-600">
        Enter the 4-digit code sent to your email
      </p>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-12 bg-[#34A1CD] hover:bg-[#2E92BA] text-white rounded-full font-medium"
      >
        Verify OTP
      </Button>

      {/* Resend Link */}
      <p className="text-center text-sm text-gray-600">
        Didn't receive the code?{" "}
        <button
          type="button"
          onClick={handleResend}
          className="text-[#34A1CD] hover:underline font-medium"
        >
          Resend
        </button>
      </p>
    </form>
  );
}
