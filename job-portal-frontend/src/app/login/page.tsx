"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      if (response.status === 200) {
        alert("Login successful!");

        // ✅ Store token in localStorage
        localStorage.setItem("token", response.data.token);

        // ✅ Redirect based on role
        const role = response.data.role;
        if (role === "user") {
          router.push("/dashboard/user");
        } else if (role === "admin") {
          router.push("/dashboard/admin");
        } else if (role === "hr") {
          router.push("/dashboard/hr");
        } else if (role === "manager") {
          router.push("/dashboard/manager");
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-blue-100 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-400 rounded mt-1 bg-white text-gray-800"
          />
          <label className="block text-gray-700 font-medium mt-3">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-400 rounded mt-1 bg-white text-gray-800"
          />
          <button
            type="submit"
            className="w-full mt-4 p-2 bg-green-500 text-white font-bold rounded hover:bg-green-600"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          New user?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
