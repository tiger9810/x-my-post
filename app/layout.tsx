import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import { SessionProvider } from "next-auth/react";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "X only Posts",
  description: "自分の投稿に集中できるシンプルなXクライアント",
  openGraph: {
    title: "X only Posts",
    description: "自分の投稿に集中できるシンプルなXクライアント",
    siteName: "X only Posts",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "X only Posts",
    description: "自分の投稿に集中できるシンプルなXクライアント",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}