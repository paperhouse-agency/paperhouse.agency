import type { SessionOptions } from 'iron-session'
import type { AdminSession } from '@/libs/cms/types'

export const sessionOptions: SessionOptions = {
  password: process.env.CMS_SESSION_SECRET!,
  cookieName: 'cms_session',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 8,
  },
}

declare module 'iron-session' {
  interface IronSessionData extends AdminSession {}
}
