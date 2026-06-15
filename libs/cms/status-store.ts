import { create } from 'zustand'

interface CmsStatusState {
  isSaving: boolean
  isDirty: boolean
  lastSaved: Date | null
  markSaving: () => void
  markSaved: () => void
  markDirty: () => void
  markError: () => void
}

export const useCmsStatus = create<CmsStatusState>((set) => ({
  isSaving: false,
  isDirty: false,
  lastSaved: null,
  markSaving: () => set({ isSaving: true }),
  markSaved: () => set({ isSaving: false, lastSaved: new Date(), isDirty: false }),
  markDirty: () => set({ isDirty: true }),
  markError: () => set({ isSaving: false }),
}))
