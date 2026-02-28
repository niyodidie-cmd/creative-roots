import { Request, Response } from 'express';
import Donation from '../models/Donation';
import { sendDonationReceipt } from '../utils/mailer';
import whatsappService from '../utils/whatsapp';

export const getAllDonations = async (req: Request, res: Response): Promise<void> => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (error: any) {
    console.error('Donations fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
};

export const createMoMoDonation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { donor_name, donor_email, donor_phone, amount } = req.body;

    if (!donor_phone || !amount) {
      res.status(400).json({ error: 'Phone and amount required' });
      return;
    }

    const donation = new Donation({
      donorName: donor_name || 'Anonymous',
      donorEmail: donor_email,
      donorPhone: donor_phone,
      amount,
      paymentMethod: 'momo',
      status: 'pending',
    });

    await donation.save();

    // In production, call MTN MoMo API here
    // For now, return instruction message
    res.status(201).json({
      success: true,
      message: `Donation recorded. Please complete the MTN MoMo payment for ${amount.toLocaleString()} RWF.`,
      donationId: donation._id,
    });
  } catch (error: any) {
    console.error('MoMo donation error:', error);
    res.status(500).json({ error: 'Failed to process MoMo donation' });
  }
};

export const confirmDonation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { donationId, transactionId, status } = req.body;

    const donation = await Donation.findByIdAndUpdate(
      donationId,
      {
        transactionId,
        status,
      },
      { new: true }
    );

    if (!donation) {
      res.status(404).json({ error: 'Donation not found' });
      return;
    }

    if (status === 'success') {
      // Send receipt email
      try {
        if (donation.donorEmail) {
          await sendDonationReceipt(
            donation.donorEmail,
            donation.donorName,
            donation.amount,
            transactionId
          );
        }
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }

      // Send WhatsApp notification
      try {
        await whatsappService.sendDonationNotification(
          donation.donorName,
          donation.amount,
          donation.donorPhone || 'Not provided',
          transactionId
        );
      } catch (whatsappError) {
        console.error('WhatsApp sending failed:', whatsappError);
      }
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('Donation confirmation error:', error);
    res.status(500).json({ error: 'Failed to confirm donation' });
  }
};

export const getDonationStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await Donation.aggregate([
      { $match: { status: 'success' } },
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          averageAmount: { $avg: '$amount' },
        },
      },
    ]);

    res.json(stats[0] || { totalCount: 0, totalAmount: 0, averageAmount: 0 });
  } catch (error: any) {
    console.error('Donation stats error:', error);
    res.status(500).json({ error: 'Failed to fetch donation stats' });
  }
};
