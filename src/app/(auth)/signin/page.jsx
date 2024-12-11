"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async (email, password) => {
    const result = await signIn("credentials", {
      redirect: false,
      email,
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
    handleLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Sign In</button>
    </form>
  );
}