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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface ForgotPasswordFormProps {
  userType?: "candidate" | "company";
}

const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});

interface ForgotPasswordFormValues {
  email: string;
}

export default function ForgotPasswordForm({
  userType = "candidate",
}: ForgotPasswordFormProps) {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    console.log(`${userType} forgot password:`, values);
    // Handle forgot password logic here
  };

  const loginUrl = `/auth/login?type=${userType}`;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#1E1E1E] font-semibold">
                Email Address
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your registered email"
                  className="h-12 rounded-md"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 bg-[#34A1CD] hover:bg-[#2E92BA] text-white rounded-full font-medium"
        >
          Send OTP
        </Button>

        {/* Back to Login */}
        <p className="text-center text-sm text-gray-600">
          Remember your password?{" "}
          <a
            href={loginUrl}
            className="text-[#34A1CD] hover:underline font-medium"
          >
            Back to login
          </a>
        </p>
      </form>
    </Form>
  );
}
