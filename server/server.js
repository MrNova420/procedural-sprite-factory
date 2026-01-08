const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Comprehensive request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  
  // Log response
  const oldSend = res.send;
  res.send = function(data) {
    console.log(`[${timestamp}] Response Status: ${res.statusCode}`);
    if (data) {
      const dataStr = data.toString();
      if (dataStr.length > 500) {
        console.log('Response (truncated):', dataStr.substring(0, 500) + '...');
      } else {
        console.log('Response:', dataStr);
      }
    }
    oldSend.apply(res, arguments);
  };
  
  next();
});

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

// 404 handler
app.use((req, res, next) => {
  console.error(`❌ 404 NOT FOUND: ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: 'Not found', 
    message: `Endpoint ${req.method} ${req.url} does not exist`,
    availableEndpoints: [
      'POST /api/generate',
      'POST /api/dna/*',
      'POST /api/assets/*',
      'POST /api/universal/*',
      'POST /api/items/*',
      'POST /api/ui/*',
      'POST /api/animations/*',
      'POST /api/effects/*',
      'POST /api/world/*',
      'GET /api/export/png/:id'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('\n🚨 ERROR OCCURRED:');
  console.error('Path:', req.method, req.url);
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  // Check for common issues
  if (err.message.includes('PLACEHOLDER')) {
    console.error('⚠️  PLACEHOLDER DETECTED IN CODE!');
  }
  if (err.message.includes('TODO')) {
    console.error('⚠️  TODO DETECTED IN CODE!');
  }
  
  res.status(500).json({ 
    error: 'Internal server error', 
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
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
