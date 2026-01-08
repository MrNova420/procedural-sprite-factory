const express = require('express');
const router = express.Router();
const Engine = require('../core/engine');
const { parseDNA } = require('../utils/helpers');

// Create engine instance
const engine = new Engine();

/**
 * POST /api/generate
 * Generate a sprite from DNA
 */
router.post('/', async (req, res) => {
  try {
    const dna = parseDNA(req.body);
    
    console.log('Generating sprite with DNA:', JSON.stringify(dna, null, 2));
    
    const result = await engine.generate(dna);
    
    // Send base64 encoded image
    const base64Image = result.buffer.toString('base64');
    
    res.json({
      success: true,
      id: result.id,
      image: `data:image/png;base64,${base64Image}`,
      metadata: result.metadata,
      dna: result.dna
    });
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/generate/batch
 * Generate multiple sprites
 */
router.post('/batch', async (req, res) => {
  try {
    const { count = 10, template = {} } = req.body;
    
    if (count > 100) {
      return res.status(400).json({
        success: false,
        error: 'Batch count limited to 100 sprites'
      });
    }
    
    const results = [];
    
    for (let i = 0; i < count; i++) {
      // Apply slight variations to template
      const dna = {
        ...parseDNA(template),
        // Add random variation
        size: (template.size || 1.0) + (Math.random() - 0.5) * 0.2
      };
      
      const result = await engine.generate(dna);
      results.push({
        id: result.id,
        image: `data:image/png;base64,${result.buffer.toString('base64')}`,
        metadata: result.metadata
      });
    }
    
    res.json({
      success: true,
      count: results.length,
      sprites: results
    });
  } catch (error) {
    console.error('Batch generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
