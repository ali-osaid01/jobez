"use client";

import Image from "next/image";
import ForgotForm from "@/components/forms/forgot/forgot.form";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      {/* ✅ LEFT SIDE - Branding (same theme) */}
      <div className="hidden md:flex flex-col justify-center relative overflow-hidden bg-gradient-to-br from-[#E8F3FF] via-[#F4F9FD] to-[#E3F2FF] px-16">
        {/* Gradient Backgrounds */}
        <div className="absolute top-[-70px] left-[-90px] w-[320px] h-[320px] bg-[#C8DAFF] opacity-40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-100px] right-[-60px] w-[280px] h-[280px] bg-[#B6CAFF] opacity-40 rounded-full blur-[90px]" />

        {/* Left Content */}
        <div className="relative z-10 max-w-lg mx-auto text-left">
          <div className="flex items-center mb-8">
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

          <h2 className="text-[32px] font-extrabold text-[#1E1E1E] mb-3 leading-snug">
            Forgot your password?
          </h2>
          <p className="text-[18px] text-gray-600 leading-relaxed mb-10">
            Don’t worry! Enter your registered email and we’ll send you an OTP
            to reset your password securely.
          </p>

          <div className="flex justify-center mt-8">
            <div className="relative w-[240px] h-[240px] flex items-center justify-center">
              <div className="absolute w-[200px] h-[200px] bg-[#CDE4FF] rounded-full blur-[50px] opacity-40" />
              <Image
                src="/illustrations/lock.png"
                alt="Forgot Password Illustration"
                width={200}
                height={200}
                className="relative z-10 object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ✅ RIGHT SIDE - Form */}
      <div className="flex items-center justify-center px-6 md:px-12 py-12 bg-gradient-to-tr from-white to-[#F5F9FF]">
        <div className="w-full max-w-md">
          <h1 className="text-[28px] font-bold text-[#1E1E1E] mb-6 text-center">
            Forgot Password
          </h1>
          <ForgotForm />
        </div>
      </div>
    </main>
  );
}
