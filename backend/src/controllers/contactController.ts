import { Request, Response } from 'express';
import ContactMessage from '../models/ContactMessage';
import ActivityLog from '../models/ActivityLog';
import { sendContactAutoReply } from '../utils/mailer';

export const getAllMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { read } = req.query;
    const filter: any = {};

    if (read !== undefined) filter.read = read === 'true';

    const messages = await ContactMessage.find(filter).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error: any) {
    console.error('Messages fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

export const getMessageById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const message = await ContactMessage.findById(id);

    if (!message) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    res.json(message);
  } catch (error: any) {
    console.error('Message fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
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

    // Log activity
    await ActivityLog.create({
      action: 'message_received',
      description: `New contact message from ${name || 'Anonymous'}`,
      entityType: 'message',
      entityId: contactMessage._id,
    });

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

export const markMessageAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!message) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    // Log activity
    await ActivityLog.create({
      action: 'message_read',
      description: `Marked message as read: ${message.subject || 'No subject'}`,
      adminId: req.admin?.id,
      adminUsername: req.admin?.username,
      entityType: 'message',
      entityId: message._id,
    });

    res.json({
      success: true,
      message,
    });
  } catch (error: any) {
    console.error('Message update error:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
};

export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findById(id);
    if (!message) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    await ContactMessage.findByIdAndDelete(id);

    // Log activity
    await ActivityLog.create({
      action: 'delete',
      description: `Deleted message: ${message.subject || 'No subject'}`,
      adminId: req.admin?.id,
      adminUsername: req.admin?.username,
      entityType: 'message',
      entityId: id,
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Message deletion error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
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
