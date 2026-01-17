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

interface LoginFormProps {
  userType?: "candidate" | "company";
}

const loginSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginForm({ userType = "candidate" }: LoginFormProps) {
  const form = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginFormValues) => {
    console.log(`${userType} login:`, values);
    // Handle login logic here
  };

  const isCompany = userType === "company";
  const forgotPasswordUrl = `/auth/forgot-password?type=${userType}`;
  const registerUrl = `/auth/register?type=${userType}`;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#1E1E1E]">
                {isCompany ? "Company Email" : "Email Address"}
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={
                    isCompany ? "Enter company email" : "Email Address"
                  }
                  className="h-12 rounded-md"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel className="text-[#1E1E1E]">Password</FormLabel>
                <a
                  href={forgotPasswordUrl}
                  className="text-[#34A1CD] text-sm font-medium hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  className="h-12 rounded-md"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Remember Device */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            id="remember"
            className="w-4 h-4 accent-[#34A1CD]"
          />
          <label htmlFor="remember">Remember this device</label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 bg-[#34A1CD] hover:bg-[#2E92BA] text-white rounded-full font-medium"
        >
          Sign in
        </Button>

        {/* Footer Links */}
        <p className="text-center text-gray-500 text-sm mt-6">
          {isCompany
            ? "Don't have a company account? "
            : "Don't have an account? "}
          <a
            href={registerUrl}
            className="text-[#34A1CD] font-medium hover:underline"
          >
            {isCompany ? "Register here" : "Register"}
          </a>
        </p>

        {/* Divider */}
        <div className="flex items-center justify-center my-6">
          <span className="h-px w-1/3 bg-gray-200"></span>
          <span className="mx-2 text-gray-400 text-sm">
            {isCompany ? "or continue with" : "Or log in with"}
          </span>
          <span className="h-px w-1/3 bg-gray-200"></span>
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

        {/* Legal Links */}
        <p className="text-center text-xs text-gray-500 mt-6">
          By continuing, you agree to our{" "}
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
      </form>
    </Form>
  );
}
