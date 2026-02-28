import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import connectDB from './config/database';
import { env } from './config/env';
import { errorHandler } from './middleware/auth';
import apiRoutes from './routes';

const app: Express = express();

// Create uploads directory if it doesn't exist
if (!fs.existsSync(env.upload.uploadDir)) {
  fs.mkdirSync(env.upload.uploadDir, { recursive: true });
}

// ============================================
// MIDDLEWARE
// ============================================

app.use(helmet());
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(env.upload.uploadDir));

// ============================================
// DATABASE CONNECTION
// ============================================

connectDB();

// ============================================
// API ROUTES
// ============================================

app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ============================================
// ERROR HANDLING
// ============================================

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use(errorHandler);

// ============================================
// SERVER START
// ============================================

const PORT = env.port;

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  Creative Roots Rwanda - Backend       ║
║  Server running on http://localhost:${PORT}   ║
║  Database: MongoDB Atlas               ║
║  Environment: ${env.nodeEnv}           ║
╚════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;
