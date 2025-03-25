"use client";

// import { GeistSans, GeistMono } from 'geist/font';
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { GistProvider } from "@/contexts/GistContext";
import { SessionProvider } from "next-auth/react";

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Toaster richColors />
        <SessionProvider>
          <GistProvider>{children}</GistProvider>
        </SessionProvider>
      </body>
    </html>
  );
}