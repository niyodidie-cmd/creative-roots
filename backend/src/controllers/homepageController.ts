import { Request, Response } from 'express';
import HomepageContent from '../models/HomepageContent';
import ActivityLog from '../models/ActivityLog';

export const getHomepageContent = async (req: Request, res: Response): Promise<void> => {
  try {
    let content = await HomepageContent.findOne();

    if (!content) {
      // Create default content if none exists
      content = new HomepageContent({});
      await content.save();
    }

    res.json(content);
  } catch (error: any) {
    console.error('Homepage content fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch homepage content' });
  }
};

export const updateHomepageContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { heroTitle, heroSubtitle, heroImageUrl, aboutText, featuredGalleryItems, featuredEventId } = req.body;

    let content = await HomepageContent.findOne();

    if (!content) {
      content = new HomepageContent({});
    }

    // Update fields
    if (heroTitle !== undefined) content.heroTitle = heroTitle;
    if (heroSubtitle !== undefined) content.heroSubtitle = heroSubtitle;
    if (heroImageUrl !== undefined) content.heroImageUrl = heroImageUrl;
    if (aboutText !== undefined) content.aboutText = aboutText;
    if (featuredGalleryItems !== undefined) content.featuredGalleryItems = featuredGalleryItems;
    if (featuredEventId !== undefined) content.featuredEventId = featuredEventId;

    await content.save();

    // Log activity
    await ActivityLog.create({
      action: 'update',
      description: 'Updated homepage content',
      adminId: req.admin?.id,
      adminUsername: req.admin?.username,
      entityType: 'homepage',
    });

    res.json({
      success: true,
      content,
    });
  } catch (error: any) {
    console.error('Homepage content update error:', error);
    res.status(500).json({ error: 'Failed to update homepage content' });
  }
};