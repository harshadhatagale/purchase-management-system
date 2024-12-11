"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State for adding users
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  if (status === "loading") return <p>Loading...</p>;

  if (!session || session.user.role !== "admin") {
    router.push("/unauthorized"); // Redirect unauthorized users
    return null;
  }

  const handleAddUser = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await response.json();
    if (response.ok) {
      setStatusMessage("User added successfully!");
      setName("");
      setEmail("");
      setPassword("");
      setRole("");
    } else {
      setStatusMessage(data.message || "Error adding user.");
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>
        <p className="text-center mb-4">Welcome, {session.user.name}!</p>

        {/* Add New User Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Add New User</h2>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter user's name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter user's email"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter a password"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="admin">Admin</option>
                <option value="hod">HOD</option>
                <option value="os">OS</option>
                <option value="registrar">Registrar</option>
                <option value="principal">Principal</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
            >
              Add User
            </button>
          </form>
          {statusMessage && (
            <p className="mt-4 text-center text-gray-600">{statusMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
