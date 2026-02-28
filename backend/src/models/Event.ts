import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  capacity: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    location: {
      type: String,
      trim: true,
    },
    capacity: {
      type: Number,
      default: 0,
      min: 0,
    },
    imageUrl: String,
  },
  { timestamps: true }
);

// Create indexes
eventSchema.index({ date: 1 });
eventSchema.index({ title: 'text', description: 'text' });

export default mongoose.model<IEvent>('Event', eventSchema);
