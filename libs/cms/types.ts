export type UserRole = 'super_admin' | 'marketing' | 'editor'

export interface CmsUser {
  id: string
  email: string
  name: string
  role: UserRole
  passwordHash: string
  totpSecret: string
  totpEnrolled: boolean
  skipTotp?: boolean
  createdAt: string
  updatedAt: string
}

export interface AdminSession {
  isLoggedIn: boolean
  userId?: string
  role?: UserRole
  pendingTotpUserId?: string
}

export interface CmsImage {
  src: string
  alt: string
}

export interface CmsPageSeo {
  title?: string
  description?: string
  keywords?: string[]
  /** URL of the Open Graph / social share image (e.g. "https://example.com/og.jpg") */
  ogImage?: string
  noIndex?: boolean
}

export type PageVisibility = 'public' | 'private' | 'password-protected'
export type PageTemplate = 'default' | 'landing-page' | 'article' | 'contact' | 'blank'

export interface CmsPageSettings {
  /** Who can view this page */
  visibility?: PageVisibility
  /** Layout template for rendering */
  template?: PageTemplate
  /** Display name of the content author */
  author?: string
  /** BCP-47 language tag, e.g. "en-US" */
  language?: string
  /** Slug of the parent page for breadcrumb / nav hierarchy */
  parentSlug?: string
  /** ISO timestamp of first publish (set automatically) */
  publishedAt?: string
}

// ── Navigation types ──────────────────────────────────────────────────────────

export interface CmsNavItem {
  id: string
  label: string
  url: string
  openInNewTab?: boolean
}

export interface CmsFooterColumn {
  id: string
  heading: string
  items: CmsNavItem[]
}

export interface CmsNavigation {
  header: {
    items: CmsNavItem[]
  }
  footer: {
    columns: CmsFooterColumn[]
    legal: CmsNavItem[]
  }
  updatedAt: string
}

export type LucideIconName = string

export type BlockType =
  | 'bento-stats'
  | 'brands'
  | 'card-grid'
  | 'cta-manifesto'
  | 'faq'
  | 'feature-cards'
  | 'form-cta'
  | 'image-content-cards'
  | 'image-text-split'
  | 'newsletter'
  | 'numbered-steps'
  | 'people-grid'
  | 'split-hero'
  | 'tagline-marquee'
  | 'section'

export interface BaseBlockData {
  _id: string
  _type: BlockType
  visible?: boolean
}

export interface BentoStatsBlockData extends BaseBlockData {
  _type: 'bento-stats'
  preheadingContent?: string
  metrics: {
    large: { value: string; heading: string; content: string }
    image1: CmsImage
    medium: { value: string; heading: string; content: string }
    small: { value: string; heading: string; content: string }
    image2: CmsImage
  }
}

export interface CardGridBlockData extends BaseBlockData {
  _type: 'card-grid'
  preheadingContent?: string
  headingContent: string
  bodyContent?: string
  articles: Array<{ image: CmsImage; heading: string; content: string; ctaUrl?: string }>
}

export interface FeatureCardsBlockData extends BaseBlockData {
  _type: 'feature-cards'
  headingContent: string
  bodyContent?: string
  cards: Array<{
    label: string
    heading: string
    content: string
    ctaLabel: string
    ctaUrl?: string
    image: CmsImage
  }>
}

export interface FormCtaBlockData extends BaseBlockData {
  _type: 'form-cta'
  headingLine1?: string
  headingLine2?: string
  bodyContent?: string
}

export interface ImageContentCardsBlockData extends BaseBlockData {
  _type: 'image-content-cards'
  preheadingContent?: string
  headingType?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  headingContent: string
  bodyContent?: string
  buttons?: Array<{
    label: string
    size?: 'sm' | 'md' | 'lg'
    color?: 'primary' | 'secondary' | 'neutral'
    hasIcon?: boolean
    url?: string
  }>
  cards: Array<{ icon: LucideIconName; heading: string; content: string; alternate?: boolean }>
  image: CmsImage
}

export interface ImageTextSplitBlockData extends BaseBlockData {
  _type: 'image-text-split'
  image?: CmsImage
  heading?: string
  bodyContent?: string
  ctaLabel?: string
  ctaUrl?: string
}

export interface NewsletterBlockData extends BaseBlockData {
  _type: 'newsletter'
  preheadingContent?: string
  headingContent?: string
  bodyContent?: string
}

export interface NumberedStepsBlockData extends BaseBlockData {
  _type: 'numbered-steps'
  preheadingContent?: string
  headingContent: string
  bodyContent: string
  steps: Array<{
    icon: LucideIconName
    number: string
    heading: string
    content: string
    alternate?: boolean
  }>
}

export interface PeopleGridBlockData extends BaseBlockData {
  _type: 'people-grid'
  preheadingContent?: string
  headingContent: string
  bodyContent?: string
  members: Array<{ name: string; role: string; image: CmsImage; ctaUrl?: string }>
}

export interface SplitHeroBlockData extends BaseBlockData {
  _type: 'split-hero'
  headingContent: string
  bodyContent?: string
  videoUrl?: string
  videoPosterImage?: CmsImage
  buttons?: Array<{
    label: string
    size?: 'sm' | 'md' | 'lg'
    color?: 'primary' | 'secondary' | 'neutral'
    hasIcon?: boolean
    url?: string
  }>
}

export interface BrandsBlockData extends BaseBlockData {
  _type: 'brands'
  items?: Array<{ name: string }>
}

export interface CtaManifestoBlockData extends BaseBlockData {
  _type: 'cta-manifesto'
  preheadingContent?: string
  headingLine1?: string
  headingLine2?: string
  primaryCta?: { label: string; url: string }
  secondaryCta?: { label: string; url: string }
}

export interface FaqBlockData extends BaseBlockData {
  _type: 'faq'
  preheadingContent?: string
  headingContent?: string
  bodyContent?: string
  ctaLabel?: string
  ctaUrl?: string
  items: Array<{ question: string; answer: string }>
}

export interface TaglineMarqueeBlockData extends BaseBlockData {
  _type: 'tagline-marquee'
  items?: Array<{ label: string }>
}

export interface SectionBlockData extends BaseBlockData {
  _type: 'section'
  backgroundColor?: 'offwhite' | 'bluishgray' | 'white' | 'text'
  paddingSize?: 'none' | 'sm' | 'md' | 'lg'
  children: BlockData[]
}

export type BlockData =
  | BentoStatsBlockData
  | BrandsBlockData
  | CardGridBlockData
  | CtaManifestoBlockData
  | FaqBlockData
  | FeatureCardsBlockData
  | FormCtaBlockData
  | ImageContentCardsBlockData
  | ImageTextSplitBlockData
  | NewsletterBlockData
  | NumberedStepsBlockData
  | PeopleGridBlockData
  | SplitHeroBlockData
  | TaglineMarqueeBlockData
  | SectionBlockData

export interface CmsPage {
  id: string
  title: string
  slug: string
  status: 'draft' | 'published'
  seo: CmsPageSeo
  settings?: CmsPageSettings
  blocks: BlockData[]
  createdAt: string
  updatedAt: string
}
