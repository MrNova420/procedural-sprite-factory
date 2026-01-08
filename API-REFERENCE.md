# 🚀 API Reference

Complete API documentation for the Procedural Sprite Factory.

## Base URL

```
http://localhost:3000/api
```

---

## 📋 Table of Contents

1. [Generation Endpoints](#generation-endpoints)
2. [DNA Operations](#dna-operations)
3. [Asset Generation](#asset-generation)
4. [Universal Generation](#universal-generation)
5. [Item Generation](#item-generation)
6. [UI Assets](#ui-assets)
7. [Animation System](#animation-system)
8. [Particle Effects](#particle-effects)
9. [World Generation](#world-generation)
10. [Export Operations](#export-operations)

---

## Generation Endpoints

### Generate Sprite

Generate a character or creature sprite.

**Endpoint**: `POST /api/generate`

**Request Body**:
```json
{
  "species": "dragon",           // "dragon", "wolf", "goblin", "robot", "human"
  "variant": "fire",             // "fire", "ice", "shadow", "nature", "light", "dark"
  "size": 1.5,                   // 0.5 - 3.0
  "colors": {
    "primary": "#FF0000",
    "secondary": "#FFD700"
  },
  "enableTextures": true,        // Apply procedural textures
  "seed": 12345                  // Optional: for reproducible results
}
```

**Response**:
```json
{
  "success": true,
  "image": "data:image/png;base64,...",
  "dna": { /* Complete DNA object */ },
  "metadata": {
    "species": "dragon",
    "variant": "fire",
    "generation": 1,
    "rarity": "rare"
  }
}
```

### Batch Generate

Generate multiple sprites at once.

**Endpoint**: `POST /api/generate/batch`

**Request Body**:
```json
{
  "count": 10,                   // 1 - 100
  "species": "dragon",
  "variationAmount": 0.5         // 0.0 - 1.0
}
```

---

## DNA Operations

### Generate DNA

Create random DNA for a species.

**Endpoint**: `POST /api/dna/generate`

**Request Body**:
```json
{
  "species": "dragon",
  "variant": "fire"
}
```

### Mutate DNA

Create a mutated version of existing DNA.

**Endpoint**: `POST /api/dna/mutate`

**Request Body**:
```json
{
  "dna": { /* DNA object */ },
  "mutationRate": 0.3            // 0.0 - 1.0
}
```

### Breed DNA

Combine two DNAs to create offspring.

**Endpoint**: `POST /api/dna/breed`

**Request Body**:
```json
{
  "parent1": { /* DNA object */ },
  "parent2": { /* DNA object */ }
}
```

### Serialize DNA

Convert DNA to shareable string.

**Endpoint**: `POST /api/dna/serialize`

**Request Body**:
```json
{
  "dna": { /* DNA object */ }
}
```

**Response**:
```json
{
  "serialized": "base64-encoded-string"
}
```

### Deserialize DNA

Load DNA from string.

**Endpoint**: `POST /api/dna/deserialize`

**Request Body**:
```json
{
  "serialized": "base64-encoded-string"
}
```

### Validate DNA

Check if DNA is valid.

**Endpoint**: `POST /api/dna/validate`

**Request Body**:
```json
{
  "dna": { /* DNA object */ }
}
```

---

## Asset Generation

### Generate Terrain

Create terrain tiles with variations.

**Endpoint**: `POST /api/assets/terrain`

**Request Body**:
```json
{
  "terrainType": "grass",        // "grass", "dirt", "stone", "water", "sand", "snow", "lava", "wood", "ice", "cave"
  "tileSize": 16,                // 8, 16, 32, 64
  "variations": 3                // 1 - 6
}
```

### Generate Tree

Create procedural tree sprites.

**Endpoint**: `POST /api/assets/tree`

**Request Body**:
```json
{
  "species": "oak",              // "oak", "pine", "palm", "dead"
  "size": 1.5,                   // 0.5 - 3.0
  "colors": {
    "trunk": "#8B4513",
    "foliage": "#228B22"
  }
}
```

### Generate Rock

Create rock formations.

**Endpoint**: `POST /api/assets/rock`

**Request Body**:
```json
{
  "type": "large",               // "small", "medium", "large", "boulder"
  "size": 1.0
}
```

### Generate Building

Create building sprites.

**Endpoint**: `POST /api/assets/building`

**Request Body**:
```json
{
  "type": "house",               // "house", "tower", "hut"
  "size": 1.0,
  "colors": {
    "roof": "#8B4513",
    "walls": "#D2B48C"
  }
}
```

### Generate Furniture

Create furniture sprites.

**Endpoint**: `POST /api/assets/furniture`

**Request Body**:
```json
{
  "type": "table",               // "table", "chair", "chest"
  "size": 1.0,
  "woodColor": "#8B4513"
}
```

### List Asset Types

Get all available asset types.

**Endpoint**: `GET /api/assets/types`

---

## Universal Generation

### Text-to-Asset

Generate any asset from text description.

**Endpoint**: `POST /api/universal/from-text`

**Request Body**:
```json
{
  "prompt": "A fierce red dragon with golden horns",
  "size": 1.5,
  "style": "dark-fantasy",       // Optional: override detected style
  "seed": 12345                  // Optional: for reproducibility
}
```

### Batch Text-to-Asset

Generate multiple variations from text.

**Endpoint**: `POST /api/universal/batch-from-text`

**Request Body**:
```json
{
  "prompt": "A blue robot warrior",
  "count": 20,                   // 1 - 100
  "variationAmount": 0.5         // 0.0 - 1.0
}
```

### Create Variations

Generate variations of existing asset.

**Endpoint**: `POST /api/universal/variations`

**Request Body**:
```json
{
  "dna": { /* DNA object */ },
  "count": 10,
  "type": "color",               // "similar", "color", "proportion", "style", "details", "mutation"
  "amount": 0.7                  // 0.0 - 1.0
}
```

### Style Variations

Generate same asset in multiple styles.

**Endpoint**: `POST /api/universal/style-variations`

**Request Body**:
```json
{
  "dna": { /* DNA object */ },
  "styles": ["pixel", "anime", "cyberpunk"]
}
```

### Color Schemes

Generate color palette variations.

**Endpoint**: `POST /api/universal/color-schemes`

**Request Body**:
```json
{
  "dna": { /* DNA object */ },
  "count": 5                     // Number of color schemes
}
```

### Get Examples

Get example prompts and usage.

**Endpoint**: `GET /api/universal/examples`

---

## Item Generation

### Generate Weapon

Create weapon sprites.

**Endpoint**: `POST /api/items/weapon`

**Request Body**:
```json
{
  "weaponType": "sword",         // "sword", "axe", "bow", "staff", "dagger", "hammer", "spear", "mace", "wand", "scythe", "crossbow", "katana"
  "quality": "legendary",        // "common", "uncommon", "rare", "epic", "legendary", "mythic"
  "material": "dragon",          // "leather", "iron", "steel", "mythril", "dragon"
  "size": 1.0,
  "colors": {
    "primary": "#FFD700"
  }
}
```

### Generate Armor

Create armor sprites.

**Endpoint**: `POST /api/items/armor`

**Request Body**:
```json
{
  "armorType": "helmet",         // "helmet", "chestplate", "boots", "shield"
  "material": "mythril",         // "leather", "iron", "steel", "mythril", "dragon"
  "quality": "epic",
  "size": 1.0
}
```

### Generate Consumable

Create consumable items (potions, scrolls, etc.).

**Endpoint**: `POST /api/items/consumable`

**Request Body**:
```json
{
  "consumableType": "potion",    // "potion", "scroll", "food", "elixir"
  "effect": "health",            // "health", "mana", "stamina", "buff", "debuff"
  "quality": "rare",
  "size": 1.0
}
```

### Generate Random Item

Generate a random item.

**Endpoint**: `POST /api/items/random`

**Request Body**:
```json
{
  "minQuality": "uncommon",      // Optional
  "maxQuality": "legendary"      // Optional
}
```

### Batch Generate Items

Generate multiple items.

**Endpoint**: `POST /api/items/batch`

**Request Body**:
```json
{
  "count": 10,
  "categories": ["weapon", "armor", "consumable"]
}
```

### List Item Types

Get all available item types.

**Endpoint**: `GET /api/items/types`

---

## UI Assets

### Generate Panel

Create UI panel/frame.

**Endpoint**: `POST /api/ui/panel`

**Request Body**:
```json
{
  "style": "ornate",             // "simple", "ornate", "wooden", "stone", "metal", "fantasy", "sci-fi", "minimal"
  "width": 200,
  "height": 150,
  "theme": "dark-fantasy"        // "dark-fantasy", "cyberpunk", "retro", "minimal"
}
```

### Generate Button

Create UI button.

**Endpoint**: `POST /api/ui/button`

**Request Body**:
```json
{
  "text": "Attack",
  "state": "normal",             // "normal", "hover", "pressed", "disabled", "selected", "focused", "success", "danger"
  "theme": "dark-fantasy",
  "icon": "sword"                // Optional
}
```

### Generate Icon

Create UI icon.

**Endpoint**: `POST /api/ui/icon`

**Request Body**:
```json
{
  "category": "combat",          // "combat", "stats", "items", "actions", "status", "system"
  "iconType": "sword",
  "size": 32,                    // 16, 32, 64
  "theme": "dark-fantasy"
}
```

### Generate Progress Bar

Create progress bar.

**Endpoint**: `POST /api/ui/progress-bar`

**Request Body**:
```json
{
  "type": "health",              // "health", "mana", "experience", "loading"
  "width": 100,
  "height": 20,
  "value": 0.75                  // 0.0 - 1.0
}
```

### Generate Themed UI

Generate complete themed UI set.

**Endpoint**: `POST /api/ui/theme`

**Request Body**:
```json
{
  "themeName": "dark-fantasy",
  "elements": ["panel", "button", "icon", "progress-bar"]
}
```

---

## Animation System

### Generate Walk Cycle

Create procedural walk animation.

**Endpoint**: `POST /api/animations/walk`

**Request Body**:
```json
{
  "dna": { /* character DNA */ },
  "frameCount": 8,               // 4 or 8
  "speed": 1.0,
  "bodyType": "biped"            // "biped", "quadruped", "flying", "serpentine"
}
```

### Generate Action Animation

Create action animation.

**Endpoint**: `POST /api/animations/action`

**Request Body**:
```json
{
  "dna": { /* character DNA */ },
  "actionType": "attack",        // "attack", "hurt", "death", "idle", "jump", "cast", "run"
  "frameCount": 6,
  "weaponType": "sword"          // Optional
}
```

### Custom Animation

Create custom keyframe animation.

**Endpoint**: `POST /api/animations/custom`

**Request Body**:
```json
{
  "dna": { /* character DNA */ },
  "keyframes": [
    { "frame": 0, "rotation": 0 },
    { "frame": 5, "rotation": 90 },
    { "frame": 10, "rotation": 0 }
  ],
  "easing": "easeInOut"          // "linear", "easeIn", "easeOut", "easeInOut", "cubicIn", "cubicOut", "cubicInOut"
}
```

### Export Sprite Sheet

Export animations as sprite sheet.

**Endpoint**: `POST /api/animations/sprite-sheet`

**Request Body**:
```json
{
  "animations": ["idle", "walk", "attack"],
  "dna": { /* character DNA */ },
  "layout": "horizontal",        // "horizontal", "vertical", "grid"
  "frameSize": 64
}
```

### Batch Generate Animations

Generate multiple animations.

**Endpoint**: `POST /api/animations/batch`

**Request Body**:
```json
{
  "dna": { /* character DNA */ },
  "animations": ["idle", "walk", "attack", "hurt", "death"]
}
```

---

## Particle Effects

### Generate Particle Effect

Create custom particle effect.

**Endpoint**: `POST /api/effects/particle`

**Request Body**:
```json
{
  "particleCount": 100,
  "lifetime": 2.0,
  "velocity": { "x": 0, "y": -50 },
  "color": { "start": "#FF0000", "end": "#FFFF00" },
  "gravity": 9.8
}
```

### Generate Combat Effect

Create combat effect.

**Endpoint**: `POST /api/effects/combat`

**Request Body**:
```json
{
  "effectType": "slash",         // "slash", "impact", "blood", "sparks"
  "weaponType": "sword",
  "direction": "horizontal"      // "horizontal", "vertical", "diagonal"
}
```

### Generate Magic Effect

Create magic effect.

**Endpoint**: `POST /api/effects/magic`

**Request Body**:
```json
{
  "effectType": "fireball",      // "fireball", "ice-shard", "lightning", "arcane", "holy", "dark"
  "intensity": 1.5,
  "duration": 2.0
}
```

### Generate Environmental Effect

Create environmental effect.

**Endpoint**: `POST /api/effects/environment`

**Request Body**:
```json
{
  "effectType": "rain",          // "rain", "snow", "wind", "leaves", "dust"
  "intensity": 0.8,
  "windSpeed": 0.3
}
```

### Generate Status Effect

Create status effect.

**Endpoint**: `POST /api/effects/status`

**Request Body**:
```json
{
  "effectType": "heal",          // "poison", "burn", "freeze", "stun", "heal"
  "power": 1.0
}
```

### Generate Trail Effect

Create motion trail.

**Endpoint**: `POST /api/effects/trail`

**Request Body**:
```json
{
  "trailType": "weapon",         // "weapon", "movement", "magic"
  "length": 10,
  "color": "#FF0000"
}
```

### Generate Aura Effect

Create persistent aura.

**Endpoint**: `POST /api/effects/aura`

**Request Body**:
```json
{
  "auraType": "power",           // "power", "rage", "calm", "blessing", "curse"
  "intensity": 1.0,
  "color": "#FFD700"
}
```

### Custom Effect

Create fully customized effect.

**Endpoint**: `POST /api/effects/custom`

**Request Body**:
```json
{
  "particleCount": 50,
  "lifetime": 1.5,
  "emissionRate": 20,
  "velocity": { "x": 0, "y": -100 },
  "acceleration": { "x": 0, "y": 50 },
  "colorGradient": ["#FF0000", "#FFFF00", "#FFFFFF"],
  "sizeOverTime": [1.0, 2.0, 0.0]
}
```

---

## World Generation

### Generate Overworld

Create procedural world map.

**Endpoint**: `POST /api/world/overworld`

**Request Body**:
```json
{
  "width": 100,
  "height": 100,
  "biomes": ["forest", "desert", "snow", "swamp"],  // "forest", "desert", "snow", "swamp", "mountain", "ocean", "volcanic", "crystal"
  "seed": 12345
}
```

### Generate Dungeon

Create dungeon level.

**Endpoint**: `POST /api/world/dungeon`

**Request Body**:
```json
{
  "roomCount": 15,
  "width": 50,
  "height": 50,
  "difficulty": "medium",        // "easy", "medium", "hard"
  "seed": 12345
}
```

### Place Objects

Place objects in world.

**Endpoint**: `POST /api/world/place-objects`

**Request Body**:
```json
{
  "worldData": { /* world tilemap */ },
  "objects": ["tree", "rock", "building"],
  "density": 0.3                 // 0.0 - 1.0
}
```

### Export World

Export world as tilemap.

**Endpoint**: `POST /api/world/export`

**Request Body**:
```json
{
  "worldData": { /* world tilemap */ },
  "format": "tiled",             // "tiled", "unity", "json", "csv"
  "filename": "my-world"
}
```

### Preview World

Get world preview image.

**Endpoint**: `POST /api/world/preview`

**Request Body**:
```json
{
  "worldData": { /* world tilemap */ },
  "zoom": 1.0
}
```

---

## Export Operations

### Export PNG

Export sprite as PNG.

**Endpoint**: `GET /api/export/png/:id`

**Parameters**:
- `id`: Asset ID from generation response

### Export Metadata

Export asset metadata.

**Endpoint**: `GET /api/export/metadata/:id`

**Parameters**:
- `id`: Asset ID from generation response

---

## Error Handling

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

**Common HTTP Status Codes**:
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `404`: Not Found (asset doesn't exist)
- `500`: Internal Server Error

---

## Rate Limiting

Currently no rate limiting is implemented. For production use, consider adding rate limiting middleware.

---

## Authentication

Currently no authentication is required. For production use, consider adding API key authentication.

---

## Best Practices

1. **Use Seeds** for reproducible results
2. **Batch Generation** for efficiency when creating multiple assets
3. **Cache Results** on client side to avoid regenerating identical assets
4. **Validate DNA** before breeding or mutating
5. **Use Appropriate Sizes** - larger sizes take more processing time

---

## Examples

See the `/examples` directory for complete usage examples:
- Character generation workflows
- World building tutorials
- Item creation patterns
- Animation pipelines

---

**Need Help?** Open an issue on GitHub or check the documentation.
