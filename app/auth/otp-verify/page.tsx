"use client";

import Image from "next/image";
import OTPForm from "@/components/forms/otp/otp.form";

export default function OTPVerifyPage() {
  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      {/* LEFT SIDE - Branding */}
      <div className="hidden md:flex flex-col justify-center relative overflow-hidden bg-gradient-to-br from-[#E8F3FF] via-[#F4F9FD] to-[#E3F2FF] px-16">
        {/* Background Effects */}
        <div className="absolute top-[-80px] left-[-100px] w-[320px] h-[320px] bg-[#C8DAFF] opacity-40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-120px] right-[-60px] w-[280px] h-[280px] bg-[#B6CAFF] opacity-40 rounded-full blur-[100px]" />

        {/* Content */}
        <div className="relative z-10 max-w-lg mx-auto text-left">
          <div className="flex items-center mb-10">
            <Image
              src="/logo/jobez.png"
              alt="JobEZ Logo"
              width={50}
              height={50}
              className="object-contain mr-3 drop-shadow-md"
            />
            <h1 className="text-[30px] font-extrabold text-[#2D7DBF] tracking-tight">
              JobEZ
            </h1>
          </div>

          <h2 className="text-[34px] font-extrabold text-[#1E1E1E] mb-4 leading-snug">
            Secure Your Account with OTP Verification
          </h2>
          <p className="text-[18px] text-gray-600 leading-relaxed mb-10">
            Enter the 4-digit OTP sent to your registered email to verify your identity and continue safely.
          </p>

          <div className="mt-6 flex justify-center">
            <Image
              src="/illustrations/otp.png"
              alt="OTP Illustration"
              width={250}
              height={150}
              className="object-contain drop-shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - OTP Form */}
      <div className="flex items-center justify-center px-6 md:px-12 py-12 bg-gradient-to-tr from-white to-[#F5F9FF]">
        <div className="w-full max-w-md">
          <h1 className="text-[28px] font-bold text-[#1E1E1E] mb-6 text-center">
            Verify OTP
          </h1>
          <OTPForm />
        </div>
      </div>
    </main>
  );
}
