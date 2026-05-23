const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./src/models/schema');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const aiRoutes = require('./src/routes/aiRoutes');

// Import middleware
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and body parsing
app.use(cors());
app.use(express.json());

// Serve mock downloadable assets locally if requested
app.use('/downloads', express.static(path.join(__dirname, 'public/downloads')));

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/ai', aiRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'AI LearnHub Backend is fully operational.' });
});

// Global Error Handler Exception Middleware
app.use(errorHandler);

// Initialize Database & Start Server
const startServer = async () => {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`🚀 AI LearnHub Server running on port ${PORT}`);
      console.log(`=========================================`);
    });
  } catch (error) {
    console.error('Critical Fail: Database init failed, server halted.', error);
    process.exit(1);
  }
};

// Only start the server if this file is run directly (not in tests)
if (require.main === module) {
  startServer();
}

module.exports = app; // For integration testing
