import mongoose, { Schema, Document } from 'mongoose'

export interface IPrediction extends Document {
  userId: string
  createdAt: Date
  updatedAt: Date
  groups: Record<string, { first: string; second: string; third: string; fourth: string }>
  roundOf32: string[]
  roundOf16: string[]
  quarterFinals: string[]
  semiFinals: string[]
  final: { team1: string; team2: string }
  champion: string
}

const PredictionSchema = new Schema<IPrediction>({
  userId: { type: String, required: true },
  groups: { type: Schema.Types.Mixed, default: {} },
  roundOf32: { type: [String], default: [] },
  roundOf16: { type: [String], default: [] },
  quarterFinals: { type: [String], default: [] },
  semiFinals: { type: [String], default: [] },
  final: {
    team1: { type: String, default: '' },
    team2: { type: String, default: '' },
  },
  champion: { type: String, default: '' },
}, { timestamps: true })

export default mongoose.model<IPrediction>('Prediction', PredictionSchema)
