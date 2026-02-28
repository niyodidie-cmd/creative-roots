import { Request, Response } from 'express';
import GalleryItem from '../models/GalleryItem';

export const getAllGalleryItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await GalleryItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error: any) {
    console.error('Gallery fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
};

export const createGalleryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, category } = req.body;

    if (!title || !req.file) {
      res.status(400).json({ error: 'Title and image required' });
      return;
    }

    const item = new GalleryItem({
      title,
      description,
      category: category || 'Artwork',
      imageUrl: `/uploads/${req.file.filename}`,
    });

    await item.save();

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
    const { title, description, category } = req.body;

    const updateData: any = { title, description, category };
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    await GalleryItem.findByIdAndUpdate(id, updateData, { new: true });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Gallery update error:', error);
    res.status(500).json({ error: 'Failed to update gallery item' });
  }
};

export const deleteGalleryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await GalleryItem.findByIdAndDelete(id);

    res.json({ success: true });
  } catch (error: any) {
    console.error('Gallery deletion error:', error);
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
};
