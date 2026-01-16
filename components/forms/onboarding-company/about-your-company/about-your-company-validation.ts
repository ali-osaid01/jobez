import * as yup from "yup";

const MIN = 50  ;
const MAX = 1500;

const longText = (label: string) =>
  yup
    .string()
    .required(`${label} is required`)
    .min(MIN, `${label} must be at least ${MIN} characters`)
    .max(MAX, `${label} must be at most ${MAX} characters`);

export const aboutCompanySchema = yup.object({
  mission: longText("Company mission"),
  values: longText("Company values"),
  culture: longText("Work culture"),
  hrName: yup.string().required("HR name is required"),
  hrEmail: yup.string().email("Invalid email").required("HR email is required"),
  hrPhone: yup.string().required("HR phone is required"),
});
