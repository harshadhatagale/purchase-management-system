"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // State for adding users
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState(""); // Selected role
  const [roles, setRoles] = useState([]); // List of roles from the server
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");


  useEffect(() => {

    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/departments"); // API endpoint to fetch roles
        const data = await response.json();
        setDepartments(data.departments);
      } catch (err) {
        console.error("Failed to fetch Department:", err);
      }
    }
    const fetchPositions = async () => {
      try {
        const response = await fetch("/api/positions"); // API endpoint to fetch roles
        const data = await response.json();
        setPositions(data.positions);
      } catch (err) {
        console.error("Failed to fetch Postions:", err);
      }
    }
    const fetchRoles = async () => {
      try {
        const response = await fetch("/api/roles"); // API endpoint to fetch roles
        const data = await response.json();
        setRoles(data.roles);
      } catch (err) {
        console.error("Failed to fetch roles:", err);
      }
    };

    fetchRoles();
    fetchDepartments();
    fetchPositions();
  }, []);
  if (status === "loading") return <p>Loading...</p>;

  if (!session || session.user.role !== "admin") {
    router.push("/unauthorized"); // Redirect unauthorized users
    return null;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      setStatusMessage("Please select a role");
      return;
    }
    if (!department) {
      setStatusMessage("Please select a department");
      return;
    }
    if (!position) {
      setStatusMessage("Please select a position");
      return;
    }

    setStatusMessage(null); // Reset error state

    try {
      const response = await fetch("/api/addUsers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, password, role, gender, position, department, phone }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      setStatusMessage("User Added successfully")
    } catch (err) {
      setStatusMessage(err.message);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>
        <p className="text-center mb-4">Welcome, {session.user.username}!</p>

        {/* Add New User Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Add New User</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md"
                required
              >
                <option value="">Select a role</option>
                {roles.map((r) => (
                  <option key={r._id} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md"
                required
              >
                <option value="">Select a gender</option>
                <option value="male">
                  Male
                </option>
                <option value="female">
                  Female
                </option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md"
                required
              >
                <option value="">Select a department</option>
                {departments.map((r) => (
                  <option key={r._id} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                Position
              </label>
              <select
                id="department"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md"
                required
              >
                <option value="">Select a position</option>
                {positions.map((r) => (
                  <option key={r._id} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone no.
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                pattern="[0-9]{10}"
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Sign Up
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
