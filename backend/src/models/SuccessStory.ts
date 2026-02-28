import mongoose, { Schema, Document } from 'mongoose';

export interface ISuccessStory extends Document {
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  author?: string;
  createdAt: Date;
  updatedAt: Date;
}

const successStorySchema = new Schema<ISuccessStory>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: String,
    videoUrl: String,
    author: {
      type: String,
      default: 'Anonymous',
    },
  },
  { timestamps: true }
);

// Create indexes
successStorySchema.index({ createdAt: -1 });
successStorySchema.index({ title: 'text', description: 'text' });

export default mongoose.model<ISuccessStory>('SuccessStory', successStorySchema);
