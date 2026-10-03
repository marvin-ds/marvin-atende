// TODO: Port routes from /backend/legacy/ into this Hono app.
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.json({ status: 'ok' }))

export default app
