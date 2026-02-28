import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  name: string;
  email: string;
  phone?: string;
  attendees: number;
  eventId: mongoose.Types.ObjectId;
  eventTitle: string;
  createdAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      match: /.+\@.+\..+/,
    },
    phone: {
      type: String,
      trim: true,
    },
    attendees: {
      type: Number,
      required: true,
      min: 1,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    eventTitle: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create indexes
bookingSchema.index({ eventId: 1 });
bookingSchema.index({ email: 1 });
bookingSchema.index({ createdAt: -1 });

export default mongoose.model<IBooking>('Booking', bookingSchema);
