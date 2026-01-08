const AdvancedRenderer = require('./advanced-renderer');

/**
 * Universal Procedural Generator
 * Generate ANY 2D game asset with AAA quality through pure procedural generation
 * No hardcoding - everything is parameterized and generated on the spot
 */
class UniversalProceduralGenerator extends AdvancedRenderer {
  constructor() {
    super();
    
    // Fundamental shape primitives that can combine to create anything
    this.shapePrimitives = ['circle', 'ellipse', 'rectangle', 'triangle', 'polygon', 'bezier', 'organic'];
    
    // Material/texture types
    this.materials = ['metal', 'wood', 'stone', 'flesh', 'fur', 'scales', 'feathers', 'crystal', 'fabric', 'liquid', 'energy'];
    
    // Anatomical archetypes (parameterized, not hardcoded)
    this.bodyArchetypes = {
      biped: { legs: 2, arms: 2, torso: 1, head: 1, symmetry: 'bilateral' },
      quadruped: { legs: 4, arms: 0, torso: 1, head: 1, symmetry: 'bilateral' },
      flying: { legs: 2, wings: 2, torso: 1, head: 1, symmetry: 'bilateral' },
      serpentine: { segments: 12, head: 1, symmetry: 'radial' },
      spider: { legs: 8, torso: 2, head: 1, symmetry: 'radial' },
      floating: { appendages: 0, body: 1, aura: true, symmetry: 'radial' }
    };
  }

  /**
   * Generate any creature/character procedurally from parameters
   * @param {Object} params - Generation parameters
   * @returns {Object} - Rendering instructions
   */
  generateCreature(params) {
    // Determine archetype based on parameters or randomly
    const archetype = params.archetype || this.selectArchetype(params);
    const anatomy = this.bodyArchetypes[archetype];
    
    // Generate proportions procedurally
    const proportions = this.generateProportions(anatomy, params);
    
    // Generate features procedurally
    const features = this.generateFeatures(params);
    
    // Generate material/texture
    const material = params.material || this.selectMaterial(params);
    
    // Generate color palette
    const palette = this.generateColorPalette(params);
    
    return {
      type: 'creature',
      archetype,
      anatomy,
      proportions,
      features,
      material,
      palette,
      renderInstructions: this.createRenderInstructions(anatomy, proportions, features, material, palette)
    };
  }

  /**
   * Generate any item/weapon/tool procedurally
   */
  generateItem(params) {
    const itemType = params.itemType || this.determineItemType(params);
    
    // Base shape
    const baseShape = this.generateItemShape(itemType, params);
    
    // Details and ornaments
    const details = this.generateItemDetails(itemType, params);
    
    // Material
    const material = params.material || this.selectMaterial(params);
    
    // Color palette
    const palette = this.generateColorPalette(params);
    
    return {
      type: 'item',
      itemType,
      baseShape,
      details,
      material,
      palette,
      renderInstructions: this.createItemRenderInstructions(baseShape, details, material, palette)
    };
  }

  /**
   * Generate any environmental asset procedurally
   */
  generateEnvironmentAsset(params) {
    const assetType = params.assetType || this.determineAssetType(params);
    
    // Organic vs geometric
    const isOrganic = params.organic !== undefined ? params.organic : Math.random() > 0.5;
    
    // Base structure
    const structure = this.generateStructure(assetType, isOrganic, params);
    
    // Surface details
    const surfaceDetails = this.generateSurfaceDetails(assetType, params);
    
    // Material
    const material = params.material || this.selectMaterial(params);
    
    // Color palette
    const palette = this.generateColorPalette(params);
    
    return {
      type: 'environment',
      assetType,
      isOrganic,
      structure,
      surfaceDetails,
      material,
      palette,
      renderInstructions: this.createEnvironmentRenderInstructions(structure, surfaceDetails, material, palette)
    };
  }

  /**
   * Generate proportions procedurally based on anatomy
   */
  generateProportions(anatomy, params) {
    const seed = params.seed || Math.random() * 10000;
    const random = this.seededRandom(seed);
    
    const proportions = {};
    
    // Generate limb proportions
    if (anatomy.legs) {
      proportions.legLength = 0.4 + random() * 0.3;
      proportions.legThickness = 0.15 + random() * 0.15;
    }
    
    if (anatomy.arms) {
      proportions.armLength = 0.35 + random() * 0.25;
      proportions.armThickness = 0.1 + random() * 0.1;
    }
    
    if (anatomy.wings) {
      proportions.wingSpan = 1.5 + random() * 1.0;
      proportions.wingThickness = 0.05 + random() * 0.05;
    }
    
    // Body proportions
    proportions.torsoLength = 0.5 + random() * 0.3;
    proportions.torsoWidth = 0.3 + random() * 0.3;
    proportions.headSize = 0.15 + random() * 0.15;
    
    // Musculature
    proportions.muscleDefinition = params.muscleDefinition || random();
    
    return proportions;
  }

  /**
   * Generate features procedurally (eyes, mouth, horns, etc.)
   */
  generateFeatures(params) {
    const seed = params.seed || Math.random() * 10000;
    const random = this.seededRandom(seed);
    
    const features = {
      eyes: {
        count: params.eyeCount || (random() > 0.8 ? Math.floor(random() * 4) + 3 : 2),
        size: 0.1 + random() * 0.15,
        type: this.selectFromArray(['round', 'slit', 'compound', 'glowing', 'mechanical'], random),
        color: this.generateEyeColor(params, random)
      },
      mouth: {
        type: this.selectFromArray(['fangs', 'beak', 'mandibles', 'none', 'human'], random),
        size: 0.05 + random() * 0.1
      },
      appendages: {
        horns: random() > 0.6 ? Math.floor(random() * 4) + 1 : 0,
        antennae: random() > 0.8 ? Math.floor(random() * 2) + 1 : 0,
        tentacles: random() > 0.9 ? Math.floor(random() * 6) + 3 : 0,
        spikes: random() > 0.5 ? Math.floor(random() * 10) + 3 : 0
      },
      markings: {
        pattern: this.selectFromArray(['stripes', 'spots', 'none', 'geometric', 'organic'], random),
        density: random(),
        contrast: random()
      }
    };
    
    return features;
  }

  /**
   * Generate AAA quality color palette
   */
  generateColorPalette(params) {
    const seed = params.seed || Math.random() * 10000;
    const random = this.seededRandom(seed);
    
    // Base hue
    const baseHue = params.baseHue !== undefined ? params.baseHue : Math.floor(random() * 360);
    
    // Color harmony scheme
    const harmonyScheme = params.harmony || this.selectFromArray([
      'monochromatic', 'complementary', 'triadic', 'analogous', 'split-complementary'
    ], random);
    
    const palette = {
      primary: this.hslToHex(baseHue, 70 + random() * 30, 40 + random() * 30),
      secondary: this.generateSecondaryColor(baseHue, harmonyScheme, random),
      accent: this.generateAccentColor(baseHue, harmonyScheme, random),
      shadow: this.hslToHex(baseHue, 30 + random() * 20, 15 + random() * 15),
      highlight: this.hslToHex(baseHue, 50 + random() * 30, 70 + random() * 20)
    };
    
    return palette;
  }

  /**
   * Select material based on parameters or procedurally
   */
  selectMaterial(params) {
    const seed = params.seed || Math.random() * 10000;
    const random = this.seededRandom(seed);
    
    // Weight materials based on context
    if (params.organic) {
      return this.selectFromArray(['flesh', 'fur', 'scales', 'feathers'], random);
    } else if (params.magical) {
      return this.selectFromArray(['crystal', 'energy', 'metal'], random);
    } else {
      return this.selectFromArray(this.materials, random);
    }
  }

  /**
   * Select archetype based on parameters
   */
  selectArchetype(params) {
    const seed = params.seed || Math.random() * 10000;
    const random = this.seededRandom(seed);
    
    if (params.flying) return 'flying';
    if (params.aquatic) return 'serpentine';
    if (params.spider) return 'spider';
    
    // Default weight
    const weights = [0.3, 0.3, 0.2, 0.1, 0.05, 0.05]; // biped, quadruped, flying, serpentine, spider, floating
    const archetypes = Object.keys(this.bodyArchetypes);
    
    return this.weightedSelect(archetypes, weights, random);
  }

  /**
   * Create render instructions from generated data
   */
  createRenderInstructions(anatomy, proportions, features, material, palette) {
    const instructions = {
      layers: []
    };
    
    // Layer 1: Shadow
    instructions.layers.push({
      type: 'shadow',
      opacity: 0.3,
      blur: 10
    });
    
    // Layer 2: Base body
    instructions.layers.push({
      type: 'body',
      anatomy,
      proportions,
      color: palette.primary,
      material
    });
    
    // Layer 3: Limbs
    if (anatomy.legs) {
      instructions.layers.push({
        type: 'limbs',
        count: anatomy.legs,
        proportions: {
          length: proportions.legLength,
          thickness: proportions.legThickness
        },
        color: palette.primary,
        material
      });
    }
    
    if (anatomy.arms) {
      instructions.layers.push({
        type: 'arms',
        count: anatomy.arms,
        proportions: {
          length: proportions.armLength,
          thickness: proportions.armThickness
        },
        color: palette.primary,
        material
      });
    }
    
    if (anatomy.wings) {
      instructions.layers.push({
        type: 'wings',
        count: anatomy.wings,
        proportions: {
          span: proportions.wingSpan,
          thickness: proportions.wingThickness
        },
        color: palette.secondary,
        material: 'membrane'
      });
    }
    
    // Layer 4: Head and features
    instructions.layers.push({
      type: 'head',
      size: proportions.headSize,
      features,
      color: palette.primary
    });
    
    // Layer 5: Details
    instructions.layers.push({
      type: 'details',
      features,
      palette
    });
    
    // Layer 6: Highlights
    instructions.layers.push({
      type: 'highlights',
      color: palette.highlight,
      intensity: 0.3
    });
    
    return instructions;
  }

  /**
   * Render creature from instructions
   */
  async renderFromInstructions(ctx, instructions, x, y, scale) {
    for (const layer of instructions.layers) {
      await this.renderLayer(ctx, layer, x, y, scale);
    }
  }

  /**
   * Render individual layer
   */
  async renderLayer(ctx, layer, x, y, scale) {
    switch (layer.type) {
      case 'shadow':
        this.renderShadow(ctx, x, y, scale, layer);
        break;
      case 'body':
        this.renderBody(ctx, x, y, scale, layer);
        break;
      case 'limbs':
        this.renderLimbs(ctx, x, y, scale, layer);
        break;
      case 'arms':
        this.renderArms(ctx, x, y, scale, layer);
        break;
      case 'wings':
        this.renderWings(ctx, x, y, scale, layer);
        break;
      case 'head':
        this.renderHead(ctx, x, y, scale, layer);
        break;
      case 'details':
        this.renderDetails(ctx, x, y, scale, layer);
        break;
      case 'highlights':
        this.renderHighlights(ctx, x, y, scale, layer);
        break;
    }
  }

  // ============ RENDERING METHODS ============

  renderShadow(ctx, x, y, scale, layer) {
    ctx.save();
    ctx.globalAlpha = layer.opacity;
    ctx.fillStyle = '#000000';
    ctx.filter = `blur(${layer.blur}px)`;
    ctx.beginPath();
    ctx.ellipse(x, y + scale * 0.8, scale * 0.6, scale * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  renderBody(ctx, x, y, scale, layer) {
    const width = scale * layer.proportions.torsoWidth;
    const height = scale * layer.proportions.torsoLength;
    
    ctx.fillStyle = layer.color;
    ctx.beginPath();
    ctx.ellipse(x, y, width, height, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Apply material texture
    this.applyMaterialTexture(ctx, x, y, width, height, layer.material, layer.color);
  }

  renderLimbs(ctx, x, y, scale, layer) {
    const count = layer.count;
    const length = scale * layer.proportions.length;
    const thickness = scale * layer.proportions.thickness;
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const startX = x + Math.cos(angle) * scale * 0.3;
      const startY = y + Math.sin(angle) * scale * 0.3;
      const endX = x + Math.cos(angle) * length;
      const endY = y + Math.sin(angle) * length;
      
      this.drawOrganicLimb(ctx, startX, startY, endX, endY, thickness, thickness * 0.6, layer.color);
    }
  }

  renderArms(ctx, x, y, scale, layer) {
    // Similar to limbs but positioned for arms
    this.renderLimbs(ctx, x, y - scale * 0.2, scale, layer);
  }

  renderWings(ctx, x, y, scale, layer) {
    const span = scale * layer.proportions.span;
    
    // Left wing
    ctx.fillStyle = this.adjustBrightness(layer.color, 0.6);
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x - span * 0.5, y - span * 0.3, x - span, y);
    ctx.quadraticCurveTo(x - span * 0.5, y + span * 0.2, x, y);
    ctx.fill();
    
    // Right wing
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + span * 0.5, y - span * 0.3, x + span, y);
    ctx.quadraticCurveTo(x + span * 0.5, y + span * 0.2, x, y);
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }

  renderHead(ctx, x, y, scale, layer) {
    const headSize = scale * layer.size;
    const headY = y - scale * 0.6;
    
    // Head shape
    ctx.fillStyle = layer.color;
    ctx.beginPath();
    ctx.ellipse(x, headY, headSize, headSize * 0.9, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes
    const eyeSize = headSize * layer.features.eyes.size;
    const eyeSpacing = headSize * 0.4;
    
    for (let i = 0; i < layer.features.eyes.count; i++) {
      const eyeX = x + (i - (layer.features.eyes.count - 1) / 2) * eyeSpacing;
      this.renderProfessionalEye(ctx, eyeX, headY - headSize * 0.2, eyeSize, layer.features.eyes.color, 'normal');
    }
  }

  renderDetails(ctx, x, y, scale, layer) {
    // Render appendages (horns, spikes, etc.)
    if (layer.features.appendages.horns > 0) {
      for (let i = 0; i < layer.features.appendages.horns; i++) {
        const hornX = x + (i - (layer.features.appendages.horns - 1) / 2) * scale * 0.3;
        const hornY = y - scale * 0.8;
        this.renderHorn(ctx, hornX, hornY, scale * 0.2);
      }
    }
    
    // Render markings
    if (layer.features.markings.pattern !== 'none') {
      this.renderMarkings(ctx, x, y, scale, layer.features.markings, layer.palette);
    }
  }

  renderHighlights(ctx, x, y, scale, layer) {
    ctx.save();
    ctx.globalAlpha = layer.intensity;
    const gradient = ctx.createRadialGradient(x - scale * 0.3, y - scale * 0.3, 0, x, y, scale);
    gradient.addColorStop(0, layer.color);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(x - scale, y - scale, scale * 2, scale * 2);
    ctx.restore();
  }

  renderHorn(ctx, x, y, length) {
    ctx.fillStyle = '#2A2A2A';
    ctx.beginPath();
    ctx.moveTo(x - 5, y);
    ctx.quadraticCurveTo(x - 8, y - length * 0.7, x - 5, y - length);
    ctx.lineTo(x + 5, y - length);
    ctx.quadraticCurveTo(x + 8, y - length * 0.7, x + 5, y);
    ctx.fill();
  }

  renderMarkings(ctx, x, y, scale, markings, palette) {
    ctx.save();
    ctx.globalAlpha = markings.contrast;
    
    switch (markings.pattern) {
      case 'stripes':
        for (let i = 0; i < 5; i++) {
          ctx.fillStyle = palette.accent;
          ctx.fillRect(x - scale * 0.4, y - scale * 0.6 + i * scale * 0.3, scale * 0.8, scale * 0.1);
        }
        break;
      case 'spots':
        for (let i = 0; i < 10; i++) {
          const spotX = x + (Math.random() - 0.5) * scale * 0.8;
          const spotY = y + (Math.random() - 0.5) * scale * 0.8;
          ctx.fillStyle = palette.accent;
          ctx.beginPath();
          ctx.arc(spotX, spotY, scale * 0.05, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
    }
    
    ctx.restore();
  }

  applyMaterialTexture(ctx, x, y, width, height, material, baseColor) {
    switch (material) {
      case 'scales':
        this.applyScaleTexture(ctx, x, y, width, height, baseColor);
        break;
      case 'fur':
        this.applyFurTexture(ctx, x, y, width, height, baseColor);
        break;
      case 'metal':
        this.applyMetalTexture(ctx, x, y, width, height, baseColor);
        break;
      // Add more materials as needed
    }
  }

  applyScaleTexture(ctx, x, y, width, height, color) {
    const scaleSize = 6;
    const rows = Math.floor(height * 2 / scaleSize);
    const cols = Math.floor(width * 2 / scaleSize);
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const offsetX = (row % 2) * scaleSize * 0.5;
        const scaleX = x - width + col * scaleSize + offsetX;
        const scaleY = y - height + row * scaleSize;
        
        const dx = (scaleX - x) / width;
        const dy = (scaleY - y) / height;
        if (dx * dx + dy * dy < 1.0) {
          const normal = { x: dx, y: dy, z: Math.sqrt(Math.max(0, 1 - dx * dx - dy * dy)) };
          this.renderScale(ctx, scaleX, scaleY, scaleSize, color, 0.7, normal);
        }
      }
    }
  }

  applyFurTexture(ctx, x, y, width, height, color) {
    const furCount = Math.floor(width * height * 0.02);
    
    for (let i = 0; i < furCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * Math.sqrt(width * width + height * height);
      const furX = x + Math.cos(angle) * dist;
      const furY = y + Math.sin(angle) * dist;
      
      this.drawFurStrand(ctx, furX, furY, 12, angle + Math.PI / 2, color);
    }
  }

  applyMetalTexture(ctx, x, y, width, height, color) {
    // Add metallic sheen
    const gradient = ctx.createLinearGradient(x - width, y - height, x + width, y + height);
    gradient.addColorStop(0, this.darkenColor(color, 0.3));
    gradient.addColorStop(0.5, this.lightenColor(color, 0.2));
    gradient.addColorStop(1, this.darkenColor(color, 0.3));
    
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(x, y, width, height, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }

  // ============ UTILITY METHODS ============

  seededRandom(seed) {
    let s = seed;
    return function() {
      s = Math.sin(s) * 10000;
      return s - Math.floor(s);
    };
  }

  selectFromArray(array, random) {
    return array[Math.floor(random() * array.length)];
  }

  weightedSelect(array, weights, random) {
    const total = weights.reduce((a, b) => a + b, 0);
    let threshold = random() * total;
    
    for (let i = 0; i < array.length; i++) {
      threshold -= weights[i];
      if (threshold <= 0) return array[i];
    }
    
    return array[array.length - 1];
  }

  generateSecondaryColor(baseHue, scheme, random) {
    switch (scheme) {
      case 'complementary':
        return this.hslToHex((baseHue + 180) % 360, 70, 50);
      case 'triadic':
        return this.hslToHex((baseHue + 120) % 360, 70, 50);
      case 'analogous':
        return this.hslToHex((baseHue + 30) % 360, 70, 50);
      default:
        return this.hslToHex(baseHue, 50, 60);
    }
  }

  generateAccentColor(baseHue, scheme, random) {
    switch (scheme) {
      case 'triadic':
        return this.hslToHex((baseHue + 240) % 360, 80, 55);
      case 'split-complementary':
        return this.hslToHex((baseHue + 150) % 360, 75, 55);
      default:
        return this.hslToHex((baseHue + 60) % 360, 80, 60);
    }
  }

  generateEyeColor(params, random) {
    const hue = params.eyeHue !== undefined ? params.eyeHue : Math.floor(random() * 360);
    return this.hslToHex(hue, 70 + random() * 30, 50 + random() * 20);
  }

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

  // Item generation methods (placeholders for now)
  determineItemType(params) { return 'sword'; }
  generateItemShape(itemType, params) { return {}; }
  generateItemDetails(itemType, params) { return {}; }
  createItemRenderInstructions(baseShape, details, material, palette) { return { layers: [] }; }

  // Environment generation methods (placeholders for now)
  determineAssetType(params) { return 'tree'; }
  generateStructure(assetType, isOrganic, params) { return {}; }
  generateSurfaceDetails(assetType, params) { return {}; }
  createEnvironmentRenderInstructions(structure, surfaceDetails, material, palette) { return { layers: [] }; }
}

module.exports = UniversalProceduralGenerator;
