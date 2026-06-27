import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.API_PORT ?? 4000

app.use(cors({ origin: process.env.NEXTAUTH_URL ?? 'http://localhost:3000' }))
app.use(express.json({ limit: '50mb' }))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'roblox-ui-builder-api' })
})

/** Project routes — wire to Prisma when DATABASE_URL is configured */
app.get('/api/projects', async (_req, res) => {
  res.json({ projects: [], message: 'Connect PostgreSQL and run prisma db push to enable persistence' })
})

app.post('/api/projects', async (req, res) => {
  const { name, data } = req.body
  res.status(201).json({
    id: crypto.randomUUID(),
    name: name ?? 'Untitled Project',
    data,
    createdAt: new Date().toISOString(),
  })
})

app.get('/api/projects/:id', async (req, res) => {
  res.status(404).json({ error: 'Project not found', id: req.params.id })
})

app.put('/api/projects/:id', async (req, res) => {
  res.json({ id: req.params.id, updated: true, data: req.body.data })
})

app.delete('/api/projects/:id', async (req, res) => {
  res.json({ id: req.params.id, deleted: true })
})

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
