"use client";

import { ReactNode } from "react";
import { Header } from "../components/header";
// import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      {/* <Footer /> */}
    </div>
  );
};
