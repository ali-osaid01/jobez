import * as yup from "yup";

export interface CompanyResetFormValues {
  newPassword: string;
  confirmPassword: string;
}

export const companyResetSchema = yup.object({
  newPassword: yup
    .string()
    .min(8, "At least 8 characters")
    .matches(/[A-Z]/, "Must include an uppercase letter (A-Z)")
    .matches(/[a-z]/, "Must include a lowercase letter (a-z)")
    .matches(/[0-9]/, "Must include a number (0-9)")
    .matches(/[^A-Za-z0-9]/, "Must include a special character (!@#$...)")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords do not match")
    .required("Please confirm your password"),
});
