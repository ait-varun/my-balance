"use client";

import { useEffect, useState } from "react";

export default function UserDetails() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {user ? (
        <>
          <p className="text-lg"><strong>Name:</strong> {user.name}</p>
          <p className="text-lg"><strong>Email:</strong> {user.email}</p>
        </>
      ) : (
        <p className="text-lg text-gray-500">No user data available.</p>
      )}
    </div>
  );
}
