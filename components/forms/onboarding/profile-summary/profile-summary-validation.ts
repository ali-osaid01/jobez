import * as yup from "yup";

export const profileSummarySchema = yup.object({
  name: yup.string().required("Name is required").min(2, "Minimum 2 characters"),

  currentRole: yup
    .string()
    .required("Current Role is required")
    .min(2, "Minimum 2 characters"),

  topSkills: yup
    .array()
    .of(yup.string().trim().min(1))
    .min(1, "Add at least 1 skill")
    .required("Skills are required"),

  experienceYears: yup.string().required("Experience is required"),
});
