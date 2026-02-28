import { Request, Response } from 'express';
import Event from '../models/Event';
import Booking from '../models/Booking';

export const getAllEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await Event.find({ date: { $gte: new Date() } })
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

export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, date, location, capacity } = req.body;

    if (!title || !date) {
      res.status(400).json({ error: 'Title and date required' });
      return;
    }

    const event = new Event({
      title,
      description,
      date: new Date(date),
      location,
      capacity: capacity || 0,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
    });

    await event.save();

    res.status(201).json({
      success: true,
      event,
    });
  } catch (error: any) {
    console.error('Event creation error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await Event.findByIdAndDelete(id);
    // Also delete associated bookings
    await Booking.deleteMany({ eventId: id });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Event deletion error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};

export const getAdminStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalDonations = await (await import('../models/Donation')).default.countDocuments({
      status: 'success',
    });

    res.json({
      events: totalEvents,
      bookings: totalBookings,
      donations: totalDonations,
    });
  } catch (error: any) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
