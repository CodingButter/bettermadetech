import DocLayout from '../../../components/DocLayout';

export default function CMSPage() {
  return (
    <DocLayout title="CMS Documentation">
      <h1 className="text-3xl font-bold mb-8">CMS Documentation</h1>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Overview</h2>
      <p className="mb-6">
        We use Directus as our headless CMS to manage content across our digital properties. 
        It provides a flexible and customizable API for our content.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Technology Stack</h2>
      <ul className="list-disc ml-6 mb-6 space-y-1">
        <li><strong>Directus 11</strong>: Headless CMS</li>
        <li><strong>PostgreSQL</strong>: Database</li>
        <li><strong>Docker</strong>: Containerization</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Project Structure</h2>
      <p className="mb-4">The CMS code is located in <code className="bg-gray-100 px-1 rounded">apps/directus/</code> with the following structure:</p>
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto mb-6">
        <code>directus/
├── data/             # Database data (git ignored)
├── extensions/       # Custom extensions
├── uploads/          # Uploaded files (git ignored)
└── docker-compose.yaml  # Docker configuration</code>
      </pre>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Development</h2>
      <p className="mb-4">To start the CMS:</p>
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto mb-6">
        <code>npm run dev:cms</code>
      </pre>
      <p className="mb-6">This will start the Directus server, typically at http://localhost:8055.</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Content Structure</h2>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">Collections</h3>
      <p className="mb-4">Our CMS is organized into the following collections:</p>
      <ul className="list-disc ml-6 mb-6 space-y-1">
        <li><strong>Pages</strong>: Website pages</li>
        <li><strong>Posts</strong>: Blog posts</li>
        <li><strong>Team</strong>: Team members</li>
        <li><strong>Services</strong>: Service offerings</li>
      </ul>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">Fields</h3>
      <p className="mb-4">Each collection has specific fields. For example, a Page has:</p>
      <ul className="list-disc ml-6 mb-6 space-y-1">
        <li>Title</li>
        <li>Slug</li>
        <li>Content blocks</li>
        <li>SEO metadata</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">API Usage</h2>
      <p className="mb-4">Our Next.js application interacts with the CMS using the Directus SDK:</p>
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto mb-6">
        <code>{`import { createDirectus, rest, readItems } from '@directus/sdk';

const directus = createDirectus('https://admin.bettermade.tech').with(rest());

// Example: Fetch all pages
const pages = await directus.request(readItems('pages'));`}</code>
      </pre>
    </DocLayout>
  );
}