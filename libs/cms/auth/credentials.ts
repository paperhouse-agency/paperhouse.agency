import bcrypt from 'bcryptjs'
import { readUsers } from '@/libs/cms/storage'

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12)
}

export async function findUserByEmail(email: string) {
  const users = await readUsers()
  return users.find((u) => u.email === email) ?? null
}

export async function getUserById(id: string) {
  const users = await readUsers()
  return users.find((u) => u.id === id) ?? null
}
