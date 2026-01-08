const express = require('express');
const router = express.Router();
const Engine = require('../core/engine');

// Create engine instance
const engine = new Engine();

/**
 * POST /api/dna/generate
 * Generate random DNA
 */
router.post('/generate', (req, res) => {
  try {
    const { species, options = {} } = req.body;
    
    const dna = engine.dnaGenerator.generate(species, options);
    
    res.json({
      success: true,
      dna
    });
  } catch (error) {
    console.error('DNA generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/dna/mutate
 * Mutate existing DNA
 */
router.post('/mutate', (req, res) => {
  try {
    const { dna, mutationRate = 0.3 } = req.body;
    
    if (!dna) {
      return res.status(400).json({
        success: false,
        error: 'DNA is required'
      });
    }
    
    const mutated = engine.dnaGenerator.mutate(dna, mutationRate);
    
    res.json({
      success: true,
      dna: mutated
    });
  } catch (error) {
    console.error('DNA mutation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/dna/breed
 * Breed two DNA strands
 */
router.post('/breed', (req, res) => {
  try {
    const { parent1, parent2 } = req.body;
    
    if (!parent1 || !parent2) {
      return res.status(400).json({
        success: false,
        error: 'Both parent DNAs are required'
      });
    }
    
    const child = engine.dnaGenerator.breed(parent1, parent2);
    
    res.json({
      success: true,
      dna: child
    });
  } catch (error) {
    console.error('DNA breeding error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/dna/serialize
 * Serialize DNA to string
 */
router.post('/serialize', (req, res) => {
  try {
    const { dna } = req.body;
    
    if (!dna) {
      return res.status(400).json({
        success: false,
        error: 'DNA is required'
      });
    }
    
    const serialized = engine.dnaGenerator.serialize(dna);
    
    res.json({
      success: true,
      dnaString: serialized
    });
  } catch (error) {
    console.error('DNA serialization error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/dna/deserialize
 * Deserialize DNA from string
 */
router.post('/deserialize', (req, res) => {
  try {
    const { dnaString } = req.body;
    
    if (!dnaString) {
      return res.status(400).json({
        success: false,
        error: 'DNA string is required'
      });
    }
    
    const dna = engine.dnaGenerator.deserialize(dnaString);
    
    res.json({
      success: true,
      dna
    });
  } catch (error) {
    console.error('DNA deserialization error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/dna/validate
 * Validate DNA structure
 */
router.post('/validate', (req, res) => {
  try {
    const { dna } = req.body;
    
    if (!dna) {
      return res.status(400).json({
        success: false,
        error: 'DNA is required'
      });
    }
    
    const validation = engine.dnaGenerator.validate(dna);
    
    res.json({
      success: true,
      ...validation
    });
  } catch (error) {
    console.error('DNA validation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
