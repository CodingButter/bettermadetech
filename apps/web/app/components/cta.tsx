import React from 'react';
import { Button } from '@repo/ui/button';
import Link from 'next/link';

export const CTA: React.FC = () => {
  return (
    <div className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-gradient-to-r from-primary/10 via-background to-accent/10 rounded-2xl p-8 md:p-12 text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to elevate your streams?</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Join thousands of content creators who have transformed their streaming experience with our tools. Start your free trial today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 md:justify-start justify-center">
                <Button asChild size="lg" className="px-8">
                  <Link href="/signup">
                    Start Free Trial
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/pricing">
                    View Pricing
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">No credit card required for 14-day trial</p>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="bg-background rounded-xl p-6 shadow-lg max-w-md w-full border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-foreground" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold">Complete Toolkit</p>
                      <p className="text-xs text-muted-foreground">All features included</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Starting at</p>
                    <p className="text-2xl font-bold">$9.99<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {[
                    'Winner Spinner & Interactive Widgets',
                    'Custom Stream Overlays',
                    'Browser Extension',
                    'Cloud Storage & Sync',
                    'Analytics Dashboard',
                    'Premium Support'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full">Choose Plan</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};