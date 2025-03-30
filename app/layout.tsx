import { Background } from "@/components/Background";
import { Settings } from "@/components/Settings";
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "2D Maze Game",
  description: "A 2D maze game"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Background />
        <Settings />
        {children}
      </body>
    </html>
  );
}
