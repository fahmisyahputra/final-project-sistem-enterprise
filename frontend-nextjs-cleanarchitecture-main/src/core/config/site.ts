/**
 * Site Configuration
 * Metadata dan informasi website
 */

export const siteConfig = {
  name: 'Organizational Mining',
  description: 'Analyze organizational structures from process data',
  url: 'https://example.com',
  author: 'MCI Team',
  links: {
    github: 'https://github.com',
  },
} as const;

export type SiteConfig = typeof siteConfig;
