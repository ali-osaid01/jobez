import * as yup from "yup";

export const reviewAndPublishSchema = yup.object({
  companyName: yup.string().required(),
  websiteUrl: yup.string().required(),
  industry: yup.string().required(),
  headquarters: yup.string().required(),
  companySize: yup.string().required(),

  logoDataUrl: yup.string().required(),
  coverDataUrl: yup.string().required(),

  mission: yup.string().required(),
  values: yup.string().required(),
  culture: yup.string().required(),

  hrName: yup.string().required(),
  hrEmail: yup.string().required(),
  hrPhone: yup.string().required(),
});

export type ReviewAndPublishValues = yup.InferType<typeof reviewAndPublishSchema>;