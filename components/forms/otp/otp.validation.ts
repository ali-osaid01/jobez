import * as yup from "yup";

export interface OTPFormValues {
  otp: string[];
}

export const otpSchema = yup.object({
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
