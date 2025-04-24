import DocLayout from '../../../components/DocLayout';

export default function UIPage() {
  return (
    <DocLayout title="UI Components Documentation">
      <h1 className="text-3xl font-bold mb-8">UI Components Documentation</h1>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Overview</h2>
      <p className="mb-6">
        Our shared UI component library ensures consistent design and user experience across all our applications.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Technology Stack</h2>
      <ul className="list-disc ml-6 mb-6 space-y-1">
        <li><strong>React 19</strong>: For component-based UI development</li>
        <li><strong>Tailwind CSS v4</strong>: For styling</li>
        <li><strong>TypeScript</strong>: For type safety</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Project Structure</h2>
      <p className="mb-4">The UI component library is located in <code className="bg-gray-100 px-1 rounded">packages/ui/</code> with the following structure:</p>
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto mb-6">
        <code>ui/
├── src/
│   ├── components/    # UI components
│   └── index.ts       # Entry point</code>
      </pre>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Components</h2>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">Button</h3>
      <p className="mb-4">The Button component provides a consistent button style across applications.</p>
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto mb-6">
        <code>{`import { Button } from '@bettermade/ui';

<Button variant="primary">Click me</Button>
<Button variant="secondary">Cancel</Button>`}</code>
      </pre>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">Card</h3>
      <p className="mb-4">The Card component provides a consistent card style for content display.</p>
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto mb-6">
        <code>{`import { Card } from '@bettermade/ui';

<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content goes here</Card.Body>
  <Card.Footer>Footer content</Card.Footer>
</Card>`}</code>
      </pre>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Styling</h2>
      <p className="mb-6">Components use our shared Tailwind CSS configuration from <code className="bg-gray-100 px-1 rounded">@bettermade/tailwind-config</code>.</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Development</h2>
      <p className="mb-4">To develop the UI components:</p>
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto mb-6">
        <code>cd packages/ui
npm run dev</code>
      </pre>
      <p className="mb-6">This will start the build process in watch mode.</p>
    </DocLayout>
  );
}