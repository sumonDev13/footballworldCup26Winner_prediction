import { Router, Request, Response } from 'express'
import Prediction from '../models/Prediction'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
  try {
    const prediction = new Prediction({
      userId: req.body.userId || 'anonymous',
      groups: req.body.groups || {},
      roundOf32: req.body.roundOf32 || [],
      roundOf16: req.body.roundOf16 || [],
      quarterFinals: req.body.quarterFinals || [],
      semiFinals: req.body.semiFinals || [],
      final: req.body.final || { team1: '', team2: '' },
      champion: req.body.champion || '',
    })
    await prediction.save()
    res.status(201).json(prediction)
  } catch (error) {
    res.status(500).json({ error: 'Failed to save prediction' })
  }
})

router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const prediction = await Prediction.findOne({ userId: req.params.userId })
    if (!prediction) {
      return res.status(404).json({ error: 'Not found' })
    }
    res.json(prediction)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prediction' })
  }
})

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const prediction = await Prediction.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
    if (!prediction) {
      return res.status(404).json({ error: 'Not found' })
    }
    res.json(prediction)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update prediction' })
  }
})

export default router
