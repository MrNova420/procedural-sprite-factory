const express = require('express');
const router = express.Router();
const Engine = require('../core/engine');

// Create engine instance
const engine = new Engine();

/**
 * GET /api/export/png/:id
 * Export sprite as PNG
 */
router.get('/png/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sprite = engine.getCached(id);
    
    if (!sprite) {
      return res.status(404).json({
        success: false,
        error: 'Sprite not found'
      });
    }
    
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="sprite-${id}.png"`);
    res.send(sprite.buffer);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/export/metadata
 * Export sprite metadata
 */
router.post('/metadata', async (req, res) => {
  try {
    const { id } = req.body;
    const sprite = engine.getCached(id);
    
    if (!sprite) {
      return res.status(404).json({
        success: false,
        error: 'Sprite not found'
      });
    }
    
    res.json({
      success: true,
      metadata: {
        id: sprite.id,
        dna: sprite.dna,
        size: sprite.metadata.size,
        generationTime: sprite.metadata.generationTime,
        timestamp: sprite.metadata.timestamp
      }
    });
  } catch (error) {
    console.error('Metadata export error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
