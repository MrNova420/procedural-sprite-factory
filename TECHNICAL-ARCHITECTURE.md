# Technical Architecture - Procedural Sprite Factory

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    WEB INTERFACE                        │
│  (Control Panel, Editor, Preview, Export)              │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                  API SERVER                             │
│  (Express.js, WebSocket for real-time)                 │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│              SPRITE FACTORY CORE                        │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │          ENGINE COORDINATOR                       │  │
│  │  - Manages pipeline                              │  │
│  │  - Caches generated assets                       │  │
│  │  - Handles batch processing                      │  │
│  └──────────────────┬───────────────────────────────┘  │
│                     │                                    │
│  ┌──────────────────▼───────────────────────────────┐  │
│  │         GENERATION PIPELINE                       │  │
│  │                                                    │  │
│  │  DNA Input → Shape → Texture → Style → Animate   │  │
│  └──────────────────┬───────────────────────────────┘  │
│                     │                                    │
│  ┌──────────────────▼───────────────────────────────┐  │
│  │            5 CORE ENGINES                         │  │
│  │                                                    │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │  1. SHAPE ENGINE                           │  │  │
│  │  │     - Skeleton system                      │  │  │
│  │  │     - Geometry primitives                  │  │  │
│  │  │     - Bezier curves                        │  │  │
│  │  │     - Symmetry                             │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  │                                                    │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │  2. TEXTURE BRAIN                          │  │  │
│  │  │     - Noise generators                     │  │  │
│  │  │     - Material system                      │  │  │
│  │  │     - Color palettes                       │  │  │
│  │  │     - Shading                              │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  │                                                    │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │  3. STYLE ENGINE                           │  │  │
│  │  │     - Art direction                        │  │  │
│  │  │     - Outline rendering                    │  │  │
│  │  │     - Post-processing                      │  │  │
│  │  │     - Dithering                            │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  │                                                    │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │  4. DNA GENERATOR                          │  │  │
│  │  │     - Variation system                     │  │  │
│  │  │     - Mutation engine                      │  │  │
│  │  │     - Serialization                        │  │  │
│  │  │     - Evolution                            │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  │                                                    │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │  5. ANIMATION + VFX ENGINE                 │  │  │
│  │  │     - Bone rigging                         │  │  │
│  │  │     - Motion generation                    │  │  │
│  │  │     - Particle systems                     │  │  │
│  │  │     - Effect rendering                     │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│                   EXPORTERS                              │
│  - PNG (single frame)                                   │
│  - Sprite sheets                                         │
│  - Animations (GIF, video)                              │
│  - Metadata (JSON)                                       │
└──────────────────────────────────────────────────────────┘
```

---

## Core Engine Details

### 1. Shape Engine

**Purpose**: Generate pixel-perfect geometry and skeletons

**Components**:
```javascript
class ShapeEngine {
  // Primitives
  drawCircle(x, y, radius, filled)
  drawEllipse(x, y, w, h, filled)
  drawBezier(points, thickness)
  drawPolygon(points, filled)
  
  // Skeleton System
  createSkeleton(type) // biped, quadruped, flying, etc.
  poseSkeleton(skeleton, pose)
  renderSkeleton(skeleton, canvas)
  
  // Transforms
  mirror(canvas, axis)
  rotate(canvas, angle)
  scale(canvas, factor)
  
  // Advanced
  drawSpline(points, smoothness)
  fillGradient(region, colorStart, colorEnd)
}
```

**Key Algorithms**:
- Bresenham's line algorithm (pixel-perfect lines)
- Midpoint circle algorithm
- Bezier curve calculation
- Flood fill for regions
- Skeleton inverse kinematics

---

### 2. Texture Brain

**Purpose**: Apply procedural textures to every pixel

**Noise Generators**:
```javascript
class NoiseBrain {
  // Perlin/Simplex (smooth organic)
  perlin2D(x, y, scale, octaves)
  simplex2D(x, y, scale)
  
  // Voronoi (cells, cracks)
  voronoi2D(x, y, points, metric)
  
  // Fractal (clouds, terrain)
  fractalNoise(x, y, octaves, persistence)
  
  // Cellular (patterns)
  cellularAutomata(grid, rules, iterations)
  
  // Domain warping (distortion)
  domainWarp(x, y, strength)
}
```

**Material System**:
```javascript
class MaterialSystem {
  materials = {
    skin: {
      baseColor: [220, 180, 140],
      roughness: 0.7,
      noiseType: 'perlin',
      noiseScale: 0.05,
      variations: 'subtle',
      shading: 'soft'
    },
    metal: {
      baseColor: [150, 150, 160],
      roughness: 0.2,
      noiseType: 'voronoi',
      scratches: true,
      rust: 0.3,
      shading: 'hard'
    },
    cloth: {
      baseColor: 'variable',
      roughness: 0.8,
      noiseType: 'fractal',
      weavePattern: true,
      folds: true,
      shading: 'medium'
    }
  }
  
  applyMaterial(canvas, material, lighting)
  blendMaterials(mat1, mat2, ratio)
}
```

---

### 3. Style Engine

**Purpose**: Apply art direction and aesthetic

**Style Profiles**:
```javascript
class StyleEngine {
  styles = {
    'dark-fantasy': {
      outlineThickness: 2,
      outlineColor: 'black',
      paletteSize: 32,
      saturation: 0.7,
      contrast: 1.3,
      shadows: 'hard',
      highlights: 'sharp',
      dither: false,
      glow: false
    },
    'cyberpunk': {
      outlineThickness: 1,
      outlineColor: 'cyan',
      paletteSize: 64,
      saturation: 1.5,
      contrast: 1.4,
      shadows: 'neon',
      highlights: 'bloom',
      dither: false,
      glow: true,
      scanlines: true
    },
    'retro-snes': {
      outlineThickness: 1,
      outlineColor: 'black',
      paletteSize: 16,
      saturation: 1.0,
      contrast: 1.0,
      shadows: 'dithered',
      highlights: 'flat',
      dither: true,
      glow: false,
      pixelPerfect: true
    }
  }
  
  applyStyle(canvas, styleName)
  quantizePalette(canvas, colorCount)
  applyOutline(canvas, thickness, color)
  applyDither(canvas, pattern)
  applyPostFX(canvas, effects)
}
```

---

### 4. DNA Generator

**Purpose**: Create infinite variations

**DNA Structure**:
```javascript
class DNAGenerator {
  generateDNA(species, options) {
    return {
      // Identity
      id: uuid(),
      species: species,
      subspecies: random(subspeciesList),
      
      // Physical
      size: randomRange(0.5, 3.0),
      proportions: {
        head: randomRange(0.8, 1.5),
        torso: randomRange(0.8, 1.3),
        arms: randomRange(0.7, 1.5),
        legs: randomRange(0.7, 1.5),
        tail: randomRange(0.0, 2.0)
      },
      
      // Appearance
      colors: generatePalette(species),
      eyes: randomChoice(['round', 'slit', 'glow']),
      mouth: randomChoice(['fangs', 'beak', 'tusks']),
      extras: randomSubset(['horns', 'wings', 'spikes']),
      
      // Equipment
      armor: weightedRandom(armorTypes, weights),
      weapon: randomChoice(weaponTypes),
      
      // State
      damage: 0,
      mood: 'idle',
      mutations: []
    }
  }
  
  mutateDNA(dna, mutationRate)
  breedDNA(dna1, dna2)
  serializeDNA(dna)
  deserializeDNA(string)
}
```

---

### 5. Animation + VFX Engine

**Purpose**: Bring sprites to life

**Animation System**:
```javascript
class AnimationEngine {
  // Skeleton animation
  createRig(dna)
  animateWalk(rig, time, speed)
  animateAttack(rig, time, weapon)
  animateIdle(rig, time)
  animateDeath(rig, time)
  
  // Interpolation
  interpolatePoses(pose1, pose2, t)
  easeInOut(t)
  
  // Physics
  applyGravity(bone, deltaTime)
  applyInertia(bone, velocity)
  simulateCloth(vertices, constraints)
}
```

**VFX System**:
```javascript
class VFXEngine {
  // Particle systems
  createParticleSystem(type) // fire, smoke, magic, etc.
  updateParticles(particles, deltaTime)
  renderParticles(particles, canvas)
  
  // Effects
  createFireEffect(x, y, intensity)
  createSmokeEffect(x, y, color)
  createMagicEffect(x, y, element)
  createHitFlash(x, y, color)
  
  // Post-processing
  applyGlow(canvas, intensity, color)
  applyDistortion(canvas, strength)
  applyBloom(canvas, threshold, radius)
}
```

---

## Performance Optimizations

### Caching Strategy
```javascript
{
  // Cache generated shapes
  shapeCache: Map<DNAString, Canvas>,
  
  // Cache textures
  textureCache: Map<MaterialID, ImageData>,
  
  // Cache noise fields
  noiseCache: Map<NoiseParams, Float32Array>,
  
  // Cache animations
  animationCache: Map<AnimID, Frame[]>
}
```

### Parallel Processing
- Worker threads for batch generation
- GPU acceleration via WebGL (optional)
- Async rendering pipeline

### Memory Management
- Lazy loading of presets
- Canvas pooling
- Automatic cache cleanup

---

## API Endpoints

```javascript
// Generation
POST /api/generate
POST /api/generate/batch
POST /api/generate/evolve

// DNA Management
POST /api/dna/mutate
POST /api/dna/breed
GET  /api/dna/:id

// Export
POST /api/export/png
POST /api/export/spritesheet
POST /api/export/animation

// Presets
GET  /api/presets/species
GET  /api/presets/styles
GET  /api/presets/materials
```

---

## Data Formats

### DNA Format (JSON)
```json
{
  "id": "abc123",
  "species": "dragon",
  "size": 2.5,
  "colors": {
    "primary": "#8B0000",
    "secondary": "#FFD700",
    "eyes": "#FF4500"
  },
  "equipment": {
    "armor": "heavy",
    "weapon": "claws"
  }
}
```

### Export Metadata
```json
{
  "sprite": "dragon_abc123.png",
  "size": [64, 64],
  "animations": {
    "idle": "dragon_abc123_idle.png",
    "walk": "dragon_abc123_walk.png"
  },
  "dna": { /* full DNA */ },
  "generated": "2026-01-08T00:00:00Z"
}
```

---

## Technology Stack

**Backend**:
- Node.js 18+
- Express.js (API)
- node-canvas (server-side rendering)
- simplex-noise (procedural noise)

**Frontend**:
- Vanilla JavaScript
- HTML5 Canvas
- CSS3 (UI styling)
- WebSocket (real-time preview)

**Build Tools**:
- No bundler needed (vanilla JS)
- ES6 modules
- Simple file structure

---

## Development Roadmap

**Week 1**: Core + Shape Engine
**Week 2**: Texture Brain
**Week 3**: DNA System
**Week 4**: Animation Engine
**Week 5**: VFX System
**Week 6**: Style Engine
**Week 7**: UI/UX
**Week 8**: Polish + Documentation

**Total**: 8 weeks to production-ready

---

## Success Criteria

✅ Generate 100 unique creatures in < 10 seconds
✅ Export 64x64 sprite in < 1 second
✅ Support 10+ species types
✅ Support 5+ art styles
✅ Animated sprites (4+ animations)
✅ VFX rendering
✅ Batch export (1000 sprites)
✅ Web UI with real-time preview

