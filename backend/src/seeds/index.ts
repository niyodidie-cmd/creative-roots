import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { env } from '../config/env';
import User from '../models/User';
import Event from '../models/Event';
import GalleryItem from '../models/GalleryItem';
import SuccessStory from '../models/SuccessStory';

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(env.mongodbUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✓ Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep data)
    // await User.deleteMany({});
    // await Event.deleteMany({});
    // await GalleryItem.deleteMany({});
    // await SuccessStory.deleteMany({});
    // console.log('✓ Cleared existing data');

    // Seed Admin User
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new User({
        username: 'admin',
        password: hashedPassword,
        email: 'admin@creativeroots.rw',
        lastLogin: new Date(),
      });
      await admin.save();
      console.log('✓ Admin user created (username: admin, password: admin123)');
    } else {
      console.log('✓ Admin user already exists');
    }

    // Seed Sample Events
    const eventsCount = await Event.countDocuments();
    if (eventsCount === 0) {
      const events = [
        {
          title: 'Traditional Art Workshop',
          description:
            'Learn traditional Rwandan art techniques from master craftspeople. Perfect for beginners and experienced artists alike.',
          date: new Date('2026-03-20T10:00:00'),
          location: 'Kigali, Rwanda',
          capacity: 30,
          imageUrl: 'https://via.placeholder.com/600x400?text=Art+Workshop',
        },
        {
          title: 'Music Performance Night',
          description:
            'Experience live performances from local musicians showcasing contemporary and traditional Rwandan music.',
          date: new Date('2026-03-25T18:00:00'),
          location: 'National Museum, Kigali',
          capacity: 100,
          imageUrl: 'https://via.placeholder.com/600x400?text=Music+Night',
        },
        {
          title: 'Youth Entrepreneurship Seminar',
          description:
            'Join us for an inspiring seminar on starting a creative business. Learn marketing, branding, and business management.',
          date: new Date('2026-04-05T14:00:00'),
          location: 'Innovation Hub, Kigali',
          capacity: 50,
          imageUrl: 'https://via.placeholder.com/600x400?text=Entrepreneurship',
        },
        {
          title: 'Community Art Exhibition',
          description:
            'Visit our gallery to see works from emerging local artists. Meet the artists and support the creative community.',
          date: new Date('2026-04-10T09:00:00'),
          location: 'Creative Roots Studio',
          capacity: 200,
          imageUrl: 'https://via.placeholder.com/600x400?text=Exhibition',
        },
        {
          title: 'Dance & Movement Workshop',
          description:
            'Explore contemporary and traditional dance forms with professional instructors. All levels welcome.',
          date: new Date('2026-04-15T16:00:00'),
          location: 'Studio A, Kigali',
          capacity: 40,
          imageUrl: 'https://via.placeholder.com/600x400?text=Dance+Workshop',
        },
      ];

      await Event.insertMany(events);
      console.log(`✓ Created ${events.length} sample events`);
    } else {
      console.log(`✓ Events already exist (${eventsCount} events found)`);
    }

    // Seed Sample Gallery Items
    const galleryCount = await GalleryItem.countDocuments();
    if (galleryCount === 0) {
      const galleryItems = [
        {
          title: 'Kigali Sunset',
          description: 'Beautiful sunset view over Kigali city',
          imageUrl: 'https://via.placeholder.com/400x400?text=Sunset',
          category: 'Photography',
        },
        {
          title: 'Traditional Basket',
          description: 'Handwoven traditional Rwandan basket',
          imageUrl: 'https://via.placeholder.com/400x400?text=Basket',
          category: 'Crafts',
        },
        {
          title: 'Modern Art Piece',
          description: 'Contemporary artwork by local artist',
          imageUrl: 'https://via.placeholder.com/400x400?text=Modern+Art',
          category: 'Artwork',
        },
        {
          title: 'Coffee Harvest',
          description: 'Documentary photograph of coffee harvest',
          imageUrl: 'https://via.placeholder.com/400x400?text=Coffee',
          category: 'Photography',
        },
        {
          title: 'Carved Sculpture',
          description: 'Hand-carved wooden sculpture',
          imageUrl: 'https://via.placeholder.com/400x400?text=Sculpture',
          category: 'Crafts',
        },
        {
          title: 'Urban Mural',
          description: 'Street art from Kigali',
          imageUrl: 'https://via.placeholder.com/400x400?text=Mural',
          category: 'Street Art',
        },
      ];

      await GalleryItem.insertMany(galleryItems);
      console.log(`✓ Created ${galleryItems.length} sample gallery items`);
    } else {
      console.log(`✓ Gallery items already exist (${galleryCount} items found)`);
    }

    // Seed Sample Success Stories
    const storiesCount = await SuccessStory.countDocuments();
    if (storiesCount === 0) {
      const stories = [
        {
          title: 'From Traditional to Global: Beatrice Story',
          description:
            'Beatrice started with traditional weaving and now sells her artwork globally. She employs 5 other artisans from her community.',
          author: 'Beatrice Uwimana',
          imageUrl: 'https://via.placeholder.com/300x300?text=Beatrice',
        },
        {
          title: 'Music Entrepreneurship Success',
          description:
            'Jean-Paul turned his passion for music into a sustainable business, producing 3 albums and touring across Africa.',
          author: 'Jean-Paul Nishimwe',
          imageUrl: 'https://via.placeholder.com/300x300?text=Jean-Paul',
        },
        {
          title: 'Youth Through Art',
          description:
            'Marie established an art school for underprivileged youth, impacting over 200 students so far with vocational skills.',
          author: 'Marie Mukamana',
          imageUrl: 'https://via.placeholder.com/300x300?text=Marie',
        },
        {
          title: 'Documentary Filmmaker',
          description:
            'Peter used his creative skills to document community stories, winning several international film festival awards.',
          author: 'Peter Kamali',
          imageUrl: 'https://via.placeholder.com/300x300?text=Peter',
        },
      ];

      await SuccessStory.insertMany(stories);
      console.log(`✓ Created ${stories.length} sample success stories`);
    } else {
      console.log(`✓ Success stories already exist (${storiesCount} stories found)`);
    }

    console.log(`
╔════════════════════════════════════════╗
║  Database Seeded Successfully! ✓       ║
╚════════════════════════════════════════╝

Test Credentials:
- Username: admin
- Password: admin123

Sample Events: 5
Sample Gallery Items: 6
Sample Success Stories: 4

You can now log in to the admin dashboard and test the application.
    `);

    await mongoose.connection.close();
  } catch (error) {
    console.error('✗ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
