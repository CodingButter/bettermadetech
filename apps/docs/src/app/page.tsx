import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-bold mb-8 text-center">
          BetterMade Technology Documentation
        </h1>
        
        <p className="text-lg mb-12 text-center">
          Welcome to the official documentation for BetterMade Technology projects. This documentation provides 
          comprehensive information about our technology stack, development practices, and projects.
        </p>
        
        <div className="grid gap-8 md:grid-cols-2">
          <DocumentationCard 
            title="Getting Started" 
            description="Set up your development environment and get started with the BetterMade Technology projects."
            link="/docs/getting-started"
          />
          
          <DocumentationCard 
            title="Website" 
            description="Learn about our main website built with Next.js and Tailwind CSS."
            link="/docs/website"
          />
          
          <DocumentationCard 
            title="CMS" 
            description="Learn how to use Directus CMS for content management."
            link="/docs/cms"
          />
          
          <DocumentationCard 
            title="UI Components" 
            description="Explore our shared UI component library."
            link="/docs/ui"
          />
          
          <DocumentationCard 
            title="Contributing" 
            description="Guidelines for contributing to BetterMade Technology projects."
            link="/docs/contributing"
          />
        </div>
      </div>
    </main>
  );
}

function DocumentationCard({ 
  title, 
  description, 
  link 
}: { 
  title: string; 
  description: string; 
  link: string 
}) {
  return (
    <Link href={link} className="block">
      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
}