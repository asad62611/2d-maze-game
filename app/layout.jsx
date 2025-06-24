import { Background } from "@/components/Background";
import { Instruction } from "@/components/Instruction";
import { Settings } from "@/components/Settings";
import { Suspense } from "react";
import "./globals.css";

export const metadata = {
  title: "2D Maze Game",
  description: "A 2D maze game"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black">
        <Background />
        <Instruction />
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </body>
    </html>
  );
}
