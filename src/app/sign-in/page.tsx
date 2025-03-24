"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Lock, Mail, TriangleAlert, LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";

//Zod for form validation
const registerSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must include at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must include at least one lowercase letter",
    }),
});
export default function SignIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  //Handling toggling password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    try {
      registerSchema.parse({ email, password });
      setError("");
      const response = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (response?.ok) {
        setPending(false);
        toast.success("login successful");
        router.push("/");
      } else if (response?.status === 401) {
        setError("Invalid credentials");
        setPending(false);
      } else if (response?.status === 500) {
        setError("Something went wrong");
        setPending(false);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          formattedErrors[error.path[0]] = error.message;
        });
        setErrors(formattedErrors);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setPending(false);
    }
  };

  //TODO --> Add google
  const handleProvider = (
    event: React.MouseEvent<HTMLButtonElement>,
    value: "github"
  ) => {
    event.preventDefault();
    signIn(value, { callbackUrl: "/" });
  };
  return (
    <div className="h-full flex bg-[#0c0b08] items-center justify-center">
      <div className="p-4 rounded-lg shadow-lg w-5/6 max-w-sm border border-gray-700 md:h-auto w-[80%] sm:w-[420px] sm:p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-1 text-white">Gist Tracker</h2>
          <p className="text-sm text-accent-foreground text-white">
            Use email or service, to sign in
          </p>
        </div>
        {!!error && (
          <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
            <TriangleAlert />
            <p>{error}</p>
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex-1">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white mb-1"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                disabled={pending}
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full h-12 pl-10 pr-4 py-2 border bg-[#131312] text-white border-gray-600
                   
                } ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg text-sm focus:outline-none focus:ring-2 ${
                  errors.email ? "focus:ring-red-500" : "focus:ring-gray-500"
                }`}
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                aria-describedby="user_name_error"
              />
            </div>
            {errors.email && (
              <p id="user_name_error" className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className={`block text-sm font-medium 
               text-white mb-1
              }`}
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                disabled={pending}
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full h-12 pl-10 pr-4 py-2 border 
                bg-[#131312] text-white border-gray-600
              
                ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg text-sm focus:outline-none focus:ring-2 ${
                  errors.password ? "focus:ring-red-500" : "focus:ring-gray-500"
                }`}
                aria-invalid={!!errors.password}
                aria-describedby="password_error"
              />
              <button
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                type="button"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.password && (
              <p id="password_error" className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>
          <Button
            type="submit"
            variant="outline"
            className="w-full bg-[#131312] text-white border-gray-700 py-5"
            disabled={pending}
          >
            {pending ? (
              <span className="flex items-center">
                <span className="animate-pulse mr-2">●</span>
                Logging in...
              </span>
            ) : (
              <span className="flex items-center">
                <LogIn className="mr-2 h-4 w-4" />
                Sign in
              </span>
            )}
          </Button>
        </form>
        <div className="text-center text-sm mt-4 text-white">
          {/* Buttons Container */}
          <div className="flex justify-center gap-4  ">
            {/* GitHub Button */}
            <Button
              disabled={false}
              onClick={(e) => handleProvider(e, "github")}
              variant="outline"
              size="lg"
              className="bg-[#131312]  w-full transition-transform duration-200 rounded-lg border border-gray-500 "
            >
              <FaGithub className="size-8" />
            </Button>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-sm mt-4 text-white">
            {" Don't have an account?"}
            <Link
              href="/sign-up"
              className="text-blue-500 hover:underline hover:text-blue-600 hover:bg-blue-100 transition-colors duration-200 px-2 py-1 rounded"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
