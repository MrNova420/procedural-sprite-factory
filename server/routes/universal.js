const express = require('express');
const router = express.Router();
const Engine = require('../core/engine');
const PromptParser = require('../generators/prompt-parser');
const VariationEngine = require('../generators/variation-engine');

// Create instances
const engine = new Engine();
const promptParser = new PromptParser();
const variationEngine = new VariationEngine();

/**
 * POST /api/universal/from-text
 * Generate asset from natural language description
 */
router.post('/from-text', async (req, res) => {
  try {
    const { prompt, options = {} } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }
    
    console.log(`Parsing prompt: "${prompt}"`);
    
    // Parse the prompt
    const parsed = promptParser.parse(prompt);
    console.log('Parsed:', JSON.stringify(parsed, null, 2));
    
    // Convert to DNA
    const dna = promptParser.toDNA(parsed);
    
    // Apply options
    if (options.seed) {
      dna.generation = dna.generation || {};
      dna.generation.seed = options.seed;
    }
    
    // Generate the asset
    const result = await engine.generate(dna);
    
    res.json({
      success: true,
      id: result.id,
      image: `data:image/png;base64,${result.buffer.toString('base64')}`,
      metadata: result.metadata,
      dna: result.dna,
      parsed: parsed
    });
  } catch (error) {
    console.error('Text-to-asset generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/universal/batch-from-text
 * Generate batch of assets from text with variations
 */
router.post('/batch-from-text', async (req, res) => {
  try {
    const { prompt, count = 10, variationAmount = 0.5, options = {} } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }
    
    if (count > 100) {
      return res.status(400).json({
        success: false,
        error: 'Maximum batch size is 100'
      });
    }
    
    console.log(`Generating batch of ${count} from: "${prompt}"`);
    
    // Parse the prompt
    const parsed = promptParser.parse(prompt);
    const baseDna = promptParser.toDNA(parsed);
    
    // Generate variations
    const results = [];
    for (let i = 0; i < count; i++) {
      // Create variation
      const variedDna = variationEngine.createSimilar(baseDna, variationAmount);
      
      // Apply seed if specified
      if (options.seed) {
        variedDna.generation = variedDna.generation || {};
        variedDna.generation.seed = options.seed + i;
      }
      
      // Generate
      const result = await engine.generate(variedDna);
      
      results.push({
        id: result.id,
        image: `data:image/png;base64,${result.buffer.toString('base64')}`,
        metadata: result.metadata,
        dna: result.dna
      });
    }
    
    res.json({
      success: true,
      count: results.length,
      prompt: prompt,
      assets: results
    });
  } catch (error) {
    console.error('Batch text-to-asset generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/universal/variations
 * Create variations of an existing asset
 */
router.post('/variations', async (req, res) => {
  try {
    const { dna, count = 10, type = 'similar', amount = 0.5 } = req.body;
    
    if (!dna) {
      return res.status(400).json({
        success: false,
        error: 'DNA is required'
      });
    }
    
    console.log(`Creating ${count} variations of type: ${type}`);
    
    // Create variations
    const variedDnas = variationEngine.createVariations(dna, count, type, amount);
    
    // Generate all variations
    const results = [];
    for (const variedDna of variedDnas) {
      const result = await engine.generate(variedDna);
      
      results.push({
        id: result.id,
        image: `data:image/png;base64,${result.buffer.toString('base64')}`,
        metadata: result.metadata,
        dna: result.dna
      });
    }
    
    res.json({
      success: true,
      count: results.length,
      type: type,
      variations: results
    });
  } catch (error) {
    console.error('Variation generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/universal/style-variations
 * Generate same asset in multiple styles
 */
router.post('/style-variations', async (req, res) => {
  try {
    const { dna, styles } = req.body;
    
    if (!dna || !styles || !Array.isArray(styles)) {
      return res.status(400).json({
        success: false,
        error: 'DNA and styles array are required'
      });
    }
    
    console.log(`Creating style variations: ${styles.join(', ')}`);
    
    // Create style variations
    const variedDnas = variationEngine.createStyleVariations(dna, styles);
    
    // Generate all
    const results = [];
    for (const variedDna of variedDnas) {
      const result = await engine.generate(variedDna);
      
      results.push({
        id: result.id,
        style: variedDna.style,
        image: `data:image/png;base64,${result.buffer.toString('base64')}`,
        metadata: result.metadata,
        dna: result.dna
      });
    }
    
    res.json({
      success: true,
      count: results.length,
      styles: styles,
      variations: results
    });
  } catch (error) {
    console.error('Style variation generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/universal/color-schemes
 * Generate same asset in multiple color schemes
 */
router.post('/color-schemes', async (req, res) => {
  try {
    const { dna, count = 5 } = req.body;
    
    if (!dna) {
      return res.status(400).json({
        success: false,
        error: 'DNA is required'
      });
    }
    
    console.log(`Creating ${count} color schemes`);
    
    // Create color variations
    const variedDnas = variationEngine.createColorSchemes(dna, count);
    
    // Generate all
    const results = [];
    for (const variedDna of variedDnas) {
      const result = await engine.generate(variedDna);
      
      results.push({
        id: result.id,
        colors: variedDna.colors,
        image: `data:image/png;base64,${result.buffer.toString('base64')}`,
        metadata: result.metadata,
        dna: result.dna
      });
    }
    
    res.json({
      success: true,
      count: results.length,
      schemes: results
    });
  } catch (error) {
    console.error('Color scheme generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/universal/examples
 * Get example prompts
 */
router.get('/examples', (req, res) => {
  res.json({
    success: true,
    examples: [
      "A fierce red dragon with golden horns",
      "A futuristic robot warrior with laser weapons",
      "An ancient stone temple covered in moss",
      "A magical glowing sword with blue crystals",
      "A cute cartoon cat wearing a wizard hat",
      "Dark fantasy tavern interior",
      "Cyberpunk neon city street",
      "Pixel art medieval knight in armor",
      "A mysterious purple potion bottle",
      "An old wooden treasure chest with gold trim"
    ],
    categories: Object.keys(promptParser.categoryKeywords),
    styles: Object.keys(promptParser.styleKeywords)
  });
});

module.exports = router;
