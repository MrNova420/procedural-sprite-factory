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
const animationsRoutes = require('./routes/animations');
const effectsRoutes = require('./routes/effects');
const worldRoutes = require('./routes/world');

// API Routes
app.use('/api/generate', generateRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/dna', dnaRoutes);
app.use('/api/assets', assetsRoutes);
app.use('/api/universal', universalRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/ui', uiRoutes);
app.use('/api/animations', animationsRoutes);
app.use('/api/effects', effectsRoutes);
app.use('/api/world', worldRoutes);

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
  console.log('  POST /api/dna/* - DNA operations (mutate, breed, serialize)');
  console.log('  POST /api/assets/* - Game assets (terrain, trees, rocks, buildings)');
  console.log('  POST /api/universal/* - Text-to-asset & variations');
  console.log('  POST /api/items/* - Items (weapons, armor, consumables)');
  console.log('  POST /api/ui/* - UI elements (panels, buttons, icons, bars)');
  console.log('  POST /api/animations/* - Animations (walk, action, custom)');
  console.log('  POST /api/effects/* - Particle effects (combat, magic, environment)');
  console.log('  POST /api/world/* - World generation (overworld, dungeons)');
  console.log('  GET  /api/export/png/:id - Export PNG');
  console.log('');
  console.log('🎉 COMPLETE: All 11 Phases Implemented!');
  console.log('  ✅ Foundation, Shape Engine, Texture Brain');
  console.log('  ✅ DNA System, Terrain & Environment');
  console.log('  ✅ Ultimate Generation, Items, UI Assets');
  console.log('  ✅ Animations, Particle Effects, World Generation');
  console.log('');
  console.log('🚀 Try text-to-asset: POST /api/universal/from-text');
  console.log('  Body: { "prompt": "A fierce red dragon" }');
});

module.exports = app;
