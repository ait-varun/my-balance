"use client"

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

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!formData.email.includes("@")) {
      newErrors.email = "Invalid email format";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Login with Google clicked");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{isLogin ? "Welcome back" : "Create an account"}</CardTitle>
          <CardDescription>{isLogin ? "Login with your credentials" : "Sign up to get started"}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                Login with Google
              </Button>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={formData.password} onChange={handleChange} required />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
              {!isLogin && (
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
                  {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                </div>
              )}
              <Button type="submit" className="w-full">
                {isLogin ? "Login" : "Sign up"}
              </Button>
            </div>
            <div className="text-center text-sm mt-4">
              {isLogin ? "Don't have an account?" : "Already have an account?"} {" "}
              <button type="button" onClick={toggleAuthMode} className="underline underline-offset-4 hover:text-primary">
                {isLogin ? "Sign up" : "Login"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
