import mongoose, { Schema, Document } from 'mongoose';

export interface IContactMessage extends Document {
  name?: string;
  email?: string;
  subject?: string;
  message: string;
  createdAt: Date;
}

const contactMessageSchema = new Schema<IContactMessage>(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      match: /.+\@.+\..+/,
    },
    subject: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create index
contactMessageSchema.index({ email: 1 });
contactMessageSchema.index({ createdAt: -1 });

export default mongoose.model<IContactMessage>('ContactMessage', contactMessageSchema);
