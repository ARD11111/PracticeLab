const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

const authRoutes = require('./routes/authRoutes');
const problemRoutes = require('./routes/problemRoutes');
const patternRoutes = require('./routes/patternRoutes');
const practiceRoutes = require('./routes/practiceRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const extensionRoutes = require('./routes/extensionRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { initEmailScheduler } = require('./jobs/emailCron');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: '*', // Allow extension and client web app
  credentials: true
}));

app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/patterns', patternRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/extension', extensionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PracticeLab API running smoothly.' });
});

// Database connection & server listen
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/practicelab';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(`[MongoDB] Connected to database: ${MONGO_URI}`);
    
    // Initialize server-side email cron job scheduler
    initEmailScheduler();

    app.listen(PORT, () => {
      console.log(`[PracticeLab Backend] Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[MongoDB Error] Database connection failed:', err.message);
    process.exit(1);
  });
