import mongoose, { Schema, Document } from 'mongoose';

export interface IVolunteer extends Document {
  name: string;
  email: string;
  phone: string;
  skills: string;
  status: 'new' | 'contacted' | 'assigned' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const volunteerSchema = new Schema<IVolunteer>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, match: /.+\@.+\..+/ },
    phone: { type: String, required: true, trim: true },
    skills: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'assigned', 'inactive'],
      default: 'new',
      index: true,
    },
  },
  { timestamps: true }
);

volunteerSchema.index({ createdAt: -1 });

export default mongoose.model<IVolunteer>('Volunteer', volunteerSchema);
