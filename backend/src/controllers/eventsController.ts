import { Request, Response } from 'express';
import Event from '../models/Event';
import Booking from '../models/Booking';
import ActivityLog from '../models/ActivityLog';

export const getAllEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, published } = req.query;
    const filter: any = {};

    if (status) filter.status = status;
    if (published !== undefined) filter.published = published === 'true';

    const events = await Event.find(filter)
      .sort({ date: 1 })
      .lean();

    // Get booked count for each event
    const eventsWithBookings = await Promise.all(
      events.map(async (event) => {
        const booked = await Booking.aggregate([
          { $match: { eventId: event._id } },
          { $group: { _id: null, total: { $sum: '$attendees' } } },
        ]);
        return {
          ...event,
          booked: booked[0]?.total || 0,
        };
      })
    );

    res.json(eventsWithBookings);
  } catch (error: any) {
    console.error('Events fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    // Get booked count
    const booked = await Booking.aggregate([
      { $match: { eventId: event._id } },
      { $group: { _id: null, total: { $sum: '$attendees' } } },
    ]);

    res.json({
      ...event.toObject(),
      booked: booked[0]?.total || 0,
    });
  } catch (error: any) {
    console.error('Event fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};

export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, date, time, location, capacity, published } = req.body;

    if (!title || !date) {
      res.status(400).json({ error: 'Title and date required' });
      return;
    }

    const eventDate = new Date(date);
    const status = eventDate > new Date() ? 'upcoming' : 'past';

    const event = new Event({
      title,
      description,
      date: eventDate,
      time,
      location,
      capacity: capacity || 0,
      published: published !== undefined ? published : true,
      status,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
    });

    await event.save();

    // Log activity
    await ActivityLog.create({
      action: 'create',
      description: `Created event: ${title}`,
      adminId: req.admin?.id,
      adminUsername: req.admin?.username,
      entityType: 'event',
      entityId: event._id,
    });

    res.status(201).json({
      success: true,
      event,
    });
  } catch (error: any) {
    console.error('Event creation error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, date, time, location, capacity, published, status } = req.body;

    const updateData: any = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (date) {
      updateData.date = new Date(date);
      updateData.status = updateData.date > new Date() ? 'upcoming' : 'past';
    }
    if (time !== undefined) updateData.time = time;
    if (location !== undefined) updateData.location = location;
    if (capacity !== undefined) updateData.capacity = capacity;
    if (published !== undefined) updateData.published = published;
    if (status) updateData.status = status;
    if (req.file) updateData.imageUrl = `/uploads/${req.file.filename}`;

    const event = await Event.findByIdAndUpdate(id, updateData, { new: true });

    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    // Log activity
    await ActivityLog.create({
      action: 'update',
      description: `Updated event: ${event.title}`,
      adminId: req.admin?.id,
      adminUsername: req.admin?.username,
      entityType: 'event',
      entityId: event._id,
    });

    res.json({
      success: true,
      event,
    });
  } catch (error: any) {
    console.error('Event update error:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
};

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    await Event.findByIdAndDelete(id);
    // Also delete associated bookings
    await Booking.deleteMany({ eventId: id });

    // Log activity
    await ActivityLog.create({
      action: 'delete',
      description: `Deleted event: ${event.title}`,
      adminId: req.admin?.id,
      adminUsername: req.admin?.username,
      entityType: 'event',
      entityId: id,
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Event deletion error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};
};

export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, date, location, capacity } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    if (title) event.title = title;
    if (description) event.description = description;
    if (date) event.date = new Date(date);
    if (location) event.location = location;
    if (capacity) event.capacity = capacity;
    if (req.file) event.imageUrl = `/uploads/${req.file.filename}`;

    await event.save();

    res.json({
      success: true,
      event,
    });
  } catch (error: any) {
    console.error('Event update error:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
};

export const getAdminStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalDonations = await (await import('../models/Donation')).default.countDocuments({
      status: 'success',
    });

    // compute total booking revenue (amount field)
    const revenueAgg = await Booking.aggregate([
      { $match: { amount: { $exists: true } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // recent bookings / donations
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const DonationModel = (await import('../models/Donation')).default;
    const recentDonations = await DonationModel.find({ status: 'success' })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      events: totalEvents,
      bookings: totalBookings,
      donations: totalDonations,
      totalRevenue,
      recentBookings,
      recentDonations,
    });
  } catch (error: any) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
