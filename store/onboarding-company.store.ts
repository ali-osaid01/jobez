import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type BasicInfoState = {
  companyName: string;
  websiteUrl: string;
  industry: string;
  headquarters: string; // ✅ consistent name
  companySize: string;
};

type BrandingState = {
  logoDataUrl: string; // base64
  coverDataUrl: string; // base64
};

type AboutHrState = {
  mission: string;
  values: string;
  culture: string;
  hrName: string;
  hrEmail: string;
  hrPhone: string;
};

type OnboardingCompanyStore = {
  hasHydrated: boolean;

  basic: BasicInfoState;
  branding: BrandingState;
  aboutHr: AboutHrState;

  setBasic: (data: Partial<BasicInfoState>) => void;
  setBranding: (data: Partial<BrandingState>) => void;
  setAboutHr: (data: Partial<AboutHrState>) => void;

  resetAll: () => void;
};

const emptyBasic: BasicInfoState = {
  companyName: "",
  websiteUrl: "",
  industry: "",
  headquarters: "",
  companySize: "",
};

const emptyBranding: BrandingState = {
  logoDataUrl: "",
  coverDataUrl: "",
};

const emptyAboutHr: AboutHrState = {
  mission: "",
  values: "",
  culture: "",
  hrName: "",
  hrEmail: "",
  hrPhone: "",
};

// ✅ sessionStorage (onboarding friendly)
const storage =
  typeof window !== "undefined"
    ? createJSONStorage(() => sessionStorage)
    : undefined;

export const useOnboardingCompanyStore = create<OnboardingCompanyStore>()(
  persist(
    (set) => ({
      hasHydrated: false,

      basic: emptyBasic,
      branding: emptyBranding,
      aboutHr: emptyAboutHr,

      setBasic: (data) =>
        set((state) => ({
          basic: { ...state.basic, ...data },
        })),

      setBranding: (data) =>
        set((state) => ({
          branding: { ...state.branding, ...data },
        })),

      setAboutHr: (data) =>
        set((state) => ({
          aboutHr: { ...state.aboutHr, ...data },
        })),

      resetAll: () =>
        set({
          basic: emptyBasic,
          branding: emptyBranding,
          aboutHr: emptyAboutHr,
        }),
    }),
    {
      name: "onboarding-company-storage",
      storage,
      partialize: (state) => ({
        basic: state.basic,
        branding: state.branding,
        aboutHr: state.aboutHr,
      }),
      onRehydrateStorage: () => (state) => {
        state?.hasHydrated && state.hasHydrated; // no-op safe
        // ✅ mark hydration done
        if (state) state.hasHydrated = true;
      },
    }
  )
);
