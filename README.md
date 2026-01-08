# 🎨 Procedural Sprite Factory

**The Ultimate All-in-One 2D Game Asset Generation System**

Generate unlimited unique game assets through pure procedural generation. No AI. No hand-drawing. Just mathematics, algorithms, and infinite possibilities.

[![Production Ready](https://img.shields.io/badge/status-production%20ready-brightgreen)](https://github.com/MrNova420/procedural-sprite-factory)
[![100% Complete](https://img.shields.io/badge/completion-100%25-blue)](https://github.com/MrNova420/procedural-sprite-factory)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 What Is This?

The Procedural Sprite Factory is a complete, production-ready system that generates **every asset type you need for 2D games**:

- ✨ **Characters & Creatures** - 30+ species variants with DNA-driven variations
- 🌍 **Terrain & Environments** - 10+ terrain types, trees, rocks, buildings
- ⚔️ **Items & Equipment** - 12 weapon types, 20 armor variations, consumables
- 🎨 **UI Elements** - 48+ icons, buttons, panels, progress bars, 4 themes
- 🎬 **Animations** - Walk cycles, action animations, sprite sheets
- ✨ **Particle Effects** - 30+ combat, magic, and environmental effects
- 🗺️ **World Generation** - Procedural overworlds (8 biomes) and dungeons

**Describe anything in text → Get it generated** with our text-to-asset system!

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/MrNova420/procedural-sprite-factory.git
cd procedural-sprite-factory

# Install dependencies
npm install

# Start the server
npm start
```

Open your browser to **http://localhost:3000** 🎉

### First Generation

```bash
# Generate a dragon sprite
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"species": "dragon", "size": 1.5}'

# Or use text-to-asset
curl -X POST http://localhost:3000/api/universal/from-text \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A fierce red dragon with golden horns"}'
```

---

## 📖 Features

### 🎯 Core Generation Systems

| System | Description | Endpoints |
|--------|-------------|-----------|
| **Text-to-Asset** | Describe anything, generate it | `/api/universal/from-text` |
| **Characters** | 5 species × 6 variants = 30 combinations | `/api/generate` |
| **DNA System** | Mutations, breeding, evolution | `/api/dna/*` |
| **Terrain** | 10+ types with animations | `/api/assets/terrain` |
| **Environment** | Trees, rocks, buildings, furniture | `/api/assets/*` |
| **Items** | Weapons, armor, consumables | `/api/items/*` |
| **UI Assets** | Icons, buttons, panels, bars | `/api/ui/*` |
| **Animations** | Walk cycles, actions, sprite sheets | `/api/animations/*` |
| **Particle FX** | 30+ combat/magic/env effects | `/api/effects/*` |
| **Worlds** | Overworlds and dungeons | `/api/world/*` |

### 🎨 Generation Options

- **Species**: dragon, wolf, goblin, robot, human
- **Variants**: fire, ice, shadow, nature, light, dark
- **Art Styles**: pixel, dark-fantasy, cyberpunk, retro, minimal, and 15+ more
- **Sizes**: 0.5x - 3.0x scaling
- **Colors**: Full color customization with 8 harmony schemes
- **Variations**: 6 types (similar, color, proportion, style, details, mutation)
- **Batch Generation**: Create 10-100 assets at once
- **Seed Control**: Reproducible generations

---

## 📚 API Reference

### 1. Text-to-Asset Generation (NEW!)

Generate ANY asset by describing it in natural language:

```javascript
POST /api/universal/from-text
{
  "prompt": "A fierce red dragon with golden horns",
  "size": 1.5,
  "style": "dark-fantasy"
}
```

### 2. Character Generation

```javascript
POST /api/generate
{
  "species": "dragon",
  "variant": "fire",
  "size": 1.5,
  "colors": { "primary": "#FF0000", "secondary": "#FFD700" }
}
```

### 3. Batch Generation with Variations

```javascript
POST /api/universal/batch-from-text
{
  "prompt": "A blue robot warrior",
  "count": 20,
  "variationAmount": 0.5
}
```

### 4. DNA Operations

```javascript
// Mutate
POST /api/dna/mutate
{ "dna": {...}, "mutationRate": 0.3 }

// Breed
POST /api/dna/breed
{ "parent1": {...}, "parent2": {...} }
```

### 5. Item Generation

```javascript
// Generate legendary sword
POST /api/items/weapon
{
  "weaponType": "sword",
  "quality": "legendary",
  "material": "dragon"
}

// Generate armor
POST /api/items/armor
{
  "armorType": "helmet",
  "material": "mythril",
  "quality": "epic"
}
```

### 6. UI Assets

```javascript
// Generate icon
POST /api/ui/icon
{
  "category": "combat",
  "iconType": "sword",
  "theme": "dark-fantasy",
  "size": 32
}

// Generate button
POST /api/ui/button
{
  "text": "Attack",
  "state": "normal",
  "theme": "dark-fantasy"
}
```

### 7. Animations

```javascript
// Generate walk cycle
POST /api/animations/walk
{
  "dna": { /* character DNA */ },
  "frameCount": 8,
  "bodyType": "biped"
}

// Export sprite sheet
POST /api/animations/sprite-sheet
{
  "animations": ["idle", "walk", "attack"],
  "layout": "horizontal"
}
```

### 8. Particle Effects

```javascript
// Generate fireball effect
POST /api/effects/magic
{
  "effectType": "fireball",
  "intensity": 1.5,
  "duration": 2.0
}

// Generate combat effect
POST /api/effects/combat
{
  "effectType": "slash",
  "weaponType": "sword"
}
```

### 9. World Generation

```javascript
// Generate overworld
POST /api/world/overworld
{
  "width": 100,
  "height": 100,
  "biomes": ["forest", "desert", "snow"],
  "seed": 12345
}

// Generate dungeon
POST /api/world/dungeon
{
  "roomCount": 15,
  "width": 50,
  "height": 50
}

// Export tilemap
POST /api/world/export
{
  "worldData": {...},
  "format": "tiled"  // or "unity", "json", "csv"
}
```

**📋 [Full API Documentation](./API-REFERENCE.md)**

---

## 🎮 Use Cases

### Game Development
- **Infinite NPCs**: Generate unique enemies and NPCs on the fly
- **Procedural Worlds**: Create entire game worlds with biomes and dungeons
- **Dynamic Loot**: Generate weapons and armor with unique stats
- **Particle Systems**: Add combat and magic effects to your game

### Asset Creation
- **Sprite Sheets**: Export complete animation sets
- **Icon Libraries**: Generate 100s of themed UI icons
- **Tilesets**: Create complete terrain tile sets with auto-tiling

### Prototyping
- **Rapid Iteration**: Generate placeholder assets in seconds
- **Style Exploration**: Try 20+ art styles instantly
- **Variation Testing**: Create hundreds of variations to find the perfect look

---

## 🏗️ Architecture

### Generation Pipeline

```
User Input → DNA System → Generation Engine → Export
```

### Core Systems

1. **Shape Engine** - Skeletal system with 4 body types
2. **Texture Brain** - Procedural noise-based textures
3. **DNA System** - Genetic variations and breeding
4. **Animation Engine** - Walk cycles and action animations
5. **Particle Engine** - Physics-based effects
6. **World Generator** - Biome-based terrain generation

### Technology Stack

- **Backend**: Node.js + Express.js
- **Rendering**: HTML5 Canvas (node-canvas)
- **Noise**: Simplex Noise for procedural textures
- **Export**: PNG, Sprite Sheets, Tilemaps (Tiled/Unity)

---

## 📊 Project Status

### ✅ 100% Complete - All 11 Phases Implemented!

| Phase | System | Status | Lines of Code |
|-------|--------|--------|---------------|
| 1 | Foundation | ✅ Complete | ~2,000 |
| 2 | Shape Engine | ✅ Complete | ~1,500 |
| 3 | Texture Brain | ✅ Complete | ~2,000 |
| 4 | DNA System | ✅ Complete | ~2,500 |
| 5 | Terrain & Environment | ✅ Complete | ~3,500 |
| 6 | Ultimate Generation | ✅ Complete | ~3,000 |
| 7 | Item Generation | ✅ Complete | ~2,500 |
| 8 | UI Assets | ✅ Complete | ~2,000 |
| 9 | Animation Engine | ✅ Complete | ~2,500 |
| 10 | Particle & VFX | ✅ Complete | ~2,500 |
| 11 | World Generation | ✅ Complete | ~2,000 |

**Total**: 41 files, ~30,000 lines of code, 50+ API endpoints

---

## 📂 Project Structure

```
procedural-sprite-factory/
├── server/
│   ├── core/              # Engine and canvas manager
│   ├── generators/        # 13 generation systems
│   │   ├── shape-engine.js
│   │   ├── texture-brain.js
│   │   ├── dna-generator.js
│   │   ├── terrain-generator.js
│   │   ├── environment-generator.js
│   │   ├── item-generator.js
│   │   ├── ui-generator.js
│   │   ├── animation-engine.js
│   │   ├── particle-engine.js
│   │   ├── world-generator.js
│   │   └── ...
│   ├── routes/            # API endpoint handlers
│   └── utils/             # Math, colors, helpers
├── client/                # Web dashboard
│   ├── css/
│   ├── js/
│   └── index.html
├── presets/               # Asset definitions
│   ├── species/
│   ├── styles/
│   └── materials/
├── docs/                  # Documentation
└── package.json
```

---

## 🎓 Learning Resources

### Documentation
- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 5 minutes
- **[PROJECT-VISION.md](./PROJECT-VISION.md)** - Project goals and philosophy
- **[TECHNICAL-ARCHITECTURE.md](./TECHNICAL-ARCHITECTURE.md)** - System design
- **[GAME-ASSETS-EXPANSION.md](./GAME-ASSETS-EXPANSION.md)** - Asset coverage
- **[ULTIMATE-GENERATION-SYSTEM.md](./ULTIMATE-GENERATION-SYSTEM.md)** - Generation details

### Examples
- **Character Generation** - See `/examples/characters.md`
- **World Building** - See `/examples/worlds.md`
- **Item Creation** - See `/examples/items.md`

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Report Bugs** - Open an issue with reproduction steps
2. **Suggest Features** - Describe your use case
3. **Submit PRs** - Fix bugs or add features
4. **Share Creations** - Show us what you've generated!

---

## 📜 License

MIT License - Use freely for personal or commercial projects.

---

## 🙏 Acknowledgments

- **Simplex Noise** - For procedural texture generation
- **Node Canvas** - For server-side rendering
- **Express.js** - For the API server

---

## 🔮 What's Next?

The system is production-ready, but we're always improving:

- 🎨 More art styles (hand-drawn, watercolor, etc.)
- 🌟 Advanced lighting and shadows
- 🎵 Sound effect generation
- 📱 Mobile app version
- 🌐 Cloud-based generation API

---

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/MrNova420/procedural-sprite-factory/issues)
- **Discussions**: [GitHub Discussions](https://github.com/MrNova420/procedural-sprite-factory/discussions)

---

**Built with ❤️ for game developers, by game developers**

*"From mathematics and randomness, we create infinite worlds."*

---

## 🎯 Quick Links

- [Getting Started](#-quick-start)
- [API Reference](#-api-reference)
- [Examples](./examples/)
- [Documentation](./docs/)
- [Contributing](#-contributing)

---

Made with 🎨 by the Procedural Sprite Factory Team
