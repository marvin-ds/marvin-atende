import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: import.meta.env.VITE_BLINK_PROJECT_ID || 'atendezap-template-para-7pbxxz0g',
  publishableKey: import.meta.env.VITE_BLINK_PUBLISHABLE_KEY || 'blnk_pk__V1JtFPCdd-xzBKAaF48xj44ZcN95CBr',
  authRequired: false,
  auth: { mode: 'managed' },
})
