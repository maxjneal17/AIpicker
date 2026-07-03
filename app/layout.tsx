import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Picker — Find the right AI for any task",
  description:
    "Describe what you want to create or accomplish and get a ranked recommendation of the best AI tools for the job.",
  openGraph: {
    title: "AI Picker — Find the right AI for any task",
    description:
      "Describe your task and instantly find the best AI tool for it — from image generation to coding to video creation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
