const MathUtils = require('../utils/math');

/**
 * Generate unique ID
 */
function generateId() {
  return require('crypto').randomBytes(8).toString('hex');
}

/**
 * Parse hex color to RGB array
 */
function hexToRgb(hex) {
  hex = hex.replace('#', '');
  return [
    parseInt(hex.substring(0, 2), 16),
    parseInt(hex.substring(2, 4), 16),
    parseInt(hex.substring(4, 6), 16)
  ];
}

/**
 * Convert RGB to hex color
 */
function rgbToHex(r, g, b) {
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Parse DNA from request or apply defaults
 */
function parseDNA(input) {
  return {
    species: input.species || 'dragon',
    size: input.size || 1.0,
    colors: input.colors || {},
    style: input.style || 'pixel',
    features: input.features || {},
    equipment: input.equipment || {},
    state: input.state || { pose: 'idle' },
    enableTextures: input.enableTextures !== false
  };
}

module.exports = {
  generateId,
  hexToRgb,
  rgbToHex,
  parseDNA,
  // Re-export commonly used MathUtils functions for convenience
  clamp: MathUtils.clamp,
  lerp: MathUtils.lerp
};
