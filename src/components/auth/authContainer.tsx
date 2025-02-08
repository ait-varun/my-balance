"use client";

import { useState } from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";
import { useToast } from "@/hooks/use-toast";

export default function AuthContainer() {
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();

  const handleGoogleLogin = () => {
    toast({
      title: "Login Successful",
      description: "You have successfully logged in with Google",
    });
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          My Account Expenses
        </a>

        {isLogin ? (
          <LoginForm handleGoogleLogin={handleGoogleLogin} />
        ) : (
          <SignupForm />
        )}

        <div className="text-center text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="underline underline-offset-4 hover:text-primary"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
