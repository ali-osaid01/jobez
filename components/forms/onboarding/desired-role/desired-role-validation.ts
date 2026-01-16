import * as yup from "yup";

export const desiredRoleSchema = yup.object({
  desiredRole: yup
    .string()
    .required("Desired role is required")
    .min(2, "Please enter at least 2 characters"),
});
