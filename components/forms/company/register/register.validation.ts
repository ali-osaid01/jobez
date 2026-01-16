import * as z from "zod";

export const companyRegisterSchema = z.object({
  companyName: z.string().min(2, "Enter company name").optional(),
  industry: z.string().min(2, "Enter industry type").optional(),
  companyPhone: z.string().min(10, "Enter valid phone number").optional(),
  companyWebsite: z.string().url("Enter valid website URL").optional(),
  employeeFirst: z.string().min(2, "First name required"),
  employeeLast: z.string().min(2, "Last name required"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Must include uppercase, lowercase, number & special character"
    ),
});
