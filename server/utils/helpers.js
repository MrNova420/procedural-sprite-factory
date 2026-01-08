const crypto = require('crypto');

/**
 * Generate unique ID
 */
function generateId() {
  return crypto.randomBytes(8).toString('hex');
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
 * Clamp value between min and max
 */
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Linear interpolation
 */
function lerp(start, end, t) {
  return start + (end - start) * t;
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
    state: input.state || { pose: 'idle' }
  };
}

module.exports = {
  generateId,
  hexToRgb,
  rgbToHex,
  clamp,
  lerp,
  parseDNA
};
