"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiCheckCircle } from "react-icons/fi";

export default function CompleteProfileSuccess() {
  const router = useRouter();

  return (
    <div className="w-full max-w-3xl flex flex-col items-center">
      {/* ICON */}
      <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
        <FiCheckCircle className="text-blue-500 text-5xl" />
      </div>

      {/* TITLE */}
      <h2 className="mt-6 text-2xl sm:text-3xl font-semibold text-gray-900">
        Your Profile is ready !
      </h2>

      {/* SUBTEXT */}
      <p className="mt-3 text-gray-500 text-sm sm:text-base leading-relaxed max-w-lg">
        Start discovering jobs tailored for you JoBeZ’s AI will match
        <br className="hidden sm:block" />
        you with opportunities based on your skills and preferences
      </p>

      {/* BUTTON */}
      <button
        type="button"
        onClick={() => router.push("/dashboard")}
        className="mt-7 w-full max-w-xl h-12 rounded-full bg-[#34A1CD] hover:bg-[#2E92BA]
                   text-white font-medium text-sm sm:text-base transition flex items-center justify-center gap-2"
      >
        Go to Dashboard <span className="text-lg">→</span>
      </button>

      {/* TRUST (bottom-left like your screenshot) */}
      <div className="mt-16 w-full flex items-center justify-start gap-3 text-gray-500 text-sm">
        <div className="flex -space-x-3">
          <Image
            src="/logo/pro1.png"
            alt="u1"
            width={28}
            height={28}
            className="rounded-full border border-white"
          />
          <Image
            src="/logo/pro2.png"
            alt="u2"
            width={28}
            height={28}
            className="rounded-full border border-white"
          />
          <Image
            src="/logo/pro3.png"
            alt="u3"
            width={28}
            height={28}
            className="rounded-full border border-white"
          />
        </div>
        <span>Trusted by 1,000,000+ job seekers</span>
      </div>
    </div>
  );
}
