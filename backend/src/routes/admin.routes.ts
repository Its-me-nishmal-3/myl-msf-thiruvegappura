import express from 'express';
import jwt from 'jsonwebtoken';
import Payment from '../models/Payment';
import { adminLoginLimiter, statsLimiter } from '../middleware/rateLimiter';

const router = express.Router();
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Admin Login (strict rate limiting to prevent brute force)
router.post('/login', adminLoginLimiter, (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ success: true, token });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Middleware to verify token
const verifyToken = (req: any, res: any, next: any) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('A token is required');
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
    return next();
};

// Analytics Endpoint (rate limited)
router.get('/analytics', verifyToken, statsLimiter, async (req, res) => {
    try {
        // 1. Overall Stats
        const overallStats = await Payment.aggregate([
            { $match: { status: 'success' } },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    totalQuantity: { $sum: '$quantity' },
                    totalOrders: { $count: {} },
                    avgOrderValue: { $avg: '$amount' }
                }
            }
        ]);

        // 2. Ward Wise Stats
        const wardStats = await Payment.aggregate([
            { $match: { status: 'success' } },
            {
                $group: {
                    _id: '$ward',
                    amount: { $sum: '$amount' },
                    quantity: { $sum: '$quantity' },
                    count: { $count: {} }
                }
            },
            { $sort: { amount: -1 } }
        ]);

        // 3. Daily Stats (Last 7 Days)
        const dailyStats = await Payment.aggregate([
            {
                $match: {
                    status: 'success',
                    createdAt: {
                        $gte: new Date(new Date().setDate(new Date().getDate() - 7))
                    }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    amount: { $sum: '$amount' },
                    quantity: { $sum: '$quantity' },
                    count: { $count: {} }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            overall: overallStats[0] || { totalAmount: 0, totalQuantity: 0, totalOrders: 0, avgOrderValue: 0 },
            wardStats,
            dailyStats
        });
    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ message: 'Error fetching analytics' });
    }
});

// Get All Payments with Filters (rate limited)
router.get('/payments', verifyToken, statsLimiter, async (req, res) => {
    try {
        const { search, ward } = req.query;
        const query: any = {};

        if (ward && ward !== 'All') {
            query.ward = ward;
        }

        if (search) {
            const searchRegex = new RegExp(search as string, 'i');
            query.$or = [
                { name: searchRegex },
                { mobile: searchRegex },
                { paymentId: searchRegex }
            ];
        }

        const payments = await Payment.find(query).sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payments' });
    }
});

export default router;
