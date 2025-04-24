import { ReactNode } from 'react';

interface DocLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function DocLayout({ children, title }: DocLayoutProps) {
  return (
    <>
      {title && <title>{title} | BetterMade Tech Docs</title>}
      <div className="docs-content">
        {children}
      </div>
    </>
  );
}