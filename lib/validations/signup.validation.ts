import { z } from 'zod';

export const signupSchema = z.object({
  name: z
    .string()
    .min(1, 'Full name is required.')
    .min(2, 'Name must be at least 2 characters.'),
  email: z
    .email()
    .min(1, 'Email is required.'),
  phone: z
    .string()
    .min(1, 'Phone number is required.')
    .regex(/^\+?[\d\s\-()]+$/, 'Phone number can only contain digits, spaces, +, -, and parentheses.')
    .refine((val) => val.replace(/\D/g, '').length >= 10, {
      message: 'Phone number must have at least 10 digits.',
    }),
  password: z
    .string()
    .min(1, 'Password is required.')
    .min(6, 'Password must be at least 6 characters.'),
});

export type SignupFormData = z.infer<typeof signupSchema>;

export function validateSignupForm(data: SignupFormData): Record<string, string> {
  const result = signupSchema.safeParse(data);
  if (result.success) return {};
  return Object.fromEntries(
    result.error.errors.map((e) => [e.path[0] as string, e.message]),
  );
}
