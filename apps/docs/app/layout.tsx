import './global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';

const inter = Inter({
  subsets: ['latin'],
});

// Read the favicon snippet if it exists
let faviconSnippet = '';
try {
  faviconSnippet = fs.readFileSync(
    path.join(process.cwd(), 'public/favicon-snippet.html'),
    'utf8'
  );
} catch (e) {
  console.warn('Favicon snippet not found');
}

export const metadata: Metadata = {
  title: {
    template: '%s | Winner Spinner Documentation',
    default: 'Winner Spinner Documentation',
  },
  description: 'Documentation for the Winner Spinner project',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon192.png',
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        {/* Include favicons from the assets package */}
        <div dangerouslySetInnerHTML={{ __html: faviconSnippet }} />
      </head>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
