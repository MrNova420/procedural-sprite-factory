/**
 * World Generator
 * Generates overworld maps and dungeons with biomes, rooms, and object placement
 */

const { createNoise2D } = require('simplex-noise');
const seedrandom = require('seedrandom');

class WorldGenerator {
  constructor() {
    // Noise instances will be created per-generation with seed
  }

  /**
   * Generate overworld map
   */
  generateOverworld(options = {}) {
    const {
      width = 100,
      height = 100,
      biomes = ['forest', 'desert', 'snow', 'swamp'],
      seed = Math.random() * 10000
    } = options;

    const tiles = [];
    const biomesData = this.getBiomeDefinitions();
    
    // Create noise instance with seed for reproducibility
    const rng = seedrandom(seed.toString());
    const noise = createNoise2D(rng);
    
    // Generate height map
    const heightMap = this.generateHeightMap(width, height, seed, noise);
    
    // Generate moisture map
    const moistureMap = this.generateMoistureMap(width, height, seed + 1000, noise);
    
    // Assign biomes based on height and moisture
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const height = heightMap[y * width + x];
        const moisture = moistureMap[y * width + x];
        
        const biome = this.selectBiome(height, moisture, biomes, biomesData);
        
        tiles.push({
          x,
          y,
          biome: biome.name,
          terrainType: biome.terrain,
          elevation: height,
          moisture
        });
      }
    }
    
    return {
      width,
      height,
      tiles,
      biomes: biomes.map(b => biomesData[b])
    };
  }

  /**
   * Generate dungeon
   */
  generateDungeon(options = {}) {
    const {
      roomCount = 10,
      width = 50,
      height = 50,
      difficulty = 'medium'
    } = options;

    const rooms = [];
    const corridors = [];
    const tiles = this.initializeDungeonTiles(width, height);
    
    // Generate rooms
    for (let i = 0; i < roomCount; i++) {
      const room = this.generateRoom(width, height, difficulty);
      
      if (this.canPlaceRoom(room, rooms, width, height)) {
        rooms.push(room);
        this.carveRoom(room, tiles);
      }
    }
    
    // Connect rooms with corridors
    for (let i = 0; i < rooms.length - 1; i++) {
      const corridor = this.generateCorridor(rooms[i], rooms[i + 1]);
      corridors.push(corridor);
      this.carveCorridor(corridor, tiles);
    }
    
    // Add doors
    const doors = this.placeDoors(rooms, corridors, tiles);
    
    // Add special rooms (entranceRoom and bossRoom used for typing)
    rooms[0].type = 'entrance';
    rooms[rooms.length - 1].type = 'boss';
    const treasureRooms = rooms.filter((r, i) => i > 0 && i < rooms.length - 1 && Math.random() < 0.3);
    
    return {
      width,
      height,
      tiles,
      rooms: rooms.map((r, i) => ({
        ...r,
        type: i === 0 ? 'entrance' : i === rooms.length - 1 ? 'boss' : treasureRooms.includes(r) ? 'treasure' : 'normal'
      })),
      corridors,
      doors,
      difficulty
    };
  }

  /**
   * Place objects in world
   */
  placeObjects(worldData, objects, options = {}) {
    const {
      density = 0.3,
      rules = {}
    } = options;

    const placements = [];
    
    for (const tile of worldData.tiles) {
      if (tile.terrainType === 'water') continue;
      if (Math.random() > density) continue;
      
      // Select object based on biome
      const validObjects = objects.filter(obj => {
        const rule = rules[obj] || {};
        return !rule.biomes || rule.biomes.includes(tile.biome);
      });
      
      if (validObjects.length === 0) continue;
      
      const object = validObjects[Math.floor(Math.random() * validObjects.length)];
      
      placements.push({
        x: tile.x,
        y: tile.y,
        object,
        biome: tile.biome
      });
    }
    
    return placements;
  }

  /**
   * Export tilemap in various formats
   */
  exportTilemap(worldData, format = 'json') {
    switch (format) {
      case 'tiled':
        return this.exportToTiled(worldData);
      case 'unity':
        return this.exportToUnity(worldData);
      case 'csv':
        return this.exportToCSV(worldData);
      default:
        return worldData;
    }
  }

  // Helper methods

  generateHeightMap(width, height, seed, noise) {
    const map = [];
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let value = 0;
        let amplitude = 1;
        let frequency = 0.01;
        
        // Multiple octaves
        for (let i = 0; i < 4; i++) {
          value += noise(
            (x + seed) * frequency,
            (y + seed) * frequency
          ) * amplitude;
          
          frequency *= 2;
          amplitude *= 0.5;
        }
        
        // Normalize to 0-1
        value = (value + 1) / 2;
        map.push(value);
      }
    }
    
    return map;
  }

  generateMoistureMap(width, height, seed, noise) {
    const map = [];
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const value = (noise(
          (x + seed) * 0.02,
          (y + seed) * 0.02
        ) + 1) / 2;
        
        map.push(value);
      }
    }
    
    return map;
  }

  selectBiome(height, moisture, allowedBiomes, biomesData) {
    // Water
    if (height < 0.3) {
      return biomesData['ocean'] || { name: 'ocean', terrain: 'water' };
    }
    
    // Mountain
    if (height > 0.8) {
      return biomesData['mountain'] || { name: 'mountain', terrain: 'stone' };
    }
    
    // Other biomes based on moisture
    if (moisture < 0.3) {
      return allowedBiomes.includes('desert') ? biomesData['desert'] : biomesData['grass'];
    } else if (moisture < 0.5) {
      return allowedBiomes.includes('forest') ? biomesData['forest'] : biomesData['grass'];
    } else if (moisture < 0.7) {
      return allowedBiomes.includes('swamp') ? biomesData['swamp'] : biomesData['grass'];
    } else {
      return allowedBiomes.includes('snow') ? biomesData['snow'] : biomesData['grass'];
    }
  }

  getBiomeDefinitions() {
    return {
      forest: { name: 'forest', terrain: 'grass', objects: ['tree', 'rock'] },
      desert: { name: 'desert', terrain: 'sand', objects: ['cactus', 'rock'] },
      snow: { name: 'snow', terrain: 'snow', objects: ['pine', 'ice'] },
      swamp: { name: 'swamp', terrain: 'dirt', objects: ['dead-tree', 'water'] },
      mountain: { name: 'mountain', terrain: 'stone', objects: ['rock', 'boulder'] },
      ocean: { name: 'ocean', terrain: 'water', objects: [] },
      volcanic: { name: 'volcanic', terrain: 'lava', objects: ['rock'] },
      crystal: { name: 'crystal', terrain: 'ice', objects: ['crystal'] },
      grass: { name: 'grass', terrain: 'grass', objects: ['tree', 'rock'] }
    };
  }

  initializeDungeonTiles(width, height) {
    return Array(height).fill(null).map(() => 
      Array(width).fill({ type: 'wall' })
    );
  }

  generateRoom(maxWidth, maxHeight, difficulty) {
    const width = 5 + Math.floor(Math.random() * 8);
    const height = 5 + Math.floor(Math.random() * 8);
    const x = Math.floor(Math.random() * (maxWidth - width - 2)) + 1;
    const y = Math.floor(Math.random() * (maxHeight - height - 2)) + 1;
    
    return { x, y, width, height };
  }

  canPlaceRoom(room, existingRooms, maxWidth, maxHeight) {
    if (room.x < 0 || room.y < 0) return false;
    if (room.x + room.width >= maxWidth) return false;
    if (room.y + room.height >= maxHeight) return false;
    
    for (const existing of existingRooms) {
      if (this.roomsOverlap(room, existing)) {
        return false;
      }
    }
    
    return true;
  }

  roomsOverlap(room1, room2) {
    return !(
      room1.x + room1.width + 2 < room2.x ||
      room2.x + room2.width + 2 < room1.x ||
      room1.y + room1.height + 2 < room2.y ||
      room2.y + room2.height + 2 < room1.y
    );
  }

  carveRoom(room, tiles) {
    for (let y = room.y; y < room.y + room.height; y++) {
      for (let x = room.x; x < room.x + room.width; x++) {
        tiles[y][x] = { type: 'floor' };
      }
    }
  }

  generateCorridor(room1, room2) {
    const center1 = {
      x: room1.x + Math.floor(room1.width / 2),
      y: room1.y + Math.floor(room1.height / 2)
    };
    
    const center2 = {
      x: room2.x + Math.floor(room2.width / 2),
      y: room2.y + Math.floor(room2.height / 2)
    };
    
    return { start: center1, end: center2 };
  }

  carveCorridor(corridor, tiles) {
    let { x, y } = corridor.start;
    const { x: endX, y: endY } = corridor.end;
    
    // Horizontal then vertical
    while (x !== endX) {
      tiles[y][x] = { type: 'floor' };
      x += x < endX ? 1 : -1;
    }
    
    while (y !== endY) {
      tiles[y][x] = { type: 'floor' };
      y += y < endY ? 1 : -1;
    }
  }

  placeDoors(rooms, corridors, tiles) {
    const doors = [];
    // Simple door placement at room entrances
    for (const room of rooms) {
      // Check each edge for corridor connections
      const edges = [
        { x: room.x, y: room.y + Math.floor(room.height / 2) }, // left
        { x: room.x + room.width - 1, y: room.y + Math.floor(room.height / 2) }, // right
        { x: room.x + Math.floor(room.width / 2), y: room.y }, // top
        { x: room.x + Math.floor(room.width / 2), y: room.y + room.height - 1 } // bottom
      ];
      
      for (const edge of edges) {
        if (Math.random() < 0.3) {
          doors.push(edge);
        }
      }
    }
    
    return doors;
  }

  exportToTiled(worldData) {
    return {
      format: 'TMX',
      width: worldData.width,
      height: worldData.height,
      tilewidth: 16,
      tileheight: 16,
      layers: [
        {
          name: 'Terrain',
          data: worldData.tiles.map(t => this.terrainToTileId(t.terrainType))
        }
      ]
    };
  }

  exportToUnity(worldData) {
    return {
      format: 'Unity Tilemap',
      tiles: worldData.tiles.map(t => ({
        position: { x: t.x, y: t.y },
        tile: t.terrainType
      }))
    };
  }

  exportToCSV(worldData) {
    const rows = [];
    
    for (let y = 0; y < worldData.height; y++) {
      const row = [];
      for (let x = 0; x < worldData.width; x++) {
        const tile = worldData.tiles[y * worldData.width + x];
        row.push(this.terrainToTileId(tile.terrainType));
      }
      rows.push(row.join(','));
    }
    
    return rows.join('\n');
  }

  terrainToTileId(terrainType) {
    const mapping = {
      'grass': 1,
      'dirt': 2,
      'stone': 3,
      'water': 4,
      'sand': 5,
      'snow': 6,
      'lava': 7,
      'ice': 8,
      'wood': 9,
      'cave': 10
    };
    
    return mapping[terrainType] || 0;
  }
}

module.exports = WorldGenerator;
