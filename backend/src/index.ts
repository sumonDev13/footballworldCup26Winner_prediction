import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db'
import teamsRouter from './routes/teams'
import predictionsRouter from './routes/predictions'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.use('/api/teams', teamsRouter)
app.use('/api/predictions', predictionsRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

async function start() {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
