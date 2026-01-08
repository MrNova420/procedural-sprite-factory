# 🚀 Quick Start Guide

## Installation

```bash
npm install
```

## Running the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

## Using the Dashboard

1. Open your browser to `http://localhost:3000`
2. Select a species from the dropdown (Dragon, Wolf, Goblin, Robot, Human)
3. Adjust the size slider (0.5x - 3.0x)
4. Choose an art style
5. Pick a primary color
6. Click "Generate Sprite" or "Random" for a surprise!

## API Usage

### Generate a Sprite

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "species": "dragon",
    "size": 1.5,
    "style": "dark-fantasy",
    "colors": {
      "primary": "#8B0000"
    }
  }'
```

### Generate Batch

```bash
curl -X POST http://localhost:3000/api/generate/batch \
  -H "Content-Type: application/json" \
  -d '{
    "count": 10,
    "template": {
      "species": "wolf",
      "size": 1.0
    }
  }'
```

### Export PNG

```bash
curl http://localhost:3000/api/export/png/{sprite-id} -o sprite.png
```

## DNA Structure

Every sprite is defined by its DNA:

```javascript
{
  species: "dragon",        // Species type
  size: 1.5,               // Size multiplier
  style: "dark-fantasy",   // Art style
  colors: {
    primary: "#8B0000",    // Primary color
    secondary: "#FFD700"   // Secondary color (auto-generated if not provided)
  },
  features: {},            // Additional features (Phase 3+)
  equipment: {},           // Equipment (Phase 4+)
  state: {
    pose: "idle"          // Animation state
  }
}
```

## Current Features (Phase 1 + Phase 2)

✅ Core engine architecture
✅ Server-side rendering with Canvas API
✅ Basic and skeletal shape generation
✅ 5 species types (Dragon, Wolf, Goblin, Robot, Human)
✅ Multiple body types (biped, quadruped, flying, serpentine)
✅ Bezier curves and advanced geometry
✅ Real-time preview with zoom (1x, 2x, 4x, 8x)
✅ PNG export
✅ Metadata export
✅ DNA copy/paste
✅ Random generation
✅ Batch generation (up to 100 sprites)
✅ Responsive dark theme UI

## Coming Soon

🔜 Phase 3: Procedural textures (Perlin/Simplex noise, materials)
🔜 Phase 4: Advanced DNA system with mutations
🔜 Phase 5: Skeletal animations (walk, attack, idle)
🔜 Phase 6: Particle effects and VFX
🔜 Phase 7: Multiple art styles (pixel, cyberpunk, anime, retro)
🔜 Phase 8: Code generation, gallery, evolution system

## Project Structure

```
procedural-sprite-factory/
├── server/
│   ├── server.js              # Express API server
│   ├── core/
│   │   ├── engine.js          # Main sprite factory
│   │   └── canvas-manager.js  # Canvas operations
│   ├── generators/
│   │   ├── shape-engine.js    # Shape generation
│   │   └── skeleton.js        # Skeletal system
│   ├── routes/
│   │   ├── generate.js        # Generation endpoints
│   │   └── export.js          # Export endpoints
│   └── utils/
│       ├── helpers.js         # Utility functions
│       └── math.js            # Math utilities
├── client/
│   ├── index.html             # Dashboard UI
│   ├── css/                   # Styles
│   └── js/                    # Client-side code
└── presets/
    ├── species/               # Species definitions
    ├── styles/                # Art style presets
    └── materials/             # Material definitions
```

## Troubleshooting

### Server won't start
- Make sure port 3000 is not in use
- Check that dependencies are installed: `npm install`

### Sprites not generating
- Check the browser console for errors
- Verify the server is running: `http://localhost:3000`
- Try a different browser (Chrome recommended)

### Performance issues
- Reduce size multiplier
- Disable real-time preview during generation
- Clear browser cache

## Support

For issues, questions, or feature requests, please open an issue on GitHub.
