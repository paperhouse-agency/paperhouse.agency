import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import type { AdminSession } from '@/libs/cms/types'
import { sessionOptions } from './session-config'

export async function getSession() {
  return getIronSession<AdminSession>(await cookies(), sessionOptions)
}
