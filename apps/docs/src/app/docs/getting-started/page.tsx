import DocLayout from '../../../components/DocLayout';

export default function GettingStartedPage() {
  return (
    <DocLayout title="Getting Started">
      <h1 className="text-3xl font-bold mb-8">Getting Started</h1>
      
      <p className="mb-6">
        This guide will help you set up your development environment and get started with the BetterMade Technology projects.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Prerequisites</h2>
      <p className="mb-4">Before you begin, make sure you have the following installed:</p>
      <ul className="list-disc ml-6 mb-6 space-y-1">
        <li>Node.js (version 18 or later)</li>
        <li>npm or yarn</li>
        <li>Docker and Docker Compose (for Directus CMS)</li>
        <li>Git</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Installation</h2>
      <ol className="list-decimal ml-6 mb-6 space-y-4">
        <li>
          <p className="font-medium">Clone the repository:</p>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto mb-4">
            <code>git clone https://github.com/CodingButter/bettermadetech.git
cd bettermadetech</code>
          </pre>
        </li>
        <li>
          <p className="font-medium">Install dependencies:</p>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto mb-4">
            <code>npm install</code>
          </pre>
        </li>
        <li>
          <p className="font-medium">Set up environment variables:</p>
          <p>Each application has its own environment variables. Check the `.env.example` files in each app directory and create corresponding `.env` files.</p>
        </li>
      </ol>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Development</h2>
      <h3 className="text-xl font-semibold mt-6 mb-3">Running the applications</h3>
      <p className="mb-4">You can run each application individually:</p>
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto mb-6">
        <code># Start Directus CMS
npm run dev:cms

# Start Next.js website
npm run dev:web

# Start documentation site
npm run dev:docs</code>
      </pre>
      <p className="mb-4">Or run everything in parallel:</p>
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto mb-6">
        <code>npm run dev</code>
      </pre>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">Building for production</h3>
      <p className="mb-4">To build all applications for production:</p>
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto mb-6">
        <code>npm run build</code>
      </pre>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Project Structure</h2>
      <p className="mb-4">Our monorepo is organized as follows:</p>
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto mb-6">
        <code>bettermade/
├── apps/
│   ├── directus/          # Directus CMS (Headless CMS)
│   ├── docs/              # Documentation site
│   └── nextjs/            # Main marketing website (Next.js)
│   
└── packages/
    ├── tailwind-config/   # Shared Tailwind CSS v4 configuration
    ├── tsconfig/          # Shared TypeScript configuration
    └── ui/                # Shared UI components</code>
      </pre>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Next Steps</h2>
      <ul className="list-disc ml-6 mb-6 space-y-1">
        <li>Check out the <a href="/docs/website" className="text-blue-600 hover:underline">website documentation</a> to learn more about our main website</li>
        <li>Learn how to use our <a href="/docs/cms" className="text-blue-600 hover:underline">CMS</a> for content management</li>
        <li>Explore our <a href="/docs/ui" className="text-blue-600 hover:underline">UI components</a> for building consistent interfaces</li>
      </ul>
    </DocLayout>
  );
}