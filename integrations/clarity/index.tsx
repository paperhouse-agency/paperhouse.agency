'use client'

import Clarity from '@microsoft/clarity'
import { useEffect } from 'react'

const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID

export function MicrosoftClarity() {
  useEffect(() => {
    if (!projectId) return
    Clarity.init(projectId)
  }, [])

  return null
}
