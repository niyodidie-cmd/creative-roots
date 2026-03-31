import { Request, Response } from 'express';
import Booking from '../models/Booking';
import Event from '../models/Event';
import ActivityLog from '../models/ActivityLog';
import { sendBookingConfirmation } from '../utils/mailer';
import whatsappService from '../utils/whatsapp';

export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const filter: any = {};

    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('eventId', 'title date location')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error: any) {
    console.error('Bookings fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export const getBookingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate('eventId', 'title date location');

    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    res.json(booking);
  } catch (error: any) {
    console.error('Booking fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, attendees, eventId, amount, paymentMethod } = req.body;

    if (!name || !email || !attendees || !eventId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // amount & paymentMethod are optional; if amount provided, ensure positive
    if (amount && amount <= 0) {
      res.status(400).json({ error: 'Amount must be positive' });
      return;
    }

    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    // Check capacity
    const totalBooked = await Booking.aggregate([
      { $match: { eventId: event._id } },
      { $group: { _id: null, total: { $sum: '$attendees' } } },
    ]);

    const booked = totalBooked[0]?.total || 0;
    if (booked + attendees > event.capacity) {
      res.status(400).json({ error: 'Not enough available spots' });
      return;
    }

    const booking = new Booking({
      name,
      email,
      phone,
      attendees,
      eventId,
      eventTitle: event.title,
      amount,
      paymentMethod,
    });

    await booking.save();

    // Log activity
    await ActivityLog.create({
      action: 'booking_created',
      description: `New booking for ${event.title} by ${name}`,
      entityType: 'booking',
      entityId: booking._id,
    });

    // Send confirmation email
    try {
      await sendBookingConfirmation(email, name, event.title);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    // Send WhatsApp notification
    try {
      await whatsappService.sendBookingNotification(name, email, event.title, attendees);
    } catch (whatsappError) {
      console.error('WhatsApp sending failed:', whatsappError);
    }

    res.status(201).json({
      success: true,
      bookingId: booking._id,
    });
  } catch (error: any) {
    console.error('Booking creation error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('eventId', 'title');

    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    // Log activity
    await ActivityLog.create({
      action: 'booking_status_update',
      description: `Updated booking status to ${status}: ${booking.eventTitle} - ${booking.name}`,
      adminId: req.admin?.id,
      adminUsername: req.admin?.username,
      entityType: 'booking',
      entityId: booking._id,
    });

    res.json({
      success: true,
      booking,
    });
  } catch (error: any) {
    console.error('Booking update error:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
};

export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    await Booking.findByIdAndDelete(id);

    // Log activity
    await ActivityLog.create({
      action: 'delete',
      description: `Deleted booking: ${booking.eventTitle} - ${booking.name}`,
      adminId: req.admin?.id,
      adminUsername: req.admin?.username,
      entityType: 'booking',
      entityId: id,
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Booking deletion error:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};

export const getBookingStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          totalRevenue: { $sum: '$amount' },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          confirmed: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        },
      },
    ]);

    res.json(stats[0] || { totalCount: 0, totalRevenue: 0, pending: 0, confirmed: 0, completed: 0 });
  } catch (error: any) {
    console.error('Booking stats error:', error);
    res.status(500).json({ error: 'Failed to fetch booking stats' });
  }
};

export const exportBookingsCSV = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await Booking.find().lean();

    const csv = [
      'Name,Email,Phone,Attendees,Event,Date',
      ...bookings.map(
        (b) =>
          `"${b.name}","${b.email}","${b.phone}",${b.attendees},"${b.eventTitle}","${b.createdAt}"`
      ),
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="bookings.csv"');
    res.send(csv);
  } catch (error: any) {
    console.error('CSV export error:', error);
    res.status(500).json({ error: 'Failed to export bookings' });
  }
};
