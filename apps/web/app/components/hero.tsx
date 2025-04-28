'use client';

import React from 'react';
import { Button } from '@repo/ui/button';
import Link from 'next/link';

export const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Level Up Your <span className="text-primary">Streaming</span> Experience
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Professional tools and widgets for content creators. Enhance engagement and bring your streams to life.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="px-8 py-6 text-lg">
              <Link href="#features">
                Explore Features
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg">
              <Link href="#spinner-demo">
                Try Demo
              </Link>
            </Button>
          </div>
          
          <div className="mt-12 flex items-center justify-center space-x-6">
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span className="ml-3 text-sm text-muted-foreground">Join 2,000+ content creators</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};