import { Request, Response } from 'express';
import ActivityLog from '../models/ActivityLog';

export const getActivityLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 50, action, entityType } = req.query;
    const filter: any = {};

    if (action) filter.action = action;
    if (entityType) filter.entityType = entityType;

    const logs = await ActivityLog.find(filter)
      .populate('adminId', 'username')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string));

    res.json(logs);
  } catch (error: any) {
    console.error('Activity logs fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
};

export const getRecentActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const logs = await ActivityLog.find()
      .populate('adminId', 'username')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(logs);
  } catch (error: any) {
    console.error('Recent activity fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
};