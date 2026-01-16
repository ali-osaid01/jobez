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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "./login.validation";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginForm(): React.ReactNode {
  const form = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginFormValues) =>
    console.log("Login form values:", values);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#1E1E1E]">Email Address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Email Address"
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
                  href="/auth/forgot-password"
                  className="text-[#34A1CD] text-sm font-medium hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Password"
                  className="h-12 rounded-md"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Remember & Button */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="remember" className="w-4 h-4 accent-[#34A1CD]" />
            <label htmlFor="remember">Remember this device</label>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-[#34A1CD] hover:bg-[#2E92BA] text-white rounded-full font-medium"
        >
          Sign in
        </Button>

        {/* Footer Links */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Don’t have an account?{" "}
          <a href="/auth/register" className="text-[#34A1CD] font-medium hover:underline">
            Register
          </a>
        </p>

        {/* Divider */}
        <div className="flex items-center justify-center my-6">
          <span className="h-px w-1/3 bg-gray-200"></span>
          <span className="mx-2 text-gray-400 text-sm">Or log in with</span>
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


        {/* Social Buttons */}
        <div className="grid grid-cols-1 gap-3">
          <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-full py-2 hover:bg-gray-50 transition">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="h-5 w-5"
            />
            <span className="text-gray-700 font-medium text-sm">
              Continue with Google
            </span>
          </button>

          <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-full py-2 hover:bg-gray-50 transition">
            <img
              src="https://www.svgrepo.com/show/448234/linkedin.svg"
              alt="LinkedIn"
              className="h-5 w-5"
            />
            <span className="text-gray-700 font-medium text-sm">
              Continue with LinkedIn
            </span>
          </button>
        </div>
</div>
      </form>
    </Form>
  );
}
