import { Request, Response } from 'express';
import Booking from '../models/Booking';
import Event from '../models/Event';
import { sendBookingConfirmation } from '../utils/mailer';
import whatsappService from '../utils/whatsapp';

export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await Booking.find()
      .populate('eventId', 'title date location')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error: any) {
    console.error('Bookings fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, attendees, eventId } = req.body;

    if (!name || !email || !attendees || !eventId) {
      res.status(400).json({ error: 'Missing required fields' });
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
    });

    await booking.save();

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

export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await Booking.findByIdAndDelete(id);

    res.json({ success: true });
  } catch (error: any) {
    console.error('Booking deletion error:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
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
