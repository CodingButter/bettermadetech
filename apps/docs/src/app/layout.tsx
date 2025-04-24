import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BetterMade Technology Documentation',
  description: 'Documentation for BetterMade Technology projects',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}