import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SekurAI - Agentic Penetration Testing",
  description: "Autonomous AI agents that reason, adapt, and chain attacks like elite pentesters",
};

// Force dynamic rendering to avoid build-time Clerk errors
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic>
      <html lang="en" className="dark">
        <body className={`${inter.variable} font-sans antialiased bg-[#0a0f1a] text-white`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

