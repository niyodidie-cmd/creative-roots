import { Request, Response } from 'express';
import Visitor from '../models/Visitor';

export const trackVisitor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, referrer, sessionId } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Create or update visitor record
    await Visitor.findOneAndUpdate(
      { ip, sessionId },
      {
        page,
        referrer,
        userAgent,
        $setOnInsert: { ip, sessionId },
      },
      { upsert: true, new: true }
    );

    res.json({ success: true });
  } catch (error: any) {
    console.error('Visitor tracking error:', error);
    res.status(500).json({ error: 'Failed to track visitor' });
  }
};

export const getVisitorStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period as string);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const stats = await Visitor.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 },
          uniqueIPs: { $addToSet: '$ip' }
        }
      },
      {
        $project: {
          date: '$_id',
          visits: '$count',
          uniqueVisitors: { $size: '$uniqueIPs' },
          _id: 0
        }
      },
      { $sort: { date: 1 } }
    ]);

    const totalVisitors = await Visitor.distinct('ip', { createdAt: { $gte: startDate } }).then(ips => ips.length);
    const totalVisits = await Visitor.countDocuments({ createdAt: { $gte: startDate } });

    res.json({
      totalVisitors,
      totalVisits,
      dailyStats: stats,
    });
  } catch (error: any) {
    console.error('Visitor stats error:', error);
    res.status(500).json({ error: 'Failed to get visitor stats' });
  }
};