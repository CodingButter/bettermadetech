import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Winner Spinner Logo"
        >
          <circle cx={12} cy={12} r={10} fill="#3b82f6" />
          <circle cx={12} cy={12} r={8} fill="#6366f1" stroke="#fff" strokeWidth={0.5} />
          <circle cx={12} cy={12} r={2} fill="#fff" />
          <path d="M12 4 L12 10" stroke="#fff" strokeWidth={1.5} />
          <path d="M12 14 L12 20" stroke="#fff" strokeWidth={1.5} />
          <path d="M4 12 L10 12" stroke="#fff" strokeWidth={1.5} />
          <path d="M14 12 L20 12" stroke="#fff" strokeWidth={1.5} />
        </svg>
        <span className="ml-2 font-bold">Winner Spinner</span>
      </>
    ),
  },
  links: [
    {
      text: 'Documentation',
      url: '/docs',
      active: 'nested-url',
    },
  ],
};
