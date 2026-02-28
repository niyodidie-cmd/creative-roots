import { Request, Response } from 'express';
import ContactMessage from '../models/ContactMessage';
import { sendContactAutoReply } from '../utils/mailer';

export const getAllMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error: any) {
    console.error('Messages fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

export const createMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const contactMessage = new ContactMessage({
      name,
      email,
      subject,
      message,
    });

    await contactMessage.save();

    // Send auto-reply email
    if (email) {
      try {
        await sendContactAutoReply(email, name || 'Visitor');
      } catch (emailError) {
        console.error('Auto-reply email failed:', emailError);
      }
    }

    res.status(201).json({
      success: true,
      messageId: contactMessage._id,
    });
  } catch (error: any) {
    console.error('Message creation error:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
};

export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await ContactMessage.findByIdAndDelete(id);

    res.json({ success: true });
  } catch (error: any) {
    console.error('Message deletion error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
};
