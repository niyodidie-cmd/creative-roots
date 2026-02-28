import express, { Router } from 'express';
import multer from 'multer';
import path from 'path';
import * as authController from '../controllers/authController';
import * as eventsController from '../controllers/eventsController';
import * as bookingsController from '../controllers/bookingsController';
import * as donationsController from '../controllers/donationsController';
import * as contactController from '../controllers/contactController';
import * as galleryController from '../controllers/galleryController';
import * as storiesController from '../controllers/storiesController';
import { verifyToken } from '../middleware/auth';
import { env } from '../config/env';

const router = Router();

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, env.upload.uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: env.upload.maxFileSize },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'));
    }
  },
});

// ============================================
// AUTHENTICATION ROUTES
// ============================================
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);

// ============================================
// EVENTS ROUTES
// ============================================
router.get('/events', eventsController.getAllEvents);
router.post('/events', verifyToken, upload.single('image'), eventsController.createEvent);
router.delete('/events/:id', verifyToken, eventsController.deleteEvent);
router.get('/admin/stats', verifyToken, eventsController.getAdminStats);

// ============================================
// BOOKINGS ROUTES
// ============================================
router.get('/bookings', verifyToken, bookingsController.getAllBookings);
router.post('/bookings', bookingsController.createBooking);
router.delete('/bookings/:id', verifyToken, bookingsController.deleteBooking);
router.get('/bookings/export/csv', verifyToken, bookingsController.exportBookingsCSV);

// ============================================
// DONATIONS ROUTES
// ============================================
router.get('/donations', verifyToken, donationsController.getAllDonations);
router.post('/donations/momo', donationsController.createMoMoDonation);
router.post('/donations/confirm', donationsController.confirmDonation);
router.get('/donations/stats', verifyToken, donationsController.getDonationStats);

// ============================================
// CONTACT ROUTES
// ============================================
router.get('/contact', verifyToken, contactController.getAllMessages);
router.post('/contact', contactController.createMessage);
router.delete('/contact/:id', verifyToken, contactController.deleteMessage);

// ============================================
// GALLERY ROUTES
// ============================================
router.get('/gallery', galleryController.getAllGalleryItems);
router.post('/gallery', verifyToken, upload.single('image'), galleryController.createGalleryItem);
router.put('/gallery/:id', verifyToken, upload.single('image'), galleryController.updateGalleryItem);
router.delete('/gallery/:id', verifyToken, galleryController.deleteGalleryItem);

// ============================================
// SUCCESS STORIES ROUTES
// ============================================
router.get('/stories', storiesController.getAllSuccessStories);
router.post('/stories', verifyToken, upload.single('image'), storiesController.createSuccessStory);
router.put('/stories/:id', verifyToken, upload.single('image'), storiesController.updateSuccessStory);
router.delete('/stories/:id', verifyToken, storiesController.deleteSuccessStory);

export default router;
