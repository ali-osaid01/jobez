import * as yup from "yup";

export const companyLoginSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid company email")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});
