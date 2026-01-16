"use client";

import Image from "next/image";
import LoginForm from "@/components/forms/login/login.form";

export default function LoginPage() {
  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      {/* ================================
          LEFT SECTION – Brand & Illustration
      ================================== */}
      <section className="hidden md:flex flex-col justify-center relative overflow-hidden bg-gradient-to-br from-[#0F2557] via-[#1A3A6B] to-[#2E4C7F] px-16">
        {/* 🔵 Decorative Gradient Circles with enhanced glow */}
        <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-[#34A1CD] opacity-20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-120px] right-[-80px] w-[350px] h-[350px] bg-[#5279E1] opacity-15 rounded-full blur-[100px]" />
        <div className="absolute top-[35%] right-[10%] w-[200px] h-[200px] bg-[#4FB3E8] opacity-10 rounded-full blur-[90px]" />

        {/* Grid pattern overlay for depth */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />

        {/* 📘 Main Content */}
        <div className="relative z-10 max-w-lg mx-auto">
          {/* 🔹 Logo + Brand Name */}
          <div className="flex items-center mb-12 animate-fade-in">
            <Image
              src="/logo/jobez.png"
              alt="JobEZ Logo"
              width={60}
              height={60}
              className="object-contain mr-4 drop-shadow-2xl"
              priority
            />
            <h1 className="text-[36px] font-extrabold tracking-tight text-white">
              JobEZ
            </h1>
          </div>

          {/* 🏆 Headline */}
          <h2 className="text-[42px] font-extrabold text-white leading-tight mb-6">
            Your Career Journey,<br />
            <span className="bg-gradient-to-r from-[#34A1CD] to-[#5FB3E8] bg-clip-text text-transparent">
              Simplified & Supercharged
            </span>
          </h2>

          {/* 💬 Sub-Tagline */}
          <p className="text-[17px] text-gray-300 leading-relaxed mb-12">
            Streamline your job search with AI-powered matching, smart tracking,
            and an intuitive dashboard designed for modern professionals.
          </p>

          {/* ✨ Feature Highlights */}
          <div className="space-y-4 mb-12">
            <div className="flex items-start gap-3 text-white/90">
              <div className="mt-1 w-6 h-6 rounded-full bg-[#34A1CD]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-[#34A1CD]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[16px]">AI-Powered Job Matching</h3>
                <p className="text-sm text-gray-400">Find positions that align with your skills and goals</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-white/90">
              <div className="mt-1 w-6 h-6 rounded-full bg-[#34A1CD]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-[#34A1CD]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[16px]">Smart Application Tracking</h3>
                <p className="text-sm text-gray-400">Never lose track of your applications again</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-white/90">
              <div className="mt-1 w-6 h-6 rounded-full bg-[#34A1CD]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-[#34A1CD]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[16px]">Centralized Dashboard</h3>
                <p className="text-sm text-gray-400">Everything you need in one beautiful interface</p>
              </div>
            </div>
          </div>

          {/* 🎨 Illustration (Career Growth Image) */}
          <div className="mt-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#34A1CD]/20 rounded-2xl blur-3xl" />
              <Image
                src="/illustrations/membership.png"
                alt="Career Growth Illustration"
                width={280}
                height={190}
                className="relative object-contain transition-transform hover:scale-105 duration-500 drop-shadow-2xl"
              />
            </div>
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
