import DocLayout from '../../../components/DocLayout';

export default function ContributingPage() {
  return (
    <DocLayout title="Contributing to BetterMade Technology">
      <h1 className="text-3xl font-bold mb-8">Contributing to BetterMade Technology</h1>
      
      <p className="mb-6">
        We love your input! We want to make contributing to BetterMade Technology projects as easy and transparent as possible, whether it's:
      </p>
      
      <ul className="list-disc ml-6 mb-6 space-y-1">
        <li>Reporting a bug</li>
        <li>Discussing the current state of the code</li>
        <li>Submitting a fix</li>
        <li>Proposing new features</li>
        <li>Becoming a maintainer</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Development Process</h2>
      <p className="mb-6">We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.</p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">Pull Requests</h3>
      <ol className="list-decimal ml-6 mb-6 space-y-2">
        <li>Fork the repository</li>
        <li>Create your feature branch (<code className="bg-gray-100 px-1 rounded">git checkout -b feature/amazing-feature</code>)</li>
        <li>Commit your changes (<code className="bg-gray-100 px-1 rounded">git commit -m 'Add some amazing feature'</code>)</li>
        <li>Push to the branch (<code className="bg-gray-100 px-1 rounded">git push origin feature/amazing-feature</code>)</li>
        <li>Open a Pull Request</li>
      </ol>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">Issues</h3>
      <p className="mb-6">We use GitHub issues to track public bugs. Report a bug by opening a new issue.</p>
      
      <h3 className="text-xl font-semibold mt-6 mb-3">Coding Standards</h3>
      <ul className="list-disc ml-6 mb-6 space-y-1">
        <li>Use consistent code formatting</li>
        <li>Write tests for your code when possible</li>
        <li>Keep pull requests focused on a single feature or bug fix</li>
        <li>Document your code</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Branch Organization</h2>
      <ul className="list-disc ml-6 mb-6 space-y-1">
        <li><code className="bg-gray-100 px-1 rounded">main</code> - Production-ready code</li>
        <li><code className="bg-gray-100 px-1 rounded">docs</code> - Documentation website</li>
        <li><code className="bg-gray-100 px-1 rounded">develop</code> - Integration branch for feature development</li>
        <li><code className="bg-gray-100 px-1 rounded">feature/*</code> - Feature branches</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">License</h2>
      <p className="mb-6">By contributing, you agree that your contributions will be licensed under the project's license.</p>
    </DocLayout>
  );
}