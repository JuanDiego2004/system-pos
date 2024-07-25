
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";


const inter = Inter({ subsets: ["latin"] });


export default function Layout({ children }) {
  return (
    <>
    <html lang="en">
      <body className={inter.className}>
       <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4">
          {children}
        </div>
       </div>
       
        </body>
    </html>
    </>
  );
}
