import Image from "next/image";
import Link from "next/link";
import { Button, Card, CardTitle, CardContent } from "@repo/ui";
import styles from "./page.module.css";

/**
 * DocCard component for displaying documentation section links
 */
interface DocCardProps {
  title: string;
  description: string;
  href: string;
  icon?: string;
}

const DocCard = ({ title, description, href, icon }: DocCardProps) => {
  return (
    <Link href={href} className="block no-underline">
      <Card hoverable className="p-6 h-full transition-all hover:shadow-md">
        <div className="flex items-start">
          {icon && (
            <div className="mr-4">
              <Image 
                src={icon} 
                alt={`${title} icon`} 
                width={24} 
                height={24} 
                className="opacity-80"
              />
            </div>
          )}
          <div>
            <CardTitle className="mb-2">{title}</CardTitle>
            <CardContent className="pt-0">
              <p className="text-muted-foreground">{description}</p>
            </CardContent>
          </div>
        </div>
      </Card>
    </Link>
  );
};

/**
 * Main documentation landing page providing navigation to all documentation sections
 */
export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Better Made Tech Documentation</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Comprehensive documentation for the Better Made Tech platform,
          including UI components, extension, and backend integration.
        </p>
      </div>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DocCard
            title="Introduction"
            description="Overview of the Better Made Tech platform and its components."
            href="/introduction"
            icon="/file-text.svg"
          />
          <DocCard
            title="Installation"
            description="Step-by-step guide to install and set up the development environment."
            href="/installation"
            icon="/file-text.svg"
          />
          <DocCard
            title="Architecture"
            description="Learn about the platform architecture and technology stack."
            href="/architecture"
            icon="/file-text.svg"
          />
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">UI Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DocCard
            title="Component Library"
            description="Explore the reusable UI components available in the platform."
            href="/components"
            icon="/file-text.svg"
          />
          <DocCard
            title="Spinner Component"
            description="Detailed documentation for the customizable spinner wheel."
            href="/spinner"
            icon="/file-text.svg"
          />
          <DocCard
            title="Theming"
            description="Learn how to customize the appearance of components."
            href="/components#theme"
            icon="/file-text.svg"
          />
        </div>
      </section>
      
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Chrome Extension</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DocCard
            title="Extension Overview"
            description="Introduction to the Better Made Tech Chrome extension."
            href="/extension#overview"
            icon="/file-text.svg"
          />
          <DocCard
            title="Installation & Usage"
            description="How to install and use the Chrome extension."
            href="/extension#installation"
            icon="/file-text.svg"
          />
          <DocCard
            title="Development Guide"
            description="Guide for developers working on the extension."
            href="/extension#development"
            icon="/file-text.svg"
          />
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Backend Integration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DocCard
            title="Directus Integration"
            description="How to connect and use the Directus backend."
            href="/extension#directus"
            icon="/file-text.svg"
          />
          <DocCard
            title="API Reference"
            description="Complete API documentation for backend integration."
            href="/api-reference"
            icon="/file-text.svg"
          />
          <DocCard
            title="Authentication"
            description="Implement authentication in your application."
            href="/authentication"
            icon="/file-text.svg"
          />
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8">Additional Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DocCard
            title="Tutorials"
            description="Step-by-step tutorials for common tasks."
            href="/tutorials"
            icon="/file-text.svg"
          />
          <DocCard
            title="FAQ"
            description="Frequently asked questions about the platform."
            href="/faq"
            icon="/file-text.svg"
          />
          <DocCard
            title="Troubleshooting"
            description="Solutions for common issues and problems."
            href="/troubleshooting"
            icon="/file-text.svg"
          />
        </div>
      </section>

      <div className="text-center mt-16">
        <p className="text-muted-foreground mb-4">Need more help?</p>
        <div className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <a href="https://github.com/CodingButter/bettermadetech" target="_blank" rel="noopener noreferrer">
              GitHub Repository
            </a>
          </Button>
          <Button asChild>
            <a href="mailto:support@bettermade.tech">
              Contact Support
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}