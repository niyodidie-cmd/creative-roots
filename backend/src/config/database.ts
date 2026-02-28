import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined');
    }

    await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✓ MongoDB connected successfully');

    // Create indexes
    createIndexes();
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error);
    process.exit(1);
  }
};

const createIndexes = async (): Promise<void> => {
  try {
    // Import models to ensure indexes are created
    require('../models/User');
    require('../models/Event');
    require('../models/Booking');
    require('../models/Donation');
    require('../models/ContactMessage');
    require('../models/GalleryItem');
    require('../models/SuccessStory');

    console.log('✓ Database indexes created');
  } catch (error) {
    console.error('Index creation error:', error);
  }
};

export default connectDB;
