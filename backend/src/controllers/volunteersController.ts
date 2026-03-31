import { Request, Response } from 'express';
import Volunteer from '../models/Volunteer';
import ActivityLog from '../models/ActivityLog';

export const getAllVolunteers = async (req: Request, res: Response): Promise<void> => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.json(volunteers);
  } catch (error: any) {
    console.error('Volunteers fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch volunteers' });
  }
};

export const getVolunteerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const volunteer = await Volunteer.findById(id);

    if (!volunteer) {
      res.status(404).json({ error: 'Volunteer not found' });
      return;
    }

    res.json(volunteer);
  } catch (error: any) {
    console.error('Volunteer fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch volunteer' });
  }
};

export const createVolunteer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, skills } = req.body;

    if (!name || !email || !phone) {
      res.status(400).json({ error: 'Name, email, and phone are required' });
      return;
    }

    const volunteer = new Volunteer({ name, email, phone, skills });
    await volunteer.save();

    await ActivityLog.create({
      action: 'create',
      description: `New volunteer submission: ${name}`,
      entityType: 'volunteer',
      entityId: volunteer._id,
      adminUsername: req.admin?.username,
    });

    res.status(201).json({ success: true, volunteer });
  } catch (error: any) {
    console.error('Volunteer creation error:', error);
    res.status(500).json({ error: 'Failed to save volunteer' });
  }
};

export const updateVolunteer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, phone, skills, status } = req.body;

    const update: any = {};
    if (name !== undefined) update.name = name;
    if (email !== undefined) update.email = email;
    if (phone !== undefined) update.phone = phone;
    if (skills !== undefined) update.skills = skills;
    if (status !== undefined) update.status = status;

    const volunteer = await Volunteer.findByIdAndUpdate(id, update, { new: true });
    if (!volunteer) {
      res.status(404).json({ error: 'Volunteer not found' });
      return;
    }

    await ActivityLog.create({
      action: 'update',
      description: `Volunteer updated: ${volunteer.name}`,
      entityType: 'volunteer',
      entityId: volunteer._id,
      adminUsername: req.admin?.username,
    });

    res.json({ success: true, volunteer });
  } catch (error: any) {
    console.error('Volunteer update error:', error);
    res.status(500).json({ error: 'Failed to update volunteer' });
  }
};

export const deleteVolunteer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const volunteer = await Volunteer.findByIdAndDelete(id);
    if (!volunteer) {
      res.status(404).json({ error: 'Volunteer not found' });
      return;
    }

    await ActivityLog.create({
      action: 'delete',
      description: `Volunteer removed: ${volunteer.name}`,
      entityType: 'volunteer',
      entityId: volunteer._id,
      adminUsername: req.admin?.username,
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Volunteer deletion error:', error);
    res.status(500).json({ error: 'Failed to delete volunteer' });
  }
};
