import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserProgress extends Document {
  userName: string;
  userAvatar?: string;
  selectedSurahIds: number[];
  totalMemorizedCount: number;
  totalAyahsMemorized: number;
  percentageCompleted: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserProgressSchema: Schema = new Schema(
  {
    userName: { type: String, required: true },
    userAvatar: { type: String, default: '' },
    selectedSurahIds: { type: [Number], default: [] },
    totalMemorizedCount: { type: Number, default: 0 },
    totalAyahsMemorized: { type: Number, default: 0 },
    percentageCompleted: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const UserProgress: Model<IUserProgress> =
  mongoose.models.UserProgress ||
  mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);
