// "use client";

// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { aboutCompanySchema } from "./about-your-company-validation";

// type FormValues = {
//   mission: string;
//   values: string;
//   culture: string;
//   hrName: string;
//   hrEmail: string;
//   hrPhone: string;
// };

// const CARD =
//   "w-full max-w-[650px] rounded-2xl border border-[#E5E7EB] bg-white p-8 sm:p-10"; // Adjusted card width and padding for spacing

// const BOX = "rounded-xl border border-[#E5E7EB] bg-white p-6"; // Increased padding for better spacing
// const LABEL = "text-[14px] font-semibold text-[#111827]"; // Font size adjusted to match design
// const INPUT =
//   "mt-2 w-full border border-[#E5E7EB] px-4 py-3 text-[14px] bg-white outline-none focus:outline-none focus:ring-0 focus:border-[#000000] rounded-xl"; // Adjusted input fields for rounded corners and padding

// const TEXTAREA =
//   "mt-2 w-full border border-[#E5E7EB] px-4 py-3 text-[14px] bg-white resize-none min-h-[120px] outline-none focus:outline-none focus:ring-0 focus:border-[#000000] rounded-xl"; // Larger textarea and rounded corners for uniformity

// const ERROR = "mt-1 text-[12px] text-red-500"; // Error styling unchanged

// const HINT_ROW =
//   "mt-2 flex items-center justify-between text-[12px] text-[#6B7280]"; // Hint row adjusted to match design with a smaller font

// export default function AboutCompanyForm() {
//   const router = useRouter();

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors, isSubmitting },
//   } = useForm<FormValues>({
//     resolver: yupResolver(aboutCompanySchema),
//     mode: "onSubmit",
//     defaultValues: {
//       mission: "",
//       values: "",
//       culture: "",
//       hrName: "",
//       hrEmail: "",
//       hrPhone: "",
//     },
//   });

//   const mission = watch("mission") || "";
//   const values = watch("values") || "";
//   const culture = watch("culture") || "";

//   const onSubmit = async () => {
//     router.push("/auth/onboarding-company/review-&-publish");
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className={CARD} noValidate>
//       {/* TOP BOX: Mission/Values/Culture */}
//       <div className={BOX}>
//         {/* Mission */}
//         <label className={LABEL}>Your company mission *</label>
//         <textarea
//           {...register("mission")}
//           className={TEXTAREA}
//           placeholder="Describe your company mission"
//         />
//         <div className={HINT_ROW}>
//           <span>500 - 1500 recommended</span>
//           <span>{mission.length}</span>
//         </div>
//         {errors.mission && <p className={ERROR}>{errors.mission.message}</p>}

//         {/* Values */}
//         <label className={`${LABEL} mt-4 block`}>Values *</label>
//         <textarea
//           {...register("values")}
//           className={TEXTAREA}
//           placeholder="Describe your company values"
//         />
//         <div className={HINT_ROW}>
//           <span>500 - 1500 recommended</span>
//           <span>{values.length}</span>
//         </div>
//         {errors.values && <p className={ERROR}>{errors.values.message}</p>}

//         {/* Culture */}
//         <label className={`${LABEL} mt-4 block`}>Work Culture *</label>
//         <textarea
//           {...register("culture")}
//           className={TEXTAREA}
//           placeholder="Describe your company work culture"
//         />
//         <div className={HINT_ROW}>
//           <span>500 - 1500 recommended</span>
//           <span>{culture.length}</span>
//         </div>
//         {errors.culture && <p className={ERROR}>{errors.culture.message}</p>}
//       </div>

//       {/* SECOND BOX: HR Contact Info */}
//       <div className={`mt-6 ${BOX}`}>
//         <p className="text-[14px] font-semibold text-[#111827]">
//           HR Contact information
//         </p>

//         <label className={`${LABEL} mt-4 block`}>Name *</label>
//         <input
//           {...register("hrName")}
//           className={INPUT}
//           placeholder="eg: Osaf Imran"
//         />
//         {errors.hrName && <p className={ERROR}>{errors.hrName.message}</p>}

//         <label className={`${LABEL} mt-4 block`}>Email *</label>
//         <input
//           {...register("hrEmail")}
//           className={INPUT}
//           placeholder="eg: aliosaid@gmail.com"
//         />
//         {errors.hrEmail && <p className={ERROR}>{errors.hrEmail.message}</p>}

//         <label className={`${LABEL} mt-4 block`}>Phone *</label>
//         <input
//           {...register("hrPhone")}
//           className={INPUT}
//           placeholder="+92-34567893"
//         />
//         {errors.hrPhone && <p className={ERROR}>{errors.hrPhone.message}</p>}
//       </div>

//       {/* Buttons */}
//       <div className="mt-6 flex flex-col sm:flex-row gap-4">
//         <button
//           type="button"
//           onClick={() => router.back()}
//           className="h-[48px] w-full sm:w-[120px] rounded-xl border border-[#E5E7EB] bg-white text-[14px] font-semibold text-[#111827]"
//         >
//           ‹ Back
//         </button>

//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="h-[48px] w-full sm:flex-1 rounded-xl bg-[#2F80FF] text-white text-[14px] font-semibold hover:bg-[#256DDB] disabled:opacity-60 disabled:cursor-not-allowed"
//         >
//           {isSubmitting ? "Starting..." : "Start"}
//         </button>
//       </div>
//     </form>
//   );
// }
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { aboutCompanySchema } from "./about-your-company-validation";

import { useOnboardingCompanyStore } from "@/store/onboarding-company.store";

type FormValues = {
  mission: string;
  values: string;
  culture: string;
  hrName: string;
  hrEmail: string;
  hrPhone: string;
};

const CARD =
  "w-full max-w-[650px] rounded-2xl border border-[#E5E7EB] bg-white p-8 sm:p-10";

const BOX = "rounded-xl border border-[#E5E7EB] bg-white p-6";
const LABEL = "text-[14px] font-semibold text-[#111827]";
const INPUT =
  "mt-2 w-full border border-[#E5E7EB] px-4 py-3 text-[14px] bg-white outline-none focus:border-[#000000] rounded-xl";

const TEXTAREA =
  "mt-2 w-full border border-[#E5E7EB] px-4 py-3 text-[14px] bg-white resize-none min-h-[120px] outline-none focus:border-[#000000] rounded-xl";

const ERROR = "mt-1 text-[12px] text-red-500";
const HINT_ROW =
  "mt-2 flex items-center justify-between text-[12px] text-[#6B7280]";

export default function AboutCompanyForm() {
  const router = useRouter();

  // ✅ STORE
  const aboutHr = useOnboardingCompanyStore((s) => s.aboutHr);
  const setAboutHr = useOnboardingCompanyStore((s) => s.setAboutHr);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(aboutCompanySchema),
    mode: "onSubmit",

    // ✅ PREFILL FROM STORE
    defaultValues: {
      mission: aboutHr.mission,
      values: aboutHr.values,
      culture: aboutHr.culture,
      hrName: aboutHr.hrName,
      hrEmail: aboutHr.hrEmail,
      hrPhone: aboutHr.hrPhone,
    },
  });

  const mission = watch("mission") || "";
  const values = watch("values") || "";
  const culture = watch("culture") || "";

  const onSubmit = async (data: FormValues) => {
    // ✅ SAVE TO STORE
    setAboutHr(data);

    // ✅ NEXT STEP
    router.push("/auth/onboarding-company/review-&-publish");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={CARD} noValidate>
      {/* Mission / Values / Culture */}
      <div className={BOX}>
        <label className={LABEL}>Your company mission *</label>
        <textarea
          {...register("mission")}
          className={TEXTAREA}
          placeholder="Describe your company mission"
        />
        <div className={HINT_ROW}>
          <span>500 - 1500 recommended</span>
          <span>{mission.length}</span>
        </div>
        {errors.mission && <p className={ERROR}>{errors.mission.message}</p>}

        <label className={`${LABEL} mt-4 block`}>Values *</label>
        <textarea
          {...register("values")}
          className={TEXTAREA}
          placeholder="Describe your company values"
        />
        <div className={HINT_ROW}>
          <span>500 - 1500 recommended</span>
          <span>{values.length}</span>
        </div>
        {errors.values && <p className={ERROR}>{errors.values.message}</p>}

        <label className={`${LABEL} mt-4 block`}>Work Culture *</label>
        <textarea
          {...register("culture")}
          className={TEXTAREA}
          placeholder="Describe your company work culture"
        />
        <div className={HINT_ROW}>
          <span>500 - 1500 recommended</span>
          <span>{culture.length}</span>
        </div>
        {errors.culture && <p className={ERROR}>{errors.culture.message}</p>}
      </div>

      {/* HR CONTACT */}
      <div className={`mt-6 ${BOX}`}>
        <p className="text-[14px] font-semibold text-[#111827]">
          HR Contact information
        </p>

        <label className={`${LABEL} mt-4 block`}>Name *</label>
        <input
          {...register("hrName")}
          className={INPUT}
          placeholder="eg: Osaf Imran"
        />
        {errors.hrName && <p className={ERROR}>{errors.hrName.message}</p>}

        <label className={`${LABEL} mt-4 block`}>Email *</label>
        <input
          {...register("hrEmail")}
          className={INPUT}
          placeholder="eg: aliosaid@gmail.com"
        />
        {errors.hrEmail && <p className={ERROR}>{errors.hrEmail.message}</p>}

        <label className={`${LABEL} mt-4 block`}>Phone *</label>
        <input
          {...register("hrPhone")}
          className={INPUT}
          placeholder="+92-34567893"
        />
        {errors.hrPhone && <p className={ERROR}>{errors.hrPhone.message}</p>}
      </div>

      {/* Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="h-[48px] w-full sm:w-[120px] rounded-xl border border-[#E5E7EB] bg-white text-[14px] font-semibold text-[#111827]"
        >
          ‹ Back
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-[48px] w-full sm:flex-1 rounded-xl bg-[#2F80FF] text-white text-[14px] font-semibold hover:bg-[#256DDB] disabled:opacity-60"
        >
          {isSubmitting ? "Starting..." : "Start"}
        </button>
      </div>
    </form>
  );
}
