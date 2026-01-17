"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedinIn } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface RegisterFormProps {
  userType?: "candidate" | "company";
}

const candidateSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const companySchema = yup.object({
  companyName: yup.string().required("Company name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

interface CandidateFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface CompanyFormValues {
  companyName: string;
  email: string;
  password: string;
}

export default function RegisterForm({
  userType = "candidate",
}: RegisterFormProps) {
  const isCompany = userType === "company";

  const form = useForm<CandidateFormValues | CompanyFormValues>({
    resolver: yupResolver(isCompany ? companySchema : candidateSchema),
    defaultValues: isCompany
      ? { companyName: "", email: "", password: "" }
      : { firstName: "", lastName: "", email: "", password: "" },
  });

  const onSubmit = (values: CandidateFormValues | CompanyFormValues) => {
    console.log(`${userType} register:`, values);
    // Handle registration logic here
  };

  const loginUrl = `/auth/login?type=${userType}`;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Company Name OR First/Last Name */}
        {isCompany ? (
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-gray-800">
                  Company Name
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter company name"
                    {...field}
                    className="h-12 rounded-md border-gray-300 focus:border-[#34A1CD] focus:ring-[#34A1CD]"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-800">
                    First Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="First Name"
                      {...field}
                      className="h-12 rounded-md border-gray-300 focus:border-[#34A1CD] focus:ring-[#34A1CD]"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-gray-800">
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Last Name"
                      {...field}
                      className="h-12 rounded-md border-gray-300 focus:border-[#34A1CD] focus:ring-[#34A1CD]"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-gray-800">
                {isCompany ? "Company Email" : "Email Address"}
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={
                    isCompany ? "company@example.com" : "Email Address"
                  }
                  {...field}
                  className="h-12 rounded-md border-gray-300 focus:border-[#34A1CD] focus:ring-[#34A1CD]"
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-gray-800">
                Password
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Password"
                  {...field}
                  className="h-12 rounded-md border-gray-300 focus:border-[#34A1CD] focus:ring-[#34A1CD]"
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center">
          By signing up you agree to our{" "}
          <a
            href="/terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#34A1CD] hover:underline"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#34A1CD] hover:underline"
          >
            Privacy Policy
          </a>
          .
        </p>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 bg-[#34A1CD] hover:bg-[#2E92BA] text-white rounded-full font-medium"
        >
          Register
        </Button>

        {/* Login link */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href={loginUrl}
            className="text-[#34A1CD] hover:underline font-medium"
          >
            Log in
          </a>
        </p>

        {/* Divider */}
        <div className="flex items-center gap-2 my-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-gray-400 text-sm">Or register with</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Social Buttons */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-300 rounded-full py-2.5 text-sm hover:bg-gray-50 transition"
          >
            <FcGoogle className="text-xl" />
            Continue with Google
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-300 rounded-full py-2.5 text-sm hover:bg-gray-50 transition"
          >
            <FaLinkedinIn className="text-[#0077B5] text-lg" />
            Continue with LinkedIn
          </button>
        </div>
      </form>
    </Form>
  );
}
