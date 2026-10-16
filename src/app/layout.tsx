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
  title: "Staywise — Your Property. Your Control. One Platform.",
  description: "Staywise helps property owners manage their properties, tenants, rent, maintenance, documents, expenses, and property performance in one simple place.",
  keywords: ["Property Management", "Tenant Management", "Rent Collection", "PG Management", "Real Estate Software", "Staywise"],
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
      <body className="min-h-full bg-[#F7F8F6] text-[#263238] flex flex-col selection:bg-[#163B36] selection:text-white">
        {children}
      </body>
    </html>
  );
}
