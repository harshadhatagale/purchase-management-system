'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p>Loading...</p>;

  if (!session || session.user.role !== "admin") {
    router.push("/unauthorized"); // Redirect unauthorized users
    return null;
  }
  return <div>
    <h2 className="text-2xl my-6">Hello Admin!</h2>
    <Link href={"/dashboard/admin/addUser"} className="text-lg px-3 py-2 bg-yellow-600 text-white rounded-md">Add User</Link>
  </div>;
}
