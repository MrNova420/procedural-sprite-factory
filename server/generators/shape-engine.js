const Skeleton = require('./skeleton');
const MathUtils = require('../utils/math');
const DragonRenderer = require('./dragon-renderer');
const WolfRenderer = require('./wolf-renderer');
const UniversalProceduralGenerator = require('./universal-procedural-generator');
const TopDownRenderer = require('./topdown-renderer');

/**
 * Shape Engine
 * Generates pixel-perfect geometry and skeletal structures
 */
class ShapeEngine {
  constructor() {
    this.skeletonCache = new Map();
    this.dragonRenderer = new DragonRenderer();
    this.wolfRenderer = new WolfRenderer();
    this.universalGenerator = new UniversalProceduralGenerator();
    this.topDownRenderer = new TopDownRenderer();
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
    
    // Add colors to DNA if not present
    if (!dna.colors) {
      dna.colors = { primary: primaryColor, secondary: secondaryColor };
    }
    
    // Check if using top-down rendering
    if (dna.topDown === true || dna.perspective === 'topdown') {
      const palette = this.generatePaletteFromDNA(dna);
      
      if (dna.generateItem || dna.itemType) {
        const itemData = this.universalGenerator.generateItem({
          itemType: dna.itemType,
          itemCategory: dna.itemCategory,
          seed: dna.seed,
          quality: dna.quality,
          baseHue: dna.baseHue
        });
        this.topDownRenderer.renderTopDownItem(ctx, centerX, centerY, size * 0.4, itemData);
      } else if (dna.generateEnvironment || dna.assetType) {
        const envData = this.universalGenerator.generateEnvironmentAsset({
          assetType: dna.assetType,
          assetCategory: dna.assetCategory,
          seed: dna.seed,
          baseHue: dna.baseHue
        });
        this.topDownRenderer.renderTopDownEnvironment(ctx, centerX, centerY, size * 0.4, envData);
      } else {
        // Top-down character
        const params = {
          archetype: dna.archetype || 'biped',
          material: dna.material || 'flesh',
          palette,
          features: this.universalGenerator.generateFeatures({seed: dna.seed}),
          showUI: dna.showUI,
          selected: dna.selected,
          showHealth: dna.showHealth,
          health: dna.health
        };
        this.topDownRenderer.renderTopDownCharacter(ctx, centerX, centerY, size * 0.4, params);
      }
      return;
    }
    
    // Check if generating items
    if (dna.generateItem === true || dna.itemType) {
      const itemData = this.universalGenerator.generateItem({
        itemType: dna.itemType,
        itemCategory: dna.itemCategory,
        seed: dna.seed,
        material: dna.material,
        quality: dna.quality,
        wear: dna.wear,
        size: dna.size,
        angle: dna.angle,
        baseHue: dna.baseHue,
        harmony: dna.harmony
      });
      
      await this.universalGenerator.renderFromInstructions(
        ctx,
        itemData.renderInstructions,
        centerX,
        centerY,
        size * 0.4
      );
      return;
    }
    
    // Check if generating environment assets
    if (dna.generateEnvironment === true || dna.assetType) {
      const envData = this.universalGenerator.generateEnvironmentAsset({
        assetType: dna.assetType,
        assetCategory: dna.assetCategory,
        seed: dna.seed,
        material: dna.material,
        organic: dna.organic,
        size: dna.size,
        weathering: dna.weathering,
        age: dna.age,
        baseHue: dna.baseHue,
        harmony: dna.harmony
      });
      
      await this.universalGenerator.renderFromInstructions(
        ctx,
        envData.renderInstructions,
        centerX,
        centerY,
        size * 0.4
      );
      return;
    }
    
    // Check if we should use universal procedural generation for creatures
    if (dna.procedural === true || dna.archetype) {
      // Use universal procedural generator for AAA quality on-the-spot generation
      const generatedData = this.universalGenerator.generateCreature({
        archetype: dna.archetype,
        seed: dna.seed,
        material: dna.material,
        organic: dna.organic,
        muscleDefinition: dna.muscleDefinition,
        baseHue: dna.baseHue,
        harmony: dna.harmony,
        flying: dna.flying,
        aquatic: dna.aquatic,
        spider: dna.spider,
        magical: dna.magical,
        eyeCount: dna.eyeCount
      });
      
      await this.universalGenerator.renderFromInstructions(
        ctx, 
        generatedData.renderInstructions,
        centerX,
        centerY,
        size * 0.4
      );
      return;
    }
    
    // Determine body type for skeletal system
    const bodyType = this.getBodyType(dna.species);
    
    // Use professional renderers for dragon and wolf
    if (dna.species === 'dragon') {
      await this.dragonRenderer.renderDragon(ctx, centerX, centerY, size * 0.4, dna);
      return;
    } else if (dna.species === 'wolf') {
      await this.wolfRenderer.renderWolf(ctx, centerX, centerY, size * 0.35, dna);
      return;
    }
    
    // Phase 2: Use skeletal system for more advanced creatures
    if (this.usesSkeletalSystem(dna.species)) {
      await this.drawSkeletalCreature(ctx, dna, centerX, centerY, size * 0.4, primaryColor, secondaryColor, bodyType);
    } else {
      // Fallback to basic shapes for other species
      switch (dna.species) {
        case 'goblin':
          await this.drawGoblinBasic(ctx, centerX, centerY, size * 0.3, primaryColor, secondaryColor);
          break;
        case 'robot':
          await this.drawRobotBasic(ctx, centerX, centerY, size * 0.35, primaryColor, secondaryColor);
          break;
        case 'human':
          await this.drawHumanBasic(ctx, centerX, centerY, size * 0.35, primaryColor, secondaryColor);
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
    // DISABLED: Skeletal system draws stick figures
    // Use detailed species-specific drawing methods instead
    return false;
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
   * Draw smooth tapered limb with proper joints
   */
  drawSmoothLimb(ctx, startX, startY, endX, endY, startThick, endThick, color) {
    const angle = Math.atan2(endY - startY, endX - startX);
    const perpAngle = angle + Math.PI / 2;
    
    ctx.fillStyle = color;
    ctx.beginPath();
    
    // Start joint
    const s1x = startX + Math.cos(perpAngle) * (startThick / 2);
    const s1y = startY + Math.sin(perpAngle) * (startThick / 2);
    const s2x = startX - Math.cos(perpAngle) * (startThick / 2);
    const s2y = startY - Math.sin(perpAngle) * (startThick / 2);
    
    // End joint
    const e1x = endX + Math.cos(perpAngle) * (endThick / 2);
    const e1y = endY + Math.sin(perpAngle) * (endThick / 2);
    const e2x = endX - Math.cos(perpAngle) * (endThick / 2);
    const e2y = endY - Math.sin(perpAngle) * (endThick / 2);
    
    // Draw smooth limb shape
    ctx.moveTo(s1x, s1y);
    ctx.bezierCurveTo(
      s1x + (e1x - s1x) * 0.3, s1y + (e1y - s1y) * 0.3,
      s1x + (e1x - s1x) * 0.7, s1y + (e1y - s1y) * 0.7,
      e1x, e1y
    );
    ctx.lineTo(e2x, e2y);
    ctx.bezierCurveTo(
      e2x + (s2x - e2x) * 0.3, e2y + (s2y - e2y) * 0.3,
      e2x + (s2x - e2x) * 0.7, e2y + (s2y - e2y) * 0.7,
      s2x, s2y
    );
    ctx.closePath();
    ctx.fill();
    
    // Joint bulges
    this.fillCircle(ctx, startX, startY, startThick * 0.6);
    this.fillCircle(ctx, endX, endY, endThick * 0.6);
  }

  /**
   * Draw fur texture
   */
  drawFurTexture(ctx, x, y, width, height, color, density = 0.3) {
    ctx.save();
    const strands = Math.floor(width * height * density / 100);
    for (let i = 0; i < strands; i++) {
      const fx = x - width/2 + Math.random() * width;
      const fy = y - height/2 + Math.random() * height;
      const len = 2 + Math.random() * 4;
      const angle = Math.random() * Math.PI * 2;
      
      ctx.strokeStyle = this.darkenColor(color, Math.random() * 0.2);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx + Math.cos(angle) * len, fy + Math.sin(angle) * len);
      ctx.stroke();
    }
    ctx.restore();
  }

  /**
   * Draw scale pattern
   */
  drawScalePattern(ctx, x, y, width, height, baseColor, scaleSize = 8) {
    for (let sy = y - height/2; sy < y + height/2; sy += scaleSize * 0.7) {
      for (let sx = x - width/2; sx < x + width/2; sx += scaleSize) {
        const offset = (Math.floor((sy - (y - height/2)) / (scaleSize * 0.7)) % 2) * (scaleSize / 2);
        const scaleX = sx + offset;
        const scaleY = sy;
        
        // Scale shape
        ctx.fillStyle = this.lightenColor(baseColor, Math.random() * 0.1);
        ctx.beginPath();
        ctx.arc(scaleX, scaleY, scaleSize * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Scale highlight
        ctx.fillStyle = this.lightenColor(baseColor, 0.3);
        ctx.beginPath();
        ctx.arc(scaleX - 1, scaleY - 1, scaleSize * 0.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
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
   * Draw basic dragon shape - AAA QUALITY VERSION
   */
  async drawDragonBasic(ctx, x, y, radius, primary, secondary) {
    // Powerful dragon body with proper anatomy
    const bodyWidth = radius * 1.4;
    const bodyHeight = radius * 1.8;
    
    // === WINGS (draw first, behind body) ===
    const wingY = y - bodyHeight * 0.2;
    
    // Left wing
    ctx.fillStyle = this.transparentize(primary, 0.85);
    ctx.beginPath();
    ctx.moveTo(x - bodyWidth * 0.4, wingY);
    ctx.quadraticCurveTo(x - bodyWidth * 1.5, wingY - radius * 0.8, x - bodyWidth * 2.2, wingY - radius * 0.3);
    ctx.quadraticCurveTo(x - bodyWidth * 2.0, wingY + radius * 0.2, x - bodyWidth * 1.4, wingY + radius * 0.5);
    ctx.quadraticCurveTo(x - bodyWidth * 0.8, wingY + radius * 0.3, x - bodyWidth * 0.3, wingY + radius * 0.1);
    ctx.fill();
    
    // Wing bones (left)
    ctx.strokeStyle = this.darkenColor(primary, 0.3);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - bodyWidth * 0.4, wingY);
    ctx.lineTo(x - bodyWidth * 1.5, wingY - radius * 0.6);
    ctx.moveTo(x - bodyWidth * 0.4, wingY);
    ctx.lineTo(x - bodyWidth * 1.8, wingY);
    ctx.moveTo(x - bodyWidth * 0.4, wingY);
    ctx.lineTo(x - bodyWidth * 1.4, wingY + radius * 0.4);
    ctx.stroke();
    
    // Right wing
    ctx.fillStyle = this.transparentize(primary, 0.85);
    ctx.beginPath();
    ctx.moveTo(x + bodyWidth * 0.4, wingY);
    ctx.quadraticCurveTo(x + bodyWidth * 1.5, wingY - radius * 0.8, x + bodyWidth * 2.2, wingY - radius * 0.3);
    ctx.quadraticCurveTo(x + bodyWidth * 2.0, wingY + radius * 0.2, x + bodyWidth * 1.4, wingY + radius * 0.5);
    ctx.quadraticCurveTo(x + bodyWidth * 0.8, wingY + radius * 0.3, x + bodyWidth * 0.3, wingY + radius * 0.1);
    ctx.fill();
    
    // Wing bones (right)
    ctx.strokeStyle = this.darkenColor(primary, 0.3);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + bodyWidth * 0.4, wingY);
    ctx.lineTo(x + bodyWidth * 1.5, wingY - radius * 0.6);
    ctx.moveTo(x + bodyWidth * 0.4, wingY);
    ctx.lineTo(x + bodyWidth * 1.8, wingY);
    ctx.moveTo(x + bodyWidth * 0.4, wingY);
    ctx.lineTo(x + bodyWidth * 1.4, wingY + radius * 0.4);
    ctx.stroke();
    
    // === TAIL (powerful, tapering) ===
    ctx.fillStyle = this.darkenColor(primary, 0.2);
    ctx.beginPath();
    ctx.moveTo(x - bodyWidth * 0.3, y + bodyHeight * 0.3);
    ctx.quadraticCurveTo(x - bodyWidth * 1.2, y + bodyHeight * 0.6, x - bodyWidth * 1.8, y + bodyHeight * 0.9);
    ctx.lineTo(x - bodyWidth * 1.6, y + bodyHeight * 0.85);
    ctx.quadraticCurveTo(x - bodyWidth * 1.0, y + bodyHeight * 0.5, x - bodyWidth * 0.2, y + bodyHeight * 0.25);
    ctx.fill();
    
    // Tail spikes
    for (let i = 0; i < 4; i++) {
      const tx = x - bodyWidth * (0.5 + i * 0.35);
      const ty = y + bodyHeight * (0.4 + i * 0.15);
      ctx.fillStyle = this.darkenColor(primary, 0.3);
      ctx.beginPath();
      ctx.moveTo(tx - radius * 0.08, ty);
      ctx.lineTo(tx, ty - radius * 0.2);
      ctx.lineTo(tx + radius * 0.08, ty);
      ctx.fill();
    }
    
    // === BACK LEGS (behind body) ===
    
    // Back left leg
    const blHipX = x - bodyWidth * 0.2;
    const blHipY = y + bodyHeight * 0.4;
    const blFootX = blHipX - radius * 0.3;
    const blFootY = y + bodyHeight * 1.5;
    this.drawSmoothLimb(ctx, blHipX, blHipY, blFootX, blFootY, radius * 0.5, radius * 0.35, this.darkenColor(primary, 0.25));
    
    // Dragon claw (back left)
    ctx.fillStyle = '#000000';
    for (let c = 0; c < 3; c++) {
      const clawX = blFootX + (c - 1) * radius * 0.15;
      ctx.beginPath();
      ctx.moveTo(clawX, blFootY);
      ctx.lineTo(clawX - radius * 0.05, blFootY + radius * 0.25);
      ctx.lineTo(clawX + radius * 0.05, blFootY + radius * 0.25);
      ctx.fill();
    }
    
    // Back right leg
    const brHipX = x + bodyWidth * 0.1;
    const brHipY = y + bodyHeight * 0.4;
    const brFootX = brHipX + radius * 0.2;
    const brFootY = y + bodyHeight * 1.5;
    this.drawSmoothLimb(ctx, brHipX, brHipY, brFootX, brFootY, radius * 0.5, radius * 0.35, this.darkenColor(primary, 0.2));
    
    // Dragon claw (back right)
    ctx.fillStyle = '#000000';
    for (let c = 0; c < 3; c++) {
      const clawX = brFootX + (c - 1) * radius * 0.15;
      ctx.beginPath();
      ctx.moveTo(clawX, brFootY);
      ctx.lineTo(clawX - radius * 0.05, brFootY + radius * 0.25);
      ctx.lineTo(clawX + radius * 0.05, brFootY + radius * 0.25);
      ctx.fill();
    }
    
    // === MAIN BODY ===
    
    // Main body (muscular, oval)
    ctx.fillStyle = primary;
    this.fillEllipse(ctx, x, y, bodyWidth, bodyHeight);
    
    // Scale pattern on body
    this.drawScalePattern(ctx, x, y, bodyWidth * 1.8, bodyHeight * 1.6, primary, radius * 0.12);
    
    // Chest/underbelly (lighter, smoother)
    ctx.fillStyle = secondary;
    this.fillEllipse(ctx, x, y + radius * 0.3, bodyWidth * 0.7, bodyHeight * 0.6);
    
    // === FRONT LEGS (in front of body) ===
    
    // Front left leg
    const flShoulderX = x - bodyWidth * 0.3;
    const flShoulderY = y - bodyHeight * 0.1;
    const flFootX = flShoulderX - radius * 0.4;
    const flFootY = y + bodyHeight * 1.3;
    this.drawSmoothLimb(ctx, flShoulderX, flShoulderY, flFootX, flFootY, radius * 0.55, radius * 0.4, this.darkenColor(primary, 0.15));
    
    // Dragon claw (front left)
    ctx.fillStyle = '#000000';
    for (let c = 0; c < 3; c++) {
      const clawX = flFootX + (c - 1) * radius * 0.15;
      ctx.beginPath();
      ctx.moveTo(clawX, flFootY);
      ctx.lineTo(clawX - radius * 0.05, flFootY + radius * 0.25);
      ctx.lineTo(clawX + radius * 0.05, flFootY + radius * 0.25);
      ctx.fill();
    }
    
    // Front right leg
    const frShoulderX = x + bodyWidth * 0.3;
    const frShoulderY = y - bodyHeight * 0.1;
    const frFootX = frShoulderX + radius * 0.4;
    const frFootY = y + bodyHeight * 1.3;
    this.drawSmoothLimb(ctx, frShoulderX, frShoulderY, frFootX, frFootY, radius * 0.55, radius * 0.4, primary);
    
    // Dragon claw (front right)
    ctx.fillStyle = '#000000';
    for (let c = 0; c < 3; c++) {
      const clawX = frFootX + (c - 1) * radius * 0.15;
      ctx.beginPath();
      ctx.moveTo(clawX, frFootY);
      ctx.lineTo(clawX - radius * 0.05, frFootY + radius * 0.25);
      ctx.lineTo(clawX + radius * 0.05, frFootY + radius * 0.25);
      ctx.fill();
    }
    
    // === NECK AND HEAD ===
    
    // Powerful neck
    ctx.fillStyle = primary;
    ctx.beginPath();
    ctx.ellipse(x, y - bodyHeight * 0.5, bodyWidth * 0.5, bodyHeight * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Dragon head (reptilian, elongated)
    const headX = x;
    const headY = y - bodyHeight * 0.85;
    ctx.fillStyle = this.darkenColor(primary, 0.1);
    this.fillEllipse(ctx, headX, headY, radius * 0.8, radius * 0.6);
    
    // Scale pattern on head
    this.drawScalePattern(ctx, headX, headY, radius * 1.4, radius * 1.0, primary, radius * 0.08);
    
    // Snout
    ctx.fillStyle = this.darkenColor(primary, 0.15);
    ctx.beginPath();
    ctx.ellipse(headX, headY + radius * 0.25, radius * 0.5, radius * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Horns (curved, menacing)
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(headX - radius * 0.6, headY - radius * 0.4);
    ctx.quadraticCurveTo(headX - radius * 0.8, headY - radius * 0.9, headX - radius * 0.7, headY - radius * 1.2);
    ctx.lineTo(headX - radius * 0.65, headY - radius * 1.15);
    ctx.quadraticCurveTo(headX - radius * 0.75, headY - radius * 0.85, headX - radius * 0.55, headY - radius * 0.38);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(headX + radius * 0.6, headY - radius * 0.4);
    ctx.quadraticCurveTo(headX + radius * 0.8, headY - radius * 0.9, headX + radius * 0.7, headY - radius * 1.2);
    ctx.lineTo(headX + radius * 0.65, headY - radius * 1.15);
    ctx.quadraticCurveTo(headX + radius * 0.75, headY - radius * 0.85, headX + radius * 0.55, headY - radius * 0.38);
    ctx.fill();
    
    // Eyes (glowing, menacing)
    ctx.fillStyle = '#FF6600';
    ctx.shadowColor = '#FF0000';
    ctx.shadowBlur = 8;
    this.fillCircle(ctx, headX - radius * 0.25, headY - radius * 0.15, radius * 0.2);
    this.fillCircle(ctx, headX + radius * 0.25, headY - radius * 0.15, radius * 0.2);
    
    // Pupils (slits)
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#000000';
    ctx.fillRect(headX - radius * 0.25 - 2, headY - radius * 0.25, 4, radius * 0.2);
    ctx.fillRect(headX + radius * 0.25 - 2, headY - radius * 0.25, 4, radius * 0.2);
  }

  /**
   * Draw basic wolf shape - AAA QUALITY VERSION
   */
  async drawWolfBasic(ctx, x, y, radius, primary, secondary) {
    const bodyLength = radius * 2.2;
    const bodyHeight = radius * 0.9;
    
    // === BACK LEGS (draw first, behind body) ===
    
    // Back left leg (hip to paw)
    const blHipX = x - bodyLength * 0.25;
    const blHipY = y + bodyHeight * 0.3;
    const blPawX = blHipX - radius * 0.1;
    const blPawY = y + bodyHeight * 1.8;
    this.drawSmoothLimb(ctx, blHipX, blHipY, blPawX, blPawY, radius * 0.35, radius * 0.25, this.darkenColor(primary, 0.2));
    
    // Back right leg
    const brHipX = x - bodyLength * 0.05;
    const brHipY = y + bodyHeight * 0.3;
    const brPawX = brHipX + radius * 0.05;
    const brPawY = y + bodyHeight * 1.8;
    this.drawSmoothLimb(ctx, brHipX, brHipY, brPawX, brPawY, radius * 0.35, radius * 0.25, this.darkenColor(primary, 0.15));
    
    // === MAIN BODY ===
    
    // Tail (fluffy, curves up)
    ctx.fillStyle = primary;
    ctx.beginPath();
    ctx.moveTo(x - bodyLength * 0.5, y);
    ctx.bezierCurveTo(
      x - bodyLength * 0.8, y - radius * 0.3,
      x - bodyLength * 0.95, y - radius * 0.6,
      x - bodyLength * 1.0, y - radius * 0.9
    );
    ctx.lineTo(x - bodyLength * 0.9, y - radius * 0.85);
    ctx.bezierCurveTo(
      x - bodyLength * 0.75, y - radius * 0.5,
      x - bodyLength * 0.6, y - radius * 0.2,
      x - bodyLength * 0.45, y + radius * 0.05
    );
    ctx.fill();
    
    // Tail fur detail
    this.drawFurTexture(ctx, x - bodyLength * 0.75, y - radius * 0.5, radius * 0.8, radius * 1.0, primary, 0.4);
    
    // Main body (elongated oval)
    ctx.fillStyle = primary;
    this.fillEllipse(ctx, x, y, bodyLength * 0.5, bodyHeight);
    
    // Body fur texture
    this.drawFurTexture(ctx, x, y, bodyLength * 0.5, bodyHeight, primary, 0.2);
    
    // Chest (lighter)
    ctx.fillStyle = secondary;
    this.fillEllipse(ctx, x + bodyLength * 0.15, y + bodyHeight * 0.3, bodyLength * 0.3, bodyHeight * 0.7);
    
    // === FRONT LEGS (in front of body) ===
    
    // Front left leg
    const flShoulderX = x + bodyLength * 0.25;
    const flShoulderY = y + bodyHeight * 0.2;
    const flPawX = flShoulderX - radius * 0.05;
    const flPawY = y + bodyHeight * 1.7;
    this.drawSmoothLimb(ctx, flShoulderX, flShoulderY, flPawX, flPawY, radius * 0.32, radius * 0.23, this.darkenColor(primary, 0.1));
    
    // Front right leg
    const frShoulderX = x + bodyLength * 0.4;
    const frShoulderY = y + bodyHeight * 0.2;
    const frPawX = frShoulderX + radius * 0.05;
    const frPawY = y + bodyHeight * 1.7;
    this.drawSmoothLimb(ctx, frShoulderX, frShoulderY, frPawX, frPawY, radius * 0.32, radius * 0.23, primary);
    
    // === NECK AND HEAD ===
    
    // Neck (connects body to head smoothly)
    ctx.fillStyle = primary;
    ctx.beginPath();
    ctx.ellipse(x + bodyLength * 0.4, y - bodyHeight * 0.3, radius * 0.4, bodyHeight * 0.7, Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Head position
    const headX = x + bodyLength * 0.55;
    const headY = y - bodyHeight * 0.8;
    
    // Head (main skull)
    ctx.fillStyle = primary;
    this.fillEllipse(ctx, headX, headY, radius * 0.65, radius * 0.55);
    
    // Snout (extends from head)
    ctx.fillStyle = this.lightenColor(primary, 0.1);
    ctx.beginPath();
    ctx.ellipse(headX + radius * 0.4, headY + radius * 0.15, radius * 0.5, radius * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Nose (black, wet look)
    ctx.fillStyle = '#000000';
    this.fillCircle(ctx, headX + radius * 0.8, headY + radius * 0.1, radius * 0.15);
    ctx.fillStyle = this.transparentize('#FFFFFF', 0.3);
    this.fillCircle(ctx, headX + radius * 0.82, headY + radius * 0.05, radius * 0.06);
    
    // Ears (pointed triangles)
    ctx.fillStyle = primary;
    ctx.beginPath();
    ctx.moveTo(headX - radius * 0.35, headY - radius * 0.4);
    ctx.lineTo(headX - radius * 0.2, headY - radius * 0.85);
    ctx.lineTo(headX - radius * 0.05, headY - radius * 0.45);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(headX + radius * 0.05, headY - radius * 0.45);
    ctx.lineTo(headX + radius * 0.2, headY - radius * 0.85);
    ctx.lineTo(headX + radius * 0.35, headY - radius * 0.4);
    ctx.fill();
    
    // Inner ears (pink/lighter)
    ctx.fillStyle = this.lightenColor(primary, 0.4);
    ctx.beginPath();
    ctx.moveTo(headX - radius * 0.3, headY - radius * 0.45);
    ctx.lineTo(headX - radius * 0.2, headY - radius * 0.7);
    ctx.lineTo(headX - radius * 0.12, headY - radius * 0.47);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(headX + radius * 0.12, headY - radius * 0.47);
    ctx.lineTo(headX + radius * 0.2, headY - radius * 0.7);
    ctx.lineTo(headX + radius * 0.3, headY - radius * 0.45);
    ctx.fill();
    
    // Eyes (glowing yellow)
    ctx.shadowColor = '#FFA500';
    ctx.shadowBlur = 6;
    ctx.fillStyle = '#FFD700';
    this.fillCircle(ctx, headX - radius * 0.12, headY - radius * 0.15, radius * 0.15);
    this.fillCircle(ctx, headX + radius * 0.18, headY - radius * 0.12, radius * 0.15);
    
    // Pupils
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#000000';
    this.fillCircle(ctx, headX - radius * 0.1, headY - radius * 0.15, radius * 0.07);
    this.fillCircle(ctx, headX + radius * 0.2, headY - radius * 0.12, radius * 0.07);
    
    // Eye shine
    ctx.fillStyle = '#FFFFFF';
    this.fillCircle(ctx, headX - radius * 0.08, headY - radius * 0.18, radius * 0.04);
    this.fillCircle(ctx, headX + radius * 0.22, headY - radius * 0.15, radius * 0.04);
  }

  /**
   * Draw basic goblin shape
   */
  async drawGoblinBasic(ctx, x, y, radius, primary, secondary) {
    // Small body (goblin proportions: big head, small body)
    const bodyWidth = radius * 0.9;
    const bodyHeight = radius * 1.2;
    
    // Legs (short, stumpy)
    ctx.fillStyle = this.darkenColor(primary, 0.2);
    // Left leg
    ctx.fillRect(x - bodyWidth * 0.3, y + bodyHeight * 0.5, radius * 0.3, bodyHeight * 0.8);
    this.fillCircle(ctx, x - bodyWidth * 0.15, y + bodyHeight * 1.3, radius * 0.25);
    
    // Right leg
    ctx.fillRect(x + bodyWidth * 0.05, y + bodyHeight * 0.5, radius * 0.3, bodyHeight * 0.8);
    this.fillCircle(ctx, x + bodyWidth * 0.2, y + bodyHeight * 1.3, radius * 0.25);
    
    // Body (round belly)
    ctx.fillStyle = primary;
    this.fillEllipse(ctx, x, y + bodyHeight * 0.1, bodyWidth, bodyHeight);
    
    // Chest/belly (lighter)
    ctx.fillStyle = this.lightenColor(primary, 0.15);
    this.fillEllipse(ctx, x, y + bodyHeight * 0.3, bodyWidth * 0.7, bodyHeight * 0.6);
    
    // Arms (long, gangly)
    ctx.fillStyle = this.darkenColor(primary, 0.15);
    // Left arm
    ctx.beginPath();
    ctx.moveTo(x - bodyWidth * 0.5, y);
    ctx.quadraticCurveTo(x - bodyWidth * 0.9, y + bodyHeight * 0.3, x - bodyWidth * 0.8, y + bodyHeight * 0.7);
    ctx.lineTo(x - bodyWidth * 0.7, y + bodyHeight * 0.65);
    ctx.quadraticCurveTo(x - bodyWidth * 0.8, y + bodyHeight * 0.25, x - bodyWidth * 0.45, y - bodyHeight * 0.05);
    ctx.fill();
    
    // Left hand
    this.fillCircle(ctx, x - bodyWidth * 0.8, y + bodyHeight * 0.7, radius * 0.2);
    
    // Right arm
    ctx.beginPath();
    ctx.moveTo(x + bodyWidth * 0.5, y);
    ctx.quadraticCurveTo(x + bodyWidth * 0.9, y + bodyHeight * 0.3, x + bodyWidth * 0.8, y + bodyHeight * 0.7);
    ctx.lineTo(x + bodyWidth * 0.7, y + bodyHeight * 0.65);
    ctx.quadraticCurveTo(x + bodyWidth * 0.8, y + bodyHeight * 0.25, x + bodyWidth * 0.45, y - bodyHeight * 0.05);
    ctx.fill();
    
    // Right hand
    this.fillCircle(ctx, x + bodyWidth * 0.8, y + bodyHeight * 0.7, radius * 0.2);
    
    // Neck (very short)
    ctx.fillStyle = primary;
    this.fillEllipse(ctx, x, y - bodyHeight * 0.5, bodyWidth * 0.4, bodyHeight * 0.2);
    
    // Head (oversized)
    const headY = y - bodyHeight * 1.1;
    ctx.fillStyle = secondary;
    this.fillEllipse(ctx, x, headY, radius * 1.1, radius * 0.95);
    
    // Ears (LARGE, pointed, iconic goblin feature)
    ctx.fillStyle = this.darkenColor(secondary, 0.1);
    // Left ear
    ctx.beginPath();
    ctx.moveTo(x - radius * 0.9, headY - radius * 0.1);
    ctx.lineTo(x - radius * 1.5, headY - radius * 0.3);
    ctx.lineTo(x - radius * 1.3, headY + radius * 0.2);
    ctx.lineTo(x - radius * 0.85, headY + radius * 0.15);
    ctx.fill();
    
    // Right ear
    ctx.beginPath();
    ctx.moveTo(x + radius * 0.9, headY - radius * 0.1);
    ctx.lineTo(x + radius * 1.5, headY - radius * 0.3);
    ctx.lineTo(x + radius * 1.3, headY + radius * 0.2);
    ctx.lineTo(x + radius * 0.85, headY + radius * 0.15);
    ctx.fill();
    
    // Inner ears
    ctx.fillStyle = this.lightenColor(secondary, 0.2);
    ctx.beginPath();
    ctx.moveTo(x - radius * 0.95, headY);
    ctx.lineTo(x - radius * 1.35, headY - radius * 0.2);
    ctx.lineTo(x - radius * 1.2, headY + radius * 0.15);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(x + radius * 0.95, headY);
    ctx.lineTo(x + radius * 1.35, headY - radius * 0.2);
    ctx.lineTo(x + radius * 1.2, headY + radius * 0.15);
    ctx.fill();
    
    // Eyes (HUGE, cartoonish)
    ctx.fillStyle = '#FFFFE0';
    this.fillCircle(ctx, x - radius * 0.35, headY - radius * 0.1, radius * 0.32);
    this.fillCircle(ctx, x + radius * 0.35, headY - radius * 0.1, radius * 0.32);
    
    // Irises (yellow-green)
    ctx.fillStyle = '#9ACD32';
    this.fillCircle(ctx, x - radius * 0.35, headY - radius * 0.1, radius * 0.22);
    this.fillCircle(ctx, x + radius * 0.35, headY - radius * 0.1, radius * 0.22);
    
    // Pupils (large)
    ctx.fillStyle = '#000000';
    this.fillCircle(ctx, x - radius * 0.35, headY - radius * 0.05, radius * 0.15);
    this.fillCircle(ctx, x + radius * 0.35, headY - radius * 0.05, radius * 0.15);
    
    // Shine in eyes
    ctx.fillStyle = '#FFFFFF';
    this.fillCircle(ctx, x - radius * 0.3, headY - radius * 0.12, radius * 0.08);
    this.fillCircle(ctx, x + radius * 0.4, headY - radius * 0.12, radius * 0.08);
    
    // Nose (large, hooked)
    ctx.fillStyle = this.darkenColor(secondary, 0.2);
    ctx.beginPath();
    ctx.moveTo(x, headY + radius * 0.15);
    ctx.lineTo(x - radius * 0.1, headY + radius * 0.35);
    ctx.lineTo(x + radius * 0.15, headY + radius * 0.38);
    ctx.lineTo(x + radius * 0.1, headY + radius * 0.2);
    ctx.fill();
    
    // Mouth (wide grin with fangs)
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, headY + radius * 0.35, radius * 0.3, 0.1, Math.PI - 0.1);
    ctx.stroke();
    
    // Teeth/fangs
    ctx.fillStyle = '#FFFFFF';
    this.fillTriangle(x - radius * 0.15, headY + radius * 0.45, x - radius * 0.12, headY + radius * 0.55, x - radius * 0.18, headY + radius * 0.5);
    this.fillTriangle(x + radius * 0.15, headY + radius * 0.45, x + radius * 0.12, headY + radius * 0.55, x + radius * 0.18, headY + radius * 0.5);
  }

  /**
   * Draw basic robot shape
   */
  async drawRobotBasic(ctx, x, y, radius, primary, secondary) {
    // Metallic robot with geometric shapes
    const bodyWidth = radius * 1.0;
    const bodyHeight = radius * 1.5;
    
    // Legs (boxy, mechanical)
    ctx.fillStyle = this.darkenColor(primary, 0.2);
    // Left leg
    ctx.fillRect(x - bodyWidth * 0.35, y + bodyHeight * 0.5, bodyWidth * 0.3, bodyHeight * 0.9);
    // Joint
    ctx.fillStyle = '#404040';
    ctx.fillRect(x - bodyWidth * 0.35, y + bodyHeight * 0.95, bodyWidth * 0.3, bodyHeight * 0.08);
    // Foot
    ctx.fillStyle = this.darkenColor(primary, 0.3);
    ctx.fillRect(x - bodyWidth * 0.4, y + bodyHeight * 1.35, bodyWidth * 0.4, bodyHeight * 0.15);
    
    // Right leg
    ctx.fillStyle = this.darkenColor(primary, 0.2);
    ctx.fillRect(x + bodyWidth * 0.05, y + bodyHeight * 0.5, bodyWidth * 0.3, bodyHeight * 0.9);
    // Joint
    ctx.fillStyle = '#404040';
    ctx.fillRect(x + bodyWidth * 0.05, y + bodyHeight * 0.95, bodyWidth * 0.3, bodyHeight * 0.08);
    // Foot
    ctx.fillStyle = this.darkenColor(primary, 0.3);
    ctx.fillRect(x, y + bodyHeight * 1.35, bodyWidth * 0.4, bodyHeight * 0.15);
    
    // Main body (rectangular, metallic)
    ctx.fillStyle = primary;
    ctx.fillRect(x - bodyWidth * 0.5, y - bodyHeight * 0.1, bodyWidth, bodyHeight * 0.7);
    
    // Chest panel (lighter)
    ctx.fillStyle = secondary;
    ctx.fillRect(x - bodyWidth * 0.35, y, bodyWidth * 0.7, bodyHeight * 0.5);
    
    // Panel lines
    ctx.strokeStyle = this.darkenColor(primary, 0.4);
    ctx.lineWidth = 2;
    ctx.strokeRect(x - bodyWidth * 0.35, y, bodyWidth * 0.7, bodyHeight * 0.5);
    ctx.beginPath();
    ctx.moveTo(x - bodyWidth * 0.35, y + bodyHeight * 0.25);
    ctx.lineTo(x + bodyWidth * 0.35, y + bodyHeight * 0.25);
    ctx.stroke();
    
    // Arms (mechanical, jointed)
    ctx.fillStyle = this.darkenColor(primary, 0.15);
    // Left arm
    ctx.fillRect(x - bodyWidth * 0.75, y + bodyHeight * 0.05, bodyWidth * 0.2, bodyHeight * 0.5);
    // Shoulder joint
    ctx.fillStyle = '#606060';
    this.fillCircle(ctx, x - bodyWidth * 0.5, y + bodyHeight * 0.1, radius * 0.15);
    // Elbow
    ctx.fillStyle = '#505050';
    this.fillCircle(ctx, x - bodyWidth * 0.65, y + bodyHeight * 0.3, radius * 0.12);
    // Hand
    ctx.fillStyle = this.darkenColor(primary, 0.25);
    ctx.fillRect(x - bodyWidth * 0.85, y + bodyHeight * 0.5, bodyWidth * 0.25, bodyHeight * 0.2);
    
    // Right arm
    ctx.fillStyle = this.darkenColor(primary, 0.15);
    ctx.fillRect(x + bodyWidth * 0.55, y + bodyHeight * 0.05, bodyWidth * 0.2, bodyHeight * 0.5);
    // Shoulder joint
    ctx.fillStyle = '#606060';
    this.fillCircle(ctx, x + bodyWidth * 0.5, y + bodyHeight * 0.1, radius * 0.15);
    // Elbow
    ctx.fillStyle = '#505050';
    this.fillCircle(ctx, x + bodyWidth * 0.65, y + bodyHeight * 0.3, radius * 0.12);
    // Hand
    ctx.fillStyle = this.darkenColor(primary, 0.25);
    ctx.fillRect(x + bodyWidth * 0.6, y + bodyHeight * 0.5, bodyWidth * 0.25, bodyHeight * 0.2);
    
    // Head (boxy, robotic)
    const headY = y - bodyHeight * 0.65;
    ctx.fillStyle = primary;
    ctx.fillRect(x - bodyWidth * 0.4, headY - radius * 0.5, bodyWidth * 0.8, radius);
    
    // Head detail panel
    ctx.fillStyle = this.darkenColor(primary, 0.3);
    ctx.fillRect(x - bodyWidth * 0.35, headY - radius * 0.45, bodyWidth * 0.7, radius * 0.3);
    
    // Eyes (glowing LED)
    ctx.fillStyle = '#00FFFF';
    ctx.shadowColor = '#00FFFF';
    ctx.shadowBlur = 10;
    ctx.fillRect(x - bodyWidth * 0.25, headY - radius * 0.15, bodyWidth * 0.15, radius * 0.12);
    ctx.fillRect(x + bodyWidth * 0.1, headY - radius * 0.15, bodyWidth * 0.15, radius * 0.12);
    ctx.shadowBlur = 0;
    
    // Antenna
    ctx.strokeStyle = this.darkenColor(primary, 0.3);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, headY - radius * 0.5);
    ctx.lineTo(x, headY - radius * 0.85);
    ctx.stroke();
    
    // Antenna tip (blinking light)
    ctx.fillStyle = '#FF0000';
    ctx.shadowColor = '#FF0000';
    ctx.shadowBlur = 8;
    this.fillCircle(ctx, x, headY - radius * 0.85, radius * 0.1);
    ctx.shadowBlur = 0;
    
    // Neck/connection
    ctx.fillStyle = '#505050';
    ctx.fillRect(x - bodyWidth * 0.15, y - bodyHeight * 0.2, bodyWidth * 0.3, bodyHeight * 0.15);
    
    // Panel screws/rivets
    ctx.fillStyle = '#303030';
    const screws = [
      [x - bodyWidth * 0.42, y + bodyHeight * 0.08],
      [x + bodyWidth * 0.42, y + bodyHeight * 0.08],
      [x - bodyWidth * 0.42, y + bodyHeight * 0.48],
      [x + bodyWidth * 0.42, y + bodyHeight * 0.48]
    ];
    screws.forEach(([sx, sy]) => this.fillCircle(ctx, sx, sy, radius * 0.05));
  }

  /**
   * Draw basic human shape
   */
  async drawHumanBasic(ctx, x, y, radius, primary, secondary) {
    // Proportional humanoid
    const bodyWidth = radius * 1.0;
    const bodyHeight = radius * 1.6;
    
    // Legs
    ctx.fillStyle = this.darkenColor(primary, 0.25);
    // Left leg
    ctx.fillRect(x - bodyWidth * 0.3, y + bodyHeight * 0.5, bodyWidth * 0.25, bodyHeight * 0.95);
    ctx.fillRect(x - bodyWidth * 0.32, y + bodyHeight * 1.4, bodyWidth * 0.3, bodyHeight * 0.12);
    
    // Right leg
    ctx.fillRect(x + bodyWidth * 0.05, y + bodyHeight * 0.5, bodyWidth * 0.25, bodyHeight * 0.95);
    ctx.fillRect(x + bodyWidth * 0.02, y + bodyHeight * 1.4, bodyWidth * 0.3, bodyHeight * 0.12);
    
    // Torso
    ctx.fillStyle = secondary;
    ctx.fillRect(x - bodyWidth * 0.45, y - bodyHeight * 0.05, bodyWidth * 0.9, bodyHeight * 0.6);
    
    // Chest/shirt detail
    ctx.fillStyle = this.darkenColor(secondary, 0.1);
    ctx.beginPath();
    ctx.moveTo(x - bodyWidth * 0.45, y - bodyHeight * 0.05);
    ctx.lineTo(x, y + bodyHeight * 0.15);
    ctx.lineTo(x + bodyWidth * 0.45, y - bodyHeight * 0.05);
    ctx.fill();
    
    // Arms
    ctx.fillStyle = primary;
    // Left arm
    ctx.fillRect(x - bodyWidth * 0.75, y, bodyWidth * 0.2, bodyHeight * 0.65);
    ctx.fillRect(x - bodyWidth * 0.82, y + bodyHeight * 0.6, bodyWidth * 0.22, bodyHeight * 0.18);
    
    // Right arm
    ctx.fillRect(x + bodyWidth * 0.55, y, bodyWidth * 0.2, bodyHeight * 0.65);
    ctx.fillRect(x + bodyWidth * 0.6, y + bodyHeight * 0.6, bodyWidth * 0.22, bodyHeight * 0.18);
    
    // Neck
    ctx.fillStyle = primary;
    ctx.fillRect(x - bodyWidth * 0.15, y - bodyHeight * 0.25, bodyWidth * 0.3, bodyHeight * 0.22);
    
    // Head
    const headY = y - bodyHeight * 0.7;
    ctx.fillStyle = primary;
    this.fillCircle(ctx, x, headY, radius * 0.55);
    
    // Hair
    ctx.fillStyle = this.darkenColor(primary, 0.4);
    ctx.beginPath();
    ctx.arc(x, headY - radius * 0.15, radius * 0.58, Math.PI, 0);
    ctx.fill();
    
    // Hair strands
    for (let i = 0; i < 5; i++) {
      const hx = x - radius * 0.4 + i * radius * 0.2;
      ctx.fillRect(hx, headY - radius * 0.68, radius * 0.08, radius * 0.25);
    }
    
    // Ears
    ctx.fillStyle = this.lightenColor(primary, 0.05);
    this.fillCircle(ctx, x - radius * 0.52, headY, radius * 0.12);
    this.fillCircle(ctx, x + radius * 0.52, headY, radius * 0.12);
    
    // Eyes
    ctx.fillStyle = '#FFFFFF';
    this.fillCircle(ctx, x - radius * 0.2, headY - radius * 0.05, radius * 0.15);
    this.fillCircle(ctx, x + radius * 0.2, headY - radius * 0.05, radius * 0.15);
    
    // Irises
    ctx.fillStyle = '#4169E1';
    this.fillCircle(ctx, x - radius * 0.2, headY - radius * 0.05, radius * 0.1);
    this.fillCircle(ctx, x + radius * 0.2, headY - radius * 0.05, radius * 0.1);
    
    // Pupils
    ctx.fillStyle = '#000000';
    this.fillCircle(ctx, x - radius * 0.2, headY - radius * 0.05, radius * 0.06);
    this.fillCircle(ctx, x + radius * 0.2, headY - radius * 0.05, radius * 0.06);
    
    // Eyebrows
    ctx.strokeStyle = this.darkenColor(primary, 0.4);
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - radius * 0.35, headY - radius * 0.25);
    ctx.lineTo(x - radius * 0.05, headY - radius * 0.28);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x + radius * 0.05, headY - radius * 0.28);
    ctx.lineTo(x + radius * 0.35, headY - radius * 0.25);
    ctx.stroke();
    
    // Nose
    ctx.fillStyle = this.darkenColor(primary, 0.15);
    ctx.beginPath();
    ctx.moveTo(x, headY + radius * 0.05);
    ctx.lineTo(x - radius * 0.05, headY + radius * 0.18);
    ctx.lineTo(x + radius * 0.08, headY + radius * 0.18);
    ctx.fill();
    
    // Mouth
    ctx.strokeStyle = this.darkenColor(primary, 0.3);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, headY + radius * 0.25, radius * 0.2, 0.2, Math.PI - 0.2);
    ctx.stroke();
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
   * Darken color by percentage
   */
  darkenColor(hex, percent) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    const newR = Math.max(0, Math.round(r * (1 - percent)));
    const newG = Math.max(0, Math.round(g * (1 - percent)));
    const newB = Math.max(0, Math.round(b * (1 - percent)));
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }

  /**
   * Make color transparent
   */
  transparentize(hex, alpha) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
   * Generate color palette from DNA
   */
  generatePaletteFromDNA(dna) {
    const baseHue = dna.baseHue !== undefined ? dna.baseHue : 0;
    const primary = this.hslToHex(baseHue, 70, 50);
    const secondary = this.hslToHex((baseHue + 30) % 360, 70, 60);
    const accent = this.hslToHex((baseHue + 180) % 360, 80, 55);
    const shadow = this.hslToHex(baseHue, 30, 20);
    const highlight = this.hslToHex(baseHue, 50, 80);
    
    return { primary, secondary, accent, shadow, highlight };
  }

  /**
   * HSL to Hex conversion
   */
  hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    
    let r = 0, g = 0, b = 0;
    
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    
    const toHex = (n) => {
      const hex = Math.round((n + m) * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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
