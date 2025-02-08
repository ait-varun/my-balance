"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "../login-form";
import { useToast } from "@/hooks/use-toast"


export default function AuthContainer() {

  const { toast } = useToast()

  const handleGoogleLogin = () => {
    toast({
      title: "Login Successful",
      description: "You have successfully logged in with Google",
    })
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
        <LoginForm  handleGoogleLogin={handleGoogleLogin} />
      </div>
    </div>
  );
}