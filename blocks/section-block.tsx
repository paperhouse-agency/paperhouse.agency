import type { BlockSchema } from '@/libs/cms/block-schema'
import type { BlockData } from '@/libs/cms/types'

export interface SectionBlockProps {
  backgroundColor?: 'offwhite' | 'bluishgray' | 'white' | 'text'
  paddingSize?: 'none' | 'sm' | 'md' | 'lg'
  children?: BlockData[]
}

const bgMap: Record<string, string> = {
  offwhite: 'bg-offwhite',
  bluishgray: 'bg-bluishgray',
  white: 'bg-white',
  text: 'bg-text',
}

const paddingMap: Record<string, string> = {
  none: '',
  sm: 'py-8',
  md: 'py-15',
  lg: 'py-24',
}

export function SectionBlock({ backgroundColor = 'offwhite', paddingSize = 'md' }: SectionBlockProps) {
  return (
    <section className={`${bgMap[backgroundColor] ?? ''} ${paddingMap[paddingSize] ?? ''}`} />
  )
}

export const cmsSchema: BlockSchema = {
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
}
