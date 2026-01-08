const Skeleton = require('./skeleton');
const MathUtils = require('../utils/math');

/**
 * Shape Engine
 * Generates pixel-perfect geometry and skeletal structures
 */
class ShapeEngine {
  constructor() {
    this.skeletonCache = new Map();
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
    
    // Determine body type for skeletal system
    const bodyType = this.getBodyType(dna.species);
    
    // Phase 2: Use skeletal system for more advanced creatures
    if (this.usesSkeletalSystem(dna.species)) {
      await this.drawSkeletalCreature(ctx, dna, centerX, centerY, size * 0.4, primaryColor, secondaryColor, bodyType);
    } else {
      // Fallback to basic shapes
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
          await this.drawGenericCreature(ctx, centerX, centerY, size * 0.35, primaryColor, secondaryColor);
      }
    }
  }

  /**
   * Determine if species uses skeletal system
   */
  usesSkeletalSystem(species) {
    return ['dragon', 'wolf', 'goblin', 'human', 'robot'].includes(species);
  }

  /**
   * Get body type for species
   */
  getBodyType(species) {
    const bodyTypes = {
      dragon: 'flying',
      wolf: 'quadruped',
      goblin: 'biped',
      human: 'biped',
      robot: 'biped'
    };
    return bodyTypes[species] || 'biped';
  }

  /**
   * Draw creature using skeletal system
   */
  async drawSkeletalCreature(ctx, dna, x, y, radius, primary, secondary, bodyType) {
    // Create or get cached skeleton
    const skeleton = new Skeleton(bodyType);
    
    // Scale skeleton to fit size
    const scale = radius / 20;
    skeleton.scale(scale);
    skeleton.translate(x, y);
    
    // Draw skeleton with flesh
    this.drawSkeletonWithFlesh(ctx, skeleton, primary, secondary, radius);
    
    // Add species-specific features
    this.addSpeciesFeatures(ctx, dna, x, y, radius, primary, secondary);
  }

  /**
   * Draw skeleton with flesh/body
   */
  drawSkeletonWithFlesh(ctx, skeleton, primary, secondary, radius) {
    // Draw bones as thick lines with circles at joints
    skeleton.bones.forEach(bone => {
      // Skip tiny bones
      if (bone.length < 1) return;
      
      // Draw bone body
      ctx.strokeStyle = primary;
      ctx.lineWidth = Math.max(2, bone.length * 0.3);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(bone.x, bone.y);
      ctx.lineTo(bone.endX, bone.endY);
      ctx.stroke();
      
      // Draw joint
      ctx.fillStyle = secondary;
      this.fillCircle(ctx, bone.x, bone.y, ctx.lineWidth * 0.6);
    });
  }

  /**
   * Add species-specific features (eyes, wings, etc.)
   */
  addSpeciesFeatures(ctx, dna, x, y, radius, primary, secondary) {
    const species = dna.species;
    
    switch (species) {
      case 'dragon':
        // Eyes
        ctx.fillStyle = '#FF0000';
        this.fillCircle(ctx, x - radius * 0.2, y - radius * 1.0, radius * 0.15);
        this.fillCircle(ctx, x + radius * 0.2, y - radius * 1.0, radius * 0.15);
        break;
      
      case 'wolf':
        // Eyes
        ctx.fillStyle = '#FFD700';
        this.fillCircle(ctx, x - radius * 0.15, y - radius * 0.5, radius * 0.12);
        this.fillCircle(ctx, x + radius * 0.15, y - radius * 0.5, radius * 0.12);
        break;
      
      case 'goblin':
        // Large eyes
        ctx.fillStyle = '#FFD700';
        this.fillCircle(ctx, x - radius * 0.25, y - radius * 0.3, radius * 0.18);
        this.fillCircle(ctx, x + radius * 0.25, y - radius * 0.3, radius * 0.18);
        // Pupils
        ctx.fillStyle = '#000000';
        this.fillCircle(ctx, x - radius * 0.25, y - radius * 0.3, radius * 0.08);
        this.fillCircle(ctx, x + radius * 0.25, y - radius * 0.3, radius * 0.08);
        break;
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
   * Draw bezier curve
   */
  drawBezierCurve(ctx, points, thickness = 2) {
    if (points.length < 4) return;
    
    ctx.lineWidth = thickness;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 0; i < points.length - 3; i += 3) {
      ctx.bezierCurveTo(
        points[i + 1].x, points[i + 1].y,
        points[i + 2].x, points[i + 2].y,
        points[i + 3].x, points[i + 3].y
      );
    }
    
    ctx.stroke();
  }

  /**
   * Fill bezier shape
   */
  fillBezierShape(ctx, points) {
    if (points.length < 4) return;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 0; i < points.length - 3; i += 3) {
      ctx.bezierCurveTo(
        points[i + 1].x, points[i + 1].y,
        points[i + 2].x, points[i + 2].y,
        points[i + 3].x, points[i + 3].y
      );
    }
    
    ctx.closePath();
    ctx.fill();
  }

  /**
   * Draw smooth curve through points (Catmull-Rom)
   */
  drawSmoothCurve(ctx, points, tension = 0.5, thickness = 2) {
    if (points.length < 2) return;
    
    ctx.lineWidth = thickness;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];
      
      const steps = 10;
      for (let t = 0; t <= steps; t++) {
        const u = t / steps;
        const x = MathUtils.catmullRom(u, p0.x, p1.x, p2.x, p3.x, tension);
        const y = MathUtils.catmullRom(u, p0.y, p1.y, p2.y, p3.y, tension);
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
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
