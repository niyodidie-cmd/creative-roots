import mongoose, { Schema, Document } from 'mongoose';

export interface IVisitor extends Document {
  ip: string;
  userAgent?: string;
  page: string;
  referrer?: string;
  sessionId: string;
  createdAt: Date;
}

const visitorSchema = new Schema<IVisitor>(
  {
    ip: {
      type: String,
      required: true,
      index: true,
    },
    userAgent: String,
    page: {
      type: String,
      required: true,
    },
    referrer: String,
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Create indexes
visitorSchema.index({ createdAt: -1 });
visitorSchema.index({ page: 1, createdAt: -1 });

export default mongoose.model<IVisitor>('Visitor', visitorSchema);