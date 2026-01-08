const express = require('express');
const router = express.Router();
const TerrainGenerator = require('../generators/terrain-generator');
const EnvironmentGenerator = require('../generators/environment-generator');

// Create generator instances
const terrainGen = new TerrainGenerator();
const envGen = new EnvironmentGenerator();

/**
 * POST /api/assets/terrain
 * Generate terrain tile set
 */
router.post('/terrain', async (req, res) => {
  try {
    const { terrainType = 'grass', tileSize = 16, options = {} } = req.body;
    
    console.log(`Generating terrain: ${terrainType}`);
    
    const tileSet = terrainGen.generateTileSet(terrainType, tileSize, options);
    
    // Convert buffers to base64
    const result = {
      success: true,
      type: tileSet.type,
      tileSize: tileSet.tileSize,
      base: tileSet.tiles.base.toString('base64'),
      variations: tileSet.variations.map(v => v.toString('base64')),
      animated: tileSet.animated
    };
    
    if (tileSet.frames) {
      result.frames = tileSet.frames.map(f => f.toString('base64'));
    }
    
    res.json(result);
  } catch (error) {
    console.error('Terrain generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/assets/tree
 * Generate tree
 */
router.post('/tree', async (req, res) => {
  try {
    const { species = 'oak', size = 1.0, options = {} } = req.body;
    
    console.log(`Generating tree: ${species}`);
    
    const tree = envGen.generateTree(species, size, options);
    
    res.json({
      success: true,
      species,
      size,
      image: `data:image/png;base64,${tree.toString('base64')}`
    });
  } catch (error) {
    console.error('Tree generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/assets/rock
 * Generate rock
 */
router.post('/rock', async (req, res) => {
  try {
    const { type = 'medium', size = 1.0, options = {} } = req.body;
    
    console.log(`Generating rock: ${type}`);
    
    const rock = envGen.generateRock(type, size, options);
    
    res.json({
      success: true,
      type,
      size,
      image: `data:image/png;base64,${rock.toString('base64')}`
    });
  } catch (error) {
    console.error('Rock generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/assets/building
 * Generate building
 */
router.post('/building', async (req, res) => {
  try {
    const { type = 'house', size = 1.0, options = {} } = req.body;
    
    console.log(`Generating building: ${type}`);
    
    const building = envGen.generateBuilding(type, size, options);
    
    res.json({
      success: true,
      type,
      size,
      image: `data:image/png;base64,${building.toString('base64')}`
    });
  } catch (error) {
    console.error('Building generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/assets/furniture
 * Generate furniture
 */
router.post('/furniture', async (req, res) => {
  try {
    const { type = 'table', options = {} } = req.body;
    
    console.log(`Generating furniture: ${type}`);
    
    const furniture = envGen.generateFurniture(type, options);
    
    res.json({
      success: true,
      type,
      image: `data:image/png;base64,${furniture.toString('base64')}`
    });
  } catch (error) {
    console.error('Furniture generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/assets/types
 * List available asset types
 */
router.get('/types', (req, res) => {
  res.json({
    success: true,
    terrainTypes: Object.keys(terrainGen.terrainTypes),
    treeTypes: envGen.objectTypes.tree,
    rockTypes: envGen.objectTypes.rock,
    buildingTypes: envGen.objectTypes.building,
    furnitureTypes: ['table', 'chair', 'chest', 'barrel']
  });
});

module.exports = router;
