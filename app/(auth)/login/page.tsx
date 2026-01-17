"use client";

import { useSearchParams } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const userType = (searchParams.get("type") as "candidate" | "company") || "candidate";
  const isCompany = userType === "company";

  return (
    <AuthLayout
      title={isCompany ? "Company Login" : "Login to your account"}
      headlineMain={isCompany ? "Welcome Back!" : "Your Career Journey,"}
      headlineAccent={isCompany ? "Manage Smarter" : "Simplified & Supercharged"}
      description={
        isCompany
          ? "Log in to post jobs, manage applications, and access your company's AI-driven hiring insights — all in one powerful dashboard."
          : "Streamline your job search with AI-powered matching, smart tracking, and an intuitive dashboard designed for modern professionals."
      }
      features={
        isCompany
          ? [
              {
                icon: "check",
                title: "AI-Powered Candidate Matching",
                description: "Find the perfect candidates faster",
              },
              {
                icon: "check",
                title: "Streamlined Hiring Pipeline",
                description: "Manage applications efficiently",
              },
              {
                icon: "check",
                title: "Hiring Analytics & Insights",
                description: "Data-driven recruitment decisions",
              },
            ]
          : [
              {
                icon: "check",
                title: "AI-Powered Job Matching",
                description: "Find positions that align with your skills and goals",
              },
              {
                icon: "check",
                title: "Smart Application Tracking",
                description: "Never lose track of your applications again",
              },
              {
                icon: "check",
                title: "Centralized Dashboard",
                description: "Everything you need in one beautiful interface",
              },
            ]
      }
      illustration="/illustrations/membership.png"
      illustrationAlt="Login Illustration"
      logoText={isCompany ? "JobEZ Business" : "JobEZ"}
    >
      <LoginForm userType={userType} />
    </AuthLayout>
  );
}
