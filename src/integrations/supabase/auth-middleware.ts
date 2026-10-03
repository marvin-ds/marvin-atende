import { createMiddleware } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { blink } from '@/blink/client'

export const requireSupabaseAuth = createMiddleware({ type: 'function' }).server(async ({ next }) => {
  const request = getRequest()
  const auth = await blink.auth.verifyToken(request?.headers.get('authorization'))
  if (!auth.valid) throw new Error('Unauthorized: Invalid Blink token')
  return next({ context: { supabase: undefined, userId: auth.userId, claims: auth } })
})
