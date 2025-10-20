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
import { registerSchema } from "./register.validation";

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterForm(): React.ReactNode {
  const form = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: RegisterFormValues) =>
    console.log("Register form values:", values);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-5">
        {/* First + Last Name */}
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
                    className="h-12 rounded-md border-gray-300 focus:border-[#2CA0E2] focus:ring-[#2CA0E2]"
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
                    className="h-12 rounded-md border-gray-300 focus:border-[#2CA0E2] focus:ring-[#2CA0E2]"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />
        </div>

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-gray-800">
                Email Address
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Email Address"
                  {...field}
                  className="h-12 rounded-md border-gray-300 focus:border-[#2CA0E2] focus:ring-[#2CA0E2]"
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
                  className="h-12 rounded-md border-gray-300 focus:border-[#2CA0E2] focus:ring-[#2CA0E2]"
                />
              </FormControl>
              <FormMessage className="text-red-500 text-sm" />
            </FormItem>
          )}
        />

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center">
          By signing up you agree to our{" "}
          <a href="#" className="text-[#2CA0E2] hover:underline">
            Terms and Conditions
          </a>{" "}
          and{" "}
          <a href="#" className="text-[#2CA0E2] hover:underline">
            Privacy Policy
          </a>.
        </p>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-[#2CA0E2] hover:bg-[#2184c5] text-white rounded-full py-3 font-medium"
        >
          Register
        </Button>

        {/* Login link */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/auth/login" className="text-[#2CA0E2] hover:underline font-medium">
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
