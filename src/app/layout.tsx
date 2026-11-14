import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProofForge AI — Autonomous Epistemic Verification Engine",
  description: "Next-generation research verification and evidence mutation testing web application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#06080E] text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}

