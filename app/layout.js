"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import { AuthProvider } from "./context/AuthContext";

const inter = Inter({ subsets: ["latin"] });


export default function Layout({ children }) {
  return (
    <>
    <html lang="en">
      <body className={inter.className}>
       <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4">
          <AuthProvider>
            {children}
          </AuthProvider>
        </div>
       </div>
       
        </body>
    </html>
    </>
  );
}
