import * as yup from "yup";

export const companyForgotSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid company email")
    .required("Email is required"),
});

export type CompanyForgotValues = {
  email: string;
};
