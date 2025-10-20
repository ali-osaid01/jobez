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
import { companyLoginSchema } from "./login.validation";

type CompanyLoginValues = {
  email: string;
  password: string;
};

export default function CompanyLoginForm(): React.ReactNode {
  const form = useForm<CompanyLoginValues>({
    resolver: yupResolver(companyLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: CompanyLoginValues) =>
    console.log("Company Login Data:", values);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#1E1E1E]">Company Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter company email"
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
                  href="/company/forgot-password"
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

        {/* Remember Me */}
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
          className="w-full h-12 bg-[#2CA0E2] hover:bg-[#2184c5] text-white rounded-full font-medium"
        >
          Log In
        </Button>

        {/* Footer Links */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Don’t have a company account?{" "}
          <a
            href="/company/register"
            className="text-[#2CA0E2] font-medium hover:underline"
          >
            Register here
          </a>
        </p>

        {/* Divider */}
        <div className="flex items-center justify-center my-6">
          <span className="h-px w-1/3 bg-gray-200"></span>
          <span className="mx-2 text-gray-400 text-sm">or continue with</span>
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
      </form>
    </Form>
  );
}
