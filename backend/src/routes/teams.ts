import { Router, Request, Response } from 'express'
import Team from '../models/Team'
import { teamsData } from '../data/teams'

const router = Router()

router.get('/seed', async (_req: Request, res: Response) => {
  try {
    await Team.deleteMany({})
    const teams = await Team.insertMany(teamsData)
    res.json({ message: 'Teams seeded', count: teams.length })
  } catch (error) {
    res.status(500).json({ error: 'Failed to seed teams' })
  }
})

router.get('/', async (_req: Request, res: Response) => {
  try {
    const teams = await Team.find().sort({ group: 1, fifaRanking: 1 })
    res.json(teams)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teams' })
  }
})

router.get('/group/:group', async (req: Request, res: Response) => {
  try {
    const teams = await Team.find({ group: req.params.group.toUpperCase() }).sort({ fifaRanking: 1 })
    res.json(teams)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch group' })
  }
})

export default router
