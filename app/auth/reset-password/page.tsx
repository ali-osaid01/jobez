"use client";

import Image from "next/image";
import ResetForm from "@/components/forms/reset/reset.form";

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      {/* LEFT SIDE - Branding */}
      <div className="hidden md:flex flex-col justify-center relative overflow-hidden bg-gradient-to-br from-[#E8F3FF] via-[#F4F9FD] to-[#E3F2FF] px-16">
        <div className="absolute top-[-70px] left-[-90px] w-[320px] h-[320px] bg-[#C8DAFF] opacity-40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-100px] right-[-60px] w-[280px] h-[280px] bg-[#B6CAFF] opacity-40 rounded-full blur-[90px]" />

        <div className="relative z-10 max-w-lg mx-auto text-left">
          {/* Logo */}
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

          {/* Text */}
          <h2 className="text-[32px] font-extrabold text-[#1E1E1E] mb-3">
            Reset your password
          </h2>
          <p className="text-[18px] text-gray-600 leading-relaxed mb-10">
            Set a strong password to keep your account secure.
          </p>

          <div className="flex justify-center mt-2">
            <div className="relative w-[240px] h-[240px] flex items-center justify-center">
              <div className="absolute w-[200px] h-[200px] bg-[#CDE4FF] rounded-full blur-[50px] opacity-40" />
              <Image
                src="/illustrations/reset-password.png"
                alt="Reset Illustration"
                width={200}
                height={200}
                className="relative z-10 object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Reset Form */}
      <div className="flex items-center justify-center px-6 md:px-12 py-12 bg-gradient-to-tr from-white to-[#F5F9FF]">
        <div className="w-full max-w-md">
          <h1 className="text-[28px] font-bold text-[#1E1E1E] mb-6 text-center">
            Create a new password
          </h1>
          <ResetForm />
        </div>
      </div>
    </main>
  );
}
