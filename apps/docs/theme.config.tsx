import { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: <span style={{ fontWeight: 'bold' }}>BetterMade Technology</span>,
  project: {
    link: 'https://github.com/CodingButter/bettermadetech',
  },
  docsRepositoryBase: 'https://github.com/CodingButter/bettermadetech/tree/docs/apps/docs',
  footer: {
    text: '© BetterMade Technology ' + new Date().getFullYear(),
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – BetterMade Tech Docs'
    };
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="BetterMade Technology Documentation" />
      <meta property="og:description" content="Documentation for BetterMade Technology projects" />
    </>
  ),
  sidebar: {
    titleComponent({ title, type }) {
      if (type === 'separator') {
        return <span className="cursor-default">{title}</span>;
      }
      return <>{title}</>;
    },
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
};

export default config;