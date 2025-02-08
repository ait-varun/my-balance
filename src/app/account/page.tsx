import UserDetails from "@/components/userdetails";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Tracker",
  description: "",
};

export default function AccountPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <h1 className="text-2xl font-bold">Account Page</h1>
      <UserDetails />
    </div>
  );
}
