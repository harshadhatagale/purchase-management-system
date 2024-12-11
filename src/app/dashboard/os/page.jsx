'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function OsDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p>Loading...</p>;

  if (!session || session.user.role !== "os") {
    router.push("/unauthorized"); // Redirect unauthorized users
    return null;
  }

  return <h1>Welcome, OS!</h1>;
}
