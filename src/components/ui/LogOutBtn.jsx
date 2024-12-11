"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleLogout = () => {
    signOut({ callbackUrl: "/signin" }); // Redirect to sign-in page after logout
  };

  return (
    <button onClick={handleLogout} className='px-2 py-2 bg-red-600 rounded-md text-white'>
      Logout
    </button>
  );
}
