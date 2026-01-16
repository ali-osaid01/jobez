"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { desiredRoleSchema } from "./desired-role-validation";

type DesiredRoleValues = {
  desiredRole: string;
};

export default function DesiredRoleForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<DesiredRoleValues>({
    resolver: yupResolver(desiredRoleSchema),
    mode: "onChange",
    defaultValues: { desiredRole: "" },
  });

  const onSubmit = (data: DesiredRoleValues) => {
    console.log("Desired Role:", data);

    // ✅ Next screen (tumhare flow ke hisaab se)
    router.push("/auth/onboarding/preferred-location");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-[640px]"   // ✅ compact like screenshot
    >
      {/* ✅ FIELD BLOCK (no big card / very simple) */}
      <div className="text-left">
        <label className="block text-sm font-medium text-gray-800 mb-2">
          Desired Role?
        </label>

        <input
          {...register("desiredRole")}
          placeholder="Eg: UI/UX Designer, Backend Developer..."
          className="w-full h-11 rounded-md border border-gray-300 px-3 text-sm outline-none
                     focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white"
        />

        {errors.desiredRole?.message && (
          <p className="mt-2 text-xs text-red-600">
            {errors.desiredRole.message}
          </p>
        )}

        {/* ✅ BUTTON ROW (same like screenshot) */}
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

          {/* Next */}
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
            Next
          </button>
        </div>
      </div>

      {/* ✅ TRUST (bottom left like screenshot) */}
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
