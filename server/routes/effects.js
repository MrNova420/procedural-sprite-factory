/**
 * Effects Routes
 * API endpoints for generating particle effects and VFX
 */

const express = require('express');
const router = express.Router();
const ParticleEngine = require('../generators/particle-engine');
const CanvasManager = require('../core/canvas-manager');

const canvasManager = new CanvasManager();
const particleEngine = new ParticleEngine(canvasManager);

/**
 * Generate particle effect
 */
router.post('/particle', (req, res) => {
  try {
    const { effectType, particleCount, lifetime, intensity } = req.body;
    
    const effect = particleEngine.generateEffect(effectType, {
      particleCount,
      lifetime,
      intensity
    });
    
    res.json({
      success: true,
      effect
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Generate combat effect
 */
router.post('/combat', (req, res) => {
  try {
    const { effectType, direction, weaponType } = req.body;
    
    const effect = particleEngine.generateEffect(effectType || 'slash', {
      direction,
      weaponType
    });
    
    res.json({
      success: true,
      effect
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Generate magic effect
 */
router.post('/magic', (req, res) => {
  try {
    const { effectType, intensity, duration, color } = req.body;
    
    const effect = particleEngine.generateEffect(effectType || 'fireball', {
      intensity,
      lifetime: duration,
      colorStart: color
    });
    
    res.json({
      success: true,
      effect
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Generate environmental effect
 */
router.post('/environment', (req, res) => {
  try {
    const { effectType, intensity, windSpeed } = req.body;
    
    const effect = particleEngine.generateEffect(effectType || 'rain', {
      intensity,
      windSpeed
    });
    
    res.json({
      success: true,
      effect
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Generate status effect
 */
router.post('/status', (req, res) => {
  try {
    const { effectType, power, duration } = req.body;
    
    const effect = particleEngine.generateEffect(effectType || 'heal', {
      lifetime: duration,
      intensity: power
    });
    
    res.json({
      success: true,
      effect
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Generate trail effect
 */
router.post('/trail', (req, res) => {
  try {
    const { length, color, fadeRate, width } = req.body;
    
    const trail = particleEngine.generateTrail({
      length,
      color,
      fadeRate,
      width
    });
    
    res.json({
      success: true,
      trail
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Generate aura effect
 */
router.post('/aura', (req, res) => {
  try {
    const { radius, color, pulseSpeed, intensity } = req.body;
    
    const aura = particleEngine.generateAura({
      radius,
      color,
      pulseSpeed,
      intensity
    });
    
    res.json({
      success: true,
      aura
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get effect presets
 */
router.get('/presets', (req, res) => {
  res.json({
    success: true,
    presets: {
      combat: ['slash', 'impact', 'blood', 'sparks'],
      magic: ['fireball', 'ice-shard', 'lightning', 'arcane', 'holy', 'dark'],
      environment: ['rain', 'snow', 'wind', 'leaves', 'dust'],
      status: ['poison', 'burn', 'freeze', 'stun', 'heal'],
      special: ['explosion', 'smoke', 'portal']
    }
  });
});

module.exports = router;
