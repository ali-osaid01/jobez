// "use client";

// import React, { useRef, useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import companyBrandingSchema from "./company-branding-validation"; // ✅ same folder

// type UploadState = {
//   file: File | null;
//   previewUrl: string | null;
// };

// type FieldErrors = {
//   companyLogo?: string;
//   coverImage?: string;
// };

// const ERROR_TEXT = "mt-2 text-[12px] text-red-600";

// const CARD =
//   "w-full max-w-[720px] rounded-2xl border border-[#E5E7EB] bg-white px-5 py-5 sm:px-7 sm:py-7";

// const BLOCK = "rounded-xl border border-[#E5E7EB] bg-white p-4 sm:p-5";

// const LABEL = "text-[14px] font-semibold text-[#111827]";

// const DROPZONE =
//   "mt-3 w-full rounded-xl border border-dashed border-[#D1D5DB] bg-white " +
//   "h-[150px] sm:h-[170px] flex items-center justify-center text-center " +
//   "cursor-pointer hover:bg-[#F9FAFB] transition";

// const BTN_OUTLINE =
//   "h-[36px] px-4 rounded-lg border border-[#E5E7EB] bg-white text-[13px] font-semibold text-[#111827] " +
//   "hover:bg-[#F9FAFB] transition inline-flex items-center gap-2";

// const BTN_PRIMARY =
//   "h-[52px] w-full sm:flex-1 rounded-xl bg-[#2F80FF] hover:bg-[#256DDB] text-white text-[14px] font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed";

// const BTN_BACK =
//   "h-[52px] w-full sm:w-[120px] rounded-xl border border-[#E5E7EB] bg-white text-[14px] font-semibold text-[#111827] " +
//   "hover:bg-[#F9FAFB] transition inline-flex items-center justify-center gap-2";

// function UploadIcon() {
//   return (
//     <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//       <path
//         d="M12 16V4m0 0l-4 4m4-4l4 4"
//         stroke="#6B7280"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <path d="M4 20h16" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
//     </svg>
//   );
// }

// function CloseIcon() {
//   return (
//     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//       <path
//         d="M18 6L6 18M6 6l12 12"
//         stroke="#111827"
//         strokeWidth="2"
//         strokeLinecap="round"
//       />
//     </svg>
//   );
// }

// export default function CompanyBrandingForm() {
//   const router = useRouter();

//   const logoInputRef = useRef<HTMLInputElement>(null);
//   const coverInputRef = useRef<HTMLInputElement>(null);

//   const [logo, setLogo] = useState<UploadState>({ file: null, previewUrl: null });
//   const [cover, setCover] = useState<UploadState>({ file: null, previewUrl: null });

//   // ✅ NEW: validation errors state
//   const [errors, setErrors] = useState<FieldErrors>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // cleanup object URLs (avoid memory leak)
//   useEffect(() => {
//     return () => {
//       if (logo.previewUrl) URL.revokeObjectURL(logo.previewUrl);
//       if (cover.previewUrl) URL.revokeObjectURL(cover.previewUrl);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const setFile = (
//     file: File | null,
//     current: UploadState,
//     setter: React.Dispatch<React.SetStateAction<UploadState>>,
//     field: keyof FieldErrors
//   ) => {
//     if (!file) return;

//     if (current.previewUrl) URL.revokeObjectURL(current.previewUrl);
//     const url = URL.createObjectURL(file);
//     setter({ file, previewUrl: url });

//     // ✅ clear that field error when user selects file
//     setErrors((prev) => ({ ...prev, [field]: undefined }));
//   };

//   const removeFile = (
//     current: UploadState,
//     setter: React.Dispatch<React.SetStateAction<UploadState>>,
//     field: keyof FieldErrors,
//     inputRef: React.RefObject<HTMLInputElement>
//   ) => {
//     if (current.previewUrl) URL.revokeObjectURL(current.previewUrl);
//     setter({ file: null, previewUrl: null });

//     // ✅ clear file input so same file can be selected again
//     if (inputRef.current) inputRef.current.value = "";

//     // ✅ show required error immediately after remove
//     setErrors((prev) => ({
//       ...prev,
//       [field]: field === "companyLogo" ? "Company logo is required" : "Cover image is required",
//     }));
//   };

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     setIsSubmitting(true);
//     setErrors({});

//     try {
//       // ✅ RUN YUP VALIDATION
//       await companyBrandingSchema.validate(
//         {
//           companyLogo: logo.file,
//           coverImage: cover.file,
//         },
//         { abortEarly: false }
//       );

//       // ✅ only if valid
//      router.push("/auth/onboarding-company/about-your-company");

//     } catch (err: any) {
//       const nextErrors: FieldErrors = {};

//       // ✅ yup multiple errors
//       if (err?.inner?.length) {
//         err.inner.forEach((x: any) => {
//           if (x.path && !nextErrors[x.path as keyof FieldErrors]) {
//             nextErrors[x.path as keyof FieldErrors] = x.message;
//           }
//         });
//       } else if (err?.path) {
//         nextErrors[err.path as keyof FieldErrors] = err.message;
//       }

//       setErrors(nextErrors);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <form onSubmit={onSubmit} className={CARD} noValidate>
//       {/* Company Logo */}
//       <div className={BLOCK}>
//         <p className={LABEL}>Company Logo</p>

//         <input
//           ref={logoInputRef}
//           type="file"
//           accept="image/png,image/jpeg,image/jpg"
//           className="hidden"
//           onChange={(e) => setFile(e.target.files?.[0] ?? null, logo, setLogo, "companyLogo")}
//         />

//         {!logo.previewUrl ? (
//           <div
//             role="button"
//             tabIndex={0}
//             onClick={() => logoInputRef.current?.click()}
//             onKeyDown={(e) =>
//               e.key === "Enter" || e.key === " " ? logoInputRef.current?.click() : null
//             }
//             className={DROPZONE}
//           >
//             <div className="px-4">
//               <div className="mx-auto mb-2 flex items-center justify-center">
//                 <UploadIcon />
//               </div>
//               <p className="text-[14px] font-semibold text-[#111827]">Click to upload</p>
//               <p className="mt-1 text-[12px] text-[#6B7280]">PNG or JPG, up to 5MB</p>
//             </div>
//           </div>
//         ) : (
//           <div className="mt-4">
//             <div className="relative h-[110px] w-[110px] rounded-xl overflow-hidden border border-[#E5E7EB] bg-white">
//               <Image
//                 src={logo.previewUrl}
//                 alt="Company logo preview"
//                 fill
//                 sizes="110px"
//                 className="object-cover"
//                 unoptimized
//               />
//             </div>

//             <div className="mt-3 flex flex-wrap gap-3">
//               <button
//                 type="button"
//                 onClick={() => removeFile(logo, setLogo, "companyLogo", logoInputRef)}
//                 className={BTN_OUTLINE}
//               >
//                 <CloseIcon /> Remove
//               </button>

//               <button type="button" onClick={() => logoInputRef.current?.click()} className={BTN_OUTLINE}>
//                 Replace
//               </button>
//             </div>
//           </div>
//         )}

//         {errors.companyLogo ? <p className={ERROR_TEXT}>{errors.companyLogo}</p> : null}
//       </div>

//       {/* Cover Image */}
//       <div className={`mt-4 sm:mt-5 ${BLOCK}`}>
//         <p className={LABEL}>Cover Image</p>

//         <input
//           ref={coverInputRef}
//           type="file"
//           accept="image/png,image/jpeg,image/jpg"
//           className="hidden"
//           onChange={(e) => setFile(e.target.files?.[0] ?? null, cover, setCover, "coverImage")}
//         />

//         {!cover.previewUrl ? (
//           <div
//             role="button"
//             tabIndex={0}
//             onClick={() => coverInputRef.current?.click()}
//             onKeyDown={(e) =>
//               e.key === "Enter" || e.key === " " ? coverInputRef.current?.click() : null
//             }
//             className={DROPZONE}
//           >
//             <div className="px-4">
//               <div className="mx-auto mb-2 flex items-center justify-center">
//                 <UploadIcon />
//               </div>
//               <p className="text-[14px] font-semibold text-[#111827]">Click to upload</p>
//               <p className="mt-1 text-[12px] text-[#6B7280]">
//                 PNG or JPG, recommended: 1200×400px
//               </p>
//             </div>
//           </div>
//         ) : (
//           <div className="mt-4">
//             <div className="relative h-[140px] w-full rounded-xl overflow-hidden border border-[#E5E7EB] bg-white">
//               <Image
//                 src={cover.previewUrl}
//                 alt="Cover image preview"
//                 fill
//                 sizes="(max-width: 768px) 100vw, 720px"
//                 className="object-cover"
//                 unoptimized
//               />
//             </div>

//             <div className="mt-3 flex flex-wrap gap-3">
//               <button
//                 type="button"
//                 onClick={() => removeFile(cover, setCover, "coverImage", coverInputRef)}
//                 className={BTN_OUTLINE}
//               >
//                 <CloseIcon /> Remove
//               </button>

//               <button type="button" onClick={() => coverInputRef.current?.click()} className={BTN_OUTLINE}>
//                 Replace
//               </button>
//             </div>
//           </div>
//         )}

//         {errors.coverImage ? <p className={ERROR_TEXT}>{errors.coverImage}</p> : null}
//       </div>

//       {/* Buttons */}
//       <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
//         <button type="button" onClick={() => router.back()} className={BTN_BACK}>
//           <span className="text-[18px] leading-none">‹</span> Back
//         </button>

//         <button type="submit" className={BTN_PRIMARY} disabled={isSubmitting}>
//           {isSubmitting ? "Starting..." : "Start"}
//         </button>
//       </div>
//     </form>
//   );
// }
"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import companyBrandingSchema from "./company-branding-validation";

import { useOnboardingCompanyStore } from "@/store/onboarding-company.store";

type UploadState = {
  file: File | null;
  previewUrl: string | null; // local object URL for instant preview
};

type FieldErrors = {
  companyLogo?: string;
  coverImage?: string;
};

const ERROR_TEXT = "mt-2 text-[12px] text-red-600";

const CARD =
  "w-full max-w-[720px] rounded-2xl border border-[#E5E7EB] bg-white px-5 py-5 sm:px-7 sm:py-7";

const BLOCK = "rounded-xl border border-[#E5E7EB] bg-white p-4 sm:p-5";

const LABEL = "text-[14px] font-semibold text-[#111827]";

const DROPZONE =
  "mt-3 w-full rounded-xl border border-dashed border-[#D1D5DB] bg-white " +
  "h-[150px] sm:h-[170px] flex items-center justify-center text-center " +
  "cursor-pointer hover:bg-[#F9FAFB] transition";

const BTN_OUTLINE =
  "h-[36px] px-4 rounded-lg border border-[#E5E7EB] bg-white text-[13px] font-semibold text-[#111827] " +
  "hover:bg-[#F9FAFB] transition inline-flex items-center gap-2";

const BTN_PRIMARY =
  "h-[52px] w-full sm:flex-1 rounded-xl bg-[#2F80FF] hover:bg-[#256DDB] text-white text-[14px] font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed";

const BTN_BACK =
  "h-[52px] w-full sm:w-[120px] rounded-xl border border-[#E5E7EB] bg-white text-[14px] font-semibold text-[#111827] " +
  "hover:bg-[#F9FAFB] transition inline-flex items-center justify-center gap-2";

function UploadIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 16V4m0 0l-4 4m4-4l4 4"
        stroke="#6B7280"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 20h16" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="#111827"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ✅ helper: file -> base64 dataURL (for store)
const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function CompanyBrandingForm() {
  const router = useRouter();

  // ✅ store
  const branding = useOnboardingCompanyStore((s) => s.branding);
  const setBranding = useOnboardingCompanyStore((s) => s.setBranding);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [logo, setLogo] = useState<UploadState>({ file: null, previewUrl: null });
  const [cover, setCover] = useState<UploadState>({ file: null, previewUrl: null });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Prefill preview from store (when user comes back)
  useEffect(() => {
    // if user already saved base64 in store, show it as preview (no file needed)
    if (branding.logoDataUrl && !logo.previewUrl) {
      setLogo({ file: null, previewUrl: branding.logoDataUrl });
    }
    if (branding.coverDataUrl && !cover.previewUrl) {
      setCover({ file: null, previewUrl: branding.coverDataUrl });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branding.logoDataUrl, branding.coverDataUrl]);

  // cleanup object URLs (avoid memory leak)
  useEffect(() => {
    return () => {
      // NOTE: base64 URLs should NOT be revoked, only object URLs
      if (logo.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(logo.previewUrl);
      if (cover.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(cover.previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setFile = (
    file: File | null,
    current: UploadState,
    setter: React.Dispatch<React.SetStateAction<UploadState>>,
    field: keyof FieldErrors
  ) => {
    if (!file) return;

    // revoke old object URL only
    if (current.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(current.previewUrl);

    const url = URL.createObjectURL(file);
    setter({ file, previewUrl: url });

    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const removeFile = (
    current: UploadState,
    setter: React.Dispatch<React.SetStateAction<UploadState>>,
    field: keyof FieldErrors,
    inputRef: React.RefObject<HTMLInputElement>,
    storeKey: "logoDataUrl" | "coverDataUrl"
  ) => {
    if (current.previewUrl?.startsWith("blob:")) URL.revokeObjectURL(current.previewUrl);
    setter({ file: null, previewUrl: null });

    if (inputRef.current) inputRef.current.value = "";

    // ✅ also clear from store
    setBranding({ [storeKey]: "" });

    setErrors((prev) => ({
      ...prev,
      [field]: field === "companyLogo" ? "Company logo is required" : "Cover image is required",
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrors({});

    try {
      // ✅ validate files OR existing store/base64 previews
      const logoFileToValidate = logo.file ?? (branding.logoDataUrl ? ({} as File) : null);
      const coverFileToValidate = cover.file ?? (branding.coverDataUrl ? ({} as File) : null);

      // If user already has base64 saved, skip file validation by passing dummy object (schema requires something)
      await companyBrandingSchema.validate(
        {
          companyLogo: logo.file ?? (branding.logoDataUrl ? (new File([], "logo.png") as any) : null),
          coverImage: cover.file ?? (branding.coverDataUrl ? (new File([], "cover.png") as any) : null),
        },
        { abortEarly: false }
      );

      // ✅ If new files selected, convert to base64 and store them
      if (logo.file) {
        const logoDataUrl = await fileToDataUrl(logo.file);
        setBranding({ logoDataUrl });
      }

      if (cover.file) {
        const coverDataUrl = await fileToDataUrl(cover.file);
        setBranding({ coverDataUrl });
      }

      router.push("/auth/onboarding-company/about-your-company");
    } catch (err: any) {
      const nextErrors: FieldErrors = {};

      if (err?.inner?.length) {
        err.inner.forEach((x: any) => {
          if (x.path && !nextErrors[x.path as keyof FieldErrors]) {
            nextErrors[x.path as keyof FieldErrors] = x.message;
          }
        });
      } else if (err?.path) {
        nextErrors[err.path as keyof FieldErrors] = err.message;
      }

      setErrors(nextErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className={CARD} noValidate>
      {/* Company Logo */}
      <div className={BLOCK}>
        <p className={LABEL}>Company Logo</p>

        <input
          ref={logoInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null, logo, setLogo, "companyLogo")}
        />

        {!logo.previewUrl ? (
          <div
            role="button"
            tabIndex={0}
            onClick={() => logoInputRef.current?.click()}
            onKeyDown={(e) =>
              e.key === "Enter" || e.key === " " ? logoInputRef.current?.click() : null
            }
            className={DROPZONE}
          >
            <div className="px-4">
              <div className="mx-auto mb-2 flex items-center justify-center">
                <UploadIcon />
              </div>
              <p className="text-[14px] font-semibold text-[#111827]">Click to upload</p>
              <p className="mt-1 text-[12px] text-[#6B7280]">PNG or JPG, up to 5MB</p>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <div className="relative h-[110px] w-[110px] rounded-xl overflow-hidden border border-[#E5E7EB] bg-white">
              <Image
                src={logo.previewUrl}
                alt="Company logo preview"
                fill
                sizes="110px"
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  removeFile(logo, setLogo, "companyLogo", logoInputRef, "logoDataUrl")
                }
                className={BTN_OUTLINE}
              >
                <CloseIcon /> Remove
              </button>

              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className={BTN_OUTLINE}
              >
                Replace
              </button>
            </div>
          </div>
        )}

        {errors.companyLogo ? <p className={ERROR_TEXT}>{errors.companyLogo}</p> : null}
      </div>

      {/* Cover Image */}
      <div className={`mt-4 sm:mt-5 ${BLOCK}`}>
        <p className={LABEL}>Cover Image</p>

        <input
          ref={coverInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null, cover, setCover, "coverImage")}
        />

        {!cover.previewUrl ? (
          <div
            role="button"
            tabIndex={0}
            onClick={() => coverInputRef.current?.click()}
            onKeyDown={(e) =>
              e.key === "Enter" || e.key === " " ? coverInputRef.current?.click() : null
            }
            className={DROPZONE}
          >
            <div className="px-4">
              <div className="mx-auto mb-2 flex items-center justify-center">
                <UploadIcon />
              </div>
              <p className="text-[14px] font-semibold text-[#111827]">Click to upload</p>
              <p className="mt-1 text-[12px] text-[#6B7280]">
                PNG or JPG, recommended: 1200×400px
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <div className="relative h-[140px] w-full rounded-xl overflow-hidden border border-[#E5E7EB] bg-white">
              <Image
                src={cover.previewUrl}
                alt="Cover image preview"
                fill
                sizes="(max-width: 768px) 100vw, 720px"
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  removeFile(cover, setCover, "coverImage", coverInputRef, "coverDataUrl")
                }
                className={BTN_OUTLINE}
              >
                <CloseIcon /> Remove
              </button>

              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className={BTN_OUTLINE}
              >
                Replace
              </button>
            </div>
          </div>
        )}

        {errors.coverImage ? <p className={ERROR_TEXT}>{errors.coverImage}</p> : null}
      </div>

      {/* Buttons */}
      <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button type="button" onClick={() => router.back()} className={BTN_BACK}>
          <span className="text-[18px] leading-none">‹</span> Back
        </button>

        <button type="submit" className={BTN_PRIMARY} disabled={isSubmitting}>
          {isSubmitting ? "Starting..." : "Start"}
        </button>
      </div>
    </form>
  );
}
