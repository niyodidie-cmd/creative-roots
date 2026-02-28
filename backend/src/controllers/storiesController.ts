import { Request, Response } from 'express';
import SuccessStory from '../models/SuccessStory';

export const getAllSuccessStories = async (req: Request, res: Response): Promise<void> => {
  try {
    const stories = await SuccessStory.find().sort({ createdAt: -1 });
    res.json(stories);
  } catch (error: any) {
    console.error('Stories fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch success stories' });
  }
};

export const createSuccessStory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, videoUrl, author } = req.body;

    if (!title || !description) {
      res.status(400).json({ error: 'Title and description required' });
      return;
    }

    const story = new SuccessStory({
      title,
      description,
      videoUrl,
      author: author || 'Anonymous',
      imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
    });

    await story.save();

    res.status(201).json({
      success: true,
      story,
    });
  } catch (error: any) {
    console.error('Story creation error:', error);
    res.status(500).json({ error: 'Failed to add success story' });
  }
};

export const updateSuccessStory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, videoUrl, author } = req.body;

    const updateData: any = { title, description, videoUrl, author };
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    await SuccessStory.findByIdAndUpdate(id, updateData, { new: true });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Story update error:', error);
    res.status(500).json({ error: 'Failed to update success story' });
  }
};

export const deleteSuccessStory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await SuccessStory.findByIdAndDelete(id);

    res.json({ success: true });
  } catch (error: any) {
    console.error('Story deletion error:', error);
    res.status(500).json({ error: 'Failed to delete success story' });
  }
};
