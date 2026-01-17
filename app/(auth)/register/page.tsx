"use client";

import { useSearchParams } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const userType = (searchParams.get("type") as "candidate" | "company") || "candidate";
  const isCompany = userType === "company";

  return (
    <AuthLayout
      title={isCompany ? "Create Company Account" : "Create your account"}
      headlineMain={isCompany ? "Grow Your Team," : "Start Your Journey,"}
      headlineAccent={isCompany ? "Find Top Talent" : "Land Your Dream Job"}
      description={
        isCompany
          ? "Join thousands of companies finding exceptional talent with AI-powered matching and streamlined recruitment tools."
          : "Join thousands of professionals who've transformed their job search with AI-powered matching and intelligent career tools."
      }
      features={
        isCompany
          ? [
              {
                icon: "check",
                title: "Post Unlimited Jobs",
                description: "Reach qualified candidates instantly",
              },
              {
                icon: "check",
                title: "Smart Candidate Filtering",
                description: "AI helps you find the best matches",
              },
              {
                icon: "check",
                title: "Powerful ATS Integration",
                description: "Manage your entire hiring workflow",
              },
            ]
          : [
              {
                icon: "check",
                title: "Personalized Job Recommendations",
                description: "AI matches you with roles that fit your profile",
              },
              {
                icon: "check",
                title: "One-Click Applications",
                description: "Apply faster with saved profiles and templates",
              },
              {
                icon: "check",
                title: "Career Progress Analytics",
                description: "Track applications and optimize your strategy",
              },
            ]
      }
      illustration="/illustrations/business.png"
      illustrationAlt="Register Illustration"
      logoText={isCompany ? "JobEZ Business" : "JobEZ"}
    >
      <RegisterForm userType={userType} />
    </AuthLayout>
  );
}
