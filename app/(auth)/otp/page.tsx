"use client";

import { useSearchParams } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import OTPForm from "@/components/auth/OTPForm";

export default function OTPPage() {
  const searchParams = useSearchParams();
  const userType = (searchParams.get("type") as "candidate" | "company") || "candidate";

  return (
    <AuthLayout
      title="Verify OTP"
      headlineMain="Verify Your"
      headlineAccent="Identity"
      description="Enter the 4-digit OTP sent to your registered email to verify your identity and secure your account."
      features={[
        {
          icon: "shield",
          title: "Extra Layer of Security",
          description: "Two-factor authentication protects your account",
        },
        {
          icon: "clock",
          title: "Quick Verification",
          description: "OTP expires in a few minutes for your safety",
        },
      ]}
      illustration="/illustrations/otp.png"
      illustrationAlt="OTP Verification Illustration"
    >
      <OTPForm userType={userType} />
    </AuthLayout>
  );
}
