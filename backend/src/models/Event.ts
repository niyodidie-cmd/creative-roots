import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  time?: string;
  location: string;
  capacity: number;
  imageUrl?: string;
  published: boolean;
  status: 'upcoming' | 'past';
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
    time: {
      type: String,
      trim: true,
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
    published: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['upcoming', 'past'],
      default: 'upcoming',
    },
  },
  { timestamps: true }
);

// Create indexes
eventSchema.index({ date: 1 });
eventSchema.index({ title: 'text', description: 'text' });

export default mongoose.model<IEvent>('Event', eventSchema);
