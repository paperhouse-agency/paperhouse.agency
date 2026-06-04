import type { BlockData, BlockType, LucideIconName } from './types'

export type FieldType =
  | 'text'
  | 'textarea'
  | 'image'
  | 'url'
  | 'select'
  | 'array'
  | 'blocks'
  | 'boolean'
  | 'icon'

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

export interface BlockSchema {
  type: BlockType
  label: string
  icon: LucideIconName
  isWrapper?: boolean
  fields: FieldDef[]
  defaultData: () => BlockData
}
