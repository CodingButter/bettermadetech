'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@repo/ui';
import { Button } from '@repo/ui/button';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-xl flex items-center">
              <span className="sr-only">Better Made Tech</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
              BMT
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="text-foreground/80 hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-foreground/80 hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/docs" className="text-foreground/80 hover:text-foreground transition-colors">
              Documentation
            </Link>
            <Link href="/blog" className="text-foreground/80 hover:text-foreground transition-colors">
              Blog
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button variant="default" size="sm">
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/features"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/docs"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              Documentation
            </Link>
            <Link
              href="/blog"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <div className="flex flex-col space-y-2 mt-4 px-3 pt-4 border-t border-border">
              <Button variant="outline" className="w-full" onClick={() => setIsMenuOpen(false)}>
                Sign In
              </Button>
              <Button className="w-full" onClick={() => setIsMenuOpen(false)}>
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};