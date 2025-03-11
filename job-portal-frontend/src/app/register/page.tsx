"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      if (response.status === 201) {
        alert("Successfully registered into the Job Portal!");
        router.push("/login");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-green-100 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">Register</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <label className="block text-gray-700 font-medium">Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-400 rounded mt-1 bg-white text-gray-800"
          />
          <label className="block text-gray-700 font-medium mt-3">Email</label>
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
            placeholder="Min 8 characters"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-400 rounded mt-1 bg-white text-gray-800"
          />
          <label className="block text-gray-700 font-medium mt-3">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border border-gray-400 rounded mt-1 bg-white text-gray-800"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="hr">HR</option>
            <option value="manager">Manager</option>
          </select>
          <button
            type="submit"
            className="w-full mt-4 p-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
          >
            Register
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Already signed up? <a href="/login" className="text-blue-500 hover:underline">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
