const express = require('express');
const router = express.Router();
const AdvancedLightingSystem = require('../generators/advanced-lighting-system');
const MaterialPhysicsSystem = require('../generators/material-physics-system');
const InverseKinematicsSystem = require('../generators/inverse-kinematics');
const WeatherSystem = require('../generators/weather-system');
const QualityPresets = require('../generators/quality-presets');

// Create instances
const lightingSystem = new AdvancedLightingSystem();
const physicsSystem = new MaterialPhysicsSystem();
const ikSystem = new InverseKinematicsSystem();
const weatherSystem = new WeatherSystem();
const qualityPresets = new QualityPresets();

/**
 * GET /api/advanced/presets
 * List all quality presets
 */
router.get('/presets', (req, res) => {
  try {
    const presets = qualityPresets.listPresets();
    const categories = qualityPresets.getPresetsByCategory();
    
    res.json({
      success: true,
      presets,
      categories
    });
  } catch (error) {
    console.error('Error fetching presets:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/advanced/presets/:name
 * Get specific preset details
 */
router.get('/presets/:name', (req, res) => {
  try {
    const preset = qualityPresets.getPreset(req.params.name);
    const qualityScore = qualityPresets.getQualityScore(req.params.name);
    const performance = qualityPresets.getPerformanceEstimate(req.params.name);
    
    res.json({
      success: true,
      preset,
      qualityScore,
      performance
    });
  } catch (error) {
    console.error('Error fetching preset:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/advanced/apply-preset
 * Apply quality preset to generation parameters
 */
router.post('/apply-preset', (req, res) => {
  try {
    const { preset, baseParams = {} } = req.body;
    
    if (!preset) {
      return res.status(400).json({
        success: false,
        error: 'Preset name is required'
      });
    }
    
    const appliedParams = qualityPresets.applyPreset(preset, baseParams);
    
    res.json({
      success: true,
      parameters: appliedParams
    });
  } catch (error) {
    console.error('Error applying preset:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/advanced/lighting/setup
 * Set up custom lighting configuration
 */
router.post('/lighting/setup', (req, res) => {
  try {
    const { lights = [], ambient, globalIllumination = true } = req.body;
    
    lightingSystem.lights = [];
    if (ambient) {
      lightingSystem.ambientLight = ambient;
    }
    lightingSystem.globalIllumination = globalIllumination;
    
    for (const light of lights) {
      lightingSystem.addLight(light);
    }
    
    res.json({
      success: true,
      lightCount: lightingSystem.lights.length,
      message: 'Lighting configuration applied'
    });
  } catch (error) {
    console.error('Error setting up lighting:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/advanced/lighting/three-point
 * Set up standard 3-point lighting
 */
router.post('/lighting/three-point', (req, res) => {
  try {
    lightingSystem.setupThreePointLighting();
    
    res.json({
      success: true,
      lights: lightingSystem.lights,
      message: 'Three-point lighting configured'
    });
  } catch (error) {
    console.error('Error setting up three-point lighting:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/advanced/physics/cloth
 * Create cloth simulation
 */
router.post('/physics/cloth', (req, res) => {
  try {
    const {
      width = 50,
      height = 50,
      segmentsX = 10,
      segmentsY = 10
    } = req.body;
    
    const cloth = physicsSystem.createCloth(width, height, segmentsX, segmentsY);
    
    res.json({
      success: true,
      cloth: {
        particleCount: cloth.particles.length,
        constraintCount: cloth.constraints.length,
        dimensions: { width, height },
        segments: { x: segmentsX, y: segmentsY }
      }
    });
  } catch (error) {
    console.error('Error creating cloth:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/advanced/physics/fluid
 * Create fluid simulation
 */
router.post('/physics/fluid', (req, res) => {
  try {
    const {
      particleCount = 100,
      bounds = { x: 0, y: 0, width: 128, height: 128 }
    } = req.body;
    
    const fluid = physicsSystem.createFluid(particleCount, bounds);
    
    res.json({
      success: true,
      fluid: {
        particleCount: fluid.particles.length,
        bounds: fluid.bounds,
        properties: {
          smoothingRadius: fluid.smoothingRadius,
          restDensity: fluid.restDensity,
          stiffness: fluid.stiffness,
          viscosity: fluid.viscosity
        }
      }
    });
  } catch (error) {
    console.error('Error creating fluid:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/advanced/animation/ik
 * Solve inverse kinematics
 */
router.post('/animation/ik', (req, res) => {
  try {
    const {
      basePosition = { x: 0, y: 0, z: 0 },
      segmentLengths = [20, 20, 20],
      targetPosition,
      constraints = {}
    } = req.body;
    
    if (!targetPosition) {
      return res.status(400).json({
        success: false,
        error: 'Target position is required'
      });
    }
    
    const chain = ikSystem.createChain(basePosition, segmentLengths, constraints);
    const solved = ikSystem.solveIK(chain, targetPosition);
    
    res.json({
      success: true,
      joints: solved.map(j => ({
        pos: j.pos,
        angle: j.angle
      }))
    });
  } catch (error) {
    console.error('Error solving IK:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/advanced/animation/walk-cycle
 * Generate procedural walk cycle
 */
router.post('/animation/walk-cycle', (req, res) => {
  try {
    const {
      character,
      frameCount = 8
    } = req.body;
    
    if (!character) {
      return res.status(400).json({
        success: false,
        error: 'Character configuration is required'
      });
    }
    
    const walkCycle = ikSystem.generateWalkCycle(character, frameCount);
    
    res.json({
      success: true,
      frames: walkCycle,
      frameCount: walkCycle.length
    });
  } catch (error) {
    console.error('Error generating walk cycle:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/advanced/weather/rain
 * Generate rain effect
 */
router.post('/weather/rain', (req, res) => {
  try {
    const {
      intensity = 0.5,
      windSpeed = 0,
      width = 128,
      height = 128
    } = req.body;
    
    const rain = weatherSystem.generateRain(intensity, windSpeed, { width, height });
    
    res.json({
      success: true,
      effect: {
        type: 'rain',
        dropCount: rain.drops.length,
        splashCount: rain.splashes.length,
        intensity,
        windSpeed
      }
    });
  } catch (error) {
    console.error('Error generating rain:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/advanced/weather/snow
 * Generate snow effect
 */
router.post('/weather/snow', (req, res) => {
  try {
    const {
      intensity = 0.5,
      windSpeed = 0,
      width = 128,
      height = 128
    } = req.body;
    
    const snow = weatherSystem.generateSnow(intensity, windSpeed, { width, height });
    
    res.json({
      success: true,
      effect: {
        type: 'snow',
        flakeCount: snow.flakes.length,
        intensity,
        windSpeed,
        accumulation: snow.accumulation
      }
    });
  } catch (error) {
    console.error('Error generating snow:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/advanced/weather/lightning
 * Generate lightning effect
 */
router.post('/weather/lightning', (req, res) => {
  try {
    const options = req.body;
    
    const lightning = weatherSystem.generateLightning(options);
    
    res.json({
      success: true,
      effect: {
        type: 'lightning',
        segmentCount: lightning.segments.length,
        branchCount: lightning.branches.length,
        duration: lightning.duration
      }
    });
  } catch (error) {
    console.error('Error generating lightning:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/advanced/weather/day-night/:time
 * Get day/night lighting configuration
 */
router.get('/weather/day-night/:time', (req, res) => {
  try {
    const timeOfDay = parseFloat(req.params.time);
    
    if (isNaN(timeOfDay) || timeOfDay < 0 || timeOfDay > 1) {
      return res.status(400).json({
        success: false,
        error: 'Time of day must be between 0 and 1'
      });
    }
    
    const lighting = weatherSystem.getDayNightLighting(timeOfDay);
    
    res.json({
      success: true,
      lighting
    });
  } catch (error) {
    console.error('Error getting day/night lighting:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/advanced/weather/seasonal-palette
 * Get seasonal color palette
 */
router.post('/weather/seasonal-palette', (req, res) => {
  try {
    const { season, basePalette } = req.body;
    
    if (!season || !basePalette) {
      return res.status(400).json({
        success: false,
        error: 'Season and base palette are required'
      });
    }
    
    const seasonalPalette = weatherSystem.getSeasonalPalette(season, basePalette);
    
    res.json({
      success: true,
      palette: seasonalPalette
    });
  } catch (error) {
    console.error('Error generating seasonal palette:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/advanced/capabilities
 * List all advanced capabilities
 */
router.get('/capabilities', (req, res) => {
  try {
    res.json({
      success: true,
      capabilities: {
        lighting: {
          types: ['point', 'directional', 'spot', 'area'],
          features: ['shadows', 'global illumination', 'three-point setup', 'PBR']
        },
        physics: {
          simulations: ['cloth', 'fluid', 'soft body', 'ragdoll'],
          algorithms: ['Verlet integration', 'SPH', 'mass-spring']
        },
        animation: {
          types: ['IK', 'walk cycle', 'reach', 'ragdoll', 'procedural'],
          algorithms: ['FABRIK', 'inverse kinematics', 'physics-based']
        },
        weather: {
          effects: ['rain', 'snow', 'fog', 'wind', 'lightning'],
          features: ['day/night cycle', 'seasonal palettes', 'animated effects']
        },
        presets: {
          categories: ['games', 'artStyles', 'production'],
          count: qualityPresets.listPresets().length
        }
      }
    });
  } catch (error) {
    console.error('Error fetching capabilities:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
