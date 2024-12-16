"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const handleLogin = async (username, password) => {
    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (result.error) {
      console.error("Login failed:", result.error);
      alert("Login failed: " + result.error);
    } else {
      const roleRoutes = {
        admin: "/dashboard/admin",
        hod: "/dashboard/hod",
        os: "/dashboard/os",
        registrar: "/dashboard/registrar",
        principal: "/dashboard/principal",
      };

      // Fetch the session to determine user role
      const session = await fetch("/api/auth/session").then((res) => res.json());
      const userRole = session?.user?.role;

      if (roleRoutes[userRole]) {
        window.location.href = roleRoutes[userRole];
      } else {
        window.location.href = "/dashboard";
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleLogin(username, password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg"
      >
        <h2 className="text-center text-2xl font-semibold text-gray-800">Sign In</h2>
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your Username"
            className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your Password"
            className="mt-1 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
