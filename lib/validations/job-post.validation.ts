import { z } from 'zod';

const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const jobPostSchema = z.object({
  title: z
    .string()
    .min(1, 'Job title is required.')
    .min(3, 'Job title must be at least 3 characters.')
    .max(255, 'Job title must be under 255 characters.'),
  location: z
    .string()
    .min(1, 'Location is required.'),
  locationType: z.enum(['Remote', 'On-site', 'Hybrid'], {
    errorMap: () => ({ message: 'Location type is required.' }),
  }),
  type: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship'], {
    errorMap: () => ({ message: 'Job type is required.' }),
  }),
  experienceLevel: z.enum(['Entry', 'Mid', 'Senior', 'Lead'], {
    errorMap: () => ({ message: 'Experience level is required.' }),
  }),
  salary: z
    .string()
    .min(1, 'Salary range is required.'),
  description: z
    .string()
    .min(1, 'Description is required.')
    .min(50, 'Description must be at least 50 characters.'),
  applicationDeadline: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return new Date(val) >= today();
      },
      { message: 'Deadline must be today or a future date.' },
    ),
});

export type JobPostFormData = z.infer<typeof jobPostSchema>;

export function validateJobPostForm(data: JobPostFormData): Record<string, string> {
  const result = jobPostSchema.safeParse(data);
  if (result.success) return {};
  return Object.fromEntries(
    result.error.errors.map((e) => [e.path[0] as string, e.message]),
  );
}
