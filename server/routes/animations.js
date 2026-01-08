/**
 * Animation Routes
 * API endpoints for generating sprite animations
 */

const express = require('express');
const router = express.Router();
const AnimationEngine = require('../generators/animation-engine');
const CanvasManager = require('../core/canvas-manager');

const canvasManager = new CanvasManager();
const animationEngine = new AnimationEngine(canvasManager);

/**
 * Generate walk cycle
 */
router.post('/walk', (req, res) => {
  try {
    const { dna, frameCount, speed, bodyType } = req.body;
    
    const animation = animationEngine.generateWalkCycle(dna, {
      frameCount,
      speed,
      bodyType
    });
    
    res.json({
      success: true,
      animation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Generate action animation
 */
router.post('/action', (req, res) => {
  try {
    const { dna, actionType, frameCount, weaponType } = req.body;
    
    const animation = animationEngine.generateActionAnimation(dna, actionType, {
      frameCount,
      weaponType
    });
    
    res.json({
      success: true,
      animation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Generate custom keyframe animation
 */
router.post('/custom', (req, res) => {
  try {
    const { dna, keyframes, totalFrames, easing, fps, loop } = req.body;
    
    const animation = animationEngine.generateCustomAnimation(dna, keyframes, {
      totalFrames,
      easing,
      fps,
      loop
    });
    
    res.json({
      success: true,
      animation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Export animation as sprite sheet
 */
router.post('/sprite-sheet', (req, res) => {
  try {
    const { animation, dna, layout, frameSize, padding } = req.body;
    
    const spriteSheet = animationEngine.exportSpriteSheet(animation, dna, {
      layout,
      frameSize,
      padding
    });
    
    res.json({
      success: true,
      spriteSheet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get available animation types
 */
router.get('/types', (req, res) => {
  res.json({
    success: true,
    animationTypes: [
      'walk',
      'attack',
      'hurt',
      'death',
      'idle',
      'jump',
      'cast',
      'run'
    ],
    easingFunctions: [
      'linear',
      'easeIn',
      'easeOut',
      'easeInOut',
      'easeInCubic',
      'easeOutCubic',
      'easeInOutCubic'
    ]
  });
});

module.exports = router;
