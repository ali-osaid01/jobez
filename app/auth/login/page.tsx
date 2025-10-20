"use client";

import Image from "next/image";
import LoginForm from "@/components/forms/login/login.form";

export default function LoginPage() {
  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      {/* ================================
          LEFT SECTION – Brand & Illustration
      ================================== */}
      <section className="hidden md:flex flex-col justify-center relative overflow-hidden bg-gradient-to-br from-[#F8FBFF] via-[#EAF3FF] to-[#DDE7FF] px-16">
        {/* 🔵 Decorative Gradient Circles */}
        <div className="absolute top-[-70px] left-[-90px] w-[320px] h-[320px] bg-[#C8DAFF] opacity-40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-100px] right-[-60px] w-[280px] h-[280px] bg-[#B6CAFF] opacity-40 rounded-full blur-[90px]" />
        <div className="absolute top-[40%] left-[45%] w-[180px] h-[180px] bg-[#E3EDFF] opacity-30 rounded-full blur-[80px]" />

        {/* 📘 Main Content */}
        <div className="relative z-10 max-w-lg mx-auto text-left">
          {/* 🔹 Logo + Brand Name */}
          <div className="flex items-center mb-10">
            <Image
              src="/logo/jobez.png"
              alt="JobEZ Logo"
              width={55}
              height={55}
              className="object-contain mr-3 drop-shadow-md"
              priority
            />
            <h1 className="text-[32px] font-extrabold tracking-tight bg-gradient-to-r from-[#2D7DBF] to-[#5279E1] bg-clip-text text-transparent">
              JobEZ
            </h1>
          </div>

          {/* 🏆 Headline */}
          <h2 className="text-[34px] font-extrabold text-[#1E1E1E] leading-snug mb-3">
            The Smarter Way <br /> to Organize Your Career
          </h2>

          {/* 💬 Sub-Tagline */}
          <p className="text-[18px] text-gray-600 leading-relaxed mb-10">
            Manage, apply, and track your dream jobs — all in one intelligent
            dashboard powered by AI job matching.
          </p>

          {/* 🎨 Illustration (Career Growth Image) */}
          <div className="mt-8 flex justify-center">
            <Image
              src="/illustrations/membership.png"
              alt="Career Growth Illustration"
              width={220}
              height={150}
              className="object-contain transition-transform hover:scale-[1.03] duration-300 drop-shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* ================================
          RIGHT SECTION – Login Form
      ================================== */}
      <section className="flex items-center justify-center px-6 md:px-12 py-12 bg-gradient-to-tr from-white to-[#F5F9FF]">
        <div className="w-full max-w-md">
          <h1 className="text-[28px] font-bold text-[#1E1E1E] mb-6 text-center">
            Login to your account
          </h1>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
