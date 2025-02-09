"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="p-4 border-b flex justify-between">
      <h1 className="text-xl font-bold">Account Tracker</h1>
      <Button
        variant="destructive"
        onClick={() => {
          localStorage.removeItem("user")
          router.push("/");
        }
        }>
        Logout
      </Button>
    </nav>
  );
}
