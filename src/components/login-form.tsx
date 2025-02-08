"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export function LoginForm({
  className,
  handleGoogleLogin,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { handleGoogleLogin: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
  };

  const validateForm = () => {
    const result = schema.safeParse(formData);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          formattedErrors[error.path[0]] = error.message;
        }
      });
      setErrors(formattedErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }
  
      console.log("Signup successful", data);
      alert("Signup successful!");
    } catch (error) {
      console.error("Signup error:", error);
      alert(error);
    }
  };
  


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{isLogin ? "Welcome back" : "Create an account"}</CardTitle>
          <CardDescription>{isLogin ? "Login with your credentials" : "Sign up to get started"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 mb-6">
            <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
              Login with Google
            </Button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" value={formData.name} onChange={handleChange} className={errors.name ? "border-red-500" : ""} autoComplete="name" />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={handleChange} className={errors.email ? "border-red-500" : ""} autoComplete="email" />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={formData.password} onChange={handleChange} className={errors.password ? "border-red-500" : ""} />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>
                {!isLogin && (
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className={errors.confirmPassword ? "border-red-500" : ""} />
                    {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                  </div>
                )}
                <Button type="submit" className="w-full">
                  {isLogin ? "Login" : "Sign up"}
                </Button>
                <div className="text-center text-sm mt-4">
                  {isLogin ? "Don't have an account?" : "Already have an account?"} {" "}
                  <button type="button" onClick={toggleAuthMode} className="underline underline-offset-4 hover:text-primary">
                    {isLogin ? "Sign up" : "Login"}
                  </button>
                </div>
              </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
