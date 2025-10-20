import * as yup from "yup";

export interface CompanyOTPFormValues {
  otp: string[];
}

export const companyOTPSchema = yup.object({
  otp: yup
    .array()
    .of(
      yup
        .string()
        .required("Required")
        .matches(/^[0-9]$/, "Only numbers allowed")
    )
    .length(4, "Must be 4 digits")
    .required("OTP is required"),
});
