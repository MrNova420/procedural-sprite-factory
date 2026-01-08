const ColorUtils = require('../utils/colors');

/**
 * Environment Generator
 * Generates environmental objects like trees, rocks, buildings
 */
class EnvironmentGenerator {
  constructor() {
    this.objectTypes = {
      tree: ['oak', 'pine', 'palm', 'dead', 'cherry', 'willow'],
      rock: ['small', 'medium', 'large', 'boulder', 'crystal'],
      building: ['house', 'tower', 'castle', 'hut', 'barn'],
      plant: ['bush', 'flower', 'grass', 'mushroom', 'crop']
    };
  }

  /**
   * Generate a tree
   * @param {string} species - Tree species
   * @param {number} size - Tree size multiplier
   * @param {Object} options - Generation options
   */
  generateTree(species = 'oak', size = 1.0, options = {}) {
    const canvas = require('canvas').createCanvas(64 * size, 96 * size);
    const ctx = canvas.getContext('2d');
    
    switch (species) {
      case 'oak':
        this.drawOakTree(ctx, size, options);
        break;
      case 'pine':
        this.drawPineTree(ctx, size, options);
        break;
      case 'palm':
        this.drawPalmTree(ctx, size, options);
        break;
      case 'dead':
        this.drawDeadTree(ctx, size, options);
        break;
      default:
        this.drawOakTree(ctx, size, options);
    }
    
    return canvas.toBuffer('image/png');
  }

  /**
   * Draw oak tree
   */
  drawOakTree(ctx, size, options) {
    const centerX = ctx.canvas.width / 2;
    const baseY = ctx.canvas.height;
    
    // Trunk
    const trunkColor = options.trunkColor || '#8B4513';
    ctx.fillStyle = trunkColor;
    
    const trunkWidth = 8 * size;
    const trunkHeight = 40 * size;
    ctx.fillRect(centerX - trunkWidth / 2, baseY - trunkHeight, trunkWidth, trunkHeight);
    
    // Foliage (rounded canopy)
    const foliageColor = options.foliageColor || '#228B22';
    ctx.fillStyle = foliageColor;
    
    // Main canopy
    ctx.beginPath();
    ctx.arc(centerX, baseY - trunkHeight, 25 * size, 0, Math.PI * 2);
    ctx.fill();
    
    // Side canopies for fuller look
    ctx.beginPath();
    ctx.arc(centerX - 15 * size, baseY - trunkHeight + 10 * size, 18 * size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(centerX + 15 * size, baseY - trunkHeight + 10 * size, 18 * size, 0, Math.PI * 2);
    ctx.fill();
    
    // Add highlights
    ctx.fillStyle = ColorUtils.lighten(foliageColor, 0.2);
    ctx.beginPath();
    ctx.arc(centerX - 8 * size, baseY - trunkHeight - 10 * size, 12 * size, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * Draw pine tree
   */
  drawPineTree(ctx, size, options) {
    const centerX = ctx.canvas.width / 2;
    const baseY = ctx.canvas.height;
    
    // Trunk
    const trunkColor = options.trunkColor || '#654321';
    ctx.fillStyle = trunkColor;
    
    const trunkWidth = 6 * size;
    const trunkHeight = 30 * size;
    ctx.fillRect(centerX - trunkWidth / 2, baseY - trunkHeight, trunkWidth, trunkHeight);
    
    // Foliage (triangular layers)
    const foliageColor = options.foliageColor || '#2F4F2F';
    ctx.fillStyle = foliageColor;
    
    // Draw 3 triangular layers
    for (let i = 0; i < 3; i++) {
      const layerY = baseY - trunkHeight - i * 20 * size;
      const layerWidth = (30 - i * 5) * size;
      
      ctx.beginPath();
      ctx.moveTo(centerX, layerY - 25 * size);
      ctx.lineTo(centerX - layerWidth, layerY);
      ctx.lineTo(centerX + layerWidth, layerY);
      ctx.closePath();
      ctx.fill();
    }
  }

  /**
   * Draw palm tree
   */
  drawPalmTree(ctx, size, options) {
    const centerX = ctx.canvas.width / 2;
    const baseY = ctx.canvas.height;
    
    // Curved trunk
    const trunkColor = options.trunkColor || '#D2691E';
    ctx.strokeStyle = trunkColor;
    ctx.lineWidth = 8 * size;
    
    ctx.beginPath();
    ctx.moveTo(centerX, baseY);
    ctx.quadraticCurveTo(
      centerX + 10 * size, 
      baseY - 30 * size,
      centerX + 5 * size,
      baseY - 60 * size
    );
    ctx.stroke();
    
    // Palm fronds
    const frondColor = options.foliageColor || '#32CD32';
    ctx.fillStyle = frondColor;
    
    const topX = centerX + 5 * size;
    const topY = baseY - 60 * size;
    
    // Draw 5 fronds
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2 / 5) - Math.PI / 2;
      const length = 30 * size;
      const endX = topX + Math.cos(angle) * length;
      const endY = topY + Math.sin(angle) * length;
      
      // Draw frond as ellipse
      ctx.save();
      ctx.translate(topX, topY);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(length / 2, 0, length / 2, 5 * size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  /**
   * Draw dead tree
   */
  drawDeadTree(ctx, size, options) {
    const centerX = ctx.canvas.width / 2;
    const baseY = ctx.canvas.height;
    
    // Trunk
    const trunkColor = options.trunkColor || '#696969';
    ctx.strokeStyle = trunkColor;
    ctx.lineWidth = 6 * size;
    ctx.lineCap = 'round';
    
    // Main trunk
    ctx.beginPath();
    ctx.moveTo(centerX, baseY);
    ctx.lineTo(centerX, baseY - 50 * size);
    ctx.stroke();
    
    // Branches
    ctx.lineWidth = 3 * size;
    
    // Left branch
    ctx.beginPath();
    ctx.moveTo(centerX, baseY - 30 * size);
    ctx.lineTo(centerX - 20 * size, baseY - 45 * size);
    ctx.stroke();
    
    // Right branch
    ctx.beginPath();
    ctx.moveTo(centerX, baseY - 35 * size);
    ctx.lineTo(centerX + 15 * size, baseY - 50 * size);
    ctx.stroke();
  }

  /**
   * Generate a rock
   * @param {string} type - Rock type
   * @param {number} size - Rock size multiplier
   * @param {Object} options - Generation options
   */
  generateRock(type = 'medium', size = 1.0, options = {}) {
    const baseSize = type === 'small' ? 16 : type === 'large' ? 48 : 32;
    const canvas = require('canvas').createCanvas(baseSize * size, baseSize * size * 0.8);
    const ctx = canvas.getContext('2d');
    
    const rockColor = options.color || '#808080';
    
    // Draw irregular polygon for rock
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = (baseSize / 2) * size;
    const points = 8;
    
    ctx.fillStyle = rockColor;
    ctx.beginPath();
    
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const variation = 0.7 + Math.random() * 0.6;
      const x = centerX + Math.cos(angle) * radius * variation;
      const y = centerY + Math.sin(angle) * radius * variation * 0.8;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.closePath();
    ctx.fill();
    
    // Add shading
    ctx.fillStyle = ColorUtils.darken(rockColor, 0.3);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    for (let i = points / 2; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const variation = 0.7 + Math.random() * 0.6;
      const x = centerX + Math.cos(angle) * radius * variation;
      const y = centerY + Math.sin(angle) * radius * variation * 0.8;
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    
    return canvas.toBuffer('image/png');
  }

  /**
   * Generate a building
   * @param {string} type - Building type
   * @param {number} size - Building size multiplier
   * @param {Object} options - Generation options
   */
  generateBuilding(type = 'house', size = 1.0, options = {}) {
    const canvas = require('canvas').createCanvas(128 * size, 128 * size);
    const ctx = canvas.getContext('2d');
    
    switch (type) {
      case 'house':
        this.drawHouse(ctx, size, options);
        break;
      case 'tower':
        this.drawTower(ctx, size, options);
        break;
      case 'hut':
        this.drawHut(ctx, size, options);
        break;
      default:
        this.drawHouse(ctx, size, options);
    }
    
    return canvas.toBuffer('image/png');
  }

  /**
   * Draw house
   */
  drawHouse(ctx, size, options) {
    const baseX = 24 * size;
    const baseY = 64 * size;
    const width = 80 * size;
    const height = 50 * size;
    
    // Walls
    const wallColor = options.wallColor || '#CD853F';
    ctx.fillStyle = wallColor;
    ctx.fillRect(baseX, baseY, width, height);
    
    // Roof
    const roofColor = options.roofColor || '#8B4513';
    ctx.fillStyle = roofColor;
    ctx.beginPath();
    ctx.moveTo(baseX - 10 * size, baseY);
    ctx.lineTo(baseX + width / 2, baseY - 30 * size);
    ctx.lineTo(baseX + width + 10 * size, baseY);
    ctx.closePath();
    ctx.fill();
    
    // Door
    ctx.fillStyle = '#654321';
    ctx.fillRect(baseX + width / 2 - 10 * size, baseY + height - 25 * size, 20 * size, 25 * size);
    
    // Window
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(baseX + 15 * size, baseY + 15 * size, 15 * size, 15 * size);
  }

  /**
   * Draw tower
   */
  drawTower(ctx, size, options) {
    const baseX = 44 * size;
    const baseY = 30 * size;
    const width = 40 * size;
    const height = 80 * size;
    
    // Tower body
    const stoneColor = options.stoneColor || '#808080';
    ctx.fillStyle = stoneColor;
    ctx.fillRect(baseX, baseY, width, height);
    
    // Top
    ctx.fillStyle = ColorUtils.darken(stoneColor, 0.2);
    ctx.beginPath();
    ctx.moveTo(baseX - 5 * size, baseY);
    ctx.lineTo(baseX + width / 2, baseY - 15 * size);
    ctx.lineTo(baseX + width + 5 * size, baseY);
    ctx.closePath();
    ctx.fill();
    
    // Windows
    ctx.fillStyle = '#000000';
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(baseX + width / 2 - 4 * size, baseY + 15 * size + i * 20 * size, 8 * size, 10 * size);
    }
  }

  /**
   * Draw hut
   */
  drawHut(ctx, size, options) {
    const baseX = 32 * size;
    const baseY = 80 * size;
    const width = 64 * size;
    const height = 40 * size;
    
    // Walls
    const wallColor = options.wallColor || '#DEB887';
    ctx.fillStyle = wallColor;
    ctx.fillRect(baseX, baseY, width, height);
    
    // Thatched roof
    const roofColor = options.roofColor || '#DAA520';
    ctx.fillStyle = roofColor;
    ctx.beginPath();
    ctx.moveTo(baseX - 8 * size, baseY);
    ctx.lineTo(baseX + width / 2, baseY - 25 * size);
    ctx.lineTo(baseX + width + 8 * size, baseY);
    ctx.closePath();
    ctx.fill();
    
    // Door
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(baseX + width / 2 - 8 * size, baseY + height - 20 * size, 16 * size, 20 * size);
  }

  /**
   * Generate furniture
   * @param {string} type - Furniture type
   * @param {Object} options - Generation options
   */
  generateFurniture(type, options = {}) {
    const canvas = require('canvas').createCanvas(32, 32);
    const ctx = canvas.getContext('2d');
    
    const woodColor = options.woodColor || '#8B4513';
    
    switch (type) {
      case 'table':
        // Table top
        ctx.fillStyle = woodColor;
        ctx.fillRect(4, 12, 24, 8);
        // Legs
        ctx.fillRect(6, 20, 3, 8);
        ctx.fillRect(23, 20, 3, 8);
        break;
        
      case 'chair':
        // Seat
        ctx.fillStyle = woodColor;
        ctx.fillRect(8, 16, 16, 4);
        // Back
        ctx.fillRect(8, 8, 16, 8);
        // Legs
        ctx.fillRect(10, 20, 3, 8);
        ctx.fillRect(19, 20, 3, 8);
        break;
        
      case 'chest':
        // Main body
        ctx.fillStyle = woodColor;
        ctx.fillRect(4, 12, 24, 16);
        // Lid
        ctx.fillStyle = ColorUtils.darken(woodColor, 0.2);
        ctx.fillRect(4, 10, 24, 4);
        // Lock
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(14, 18, 4, 4);
        break;
    }
    
    return canvas.toBuffer('image/png');
  }
}

module.exports = EnvironmentGenerator;
