import * as yup from "yup";

export const preferredLocationSchema = yup.object({
  preferredLocation: yup
    .string()
    .required("Preferred location is required")
    .min(2, "Please enter at least 2 characters"),
});
