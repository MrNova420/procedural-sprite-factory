/**
 * World Routes
 * API endpoints for world and dungeon generation
 */

const express = require('express');
const router = express.Router();
const WorldGenerator = require('../generators/world-generator');

const worldGenerator = new WorldGenerator();

/**
 * Generate overworld map
 */
router.post('/overworld', (req, res) => {
  try {
    const { width, height, biomes, seed } = req.body;
    
    const world = worldGenerator.generateOverworld({
      width,
      height,
      biomes,
      seed
    });
    
    res.json({
      success: true,
      world
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Generate dungeon
 */
router.post('/dungeon', (req, res) => {
  try {
    const { roomCount, width, height, difficulty } = req.body;
    
    const dungeon = worldGenerator.generateDungeon({
      roomCount,
      width,
      height,
      difficulty
    });
    
    res.json({
      success: true,
      dungeon
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Place objects in world
 */
router.post('/place-objects', (req, res) => {
  try {
    const { worldData, objects, density, rules } = req.body;
    
    const placements = worldGenerator.placeObjects(worldData, objects, {
      density,
      rules
    });
    
    res.json({
      success: true,
      placements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Export tilemap
 */
router.post('/export', (req, res) => {
  try {
    const { worldData, format } = req.body;
    
    const exported = worldGenerator.exportTilemap(worldData, format);
    
    res.json({
      success: true,
      data: exported,
      format
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get available biomes
 */
router.get('/biomes', (req, res) => {
  res.json({
    success: true,
    biomes: [
      'forest',
      'desert',
      'snow',
      'swamp',
      'mountain',
      'ocean',
      'volcanic',
      'crystal'
    ]
  });
});

module.exports = router;
