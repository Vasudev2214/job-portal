import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

let image = <img src="/job_portal.png" alt="Job Portal" width={500} height={500} />


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-yellow-400 text-black font-bold dark:bg-black dark:text-white">
  {/* <h1 className="text-6xl text-blue-400">Job Portal!</h1> */}

      
        {children}
      </body>
    </html>
  );
}
