const app = require('./app');
const config = require('./config/env');
const { testConnection } = require('./config/database');
const { syncDatabase } = require('./models');

// Test database connection
testConnection().then(async () => {
  // Sync database models
  await syncDatabase();

  // Start server
  const PORT = config.port;
  
  app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 Tourism Backend API`);
    console.log(`📍 Environment: ${config.nodeEnv}`);
    console.log(`🌐 Server running on port ${PORT}`);
    console.log(`🔗 http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    console.log('='.repeat(50));
  });

}).catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});