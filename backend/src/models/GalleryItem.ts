import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryItem extends Document {
  title: string;
  description?: string;
  imageUrl: string;
  mediaType: 'image' | 'video';
  category?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const galleryItemSchema = new Schema<IGalleryItem>(
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
    imageUrl: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      default: 'image',
    },
    category: {
      type: String,
      default: 'Artwork',
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create indexes
galleryItemSchema.index({ category: 1 });
galleryItemSchema.index({ createdAt: -1 });
galleryItemSchema.index({ title: 'text', description: 'text' });

export default mongoose.model<IGalleryItem>('GalleryItem', galleryItemSchema);
