import React from "react";
import styles from "./page.module.css";
import { Header } from "./components/header";
import { Hero } from "./components/hero";
import { Features } from "./components/features";
import { SpinnerContainer } from "./client-container";
import { Testimonials } from "./components/testimonials";
import { CTA } from "./components/cta";
import { Footer } from "./components/footer";
import { Card, CardContent, CardTitle } from "@repo/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        
        <section id="spinner-demo" className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Winner Spinner Demo</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Create custom spinners for giveaways, decision making, or audience engagement. 
                  Easily integrate with your streams and content.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    'Customizable colors and segments',
                    'Adjustable spin duration and animations',
                    'Save multiple spinner configurations',
                    'Easy integration with OBS and other platforms',
                    'Mobile-friendly design'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <Card className="p-6 shadow-lg border border-border">
                  <CardTitle className="mb-4">Try it Yourself</CardTitle>
                  <CardContent className="p-0">
                    <SpinnerContainer />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        
        <Features />
        
        <Testimonials />
        
        <CTA />
      </main>
      
      <Footer />
    </div>
  );
}