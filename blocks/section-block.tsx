export interface SectionBlockProps {
  backgroundColor?: 'offwhite' | 'bluishgray' | 'white' | 'text'
  paddingSize?: 'none' | 'sm' | 'md' | 'lg'
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

export function SectionBlock({
  backgroundColor = 'offwhite',
  paddingSize = 'md',
}: SectionBlockProps) {
  return (
    <section
      className={`${bgMap[backgroundColor] ?? ''} ${paddingMap[paddingSize] ?? ''}`}
    />
  )
}
