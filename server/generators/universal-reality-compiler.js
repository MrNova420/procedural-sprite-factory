/**
 * Universal 2D Reality Compiler
 * A foundational system that can generate ANY 2D asset through pure mathematical description
 * Not limited to predefined types - truly universal
 */

class UniversalRealityCompiler {
  constructor() {
    this.rng = null;
  }

  /**
   * Initialize RNG with seed
   */
  initRNG(seed) {
    this.rng = this.createSeededRandom(seed);
  }

  createSeededRandom(seed) {
    return {
      value: seed,
      next: function() {
        this.value = (this.value * 9301 + 49297) % 233280;
        return this.value / 233280;
      }
    };
  }

  /**
   * Universal Form Description
   * Describes any possible 2D form through mathematical parameters
   */
  describeForm(params) {
    const seed = params.seed || Math.floor(Math.random() * 1000000);
    this.initRNG(seed);

    return {
      // Topology - the fundamental structure
      topology: {
        type: params.topology || this.generateTopology(),
        symmetry: params.symmetry || this.generateSymmetry(),
        complexity: params.complexity !== undefined ? params.complexity : this.rng.next(),
        articulation: params.articulation !== undefined ? params.articulation : this.rng.next()
      },

      // Mass distribution - how weight is distributed
      mass: {
        distribution: params.massDistribution || this.generateMassDistribution(),
        density: params.density !== undefined ? params.density : this.rng.next(),
        centerOfMass: params.centerOfMass || { x: 0.5, y: 0.5 }
      },

      // Edge characteristics
      edges: {
        sharpness: params.edgeSharpness !== undefined ? params.edgeSharpness : this.rng.next(),
        organic: params.organic !== undefined ? params.organic : this.rng.next(),
        mechanical: params.mechanical !== undefined ? params.mechanical : 1 - (params.organic || this.rng.next())
      },

      // Structural elements - universal building blocks
      elements: this.generateElements(params),

      // Proportions - dimensional relationships
      proportions: this.generateProportions(params),

      // Seed for reproducibility
      seed
    };
  }

  /**
   * Generate topology type
   */
  generateTopology() {
    const types = [
      'biped', 'quadruped', 'hexapod', 'octopod', 
      'serpentine', 'radial', 'flying', 'floating',
      'wheeled', 'tracked', 'spherical', 'cubic',
      'branching', 'crystalline', 'amorphous', 'fractal',
      'composite', 'segmented', 'spiral', 'network'
    ];
    return types[Math.floor(this.rng.next() * types.length)];
  }

  /**
   * Generate symmetry type
   */
  generateSymmetry() {
    const types = [
      { type: 'mirror', axis: 'vertical' },
      { type: 'mirror', axis: 'horizontal' },
      { type: 'radial', count: Math.floor(2 + this.rng.next() * 12) },
      { type: 'spiral', turns: this.rng.next() * 5 },
      { type: 'asymmetric', bias: this.rng.next() },
      { type: 'bilateral' },
      { type: 'fractal', iterations: Math.floor(2 + this.rng.next() * 4) }
    ];
    return types[Math.floor(this.rng.next() * types.length)];
  }

  /**
   * Generate mass distribution
   */
  generateMassDistribution() {
    const types = [
      'heavy', 'light', 'balanced', 'top-heavy', 'bottom-heavy',
      'front-heavy', 'rear-heavy', 'hollow', 'dense', 'distributed'
    ];
    return types[Math.floor(this.rng.next() * types.length)];
  }

  /**
   * Generate structural elements - the atoms of form
   */
  generateElements(params) {
    const elementCount = Math.floor(3 + this.rng.next() * 20);
    const elements = [];

    for (let i = 0; i < elementCount; i++) {
      elements.push({
        type: this.generateElementType(),
        position: { x: this.rng.next(), y: this.rng.next() },
        size: 0.1 + this.rng.next() * 0.5,
        rotation: this.rng.next() * Math.PI * 2,
        attachment: this.rng.next() > 0.5 ? elements[Math.floor(this.rng.next() * elements.length)] : null,
        articulated: this.rng.next() > 0.7
      });
    }

    return elements;
  }

  generateElementType() {
    const types = [
      'core', 'limb', 'appendage', 'sensor', 'emitter',
      'connector', 'joint', 'segment', 'terminal', 'branching',
      'protective', 'functional', 'decorative', 'structural'
    ];
    return types[Math.floor(this.rng.next() * types.length)];
  }

  /**
   * Generate proportions
   */
  generateProportions(params) {
    return {
      width: params.width || (0.3 + this.rng.next() * 0.7),
      height: params.height || (0.3 + this.rng.next() * 0.7),
      depth: params.depth || (0.3 + this.rng.next() * 0.7),
      elongation: this.rng.next(),
      compression: this.rng.next(),
      taper: this.rng.next() * 2 - 1  // -1 to 1
    };
  }

  /**
   * Universal Material Description
   * Describes any possible material through physical properties
   */
  describeMaterial(params) {
    const seed = params.seed || Math.floor(Math.random() * 1000000);
    this.initRNG(seed);

    return {
      // Physical properties
      physical: {
        roughness: params.roughness !== undefined ? params.roughness : this.rng.next(),
        reflectivity: params.reflectivity !== undefined ? params.reflectivity : this.rng.next(),
        translucency: params.translucency !== undefined ? params.translucency : this.rng.next(),
        hardness: params.hardness !== undefined ? params.hardness : this.rng.next(),
        flexibility: params.flexibility !== undefined ? params.flexibility : this.rng.next(),
        density: params.density !== undefined ? params.density : this.rng.next()
      },

      // Surface characteristics
      surface: {
        pattern: this.generatePattern(params),
        grain: params.grain !== undefined ? params.grain : this.rng.next(),
        pores: params.pores !== undefined ? params.pores : this.rng.next(),
        striations: params.striations !== undefined ? params.striations : this.rng.next(),
        bumps: params.bumps !== undefined ? params.bumps : this.rng.next()
      },

      // Weathering and age
      wear: {
        level: params.wear !== undefined ? params.wear : this.rng.next(),
        scratches: params.scratches !== undefined ? params.scratches : this.rng.next(),
        cracks: params.cracks !== undefined ? params.cracks : this.rng.next(),
        dirt: params.dirt !== undefined ? params.dirt : this.rng.next(),
        oxidation: params.oxidation !== undefined ? params.oxidation : this.rng.next(),
        erosion: params.erosion !== undefined ? params.erosion : this.rng.next()
      },

      // Optical properties
      optical: {
        subsurfaceScattering: params.subsurfaceScattering !== undefined ? params.subsurfaceScattering : this.rng.next(),
        refraction: params.refraction !== undefined ? params.refraction : this.rng.next(),
        iridescence: params.iridescence !== undefined ? params.iridescence : this.rng.next(),
        fluorescence: params.fluorescence !== undefined ? params.fluorescence : this.rng.next(),
        glow: params.glow !== undefined ? params.glow : this.rng.next()
      },

      // Dynamic properties
      dynamic: {
        flowing: params.flowing !== undefined ? params.flowing : this.rng.next(),
        pulsing: params.pulsing !== undefined ? params.pulsing : this.rng.next(),
        morphing: params.morphing !== undefined ? params.morphing : this.rng.next(),
        dissolving: params.dissolving !== undefined ? params.dissolving : this.rng.next()
      },

      seed
    };
  }

  generatePattern(params) {
    const patterns = [
      { type: 'none' },
      { type: 'stripes', frequency: this.rng.next() * 20, angle: this.rng.next() * Math.PI * 2 },
      { type: 'spots', density: this.rng.next(), size: this.rng.next() },
      { type: 'scales', size: this.rng.next(), overlap: this.rng.next() },
      { type: 'hexagonal', size: this.rng.next() },
      { type: 'cellular', size: this.rng.next() },
      { type: 'fractal', iterations: Math.floor(2 + this.rng.next() * 5) },
      { type: 'voronoi', cells: Math.floor(10 + this.rng.next() * 100) },
      { type: 'noise', octaves: Math.floor(1 + this.rng.next() * 6) },
      { type: 'geometric', shape: ['circle', 'square', 'triangle'][Math.floor(this.rng.next() * 3)] }
    ];
    return patterns[Math.floor(this.rng.next() * patterns.length)];
  }

  /**
   * Universal Style Space
   * Any possible art style described mathematically
   */
  describeStyle(params) {
    return {
      // Line characteristics
      lines: {
        thickness: params.lineThickness !== undefined ? params.lineThickness : 0.5,
        sharpness: params.lineSharpness !== undefined ? params.lineSharpness : 0.5,
        presence: params.linePresence !== undefined ? params.linePresence : 1.0,
        style: params.lineStyle || 'solid'  // solid, dashed, dotted, brush, pen, marker
      },

      // Color treatment
      color: {
        paletteSize: params.paletteSize || Math.floor(4 + Math.random() * 28),
        saturation: params.saturation !== undefined ? params.saturation : 0.7,
        brightness: params.brightness !== undefined ? params.brightness : 0.5,
        contrast: params.contrast !== undefined ? params.contrast : 0.5,
        hueDrift: params.hueDrift !== undefined ? params.hueDrift : 0.1,
        colorHarmony: params.colorHarmony || 'analogous'
      },

      // Shading approach
      shading: {
        steps: params.shadingSteps || Math.floor(2 + Math.random() * 8),
        softness: params.shadingSoftness !== undefined ? params.shadingSoftness : 0.5,
        contrast: params.shadingContrast !== undefined ? params.shadingContrast : 0.7,
        direction: params.lightDirection || { x: -0.5, y: -0.7, z: 0.5 },
        ambient: params.ambient !== undefined ? params.ambient : 0.3
      },

      // Detail level
      detail: {
        level: params.detailLevel !== undefined ? params.detailLevel : 0.5,
        noise: params.noise !== undefined ? params.noise : 0.2,
        texture: params.texture !== undefined ? params.texture : 0.5,
        highlights: params.highlights !== undefined ? params.highlights : 0.6
      },

      // Pixel characteristics
      pixel: {
        sharpness: params.pixelSharpness !== undefined ? params.pixelSharpness : 1.0,
        size: params.pixelSize || 1,
        antialiasing: params.antialiasing !== undefined ? params.antialiasing : 0.0,
        dithering: params.dithering !== undefined ? params.dithering : 0.0
      },

      // Effects
      effects: {
        glow: params.glow !== undefined ? params.glow : 0.0,
        bloom: params.bloom !== undefined ? params.bloom : 0.0,
        grain: params.grain !== undefined ? params.grain : 0.1,
        vignette: params.vignette !== undefined ? params.vignette : 0.0,
        chromatic: params.chromatic !== undefined ? params.chromatic : 0.0
      },

      // Artistic influence
      artistic: {
        painterly: params.painterly !== undefined ? params.painterly : 0.0,
        sketchy: params.sketchy !== undefined ? params.sketchy : 0.0,
        clean: params.clean !== undefined ? params.clean : 1.0,
        stylized: params.stylized !== undefined ? params.stylized : 0.5
      }
    };
  }

  /**
   * Universal Color Space
   * Not limited to RGB - true color generation
   */
  describeColor(params) {
    const seed = params.seed || Math.floor(Math.random() * 1000000);
    this.initRNG(seed);

    const baseHue = params.baseHue !== undefined ? params.baseHue : this.rng.next() * 360;

    return {
      // Base color in multiple spaces
      base: {
        hue: baseHue,
        saturation: params.saturation !== undefined ? params.saturation : 0.7,
        lightness: params.lightness !== undefined ? params.lightness : 0.5,
        alpha: params.alpha !== undefined ? params.alpha : 1.0
      },

      // Color harmony generation
      harmony: this.generateColorHarmony(baseHue, params.harmonyType),

      // Color modulation
      modulation: {
        temperature: params.temperature !== undefined ? params.temperature : 0.5,  // warm to cool
        tint: params.tint !== undefined ? params.tint : 0.0,
        shade: params.shade !== undefined ? params.shade : 0.0,
        tone: params.tone !== undefined ? params.tone : 0.0
      },

      // Dynamic color behavior
      dynamic: {
        shift: params.colorShift !== undefined ? params.colorShift : 0.0,
        pulse: params.colorPulse !== undefined ? params.colorPulse : 0.0,
        rainbow: params.rainbow !== undefined ? params.rainbow : 0.0
      },

      seed
    };
  }

  generateColorHarmony(baseHue, type = 'analogous') {
    const harmonies = {
      monochromatic: [baseHue],
      complementary: [baseHue, (baseHue + 180) % 360],
      triadic: [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360],
      tetradic: [baseHue, (baseHue + 90) % 360, (baseHue + 180) % 360, (baseHue + 270) % 360],
      analogous: [baseHue, (baseHue + 30) % 360, (baseHue + 60) % 360],
      splitComplementary: [baseHue, (baseHue + 150) % 360, (baseHue + 210) % 360],
      square: [baseHue, (baseHue + 90) % 360, (baseHue + 180) % 360, (baseHue + 270) % 360]
    };

    return harmonies[type] || harmonies.analogous;
  }

  /**
   * Compile a complete asset from universal descriptions
   */
  compile(params) {
    const form = this.describeForm(params.form || {});
    const material = this.describeMaterial(params.material || {});
    const style = this.describeStyle(params.style || {});
    const color = this.describeColor(params.color || {});

    return {
      form,
      material,
      style,
      color,
      metadata: {
        compiled: Date.now(),
        version: '1.0.0',
        type: 'universal_asset'
      }
    };
  }

  /**
   * Render compiled asset to pixel grid
   */
  render(ctx, x, y, scale, compiledAsset) {
    // This is where the magic happens - turning mathematical descriptions into pixels
    const { form, material, style, color } = compiledAsset;

    // 1. Generate silhouette from form description
    const silhouette = this.generateSilhouette(form, scale);

    // 2. Apply material properties to create texture
    const texture = this.synthesizeTexture(silhouette, material, color);

    // 3. Apply lighting based on style
    const lit = this.applyLighting(texture, style, form);

    // 4. Render to canvas with style treatment
    this.rasterize(ctx, x, y, lit, style);
  }

  generateSilhouette(form, scale) {
    // Use SDFs (Signed Distance Fields) to create clean silhouettes
    const width = Math.floor(scale * form.proportions.width * 64);
    const height = Math.floor(scale * form.proportions.height * 64);
    
    const sdf = new Float32Array(width * height);
    
    // Generate SDF from form elements
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const nx = x / width;
        const ny = y / height;
        
        let minDist = Infinity;
        
        // Calculate distance to each form element
        form.elements.forEach(element => {
          const dx = nx - element.position.x;
          const dy = ny - element.position.y;
          const dist = Math.sqrt(dx * dx + dy * dy) - element.size;
          minDist = Math.min(minDist, dist);
        });
        
        sdf[y * width + x] = minDist;
      }
    }
    
    return { width, height, sdf };
  }

  synthesizeTexture(silhouette, material, color) {
    // Create texture based on material properties
    const { width, height, sdf } = silhouette;
    const texture = new Uint8ClampedArray(width * height * 4);
    
    for (let i = 0; i < width * height; i++) {
      if (sdf[i] < 0) {  // Inside silhouette
        // Base color
        const baseColor = this.hslToRgb(
          color.base.hue / 360,
          color.base.saturation,
          color.base.lightness
        );
        
        // Apply material surface effects
        const noise = this.noise2D(i % width, Math.floor(i / width)) * material.surface.grain;
        
        texture[i * 4] = Math.floor(baseColor[0] * 255 * (1 + noise));
        texture[i * 4 + 1] = Math.floor(baseColor[1] * 255 * (1 + noise));
        texture[i * 4 + 2] = Math.floor(baseColor[2] * 255 * (1 + noise));
        texture[i * 4 + 3] = 255;
      }
    }
    
    return { width, height, data: texture };
  }

  applyLighting(texture, style, form) {
    // Apply shading based on style parameters
    const { width, height, data } = texture;
    const lit = new Uint8ClampedArray(data);
    
    const lightDir = style.shading.direction;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        
        if (data[i + 3] > 0) {  // If pixel exists
          // Calculate normal (simple gradient-based)
          const nx = x < width - 1 ? data[i + 4 + 3] - data[i + 3] : 0;
          const ny = y < height - 1 ? data[i + width * 4 + 3] - data[i + 3] : 0;
          
          // Simple diffuse lighting
          const lightAmount = Math.max(0, style.shading.ambient + 
            (1 - style.shading.ambient) * (nx * lightDir.x + ny * lightDir.y));
          
          lit[i] = Math.floor(lit[i] * lightAmount);
          lit[i + 1] = Math.floor(lit[i + 1] * lightAmount);
          lit[i + 2] = Math.floor(lit[i + 2] * lightAmount);
        }
      }
    }
    
    return { width, height, data: lit };
  }

  rasterize(ctx, x, y, image, style) {
    // Convert to canvas pixels
    const imageData = ctx.createImageData(image.width, image.height);
    imageData.data.set(image.data);
    
    // Create temporary canvas for effects
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = image.width;
    tempCanvas.height = image.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.putImageData(imageData, 0, 0);
    
    // Apply pixel art scaling
    ctx.imageSmoothingEnabled = style.pixel.sharpness > 0.5;
    ctx.drawImage(tempCanvas, x - image.width / 2, y - image.height / 2);
  }

  // Utility functions
  hslToRgb(h, s, l) {
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return [r, g, b];
  }

  noise2D(x, y) {
    // Simple 2D noise
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return n - Math.floor(n);
  }
}

module.exports = UniversalRealityCompiler;
