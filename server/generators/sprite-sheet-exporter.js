/**
 * Sprite Sheet & Atlas Exporter
 * Exports generated assets as sprite sheets, atlases, and animation timelines
 * Compatible with Phaser, Godot, Unity 2D, Unreal Paper2D
 */

const { createCanvas } = require('canvas');

class SpriteSheetExporter {
  /**
   * Export multiple sprites as a sprite sheet
   */
  static exportSpriteSheet(sprites, params = {}) {
    const {
      layout = 'horizontal', // horizontal, vertical, grid
      padding = 2,
      powerOfTwo = true,
      format = 'png'
    } = params;

    const { canvas, metadata } = this.packSprites(sprites, layout, padding, powerOfTwo);
    
    return {
      image: canvas.toBuffer(format),
      metadata: this.generateMetadata(metadata, format)
    };
  }

  /**
   * Export as texture atlas with optimal packing
   */
  static exportAtlas(sprites, params = {}) {
    const {
      algorithm = 'maxrects', // maxrects, shelf, guillotine
      padding = 2,
      maxSize = 2048,
      powerOfTwo = true,
      format = 'png',
      metadataFormat = 'json' // json, xml, txt
    } = params;

    const packed = this.packAtlas(sprites, algorithm, padding, maxSize, powerOfTwo);
    
    return {
      image: packed.canvas.toBuffer(format),
      metadata: this.generateAtlasMetadata(packed, metadataFormat)
    };
  }

  /**
   * Export animation timeline
   */
  static exportAnimation(frames, params = {}) {
    const {
      fps = 12,
      loop = true,
      format = 'json' // json, spine, dragonbones
    } = params;

    const animation = {
      frames: frames.map((frame, index) => ({
        index,
        duration: 1000 / fps,
        sprite: frame.sprite,
        bounds: frame.bounds
      })),
      fps,
      loop,
      totalDuration: (frames.length * 1000) / fps
    };

    return this.formatAnimation(animation, format);
  }

  /**
   * Pack sprites into sprite sheet
   */
  static packSprites(sprites, layout, padding, powerOfTwo) {
    let width, height;
    const positions = [];

    switch (layout) {
      case 'horizontal':
        width = sprites.reduce((sum, s) => sum + s.width + padding, padding);
        height = Math.max(...sprites.map(s => s.height)) + padding * 2;
        
        let x = padding;
        sprites.forEach((sprite, i) => {
          positions.push({ x, y: padding, sprite, index: i });
          x += sprite.width + padding;
        });
        break;

      case 'vertical':
        width = Math.max(...sprites.map(s => s.width)) + padding * 2;
        height = sprites.reduce((sum, s) => sum + s.height + padding, padding);
        
        let y = padding;
        sprites.forEach((sprite, i) => {
          positions.push({ x: padding, y, sprite, index: i });
          y += sprite.height + padding;
        });
        break;

      case 'grid':
        const cols = Math.ceil(Math.sqrt(sprites.length));
        const maxWidth = Math.max(...sprites.map(s => s.width));
        const maxHeight = Math.max(...sprites.map(s => s.height));
        
        width = cols * (maxWidth + padding) + padding;
        height = Math.ceil(sprites.length / cols) * (maxHeight + padding) + padding;
        
        sprites.forEach((sprite, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          positions.push({
            x: padding + col * (maxWidth + padding),
            y: padding + row * (maxHeight + padding),
            sprite,
            index: i
          });
        });
        break;
    }

    if (powerOfTwo) {
      width = this.nextPowerOfTwo(width);
      height = this.nextPowerOfTwo(height);
    }

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Draw all sprites
    positions.forEach(pos => {
      ctx.drawImage(pos.sprite, pos.x, pos.y);
    });

    return {
      canvas,
      metadata: positions.map(pos => ({
        name: pos.sprite.name || `sprite_${pos.index}`,
        x: pos.x,
        y: pos.y,
        width: pos.sprite.width,
        height: pos.sprite.height
      }))
    };
  }

  /**
   * Pack atlas using Max Rects algorithm
   */
  static packAtlas(sprites, algorithm, padding, maxSize, powerOfTwo) {
    // Sort sprites by area (largest first) for better packing
    const sorted = [...sprites].sort((a, b) => 
      (b.width * b.height) - (a.width * a.height)
    );

    const rects = [];
    let width = 32;
    let height = 32;

    // Try to pack sprites, expanding size as needed
    while (width <= maxSize && height <= maxSize) {
      rects.length = 0;
      const packer = new MaxRectsPacker(width, height, padding);
      
      let allFit = true;
      for (const sprite of sorted) {
        const rect = packer.insert(sprite.width, sprite.height);
        if (!rect) {
          allFit = false;
          break;
        }
        rects.push({ ...rect, sprite });
      }

      if (allFit) break;

      // Expand size
      if (width <= height) {
        width = this.nextPowerOfTwo(width + 1);
      } else {
        height = this.nextPowerOfTwo(height + 1);
      }
    }

    if (powerOfTwo) {
      width = this.nextPowerOfTwo(width);
      height = this.nextPowerOfTwo(height);
    }

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Draw all sprites at packed positions
    rects.forEach(rect => {
      ctx.drawImage(rect.sprite, rect.x, rect.y);
    });

    return {
      canvas,
      rects: rects.map(r => ({
        name: r.sprite.name,
        x: r.x,
        y: r.y,
        width: r.sprite.width,
        height: r.sprite.height
      }))
    };
  }

  /**
   * Generate metadata in various formats
   */
  static generateMetadata(positions, format) {
    return {
      format: 'sprite-sheet',
      sprites: positions,
      meta: {
        version: '1.0',
        generator: 'Procedural Sprite Factory'
      }
    };
  }

  /**
   * Generate atlas metadata in requested format
   */
  static generateAtlasMetadata(packed, format) {
    switch (format) {
      case 'json':
        return JSON.stringify({
          frames: packed.rects.reduce((acc, rect) => {
            acc[rect.name] = {
              frame: { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
              rotated: false,
              trimmed: false,
              spriteSourceSize: { x: 0, y: 0, w: rect.width, h: rect.height },
              sourceSize: { w: rect.width, h: rect.height }
            };
            return acc;
          }, {}),
          meta: {
            app: 'Procedural Sprite Factory',
            version: '1.0',
            image: 'atlas.png',
            format: 'RGBA8888',
            size: { w: packed.canvas.width, h: packed.canvas.height },
            scale: '1'
          }
        }, null, 2);

      case 'xml':
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<TextureAtlas>\n';
        packed.rects.forEach(rect => {
          xml += `  <SubTexture name="${rect.name}" x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}"/>\n`;
        });
        xml += '</TextureAtlas>';
        return xml;

      case 'txt':
        let txt = '';
        packed.rects.forEach(rect => {
          txt += `${rect.name} ${rect.x} ${rect.y} ${rect.width} ${rect.height}\n`;
        });
        return txt;

      default:
        return this.generateAtlasMetadata(packed, 'json');
    }
  }

  /**
   * Format animation in requested format
   */
  static formatAnimation(animation, format) {
    switch (format) {
      case 'json':
        return JSON.stringify(animation, null, 2);

      case 'spine':
        // Spine JSON format
        return JSON.stringify({
          skeleton: { hash: 'procedural', spine: '4.0', width: 0, height: 0 },
          bones: [{ name: 'root' }],
          animations: {
            default: {
              slots: {
                sprite: {
                  attachment: animation.frames.map(f => ({
                    time: f.index * f.duration / 1000,
                    name: f.sprite.name
                  }))
                }
              }
            }
          }
        }, null, 2);

      default:
        return this.formatAnimation(animation, 'json');
    }
  }

  /**
   * Get next power of two
   */
  static nextPowerOfTwo(n) {
    return Math.pow(2, Math.ceil(Math.log2(n)));
  }

  /**
   * Export for specific game engine
   */
  static exportForEngine(sprites, engine, params = {}) {
    switch (engine) {
      case 'phaser':
        return this.exportForPhaser(sprites, params);
      case 'godot':
        return this.exportForGodot(sprites, params);
      case 'unity':
        return this.exportForUnity(sprites, params);
      case 'unreal':
        return this.exportForUnreal(sprites, params);
      default:
        return this.exportAtlas(sprites, params);
    }
  }

  /**
   * Export optimized for Phaser
   */
  static exportForPhaser(sprites, params) {
    const atlas = this.exportAtlas(sprites, { ...params, metadataFormat: 'json' });
    
    return {
      image: atlas.image,
      json: JSON.parse(atlas.metadata),
      loader: `
// Phaser 3 loader code
this.load.atlas('sprites', 'atlas.png', 'atlas.json');
      `.trim()
    };
  }

  /**
   * Export optimized for Godot
   */
  static exportForGodot(sprites, params) {
    const atlas = this.exportAtlas(sprites, { ...params, metadataFormat: 'txt' });
    
    return {
      image: atlas.image,
      atlas: atlas.metadata,
      resource: `[remap]

importer="texture"
type="CompressedTexture2D"
path="res://.godot/imported/atlas.png"

[deps]

source_file="res://atlas.png"
dest_files=["res://.godot/imported/atlas.png"]
      `.trim()
    };
  }

  /**
   * Export optimized for Unity 2D
   */
  static exportForUnity(sprites, params) {
    const atlas = this.exportAtlas(sprites, { ...params, powerOfTwo: true });
    
    return {
      image: atlas.image,
      meta: JSON.parse(atlas.metadata)
    };
  }

  /**
   * Export optimized for Unreal Paper2D
   */
  static exportForUnreal(sprites, params) {
    const sheet = this.exportSpriteSheet(sprites, { ...params, powerOfTwo: true });
    
    return {
      image: sheet.image,
      metadata: sheet.metadata
    };
  }
}

/**
 * Max Rects Bin Packer
 * Efficient 2D bin packing algorithm
 */
class MaxRectsPacker {
  constructor(width, height, padding = 0) {
    this.width = width;
    this.height = height;
    this.padding = padding;
    this.freeRects = [{ x: 0, y: 0, width, height }];
  }

  insert(width, height) {
    width += this.padding;
    height += this.padding;

    let bestRect = null;
    let bestShortSideFit = Infinity;

    for (const freeRect of this.freeRects) {
      if (freeRect.width >= width && freeRect.height >= height) {
        const leftoverHoriz = freeRect.width - width;
        const leftoverVert = freeRect.height - height;
        const shortSideFit = Math.min(leftoverHoriz, leftoverVert);

        if (shortSideFit < bestShortSideFit) {
          bestRect = { ...freeRect, width, height };
          bestShortSideFit = shortSideFit;
        }
      }
    }

    if (!bestRect) return null;

    // Split free rectangles
    this.splitFreeRects(bestRect);

    return { x: bestRect.x, y: bestRect.y, width, height };
  }

  splitFreeRects(usedRect) {
    const newFreeRects = [];

    for (const freeRect of this.freeRects) {
      // If they intersect, split the free rect
      if (this.intersects(usedRect, freeRect)) {
        // Split into up to 4 new rects
        if (freeRect.x < usedRect.x && usedRect.x < freeRect.x + freeRect.width) {
          newFreeRects.push({
            x: freeRect.x,
            y: freeRect.y,
            width: usedRect.x - freeRect.x,
            height: freeRect.height
          });
        }
        
        if (usedRect.x + usedRect.width < freeRect.x + freeRect.width) {
          newFreeRects.push({
            x: usedRect.x + usedRect.width,
            y: freeRect.y,
            width: freeRect.x + freeRect.width - (usedRect.x + usedRect.width),
            height: freeRect.height
          });
        }
        
        if (freeRect.y < usedRect.y && usedRect.y < freeRect.y + freeRect.height) {
          newFreeRects.push({
            x: freeRect.x,
            y: freeRect.y,
            width: freeRect.width,
            height: usedRect.y - freeRect.y
          });
        }
        
        if (usedRect.y + usedRect.height < freeRect.y + freeRect.height) {
          newFreeRects.push({
            x: freeRect.x,
            y: usedRect.y + usedRect.height,
            width: freeRect.width,
            height: freeRect.y + freeRect.height - (usedRect.y + usedRect.height)
          });
        }
      } else {
        newFreeRects.push(freeRect);
      }
    }

    this.freeRects = newFreeRects;
  }

  intersects(a, b) {
    return !(a.x >= b.x + b.width ||
             a.x + a.width <= b.x ||
             a.y >= b.y + b.height ||
             a.y + a.height <= b.y);
  }
}

module.exports = SpriteSheetExporter;
