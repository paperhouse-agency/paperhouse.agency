/**
 * Site navigation — static content.
 *
 * Content is code in this repo: changing the menu means editing this file and
 * redeploying. Migrated out of the CMS `slots` table when the in-repo CMS was
 * retired (SEO/GEO is managed from HQ instead).
 */

export interface NavItem {
  id: string
  label: string
  url: string
  openInNewTab?: boolean
}

export interface FooterColumn {
  id: string
  heading: string
  items: NavItem[]
}

export interface Navigation {
  header: { items: NavItem[] }
  footer: { columns: FooterColumn[]; legal: NavItem[] }
}

export const NAVIGATION: Navigation = {
  header: {
    items: [
      { id: 'home', label: 'Home', url: '/' },
      { id: 'about', label: 'About', url: '/about' },
      { id: 'contact', label: 'Contact', url: '/contact' },
    ],
  },
  footer: {
    columns: [],
    legal: [],
  },
}
