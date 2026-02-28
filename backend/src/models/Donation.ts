import mongoose, { Schema, Document } from 'mongoose';

export type DonationStatus = 'pending' | 'processing' | 'success' | 'failed';
export type PaymentMethod = 'momo' | 'bank' | 'card';

export interface IDonation extends Document {
  donorName: string;
  donorEmail?: string;
  donorPhone?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  status: DonationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const donationSchema = new Schema<IDonation>(
  {
    donorName: {
      type: String,
      required: true,
      trim: true,
    },
    donorEmail: {
      type: String,
      trim: true,
      match: /.+\@.+\..+/,
    },
    donorPhone: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['momo', 'bank', 'card'],
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'success', 'failed'],
      default: 'pending',
      index: true,
    },
  },
  { timestamps: true }
);

// Create indexes
donationSchema.index({ status: 1 });
donationSchema.index({ createdAt: -1 });
donationSchema.index({ transactionId: 1 });

export default mongoose.model<IDonation>('Donation', donationSchema);
