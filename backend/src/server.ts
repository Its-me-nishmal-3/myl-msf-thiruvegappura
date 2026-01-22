import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { generalLimiter } from './middleware/rateLimiter';
import paymentRoutes from './routes/payment.routes';
import adminRoutes from './routes/admin.routes';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Trust proxy (for accurate IP tracking behind reverse proxies like Render)
app.set('trust proxy', 1);

// Middleware
app.use(cors());

// Conditional middleware: Use raw body parser ONLY for webhook endpoint, JSON parser for everything else
app.use((req, res, next) => {
    if (req.path === '/api/payment/webhook') {
        express.raw({ type: 'application/json' })(req, res, next);
    } else {
        next();
    }
});

// Apply JSON parser for non-webhook routes
app.use(express.json());

// Apply general rate limiter to all routes
app.use(generalLimiter);

// Socket.IO Setup
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all for now, restrict in production
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fruit-challenge';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes (webhook route already registered above with raw body parser)
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('Fruit Challenge API is running');
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export { io };
