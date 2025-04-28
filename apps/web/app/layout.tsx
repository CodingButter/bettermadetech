import type { Metadata } from "next";
import React from "react";
import localFont from "next/font/local";
import "./globals.css";
import "@repo/ui/styles.css";
import { ThemeProvider } from "@repo/ui";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Better Made Tech - Streaming Tools & Widgets",
  description: "Innovative solutions for content creators and streamers. Enhance your digital presence with customizable tools and overlays.",
  keywords: "streaming tools, content creator, overlay, widgets, spinner, giveaway, stream deck, OBS, Streamlabs",
  authors: [{ name: "Better Made Tech" }],
  creator: "Better Made Tech",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bettermade.tech",
    title: "Better Made Tech - Streaming Tools & Widgets",
    description: "Innovative solutions for content creators and streamers",
    siteName: "Better Made Tech",
  },
};

const RootLayout: React.FC<Readonly<{
  children: React.ReactNode;
}>> = ({
  children,
}) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider defaultTheme="system" storageKey="web-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
