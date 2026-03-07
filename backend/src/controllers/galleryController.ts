import { Request, Response } from 'express';
import GalleryItem from '../models/GalleryItem';
import ActivityLog from '../models/ActivityLog';

export const getAllGalleryItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, featured } = req.query;
    const filter: any = {};

    if (category) filter.category = category;
    if (featured !== undefined) filter.featured = featured === 'true';

    const items = await GalleryItem.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (error: any) {
    console.error('Gallery fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
};

export const getGalleryItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await GalleryItem.findById(id);

    if (!item) {
      res.status(404).json({ error: 'Gallery item not found' });
      return;
    }

    res.json(item);
  } catch (error: any) {
    console.error('Gallery item fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch gallery item' });
  }
};

export const createGalleryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, category, featured, mediaType } = req.body;

    if (!title || !req.file) {
      res.status(400).json({ error: 'Title and file required' });
      return;
    }

    const item = new GalleryItem({
      title,
      description,
      category: category || 'Artwork',
      featured: featured === 'true',
      mediaType: mediaType || 'image',
      imageUrl: `/uploads/${req.file.filename}`,
    });

    await item.save();

    // Log activity
    await ActivityLog.create({
      action: 'create',
      description: `Added gallery item: ${title}`,
      adminId: req.admin?.id,
      adminUsername: req.admin?.username,
      entityType: 'gallery',
      entityId: item._id,
    });

    res.status(201).json({
      success: true,
      item,
    });
  } catch (error: any) {
    console.error('Gallery creation error:', error);
    res.status(500).json({ error: 'Failed to add gallery item' });
  }
};

export const updateGalleryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, category, featured, mediaType } = req.body;

    const updateData: any = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category) updateData.category = category;
    if (featured !== undefined) updateData.featured = featured === 'true';
    if (mediaType) updateData.mediaType = mediaType;
    if (req.file) updateData.imageUrl = `/uploads/${req.file.filename}`;

    const item = await GalleryItem.findByIdAndUpdate(id, updateData, { new: true });

    if (!item) {
      res.status(404).json({ error: 'Gallery item not found' });
      return;
    }

    // Log activity
    await ActivityLog.create({
      action: 'update',
      description: `Updated gallery item: ${item.title}`,
      adminId: req.admin?.id,
      adminUsername: req.admin?.username,
      entityType: 'gallery',
      entityId: item._id,
    });

    res.json({
      success: true,
      item,
    });
  } catch (error: any) {
    console.error('Gallery update error:', error);
    res.status(500).json({ error: 'Failed to update gallery item' });
  }
};

export const deleteGalleryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const item = await GalleryItem.findById(id);
    if (!item) {
      res.status(404).json({ error: 'Gallery item not found' });
      return;
    }

    await GalleryItem.findByIdAndDelete(id);

    // Log activity
    await ActivityLog.create({
      action: 'delete',
      description: `Deleted gallery item: ${item.title}`,
      adminId: req.admin?.id,
      adminUsername: req.admin?.username,
      entityType: 'gallery',
      entityId: id,
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Gallery deletion error:', error);
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
};
