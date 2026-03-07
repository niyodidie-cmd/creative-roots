import mongoose, { Schema, Document } from 'mongoose';

export interface IHomepageContent extends Document {
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  aboutText: string;
  featuredGalleryItems: mongoose.Types.ObjectId[];
  featuredEventId?: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const homepageContentSchema = new Schema<IHomepageContent>(
  {
    heroTitle: {
      type: String,
      required: true,
      default: 'Creative Roots Rwanda',
    },
    heroSubtitle: {
      type: String,
      required: true,
      default: 'Empowering youth through art, sculpture, and storytelling',
    },
    heroImageUrl: {
      type: String,
      default: '/images/hero/main.jpg',
    },
    aboutText: {
      type: String,
      required: true,
      default: 'Creative Roots Rwanda is dedicated to nurturing young talent through artistic expression and cultural preservation.',
    },
    featuredGalleryItems: [{
      type: Schema.Types.ObjectId,
      ref: 'GalleryItem',
    }],
    featuredEventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
    },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

export default mongoose.model<IHomepageContent>('HomepageContent', homepageContentSchema);