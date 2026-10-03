import { blink } from '@/blink/client'
import { createBlinkDataClient } from './compat'

export const supabaseAdmin = Object.assign(createBlinkDataClient(blink), { auth: blink.auth })
