import { generateSecret, generateURI, verify } from 'otplib'

export function generateTotpSecret(): string {
  return generateSecret()
}

export async function verifyTotp(token: string, secret: string): Promise<boolean> {
  const result = await verify({ token, secret })
  return result.valid
}

export function getTotpUri(email: string, secret: string): string {
  return generateURI({
    issuer: 'PaperHouse CMS',
    label: email,
    secret,
  })
}
