import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/providers/ConvexClientProvider";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import MainHeader from "@/components/MainHeader";
import type { Metadata } from "next";
import Footer from "@/components/Footer";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "CodeSprints",
  description: "Interactive Code Editor with XP and Achievements",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100 flex flex-col`}>
        <ClerkProvider>
          <ConvexClientProvider>
            <MainHeader />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <Toaster position="top-right" />
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
