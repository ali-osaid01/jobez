"use client";

import { useSearchParams } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const userType = (searchParams.get("type") as "candidate" | "company") || "candidate";

  return (
    <AuthLayout
      title="Forgot Password"
      headlineMain="Need to Reset"
      headlineAccent="Your Password?"
      description="No worries! Enter your registered email and we'll send you a secure OTP to reset your password and get you back on track."
      features={[
        {
          icon: "lock",
          title: "Secure & Encrypted",
          description: "Your data is protected with industry-standard encryption",
        },
        {
          icon: "clock",
          title: "Quick Recovery",
          description: "Get back to your account in minutes",
        },
      ]}
      illustration="/illustrations/lock.png"
      illustrationAlt="Forgot Password Illustration"
    >
      <ForgotPasswordForm userType={userType} />
    </AuthLayout>
  );
}
