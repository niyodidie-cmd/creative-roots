import { Request, Response } from 'express';
import User from '../models/User';
import ActivityLog from '../models/ActivityLog';

export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    // For now, return basic settings. In a real app, you'd have a Settings model
    const settings = {
      siteName: 'Creative Roots Rwanda',
      contactEmail: 'info@creativeroots.rw',
      phone: '+250 792 505 680',
      socialMedia: {
        facebook: 'https://facebook.com/creativerootsRW',
        instagram: 'https://instagram.com/creativerootsRW',
        whatsapp: 'https://wa.me/250792505680'
      }
    };

    res.json(settings);
  } catch (error: any) {
    console.error('Settings fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { siteName, contactEmail, phone, socialMedia } = req.body;

    // In a real app, save to database
    const settings = {
      siteName: siteName || 'Creative Roots Rwanda',
      contactEmail: contactEmail || 'info@creativeroots.rw',
      phone: phone || '+250 792 505 680',
      socialMedia: socialMedia || {
        facebook: 'https://facebook.com/creativerootsRW',
        instagram: 'https://instagram.com/creativerootsRW',
        whatsapp: 'https://wa.me/250792505680'
      }
    };

    // Log activity
    await ActivityLog.create({
      action: 'update',
      description: 'Updated system settings',
      adminId: req.admin?.id,
      adminUsername: req.admin?.username,
      entityType: 'settings',
    });

    res.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    console.error('Settings update error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!req.admin?.id) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const user = await User.findById(req.admin.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Verify current password
    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      res.status(400).json({ error: 'Current password is incorrect' });
      return;
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Log activity
    await ActivityLog.create({
      action: 'password_change',
      description: 'Changed admin password',
      adminId: req.admin.id,
      adminUsername: req.admin.username,
      entityType: 'user',
      entityId: user._id,
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};