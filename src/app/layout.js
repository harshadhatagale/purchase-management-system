"use client";

import { SessionProvider } from "next-auth/react";
import "./globals.css";
import Nav from "@/components/ui/Nav";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Nav/>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
