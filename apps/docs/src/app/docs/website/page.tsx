import DocLayout from '../../../components/DocLayout';

export default function WebsitePage() {
  return (
    <DocLayout title="Website Documentation">
      <h1 className="text-3xl font-bold mb-8">Website Documentation</h1>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Overview</h2>
      <p className="mb-6">
        Our main website is built with Next.js 15 and uses Tailwind CSS v4 for styling. It serves as the primary marketing platform for BetterMade Technology.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Technology Stack</h2>
      <ul className="list-disc ml-6 mb-6 space-y-1">
        <li><strong>Next.js 15</strong>: For server-side rendering and static site generation</li>
        <li><strong>React 19</strong>: For component-based UI development</li>
        <li><strong>Tailwind CSS v4</strong>: For styling</li>
        <li><strong>Directus CMS</strong>: For content management</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Project Structure</h2>
      <p className="mb-4">The website code is located in <code className="bg-gray-100 px-1 rounded">apps/nextjs/</code> and follows standard Next.js conventions:</p>
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto mb-6">
        <code>nextjs/
├── public/            # Static assets
├── src/
│   ├── app/           # App Router pages and layouts
│   ├── components/     # Reusable UI components
│   ├── lib/           # Utility functions and libraries
│   └── types/         # TypeScript type definitions</code>
      </pre>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Development</h2>
      <p className="mb-4">To start the development server:</p>
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto mb-6">
        <code>npm run dev:web</code>
      </pre>
      <p className="mb-6">This will start the Next.js development server, typically at http://localhost:3000.</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Deployment</h2>
      <p className="mb-6">The website is automatically deployed through CI/CD pipelines. Push to the <code className="bg-gray-100 px-1 rounded">main</code> branch to trigger a deployment.</p>
    </DocLayout>
  );
}