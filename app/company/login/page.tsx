"use client";

import Image from "next/image";
import CompanyLoginForm from "@/components/forms/company/login/login.form";

export default function CompanyLoginPage() {
  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden">
      {/* ================= LEFT SIDE (FIXED) ================= */}
      <section className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-[#F8FBFF] via-[#EAF3FF] to-[#DDE7FF] overflow-hidden isolate">
        {/* Fixed container */}
        <div className="fixed top-0 left-0 w-1/2 h-screen flex flex-col justify-center items-start px-12 lg:px-16">
          {/* Background Blurs */}
          <div className="absolute top-[-80px] left-[-100px] w-[320px] h-[320px] bg-[#C8DAFF] opacity-40 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-100px] right-[-60px] w-[280px] h-[280px] bg-[#B6CAFF] opacity-40 rounded-full blur-[90px]" />

          {/* Logo (Fixed) */}
          <div className="absolute top-10 left-12 flex items-center gap-3">
            <Image
              src="/logo/jobez.png"
              alt="JobEZ Logo"
              width={55}
              height={55}
              className="object-contain drop-shadow-md"
            />
            <h1 className="text-[30px] font-extrabold bg-gradient-to-r from-[#2D7DBF] to-[#5279E1] bg-clip-text text-transparent">
              JobEZ Business
            </h1>
          </div>

          {/* Left Content */}
          <div className="relative z-10 max-w-lg space-y-6 mt-24 animate-fadeIn text-left">
            <h2 className="text-[30px] md:text-[38px] font-extrabold text-[#1E1E1E] leading-tight">
              Welcome Back! <br /> Manage Smarter with JobEZ
            </h2>
            <p className="text-[17px] text-gray-600 leading-relaxed">
              Log in to post jobs, manage applications, and access your company’s
              AI-driven hiring insights — all in one place.
            </p>

            {/* Illustration centered & smaller */}
            <div className="flex justify-center mt-8">
              <Image
                src="/illustrations/membership.png"
                alt="Business Illustration"
                width={220}
                height={150}
                className="object-contain drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= RIGHT SIDE ================= */}
      <section className="w-full md:w-1/2 flex items-center justify-center px-6 md:px-12 py-12 bg-gradient-to-tr from-white to-[#F6F9FF]">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-8 md:p-10 animate-fadeIn">
          <h1 className="text-[28px] font-bold text-center text-[#1E1E1E] mb-6">
            Company Login
          </h1>

          {/* Login Form */}
          <CompanyLoginForm />
        </div>
      </section>
    </main>
  );
}
