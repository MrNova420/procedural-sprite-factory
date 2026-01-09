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
      // Item rendering
      case 'item_shadow':
      case 'item_base':
      case 'item_texture':
      case 'item_details':
      case 'item_ornaments':
      case 'item_enchantment':
      case 'item_highlights':
        this.renderItemLayer(ctx, x, y, scale, layer);
        break;
      // Environment rendering
      case 'environment_shadow':
      case 'environment_base':
      case 'environment_texture':
      case 'environment_details':
      case 'environment_decorations':
      case 'environment_atmosphere':
        this.renderEnvironmentLayer(ctx, x, y, scale, layer);
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

  // ============ ITEM GENERATION SYSTEM ============

  /**
   * Determine item type from parameters or procedurally
   */
  determineItemType(params) {
    if (params.itemType) return params.itemType;
    
    const seed = params.seed || Math.random() * 10000;
    const random = this.seededRandom(seed);
    
    const itemCategories = {
      weapon: ['sword', 'axe', 'spear', 'dagger', 'bow', 'staff', 'hammer', 'mace', 'whip', 'scythe'],
      armor: ['helmet', 'chestplate', 'shield', 'gauntlets', 'boots', 'pauldrons'],
      tool: ['pickaxe', 'shovel', 'hoe', 'fishing_rod', 'wrench', 'saw'],
      potion: ['health_potion', 'mana_potion', 'elixir', 'flask', 'vial'],
      gem: ['diamond', 'ruby', 'emerald', 'sapphire', 'amethyst', 'crystal'],
      scroll: ['spell_scroll', 'map', 'document', 'recipe'],
      key: ['key', 'keycard', 'token', 'coin']
    };
    
    const category = params.itemCategory || this.selectFromArray(Object.keys(itemCategories), random);
    return this.selectFromArray(itemCategories[category], random);
  }
  
  /**
   * Generate item shape based on type
   */
  generateItemShape(itemType, params) {
    const seed = params.seed || Math.random() * 10000;
    const random = this.seededRandom(seed);
    
    const shape = {
      type: itemType,
      size: params.size || (0.5 + random() * 1.5),
      angle: params.angle || (random() * Math.PI / 4 - Math.PI / 8)
    };
    
    // Weapon shapes
    if (['sword', 'dagger', 'spear'].includes(itemType)) {
      shape.blade = {
        length: 0.6 + random() * 0.4,
        width: 0.1 + random() * 0.1,
        curve: random() * 0.3,
        edge: random() > 0.5 ? 'double' : 'single'
      };
      shape.handle = {
        length: 0.2 + random() * 0.2,
        width: 0.05 + random() * 0.03,
        grip: this.selectFromArray(['leather', 'wood', 'metal', 'wrapped'], random)
      };
      shape.guard = {
        style: this.selectFromArray(['cross', 'curved', 'disc', 'none'], random),
        size: 0.1 + random() * 0.1
      };
    }
    
    // Axe/Hammer shapes
    if (['axe', 'hammer', 'mace'].includes(itemType)) {
      shape.head = {
        size: 0.3 + random() * 0.3,
        weight: 0.5 + random() * 0.5,
        spikes: itemType === 'mace' ? Math.floor(random() * 8) + 4 : 0
      };
      shape.handle = {
        length: 0.5 + random() * 0.5,
        thickness: 0.05 + random() * 0.03
      };
    }
    
    // Potion shapes
    if (itemType.includes('potion') || itemType.includes('flask') || itemType.includes('vial')) {
      shape.bottle = {
        shape: this.selectFromArray(['round', 'conical', 'square', 'heart'], random),
        size: 0.3 + random() * 0.3,
        liquid_level: 0.6 + random() * 0.3
      };
      shape.cork = {
        style: this.selectFromArray(['cork', 'crystal', 'metal', 'wax'], random)
      };
    }
    
    // Gem shapes
    if (['diamond', 'ruby', 'emerald', 'sapphire', 'amethyst', 'crystal'].includes(itemType)) {
      shape.facets = Math.floor(6 + random() * 8);
      shape.cut = this.selectFromArray(['brilliant', 'emerald', 'oval', 'marquise', 'pear', 'raw'], random);
      shape.size = 0.3 + random() * 0.4;
      shape.glow = random() > 0.3;
    }
    
    // Shield shapes
    if (itemType === 'shield') {
      shape.shieldType = this.selectFromArray(['round', 'kite', 'heater', 'tower', 'buckler'], random);
      shape.size = 0.5 + random() * 0.5;
      shape.boss = random() > 0.5;
      shape.emblem = random() > 0.4;
    }
    
    return shape;
  }
  
  /**
   * Generate item details (ornaments, engravings, etc.)
   */
  generateItemDetails(itemType, params) {
    const seed = params.seed || Math.random() * 10000;
    const random = this.seededRandom(seed);
    
    const details = {
      quality: params.quality || this.selectFromArray(['common', 'uncommon', 'rare', 'epic', 'legendary'], random),
      enchantment: random() > 0.7,
      engraving: random() > 0.6,
      ornaments: random() > 0.5,
      wear: params.wear !== undefined ? params.wear : random() * 0.5,
      glow: random() > 0.8
    };
    
    // Quality affects visual details
    const qualityLevels = {
      common: { ornamentCount: 0, glowIntensity: 0 },
      uncommon: { ornamentCount: 1, glowIntensity: 0.2 },
      rare: { ornamentCount: 2, glowIntensity: 0.4 },
      epic: { ornamentCount: 3, glowIntensity: 0.6 },
      legendary: { ornamentCount: 5, glowIntensity: 0.9 }
    };
    
    Object.assign(details, qualityLevels[details.quality]);
    
    // Engravings
    if (details.engraving) {
      details.engravingPattern = this.selectFromArray([
        'runes', 'tribal', 'floral', 'geometric', 'dragon', 'skull'
      ], random);
    }
    
    // Ornaments (gems, decorations)
    if (details.ornaments && details.ornamentCount > 0) {
      details.ornamentList = [];
      for (let i = 0; i < details.ornamentCount; i++) {
        details.ornamentList.push({
          type: this.selectFromArray(['gem', 'jewel', 'spike', 'ribbon'], random),
          position: random(),
          color: this.hslToHex(Math.floor(random() * 360), 80, 50)
        });
      }
    }
    
    return details;
  }
  
  /**
   * Create render instructions for items
   */
  createItemRenderInstructions(baseShape, details, material, palette) {
    const instructions = {
      layers: []
    };
    
    // Layer 1: Shadow
    instructions.layers.push({
      type: 'item_shadow',
      opacity: 0.3,
      blur: 5
    });
    
    // Layer 2: Base item shape
    instructions.layers.push({
      type: 'item_base',
      shape: baseShape,
      material,
      color: palette.primary
    });
    
    // Layer 3: Material texture
    instructions.layers.push({
      type: 'item_texture',
      material,
      shape: baseShape,
      color: palette.primary
    });
    
    // Layer 4: Details (engravings, wear)
    if (details.engraving || details.wear > 0) {
      instructions.layers.push({
        type: 'item_details',
        details,
        color: palette.shadow
      });
    }
    
    // Layer 5: Ornaments
    if (details.ornaments && details.ornamentList) {
      instructions.layers.push({
        type: 'item_ornaments',
        ornaments: details.ornamentList,
        glowIntensity: details.glowIntensity
      });
    }
    
    // Layer 6: Enchantment glow
    if (details.enchantment || details.glow) {
      instructions.layers.push({
        type: 'item_enchantment',
        intensity: details.glowIntensity,
        color: palette.accent
      });
    }
    
    // Layer 7: Highlights
    instructions.layers.push({
      type: 'item_highlights',
      color: palette.highlight,
      intensity: 0.4
    });
    
    return instructions;
  }

  // ============ ENVIRONMENT ASSET GENERATION ============

  /**
   * Determine environment asset type
   */
  determineAssetType(params) {
    if (params.assetType) return params.assetType;
    
    const seed = params.seed || Math.random() * 10000;
    const random = this.seededRandom(seed);
    
    const assetCategories = {
      nature: ['tree', 'bush', 'flower', 'grass', 'mushroom', 'vine', 'cactus', 'crystal_formation'],
      terrain: ['rock', 'boulder', 'cliff', 'hill', 'mountain', 'crater', 'canyon'],
      water: ['waterfall', 'fountain', 'pond', 'river', 'geyser'],
      structure: ['building', 'tower', 'wall', 'gate', 'bridge', 'ruins', 'statue', 'pillar'],
      decoration: ['banner', 'torch', 'lantern', 'sign', 'fence', 'barrel', 'crate', 'chest']
    };
    
    const category = params.assetCategory || this.selectFromArray(Object.keys(assetCategories), random);
    return this.selectFromArray(assetCategories[category], random);
  }
  
  /**
   * Generate structure for environment asset
   */
  generateStructure(assetType, isOrganic, params) {
    const seed = params.seed || Math.random() * 10000;
    const random = this.seededRandom(seed);
    
    const structure = {
      type: assetType,
      isOrganic,
      size: params.size || (0.5 + random() * 1.5)
    };
    
    // Tree structures
    if (assetType === 'tree') {
      structure.trunk = {
        height: 0.6 + random() * 0.8,
        width: 0.1 + random() * 0.1,
        branches: Math.floor(3 + random() * 8),
        curve: random() * 0.3
      };
      structure.canopy = {
        shape: this.selectFromArray(['round', 'conical', 'spreading', 'weeping'], random),
        density: 0.5 + random() * 0.5,
        size: 0.5 + random() * 0.8
      };
      structure.leaves = {
        type: this.selectFromArray(['broad', 'needle', 'palm', 'feather'], random),
        count: Math.floor(50 + random() * 200)
      };
    }
    
    // Rock/Boulder structures
    if (['rock', 'boulder', 'cliff'].includes(assetType)) {
      structure.segments = Math.floor(3 + random() * 6);
      structure.roughness = 0.3 + random() * 0.7;
      structure.cracks = Math.floor(random() * 8);
      structure.moss = random() > 0.5;
    }
    
    // Building structures
    if (['building', 'tower', 'structure'].includes(assetType)) {
      structure.floors = Math.floor(1 + random() * 5);
      structure.width = 0.4 + random() * 0.6;
      structure.style = this.selectFromArray(['medieval', 'modern', 'futuristic', 'fantasy', 'ruins'], random);
      structure.windows = Math.floor(random() * 12);
      structure.door = {
        style: this.selectFromArray(['wooden', 'metal', 'stone', 'magical'], random),
        size: 0.2 + random() * 0.2
      };
    }
    
    // Crystal formations
    if (assetType === 'crystal_formation' || assetType.includes('crystal')) {
      structure.crystals = [];
      const crystalCount = Math.floor(3 + random() * 8);
      for (let i = 0; i < crystalCount; i++) {
        structure.crystals.push({
          height: 0.3 + random() * 0.7,
          width: 0.1 + random() * 0.15,
          angle: random() * Math.PI / 3,
          facets: Math.floor(4 + random() * 8),
          glow: random() > 0.3
        });
      }
    }
    
    // Fountain/Water features
    if (['fountain', 'waterfall', 'geyser'].includes(assetType)) {
      structure.base = {
        shape: this.selectFromArray(['round', 'square', 'octagonal', 'ornate'], random),
        size: 0.4 + random() * 0.4
      };
      structure.waterFlow = {
        intensity: 0.5 + random() * 0.5,
        height: 0.3 + random() * 0.7,
        tiers: Math.floor(1 + random() * 3)
      };
    }
    
    return structure;
  }
  
  /**
   * Generate surface details for environment assets
   */
  generateSurfaceDetails(assetType, params) {
    const seed = params.seed || Math.random() * 10000;
    const random = this.seededRandom(seed);
    
    const details = {
      weathering: params.weathering !== undefined ? params.weathering : random() * 0.5,
      moss: random() > 0.6,
      cracks: random() > 0.5,
      vines: random() > 0.7,
      age: params.age || this.selectFromArray(['new', 'weathered', 'ancient', 'pristine'], random)
    };
    
    // Add texture patterns
    details.patterns = [];
    if (random() > 0.5) {
      details.patterns.push({
        type: this.selectFromArray(['lines', 'dots', 'waves', 'geometric'], random),
        density: random(),
        scale: 0.05 + random() * 0.1
      });
    }
    
    // Add decorative elements based on asset type
    if (['building', 'tower', 'structure'].includes(assetType)) {
      details.decorations = {
        banners: random() > 0.7,
        torches: random() > 0.6,
        carvings: random() > 0.5,
        ornaments: Math.floor(random() * 5)
      };
    }
    
    return details;
  }
  
  /**
   * Create environment render instructions
   */
  createEnvironmentRenderInstructions(structure, surfaceDetails, material, palette) {
    const instructions = {
      layers: []
    };
    
    // Layer 1: Shadow
    instructions.layers.push({
      type: 'environment_shadow',
      opacity: 0.4,
      blur: 8
    });
    
    // Layer 2: Base structure
    instructions.layers.push({
      type: 'environment_base',
      structure,
      material,
      color: palette.primary
    });
    
    // Layer 3: Material texture
    instructions.layers.push({
      type: 'environment_texture',
      material,
      structure,
      color: palette.primary
    });
    
    // Layer 4: Surface details (cracks, moss, vines)
    instructions.layers.push({
      type: 'environment_details',
      details: surfaceDetails,
      palette
    });
    
    // Layer 5: Decorations
    if (surfaceDetails.decorations) {
      instructions.layers.push({
        type: 'environment_decorations',
        decorations: surfaceDetails.decorations,
        palette
      });
    }
    
    // Layer 6: Atmospheric effects
    instructions.layers.push({
      type: 'environment_atmosphere',
      weathering: surfaceDetails.weathering,
      age: surfaceDetails.age
    });
    
    return instructions;
  }

  // ============ ITEM RENDERING METHODS ============

  /**
   * Render item layer based on type
   */
  renderItemLayer(ctx, x, y, scale, layer) {
    switch (layer.type) {
      case 'item_shadow':
        this.renderItemShadow(ctx, x, y, scale, layer);
        break;
      case 'item_base':
        this.renderItemBase(ctx, x, y, scale, layer);
        break;
      case 'item_texture':
        this.renderItemTexture(ctx, x, y, scale, layer);
        break;
      case 'item_details':
        this.renderItemDetails(ctx, x, y, scale, layer);
        break;
      case 'item_ornaments':
        this.renderItemOrnaments(ctx, x, y, scale, layer);
        break;
      case 'item_enchantment':
        this.renderItemEnchantment(ctx, x, y, scale, layer);
        break;
      case 'item_highlights':
        this.renderItemHighlights(ctx, x, y, scale, layer);
        break;
    }
  }

  renderItemShadow(ctx, x, y, scale, layer) {
    ctx.save();
    ctx.globalAlpha = layer.opacity;
    ctx.fillStyle = '#000000';
    ctx.filter = `blur(${layer.blur}px)`;
    ctx.beginPath();
    ctx.ellipse(x, y + scale * 0.3, scale * 0.4, scale * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  renderItemBase(ctx, x, y, scale, layer) {
    const shape = layer.shape;
    ctx.fillStyle = layer.color;
    
    // Render based on item type
    if (shape.blade) {
      // Sword/Dagger blade
      const bladeLength = scale * shape.blade.length;
      const bladeWidth = scale * shape.blade.width;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(shape.angle);
      
      // Blade
      ctx.beginPath();
      ctx.moveTo(0, -bladeLength / 2);
      ctx.lineTo(bladeWidth / 2, bladeLength / 2);
      ctx.lineTo(-bladeWidth / 2, bladeLength / 2);
      ctx.closePath();
      ctx.fill();
      
      // Handle
      const handleLength = scale * shape.handle.length;
      const handleWidth = scale * shape.handle.width;
      ctx.fillRect(-handleWidth / 2, bladeLength / 2, handleWidth, handleLength);
      
      // Guard
      if (shape.guard.style !== 'none') {
        const guardSize = scale * shape.guard.size;
        ctx.fillRect(-guardSize, bladeLength / 2 - 3, guardSize * 2, 6);
      }
      
      ctx.restore();
    } else if (shape.bottle) {
      // Potion bottle
      const size = scale * shape.bottle.size;
      ctx.beginPath();
      ctx.ellipse(x, y, size * 0.4, size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Liquid
      ctx.fillStyle = this.adjustBrightness(layer.color, 0.8);
      ctx.globalAlpha = 0.7;
      const liquidLevel = shape.bottle.liquid_level;
      ctx.fillRect(x - size * 0.35, y + size * 0.1, size * 0.7, size * 0.4 * liquidLevel);
      ctx.globalAlpha = 1.0;
      
      // Cork
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(x - size * 0.15, y - size * 0.6, size * 0.3, size * 0.15);
    } else if (shape.facets) {
      // Gem
      const gemSize = scale * shape.size;
      for (let i = 0; i < shape.facets; i++) {
        const angle = (i / shape.facets) * Math.PI * 2;
        const nextAngle = ((i + 1) / shape.facets) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle) * gemSize, y + Math.sin(angle) * gemSize);
        ctx.lineTo(x + Math.cos(nextAngle) * gemSize, y + Math.sin(nextAngle) * gemSize);
        ctx.closePath();
        
        const brightness = 0.6 + (Math.cos(angle) * 0.4);
        ctx.fillStyle = this.adjustBrightness(layer.color, brightness);
        ctx.fill();
      }
    } else if (shape.shieldType) {
      // Shield
      const shieldSize = scale * shape.size;
      ctx.save();
      ctx.translate(x, y);
      
      if (shape.shieldType === 'round') {
        ctx.beginPath();
        ctx.arc(0, 0, shieldSize, 0, Math.PI * 2);
        ctx.fill();
      } else if (shape.shieldType === 'kite') {
        ctx.beginPath();
        ctx.moveTo(0, -shieldSize);
        ctx.quadraticCurveTo(shieldSize * 0.7, -shieldSize * 0.3, shieldSize * 0.7, shieldSize * 0.5);
        ctx.lineTo(0, shieldSize * 1.2);
        ctx.quadraticCurveTo(-shieldSize * 0.7, shieldSize * 0.5, -shieldSize * 0.7, -shieldSize * 0.3);
        ctx.closePath();
        ctx.fill();
      }
      
      // Shield boss
      if (shape.boss) {
        ctx.fillStyle = this.lightenColor(layer.color, 0.3);
        ctx.beginPath();
        ctx.arc(0, 0, shieldSize * 0.2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    } else {
      // Generic item (box/crate/generic)
      const itemSize = scale * shape.size;
      ctx.fillRect(x - itemSize / 2, y - itemSize / 2, itemSize, itemSize);
    }
  }

  renderItemTexture(ctx, x, y, scale, layer) {
    // Apply material-specific textures to items
    const shape = layer.shape;
    const size = scale * (shape.size || 0.5);
    
    if (layer.material) {
      this.applyMaterialTexture(ctx, x, y, size, size, layer.material, layer.color);
    }
  }

  renderItemDetails(ctx, x, y, scale, layer) {
    const details = layer.details;
    
    // Render wear and tear
    if (details.wear > 0) {
      ctx.save();
      ctx.globalAlpha = details.wear;
      ctx.strokeStyle = this.darkenColor(layer.color, 0.4);
      ctx.lineWidth = 1;
      
      // Random scratches
      for (let i = 0; i < Math.floor(details.wear * 10); i++) {
        const sx = x + (Math.random() - 0.5) * scale;
        const sy = y + (Math.random() - 0.5) * scale;
        const ex = sx + (Math.random() - 0.5) * scale * 0.2;
        const ey = sy + (Math.random() - 0.5) * scale * 0.2;
        
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();
      }
      
      ctx.restore();
    }
    
    // Render engravings
    if (details.engraving) {
      ctx.save();
      ctx.strokeStyle = this.darkenColor(layer.color, 0.3);
      ctx.lineWidth = 0.5;
      
      // Simple pattern
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(x, y - scale * 0.3 + i * scale * 0.15, scale * 0.05, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      ctx.restore();
    }
  }

  renderItemOrnaments(ctx, x, y, scale, layer) {
    if (!layer.ornaments) return;
    
    layer.ornaments.forEach(ornament => {
      const ox = x + (ornament.position - 0.5) * scale;
      const oy = y;
      
      if (ornament.type === 'gem') {
        // Small embedded gem
        ctx.fillStyle = ornament.color;
        ctx.beginPath();
        ctx.arc(ox, oy, scale * 0.05, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow
        if (layer.glowIntensity > 0) {
          ctx.save();
          ctx.globalAlpha = layer.glowIntensity * 0.5;
          ctx.fillStyle = ornament.color;
          ctx.beginPath();
          ctx.arc(ox, oy, scale * 0.1, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    });
  }

  renderItemEnchantment(ctx, x, y, scale, layer) {
    if (!layer.intensity || layer.intensity === 0) return;
    
    ctx.save();
    ctx.globalAlpha = layer.intensity * 0.3;
    
    // Magical aura
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, scale);
    gradient.addColorStop(0, layer.color);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, scale, 0, Math.PI * 2);
    ctx.fill();
    
    // Sparkles
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 + Date.now() * 0.001;
      const px = x + Math.cos(angle) * scale * 0.7;
      const py = y + Math.sin(angle) * scale * 0.7;
      
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }

  renderItemHighlights(ctx, x, y, scale, layer) {
    ctx.save();
    ctx.globalAlpha = layer.intensity;
    
    const gradient = ctx.createLinearGradient(x - scale * 0.3, y - scale * 0.3, x + scale * 0.3, y + scale * 0.3);
    gradient.addColorStop(0, layer.color);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x - scale * 0.5, y - scale * 0.5, scale, scale);
    
    ctx.restore();
  }

  // ============ ENVIRONMENT RENDERING METHODS ============

  /**
   * Render environment layer based on type
   */
  renderEnvironmentLayer(ctx, x, y, scale, layer) {
    switch (layer.type) {
      case 'environment_shadow':
        this.renderEnvironmentShadow(ctx, x, y, scale, layer);
        break;
      case 'environment_base':
        this.renderEnvironmentBase(ctx, x, y, scale, layer);
        break;
      case 'environment_texture':
        this.renderEnvironmentTexture(ctx, x, y, scale, layer);
        break;
      case 'environment_details':
        this.renderEnvironmentDetails(ctx, x, y, scale, layer);
        break;
      case 'environment_decorations':
        this.renderEnvironmentDecorations(ctx, x, y, scale, layer);
        break;
      case 'environment_atmosphere':
        this.renderEnvironmentAtmosphere(ctx, x, y, scale, layer);
        break;
    }
  }

  renderEnvironmentShadow(ctx, x, y, scale, layer) {
    ctx.save();
    ctx.globalAlpha = layer.opacity;
    ctx.fillStyle = '#000000';
    ctx.filter = `blur(${layer.blur}px)`;
    ctx.beginPath();
    ctx.ellipse(x, y + scale, scale * 0.8, scale * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  renderEnvironmentBase(ctx, x, y, scale, layer) {
    const structure = layer.structure;
    ctx.fillStyle = layer.color;
    
    // Render based on asset type
    if (structure.trunk) {
      // Tree
      const trunkWidth = scale * structure.trunk.width;
      const trunkHeight = scale * structure.trunk.height;
      
      // Trunk
      ctx.fillRect(x - trunkWidth / 2, y - trunkHeight, trunkWidth, trunkHeight);
      
      // Canopy
      const canopySize = scale * structure.canopy.size;
      ctx.fillStyle = this.darkenColor(layer.color, 0.2);
      
      if (structure.canopy.shape === 'round') {
        ctx.beginPath();
        ctx.arc(x, y - trunkHeight - canopySize / 2, canopySize, 0, Math.PI * 2);
        ctx.fill();
      } else if (structure.canopy.shape === 'conical') {
        ctx.beginPath();
        ctx.moveTo(x, y - trunkHeight - canopySize);
        ctx.lineTo(x - canopySize / 2, y - trunkHeight);
        ctx.lineTo(x + canopySize / 2, y - trunkHeight);
        ctx.closePath();
        ctx.fill();
      }
    } else if (structure.crystals) {
      // Crystal formation
      structure.crystals.forEach((crystal, i) => {
        const cx = x + (i - structure.crystals.length / 2) * scale * 0.2;
        const cy = y;
        const cHeight = scale * crystal.height;
        const cWidth = scale * crystal.width;
        
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(crystal.angle);
        
        // Crystal shape
        ctx.beginPath();
        ctx.moveTo(0, -cHeight);
        ctx.lineTo(cWidth / 2, 0);
        ctx.lineTo(0, cHeight * 0.2);
        ctx.lineTo(-cWidth / 2, 0);
        ctx.closePath();
        
        const brightness = 0.6 + Math.random() * 0.4;
        ctx.fillStyle = this.adjustBrightness(layer.color, brightness);
        ctx.fill();
        
        ctx.restore();
      });
    } else if (structure.floors) {
      // Building
      const buildingWidth = scale * structure.width;
      const floorHeight = scale * 0.3;
      
      for (let i = 0; i < structure.floors; i++) {
        const floorY = y - i * floorHeight;
        ctx.fillRect(x - buildingWidth / 2, floorY - floorHeight, buildingWidth, floorHeight);
        
        // Windows
        if (structure.windows > i * 3) {
          ctx.fillStyle = '#FFFFE0';
          for (let w = 0; w < 3; w++) {
            const wx = x - buildingWidth / 2 + (w + 0.5) * (buildingWidth / 3);
            ctx.fillRect(wx - 5, floorY - floorHeight * 0.7, 10, 15);
          }
          ctx.fillStyle = layer.color;
        }
      }
      
      // Door (ground floor)
      ctx.fillStyle = this.darkenColor(layer.color, 0.4);
      const doorWidth = scale * structure.door.size;
      const doorHeight = scale * structure.door.size * 1.5;
      ctx.fillRect(x - doorWidth / 2, y - doorHeight, doorWidth, doorHeight);
    } else if (structure.segments) {
      // Rock/Boulder
      ctx.save();
      ctx.translate(x, y);
      
      ctx.beginPath();
      for (let i = 0; i < structure.segments; i++) {
        const angle = (i / structure.segments) * Math.PI * 2;
        const radius = scale * (0.4 + Math.random() * structure.roughness * 0.3);
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    }
  }

  renderEnvironmentTexture(ctx, x, y, scale, layer) {
    const structure = layer.structure;
    
    if (layer.material) {
      const size = scale * (structure.size || 1);
      this.applyMaterialTexture(ctx, x, y, size, size, layer.material, layer.color);
    }
  }

  renderEnvironmentDetails(ctx, x, y, scale, layer) {
    const details = layer.details;
    
    // Moss
    if (details.moss) {
      ctx.fillStyle = '#2D5016';
      ctx.globalAlpha = 0.5;
      for (let i = 0; i < 10; i++) {
        const mx = x + (Math.random() - 0.5) * scale;
        const my = y + (Math.random() - 0.5) * scale;
        ctx.beginPath();
        ctx.arc(mx, my, scale * 0.05, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
    }
    
    // Cracks
    if (details.cracks) {
      ctx.strokeStyle = this.darkenColor(layer.palette.primary, 0.5);
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const sx = x + (Math.random() - 0.5) * scale;
        const sy = y + (Math.random() - 0.5) * scale;
        const ex = sx + (Math.random() - 0.5) * scale * 0.3;
        const ey = sy + (Math.random() - 0.5) * scale * 0.3;
        
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();
      }
    }
  }

  renderEnvironmentDecorations(ctx, x, y, scale, layer) {
    const decorations = layer.decorations;
    
    // Torches
    if (decorations.torches) {
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(x - scale * 0.6, y - scale * 0.8, 5, scale * 0.4);
      
      // Flame
      ctx.fillStyle = '#FF6600';
      ctx.beginPath();
      ctx.arc(x - scale * 0.6 + 2.5, y - scale * 0.9, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Glow
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = '#FFAA00';
      ctx.beginPath();
      ctx.arc(x - scale * 0.6 + 2.5, y - scale * 0.9, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    
    // Banners
    if (decorations.banners) {
      ctx.fillStyle = layer.palette.accent;
      ctx.fillRect(x + scale * 0.5, y - scale * 0.9, 3, scale * 0.6);
      ctx.fillRect(x + scale * 0.5, y - scale * 0.9, scale * 0.2, scale * 0.4);
    }
  }

  renderEnvironmentAtmosphere(ctx, x, y, scale, layer) {
    if (layer.weathering > 0.3) {
      ctx.save();
      ctx.globalAlpha = layer.weathering * 0.2;
      ctx.fillStyle = '#000000';
      ctx.fillRect(x - scale, y - scale, scale * 2, scale * 2);
      ctx.restore();
    }
  }
}

module.exports = UniversalProceduralGenerator;
