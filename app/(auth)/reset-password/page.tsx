"use client";

import { useSearchParams } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const userType = (searchParams.get("type") as "candidate" | "company") || "candidate";

  return (
    <AuthLayout
      title="Create a new password"
      headlineMain="Create a"
      headlineAccent="Strong New Password"
      description="Choose a secure password to protect your account and keep your career data safe."
      features={[
        {
          icon: "info",
          title: "Use a Strong Password",
          description: "Mix letters, numbers, and special characters",
        },
        {
          icon: "shield",
          title: "Keep It Secure",
          description: "Your password is encrypted and protected",
        },
      ]}
      illustration="/illustrations/reset-password.png"
      illustrationAlt="Reset Password Illustration"
    >
      <ResetPasswordForm userType={userType} />
    </AuthLayout>
  );
}
