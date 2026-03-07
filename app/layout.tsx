import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import LoadingScreen from "@/components/LoadingScreen";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Moonplace - Cozy Studio at Trees Residences",
  description: "Book your stay at Moonplace, a modern studio unit in Trees Residences, Quezon City. Perfect for couples and solo travelers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}
