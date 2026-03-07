import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  action: string;
  description: string;
  adminId?: mongoose.Types.ObjectId;
  adminUsername?: string;
  entityType?: string;
  entityId?: mongoose.Types.ObjectId;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    action: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    adminUsername: String,
    entityType: {
      type: String,
      enum: ['event', 'gallery', 'message', 'booking', 'homepage', 'user'],
    },
    entityId: {
      type: Schema.Types.ObjectId,
    },
    ip: String,
    userAgent: String,
  },
  { timestamps: true }
);

// Create indexes
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ adminId: 1, createdAt: -1 });
activityLogSchema.index({ action: 1 });

export default mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);