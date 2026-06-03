import type { BlockData, BlockType, LucideIconName } from './types'

type FieldType = 'text' | 'textarea' | 'image' | 'url' | 'select' | 'array' | 'blocks' | 'boolean' | 'icon'

export interface FieldDef {
  key: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  fields?: FieldDef[]
  defaultValue?: unknown
}

export interface BlockRegistryEntry {
  type: BlockType
  label: string
  icon: LucideIconName
  isWrapper: boolean
  fields: FieldDef[]
  defaultData: () => BlockData
}

export const BLOCK_REGISTRY: BlockRegistryEntry[] = [
  {
    type: 'bento-stats',
    label: 'Bento Stats',
    icon: 'LayoutGrid',
    isWrapper: false,
    fields: [
      { key: 'preheadingContent', label: 'Preheading', type: 'text' },
      { key: 'metrics.large.value', label: 'Large Metric Value', type: 'text', required: true },
      { key: 'metrics.large.heading', label: 'Large Metric Heading', type: 'text', required: true },
      { key: 'metrics.large.content', label: 'Large Metric Content', type: 'text' },
      { key: 'metrics.image1', label: 'Image 1', type: 'image', required: true },
      { key: 'metrics.medium.value', label: 'Medium Metric Value', type: 'text', required: true },
      { key: 'metrics.medium.heading', label: 'Medium Metric Heading', type: 'text', required: true },
      { key: 'metrics.medium.content', label: 'Medium Metric Content', type: 'text' },
      { key: 'metrics.small.value', label: 'Small Metric Value', type: 'text', required: true },
      { key: 'metrics.small.heading', label: 'Small Metric Heading', type: 'text', required: true },
      { key: 'metrics.small.content', label: 'Small Metric Content', type: 'text' },
      { key: 'metrics.image2', label: 'Image 2', type: 'image', required: true },
    ],
    defaultData: () => ({
      _id: crypto.randomUUID(),
      _type: 'bento-stats',
      preheadingContent: '',
      metrics: {
        large: { value: '', heading: '', content: '' },
        image1: { src: '', alt: '' },
        medium: { value: '', heading: '', content: '' },
        small: { value: '', heading: '', content: '' },
        image2: { src: '', alt: '' },
      },
    }),
  },
  {
    type: 'card-grid',
    label: 'Card Grid',
    icon: 'Grid3X3',
    isWrapper: false,
    fields: [
      { key: 'preheadingContent', label: 'Preheading', type: 'text' },
      { key: 'headingContent', label: 'Heading', type: 'text', required: true },
      { key: 'bodyContent', label: 'Body', type: 'textarea' },
      {
        key: 'articles',
        label: 'Articles',
        type: 'array',
        fields: [
          { key: 'image', label: 'Image', type: 'image', required: true },
          { key: 'heading', label: 'Heading', type: 'text', required: true },
          { key: 'content', label: 'Content', type: 'textarea' },
          { key: 'ctaUrl', label: 'CTA URL', type: 'url' },
        ],
      },
    ],
    defaultData: () => ({
      _id: crypto.randomUUID(),
      _type: 'card-grid',
      preheadingContent: '',
      headingContent: '',
      bodyContent: '',
      articles: [],
    }),
  },
  {
    type: 'feature-cards',
    label: 'Feature Cards',
    icon: 'CreditCard',
    isWrapper: false,
    fields: [
      { key: 'headingContent', label: 'Heading', type: 'text', required: true },
      { key: 'bodyContent', label: 'Body', type: 'textarea' },
      {
        key: 'cards',
        label: 'Cards',
        type: 'array',
        fields: [
          { key: 'label', label: 'Label', type: 'text', required: true },
          { key: 'heading', label: 'Heading', type: 'text', required: true },
          { key: 'content', label: 'Content', type: 'textarea' },
          { key: 'ctaLabel', label: 'CTA Label', type: 'text', required: true },
          { key: 'ctaUrl', label: 'CTA URL', type: 'url' },
          { key: 'image', label: 'Image', type: 'image', required: true },
        ],
      },
    ],
    defaultData: () => ({
      _id: crypto.randomUUID(),
      _type: 'feature-cards',
      headingContent: '',
      bodyContent: '',
      cards: [],
    }),
  },
  {
    type: 'form-cta',
    label: 'Form CTA',
    icon: 'FormInput',
    isWrapper: false,
    fields: [
      { key: 'headingLine1', label: 'Heading Line 1', type: 'text' },
      { key: 'headingLine2', label: 'Heading Line 2', type: 'text' },
      { key: 'bodyContent', label: 'Body', type: 'textarea' },
    ],
    defaultData: () => ({
      _id: crypto.randomUUID(),
      _type: 'form-cta',
      headingLine1: '',
      headingLine2: '',
      bodyContent: '',
    }),
  },
  {
    type: 'image-content-cards',
    label: 'Image Content Cards',
    icon: 'Image',
    isWrapper: false,
    fields: [
      { key: 'preheadingContent', label: 'Preheading', type: 'text' },
      {
        key: 'headingType',
        label: 'Heading Type',
        type: 'select',
        options: [
          { value: 'h1', label: 'H1' },
          { value: 'h2', label: 'H2' },
          { value: 'h3', label: 'H3' },
          { value: 'h4', label: 'H4' },
          { value: 'h5', label: 'H5' },
          { value: 'h6', label: 'H6' },
        ],
        defaultValue: 'h2',
      },
      { key: 'headingContent', label: 'Heading', type: 'text', required: true },
      { key: 'bodyContent', label: 'Body', type: 'textarea' },
      {
        key: 'buttons',
        label: 'Buttons',
        type: 'array',
        fields: [
          { key: 'label', label: 'Label', type: 'text', required: true },
          {
            key: 'size',
            label: 'Size',
            type: 'select',
            options: [
              { value: 'sm', label: 'Small' },
              { value: 'md', label: 'Medium' },
              { value: 'lg', label: 'Large' },
            ],
          },
          {
            key: 'color',
            label: 'Color',
            type: 'select',
            options: [
              { value: 'primary', label: 'Primary' },
              { value: 'secondary', label: 'Secondary' },
              { value: 'neutral', label: 'Neutral' },
            ],
          },
          { key: 'hasIcon', label: 'Has Icon', type: 'boolean' },
          { key: 'url', label: 'URL', type: 'url' },
        ],
      },
      {
        key: 'cards',
        label: 'Cards',
        type: 'array',
        fields: [
          { key: 'icon', label: 'Icon', type: 'icon', required: true },
          { key: 'heading', label: 'Heading', type: 'text', required: true },
          { key: 'content', label: 'Content', type: 'textarea' },
          { key: 'alternate', label: 'Alternate Style', type: 'boolean' },
        ],
      },
      { key: 'image', label: 'Image', type: 'image', required: true },
    ],
    defaultData: () => ({
      _id: crypto.randomUUID(),
      _type: 'image-content-cards',
      preheadingContent: '',
      headingType: 'h2' as const,
      headingContent: '',
      bodyContent: '',
      buttons: [],
      cards: [],
      image: { src: '', alt: '' },
    }),
  },
  {
    type: 'image-text-split',
    label: 'Image Text Split',
    icon: 'Columns2',
    isWrapper: false,
    fields: [
      { key: 'image', label: 'Image', type: 'image' },
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'bodyContent', label: 'Body', type: 'textarea' },
      { key: 'ctaLabel', label: 'CTA Label', type: 'text' },
      { key: 'ctaUrl', label: 'CTA URL', type: 'url' },
    ],
    defaultData: () => ({
      _id: crypto.randomUUID(),
      _type: 'image-text-split',
      image: { src: '', alt: '' },
      heading: '',
      bodyContent: '',
      ctaLabel: '',
      ctaUrl: '',
    }),
  },
  {
    type: 'newsletter',
    label: 'Newsletter',
    icon: 'Mail',
    isWrapper: false,
    fields: [
      { key: 'preheadingContent', label: 'Preheading', type: 'text' },
      { key: 'headingContent', label: 'Heading', type: 'text' },
      { key: 'bodyContent', label: 'Body', type: 'textarea' },
    ],
    defaultData: () => ({
      _id: crypto.randomUUID(),
      _type: 'newsletter',
      preheadingContent: '',
      headingContent: '',
      bodyContent: '',
    }),
  },
  {
    type: 'numbered-steps',
    label: 'Numbered Steps',
    icon: 'ListOrdered',
    isWrapper: false,
    fields: [
      { key: 'preheadingContent', label: 'Preheading', type: 'text' },
      { key: 'headingContent', label: 'Heading', type: 'text', required: true },
      { key: 'bodyContent', label: 'Body', type: 'textarea', required: true },
      {
        key: 'steps',
        label: 'Steps',
        type: 'array',
        fields: [
          { key: 'icon', label: 'Icon', type: 'icon', required: true },
          { key: 'number', label: 'Number', type: 'text', required: true },
          { key: 'heading', label: 'Heading', type: 'text', required: true },
          { key: 'content', label: 'Content', type: 'textarea' },
          { key: 'alternate', label: 'Alternate Style', type: 'boolean' },
        ],
      },
    ],
    defaultData: () => ({
      _id: crypto.randomUUID(),
      _type: 'numbered-steps',
      preheadingContent: '',
      headingContent: '',
      bodyContent: '',
      steps: [],
    }),
  },
  {
    type: 'people-grid',
    label: 'People Grid',
    icon: 'Users',
    isWrapper: false,
    fields: [
      { key: 'preheadingContent', label: 'Preheading', type: 'text' },
      { key: 'headingContent', label: 'Heading', type: 'text', required: true },
      { key: 'bodyContent', label: 'Body', type: 'textarea' },
      {
        key: 'members',
        label: 'Members',
        type: 'array',
        fields: [
          { key: 'name', label: 'Name', type: 'text', required: true },
          { key: 'role', label: 'Role', type: 'text', required: true },
          { key: 'image', label: 'Image', type: 'image', required: true },
          { key: 'ctaUrl', label: 'Profile URL', type: 'url' },
        ],
      },
    ],
    defaultData: () => ({
      _id: crypto.randomUUID(),
      _type: 'people-grid',
      preheadingContent: '',
      headingContent: '',
      bodyContent: '',
      members: [],
    }),
  },
  {
    type: 'split-hero',
    label: 'Split Hero',
    icon: 'PanelLeftOpen',
    isWrapper: false,
    fields: [
      { key: 'headingContent', label: 'Heading', type: 'text', required: true },
      { key: 'bodyContent', label: 'Body', type: 'textarea' },
      { key: 'videoUrl', label: 'Video URL', type: 'url' },
      { key: 'videoPosterImage', label: 'Video Poster Image', type: 'image' },
      {
        key: 'buttons',
        label: 'Buttons',
        type: 'array',
        fields: [
          { key: 'label', label: 'Label', type: 'text', required: true },
          {
            key: 'size',
            label: 'Size',
            type: 'select',
            options: [
              { value: 'sm', label: 'Small' },
              { value: 'md', label: 'Medium' },
              { value: 'lg', label: 'Large' },
            ],
          },
          {
            key: 'color',
            label: 'Color',
            type: 'select',
            options: [
              { value: 'primary', label: 'Primary' },
              { value: 'secondary', label: 'Secondary' },
              { value: 'neutral', label: 'Neutral' },
            ],
          },
          { key: 'hasIcon', label: 'Has Icon', type: 'boolean' },
          { key: 'url', label: 'URL', type: 'url' },
        ],
      },
    ],
    defaultData: () => ({
      _id: crypto.randomUUID(),
      _type: 'split-hero',
      headingContent: '',
      bodyContent: '',
      videoUrl: '',
      videoPosterImage: { src: '', alt: '' },
      buttons: [],
    }),
  },
  {
    type: 'section',
    label: 'Section (Wrapper)',
    icon: 'Square',
    isWrapper: true,
    fields: [
      {
        key: 'backgroundColor',
        label: 'Background Color',
        type: 'select',
        options: [
          { value: 'offwhite', label: 'Off White' },
          { value: 'bluishgray', label: 'Bluish Gray' },
          { value: 'white', label: 'White' },
          { value: 'text', label: 'Text (Dark)' },
        ],
      },
      {
        key: 'paddingSize',
        label: 'Padding Size',
        type: 'select',
        options: [
          { value: 'none', label: 'None' },
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
        ],
      },
      { key: 'children', label: 'Nested Blocks', type: 'blocks' },
    ],
    defaultData: () => ({
      _id: crypto.randomUUID(),
      _type: 'section',
      backgroundColor: 'offwhite' as const,
      paddingSize: 'md' as const,
      children: [],
    }),
  },
]

export function getBlockEntry(type: BlockType): BlockRegistryEntry | undefined {
  return BLOCK_REGISTRY.find((b) => b.type === type)
}
