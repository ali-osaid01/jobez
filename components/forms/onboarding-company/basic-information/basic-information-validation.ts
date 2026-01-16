import * as yup from "yup";

export const basicInformationSchema = yup.object({
  companyName: yup
    .string()
    .trim()
    .required("Company Name is required")
    .min(2, "Minimum 2 characters"),

  websiteUrl: yup
    .string()
    .trim()
    .required("Website URL is required")
    .url("Enter a valid URL (e.g. https://example.com)"),

  industry: yup.string().trim().required("Industry is required"),

  headquartersLocation: yup
    .string()
    .trim()
    .required("Headquarters Location is required")
    .min(2, "Minimum 2 characters"),

  companySize: yup.string().trim().required("Company size is required"),
});
