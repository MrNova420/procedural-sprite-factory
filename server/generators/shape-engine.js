/**
 * Shape Engine
 * Generates pixel-perfect geometry and basic shapes
 */
class ShapeEngine {
  constructor() {
    // Shape primitives will be expanded in Phase 2
  }

  /**
   * Generate shape based on DNA
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Object} dna - DNA parameters
   * @param {number} size - Canvas size
   */
  async generateShape(ctx, dna, size) {
    const centerX = size / 2;
    const centerY = size / 2;
    
    // Extract colors from DNA or use defaults
    const primaryColor = dna.colors?.primary || this.getSpeciesColor(dna.species);
    const secondaryColor = dna.colors?.secondary || this.lightenColor(primaryColor, 0.3);
    
    // For Phase 1, generate simple geometric shapes
    // This will be greatly expanded in Phase 2 with skeletal system
    
    switch (dna.species) {
      case 'dragon':
        await this.drawDragonBasic(ctx, centerX, centerY, size * 0.4, primaryColor, secondaryColor);
        break;
      case 'wolf':
        await this.drawWolfBasic(ctx, centerX, centerY, size * 0.35, primaryColor, secondaryColor);
        break;
      case 'goblin':
        await this.drawGoblinBasic(ctx, centerX, centerY, size * 0.3, primaryColor, secondaryColor);
        break;
      default:
        // Generic creature
        await this.drawGenericCreature(ctx, centerX, centerY, size * 0.35, primaryColor, secondaryColor);
    }
  }

  /**
   * Draw basic dragon shape
   */
  async drawDragonBasic(ctx, x, y, radius, primary, secondary) {
    // Body
    ctx.fillStyle = primary;
    this.fillCircle(ctx, x, y, radius);
    
    // Head
    ctx.fillStyle = secondary;
    this.fillCircle(ctx, x, y - radius * 0.7, radius * 0.6);
    
    // Wings (simple triangles)
    ctx.fillStyle = primary;
    this.fillTriangle(ctx, x - radius, y, x - radius * 1.8, y - radius * 0.5, x - radius * 1.3, y + radius * 0.5);
    this.fillTriangle(ctx, x + radius, y, x + radius * 1.8, y - radius * 0.5, x + radius * 1.3, y + radius * 0.5);
    
    // Eyes
    ctx.fillStyle = '#FF0000';
    this.fillCircle(ctx, x - radius * 0.2, y - radius * 1.0, radius * 0.15);
    this.fillCircle(ctx, x + radius * 0.2, y - radius * 1.0, radius * 0.15);
  }

  /**
   * Draw basic wolf shape
   */
  async drawWolfBasic(ctx, x, y, radius, primary, secondary) {
    // Body
    ctx.fillStyle = primary;
    this.fillEllipse(ctx, x, y, radius * 1.3, radius * 0.8);
    
    // Head
    ctx.fillStyle = secondary;
    this.fillCircle(ctx, x - radius * 0.6, y - radius * 0.5, radius * 0.5);
    
    // Ears
    this.fillTriangle(ctx, x - radius * 0.8, y - radius * 0.8, x - radius * 0.6, y - radius * 1.2, x - radius * 0.4, y - radius * 0.9);
    
    // Legs (simple rectangles)
    ctx.fillStyle = primary;
    ctx.fillRect(x - radius * 0.5, y + radius * 0.5, radius * 0.3, radius * 0.8);
    ctx.fillRect(x + radius * 0.2, y + radius * 0.5, radius * 0.3, radius * 0.8);
  }

  /**
   * Draw basic goblin shape
   */
  async drawGoblinBasic(ctx, x, y, radius, primary, secondary) {
    // Body (humanoid)
    ctx.fillStyle = primary;
    this.fillCircle(ctx, x, y, radius * 0.7);
    
    // Head (large for goblin)
    ctx.fillStyle = secondary;
    this.fillCircle(ctx, x, y - radius * 0.9, radius * 0.8);
    
    // Ears (pointed)
    ctx.fillStyle = primary;
    this.fillTriangle(ctx, x - radius * 0.8, y - radius * 0.9, x - radius * 1.2, y - radius * 0.9, x - radius * 0.9, y - radius * 1.1);
    this.fillTriangle(ctx, x + radius * 0.8, y - radius * 0.9, x + radius * 1.2, y - radius * 0.9, x + radius * 0.9, y - radius * 1.1);
    
    // Eyes
    ctx.fillStyle = '#FFD700';
    this.fillCircle(ctx, x - radius * 0.3, y - radius * 1.0, radius * 0.2);
    this.fillCircle(ctx, x + radius * 0.3, y - radius * 1.0, radius * 0.2);
  }

  /**
   * Draw generic creature
   */
  async drawGenericCreature(ctx, x, y, radius, primary, secondary) {
    // Body
    ctx.fillStyle = primary;
    this.fillCircle(ctx, x, y, radius);
    
    // Head
    ctx.fillStyle = secondary;
    this.fillCircle(ctx, x, y - radius * 0.8, radius * 0.6);
    
    // Eyes
    ctx.fillStyle = '#FFFFFF';
    this.fillCircle(ctx, x - radius * 0.25, y - radius * 0.9, radius * 0.15);
    this.fillCircle(ctx, x + radius * 0.25, y - radius * 0.9, radius * 0.15);
    
    // Pupils
    ctx.fillStyle = '#000000';
    this.fillCircle(ctx, x - radius * 0.25, y - radius * 0.9, radius * 0.08);
    this.fillCircle(ctx, x + radius * 0.25, y - radius * 0.9, radius * 0.08);
  }

  /**
   * Fill circle using Bresenham-like algorithm for pixel-perfect rendering
   */
  fillCircle(ctx, x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Fill ellipse
   */
  fillEllipse(ctx, x, y, radiusX, radiusY) {
    ctx.beginPath();
    ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Fill triangle
   */
  fillTriangle(ctx, x1, y1, x2, y2, x3, y3) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fill();
  }

  /**
   * Get default color for species
   */
  getSpeciesColor(species) {
    const colors = {
      dragon: '#8B0000',    // Dark red
      wolf: '#808080',      // Gray
      goblin: '#90EE90',    // Light green
      robot: '#C0C0C0',     // Silver
      human: '#FFE4C4',     // Bisque
    };
    
    return colors[species] || '#4169E1'; // Default blue
  }

  /**
   * Lighten color by percentage
   */
  lightenColor(hex, percent) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Lighten
    const newR = Math.min(255, Math.round(r + (255 - r) * percent));
    const newG = Math.min(255, Math.round(g + (255 - g) * percent));
    const newB = Math.min(255, Math.round(b + (255 - b) * percent));
    
    // Convert back to hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }
}

module.exports = ShapeEngine;
