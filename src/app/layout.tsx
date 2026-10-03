import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Staywise — Operating System for Rental & Real Estate Assets",
  description: "The complete property operating system for landlords, property managers, tenants, and estates. Manage the full asset lifecycle: Vacant → Listed → Rent → Maintenance → Renewal.",
  keywords: ["Property Operating System", "RentFlow", "PropOS", "Real Estate Management", "Tenant Onboarding", "EstateOS", "Staywise"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-full bg-[#edece6] text-[#19251f] flex flex-col selection:bg-[#274235]/20 selection:text-[#274235]">
        {children}
      </body>
    </html>
  );
}
