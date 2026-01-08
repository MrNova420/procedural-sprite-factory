const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Import routes
const generateRoutes = require('./routes/generate');
const exportRoutes = require('./routes/export');
const dnaRoutes = require('./routes/dna');
const assetsRoutes = require('./routes/assets');
const universalRoutes = require('./routes/universal');
const itemsRoutes = require('./routes/items');
const uiRoutes = require('./routes/ui');

// API Routes
app.use('/api/generate', generateRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/dna', dnaRoutes);
app.use('/api/assets', assetsRoutes);
app.use('/api/universal', universalRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/ui', uiRoutes);

// Serve the main dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎨 Procedural Sprite Factory running on http://localhost:${PORT}`);
  console.log('📚 API endpoints:');
  console.log('  POST /api/generate - Generate sprite');
  console.log('  POST /api/dna/* - DNA operations');
  console.log('  POST /api/assets/* - Game asset generation');
  console.log('  POST /api/universal/* - Text-to-asset & variations');
  console.log('  POST /api/items/* - Item generation (weapons, armor, consumables)');
  console.log('  POST /api/ui/* - UI elements (panels, buttons, icons, bars)');
  console.log('  GET  /api/export/png/:id - Export PNG');
  console.log('');
  console.log('🚀 NEW: UI Asset Generation!');
  console.log('  Try: POST /api/ui/icon');
  console.log('  Body: { "category": "combat", "iconType": "sword" }');
});

module.exports = app;
