import mongoose, { Schema, Document } from 'mongoose'

export interface ITeam extends Document {
  name: string
  flag: string
  group: string
  fifaRanking: number
}

const TeamSchema = new Schema<ITeam>({
  name: { type: String, required: true },
  flag: { type: String, required: true },
  group: { type: String, required: true },
  fifaRanking: { type: Number, default: 0 },
})

export default mongoose.model<ITeam>('Team', TeamSchema)
