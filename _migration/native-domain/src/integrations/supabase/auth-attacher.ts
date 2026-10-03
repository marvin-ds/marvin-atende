import { createMiddleware } from '@tanstack/react-start'
import { blink } from '@/blink/client'

export const attachSupabaseAuth = createMiddleware({ type: 'function' }).client(async ({ next }) => {
  const token = blink.auth.isAuthenticated() ? await blink.auth.getValidToken() : null
  return next({ headers: token ? { Authorization: `Bearer ${token}` } : {} })
})
