"use client";

import Image from "next/image";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  headlineMain: string;
  headlineAccent: string;
  description: string;
  features: {
    icon: "check" | "lock" | "clock" | "shield" | "info";
    title: string;
    description: string;
  }[];
  illustration: string;
  illustrationAlt: string;
  logoText?: string;
}

const iconPaths = {
  check: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
  lock: "M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z",
  clock: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z",
  shield: "M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
  info: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",
};

export default function AuthLayout({
  children,
  title,
  headlineMain,
  headlineAccent,
  description,
  features,
  illustration,
  illustrationAlt,
  logoText = "JobEZ",
}: AuthLayoutProps) {
  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      {/* ================================
          LEFT SECTION – Brand & Illustration
      ================================== */}
      <section className="hidden md:flex flex-col justify-center relative overflow-hidden bg-gradient-to-br from-[#0F2557] via-[#1A3A6B] to-[#2E4C7F] px-16">
        {/* Decorative Gradient Circles with enhanced glow */}
        <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-[#34A1CD] opacity-20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-120px] right-[-80px] w-[350px] h-[350px] bg-[#5279E1] opacity-15 rounded-full blur-[100px]" />
        <div className="absolute top-[35%] right-[10%] w-[200px] h-[200px] bg-[#4FB3E8] opacity-10 rounded-full blur-[90px]" />

        {/* Grid pattern overlay for depth */}
        <div className="absolute inset-0 opacity-5 auth-grid-pattern" />

        {/* Main Content */}
        <div className="relative z-10 max-w-lg mx-auto">
          {/* Logo + Brand Name */}
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
              {logoText}
            </h1>
          </div>

          {/* Headline */}
          <h2 className="text-[42px] font-extrabold text-white leading-tight mb-6">
            {headlineMain}
            <br />
            <span className="bg-gradient-to-r from-[#34A1CD] to-[#5FB3E8] bg-clip-text text-transparent">
              {headlineAccent}
            </span>
          </h2>

          {/* Sub-Tagline */}
          <p className="text-[17px] text-gray-300 leading-relaxed mb-12">
            {description}
          </p>

          {/* Feature Highlights */}
          <div className="space-y-4 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 text-white/90">
                <div className="mt-1 w-6 h-6 rounded-full bg-[#34A1CD]/20 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-[#34A1CD]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d={iconPaths[feature.icon]}
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[16px]">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Illustration */}
          <div className="mt-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#34A1CD]/20 rounded-2xl blur-3xl" />
              <Image
                src={illustration}
                alt={illustrationAlt}
                width={280}
                height={190}
                className="relative object-contain transition-transform hover:scale-105 duration-500 drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================================
          RIGHT SECTION – Form Content
      ================================== */}
      <section className="flex items-center justify-center px-6 md:px-12 py-12 bg-gradient-to-tr from-white to-[#F5F9FF]">
        <div className="w-full max-w-md">
          <h1 className="text-[28px] font-bold text-[#1E1E1E] mb-6 text-center">
            {title}
          </h1>
          {children}
        </div>
      </section>
    </main>
  );
}
