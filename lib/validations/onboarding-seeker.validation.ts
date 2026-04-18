import { z } from 'zod';

export const onboardingSeekerSchema = z.object({
  title: z
    .string()
    .min(1, 'Job title is required.')
    .min(2, 'Job title must be at least 2 characters.'),
  preferredRole: z
    .string()
    .min(1, 'Preferred role is required.'),
  experience: z
    .string()
    .min(1, 'Years of experience is required.'),
  location: z
    .string()
    .min(1, 'Preferred location is required.'),
  expectedSalary: z.string().optional(),
});

export type OnboardingSeekerFormData = z.infer<typeof onboardingSeekerSchema>;

export function validateOnboardingSeekerForm(data: OnboardingSeekerFormData): Record<string, string> {
  const result = onboardingSeekerSchema.safeParse(data);
  if (result.success) return {};
  return Object.fromEntries(
    result.error.errors.map((e) => [e.path[0] as string, e.message]),
  );
}
