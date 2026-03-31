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
import * as homepageController from '../controllers/homepageController';
import * as visitorController from '../controllers/visitorController';
import * as activityLogController from '../controllers/activityLogController';
import * as settingsController from '../controllers/settingsController';
import * as volunteersController from '../controllers/volunteersController';
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
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
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
router.get('/auth/profile', verifyToken, authController.getProfile);

// ============================================
// EVENTS ROUTES
// ============================================
router.get('/events', eventsController.getAllEvents);
router.get('/events/:id', eventsController.getEventById);
router.post('/events', verifyToken, upload.single('image'), eventsController.createEvent);
router.put('/events/:id', verifyToken, upload.single('image'), eventsController.updateEvent);
router.delete('/events/:id', verifyToken, eventsController.deleteEvent);

// ============================================
// BOOKINGS ROUTES
// ============================================
router.get('/bookings', verifyToken, bookingsController.getAllBookings);
router.get('/bookings/:id', verifyToken, bookingsController.getBookingById);
router.post('/bookings', bookingsController.createBooking);
router.put('/bookings/:id/status', verifyToken, bookingsController.updateBookingStatus);
router.delete('/bookings/:id', verifyToken, bookingsController.deleteBooking);

// ============================================
// DONATIONS ROUTES
// ============================================
router.get('/donations', verifyToken, donationsController.getAllDonations);
router.post('/donations', donationsController.createDonation);
router.post('/donations/momo', donationsController.createMoMoDonation);
router.post('/donations/confirm', donationsController.confirmDonation);
router.get('/donations/stats', verifyToken, donationsController.getDonationStats);

// ============================================
// CONTACT ROUTES
// ============================================
router.get('/contact', verifyToken, contactController.getAllMessages);
router.get('/contact/:id', verifyToken, contactController.getMessageById);
router.post('/contact', contactController.createMessage);
router.put('/contact/:id/read', verifyToken, contactController.markMessageAsRead);
router.delete('/contact/:id', verifyToken, contactController.deleteMessage);

// ============================================
// VOLUNTEER ROUTES
// ============================================
router.get('/volunteers', verifyToken, volunteersController.getAllVolunteers);
router.get('/volunteers/:id', verifyToken, volunteersController.getVolunteerById);
router.post('/volunteers', volunteersController.createVolunteer);
router.put('/volunteers/:id', verifyToken, volunteersController.updateVolunteer);
router.delete('/volunteers/:id', verifyToken, volunteersController.deleteVolunteer);

// ============================================
// GALLERY ROUTES
// ============================================
router.get('/gallery', galleryController.getAllGalleryItems);
router.get('/gallery/:id', verifyToken, galleryController.getGalleryItemById);
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

// ============================================
// HOMEPAGE ROUTES
// ============================================
router.get('/homepage', homepageController.getHomepageContent);
router.put('/homepage', verifyToken, homepageController.updateHomepageContent);

// ============================================
// VISITOR TRACKING ROUTES
// ============================================
router.post('/visitors/track', visitorController.trackVisitor);
router.get('/visitors/stats', verifyToken, visitorController.getVisitorStats);

// ============================================
// ACTIVITY LOGS ROUTES
// ============================================
router.get('/activity-logs', verifyToken, activityLogController.getActivityLogs);
router.get('/activity-logs/recent', verifyToken, activityLogController.getRecentActivity);

// ============================================
// SETTINGS ROUTES
// ============================================
router.get('/settings', verifyToken, settingsController.getSettings);
router.put('/settings', verifyToken, settingsController.updateSettings);
router.put('/settings/password', verifyToken, settingsController.changePassword);

export default router;
