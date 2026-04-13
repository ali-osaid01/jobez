import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required.')
    .email('Please enter a valid email address.'),
  password: z
    .string()
    .min(1, 'Password is required.'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export function validateLoginForm(data: LoginFormData): Record<string, string> {
  const result = loginSchema.safeParse(data);
  if (result.success) return {};
  return Object.fromEntries(
    result.error.errors.map((e) => [e.path[0] as string, e.message]),
  );
}
