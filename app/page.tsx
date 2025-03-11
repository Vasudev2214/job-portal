import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Welcome to Job Portal</h1>
      <div className="space-x-4">
        <Link href="/auth/login">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
        </Link>
        <Link href="/auth/register">
          <button className="bg-green-500 text-white px-4 py-2 rounded">Register</button>
        </Link>
      </div>
    </div>
  );
}
