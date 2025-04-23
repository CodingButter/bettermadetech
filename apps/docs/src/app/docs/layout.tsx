import Link from 'next/link';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function DocsLayout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-50 border-r border-gray-200 p-4 hidden md:block">
        <div className="mb-8">
          <Link href="/" className="text-lg font-bold text-gray-900 hover:text-blue-600">
            BetterMade Docs
          </Link>
        </div>
        
        <nav>
          <ul className="space-y-2">
            <li>
              <Link href="/docs/getting-started" className="block p-2 rounded hover:bg-gray-200">
                Getting Started
              </Link>
            </li>
            <li>
              <Link href="/docs/website" className="block p-2 rounded hover:bg-gray-200">
                Website
              </Link>
            </li>
            <li>
              <Link href="/docs/cms" className="block p-2 rounded hover:bg-gray-200">
                CMS
              </Link>
            </li>
            <li>
              <Link href="/docs/ui" className="block p-2 rounded hover:bg-gray-200">
                UI Components
              </Link>
            </li>
            <li>
              <Link href="/docs/contributing" className="block p-2 rounded hover:bg-gray-200">
                Contributing
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      
      {/* Mobile menu */}
      <div className="md:hidden flex items-center p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
        <Link href="/" className="mr-auto text-lg font-bold">
          BetterMade Docs
        </Link>
        
        {/* Mobile nav dropdown would go here */}
      </div>
      
      {/* Main content */}
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-3xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}