"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { preferredLocationSchema } from "./preferred-location-validation";

type PreferredLocationValues = {
  preferredLocation: string;
};

export default function PreferredLocationForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PreferredLocationValues>({
    resolver: yupResolver(preferredLocationSchema),
    mode: "onChange",
    defaultValues: { preferredLocation: "" },
  });

  const onSubmit = (data: PreferredLocationValues) => {
    console.log("Preferred location:", data);

    // ✅ final completion screen (tumhara route)
    router.push("/auth/onboarding/complete-profile");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[640px]">
      {/* FIELD */}
      <div className="text-left">
        <label className="block text-sm font-medium text-gray-800 mb-2">
          Preferred location?
        </label>

        <input
          {...register("preferredLocation")}
          placeholder="Eg: SanFrancisco"
          className="w-full h-11 rounded-md border border-gray-300 px-3 text-sm outline-none
                     focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white"
        />

        {errors.preferredLocation?.message && (
          <p className="mt-2 text-xs text-red-600">
            {errors.preferredLocation.message}
          </p>
        )}

        {/* BUTTON ROW (Ditto like screenshot) */}
        <div className="mt-4 flex items-center gap-3">
          {/* Back */}
          <button
            type="button"
            onClick={() => router.back()}
            className="h-11 px-6 rounded-full border border-gray-300 bg-white text-gray-800 text-sm font-medium
                       hover:bg-gray-50 transition"
          >
            ← Back
          </button>

          {/* Complete Profile */}
          <button
            type="submit"
            disabled={!isValid}
            className={[
              "flex-1 h-11 rounded-full font-medium text-sm transition",
              isValid
                ? "bg-[#34A1CD] hover:bg-[#2E92BA] text-white"
                : "bg-gray-300 text-gray-600 cursor-not-allowed",
            ].join(" ")}
          >
            Complete Profile
          </button>
        </div>
      </div>

      {/* TRUST (bottom-left like screenshot) */}
      <div className="mt-6 flex items-center gap-3 text-gray-500 text-sm justify-start">
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
    </form>
  );
}
