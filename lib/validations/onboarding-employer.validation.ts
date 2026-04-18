import { z } from 'zod';

export const onboardingEmployerSchema = z.object({
  companyName: z
    .string()
    .min(1, 'Company name is required.')
    .min(2, 'Company name must be at least 2 characters.'),
  industry: z
    .string()
    .min(1, 'Industry is required.'),
  companySize: z
    .string()
    .min(1, 'Company size is required.'),
  location: z
    .string()
    .min(1, 'Company location is required.'),
  website: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        try { new URL(val); return true; } catch { return false; }
      },
      { message: 'Please enter a valid URL (e.g. https://example.com).' },
    ),
  description: z.string().optional(),
});

export type OnboardingEmployerFormData = z.infer<typeof onboardingEmployerSchema>;

export function validateOnboardingEmployerForm(data: OnboardingEmployerFormData): Record<string, string> {
  const result = onboardingEmployerSchema.safeParse(data);
  if (result.success) return {};
  return Object.fromEntries(
    result.error.errors.map((e) => [e.path[0] as string, e.message]),
  );
}
