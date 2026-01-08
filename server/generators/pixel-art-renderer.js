/**
 * Pixel Art Renderer
 * True pixel-perfect rendering with palette limitations and nearest-neighbor scaling
 */
class PixelArtRenderer {
  constructor() {
    this.paletteSize = 16;
  }

  /**
   * Apply pixel art style to canvas
   */
  applyPixelArtStyle(ctx, size) {
    // Get image data
    const imageData = ctx.getImageData(0, 0, size, size);
    
    // Apply palette reduction
    this.reduceToPalette(imageData);
    
    // Apply dithering for smooth transitions
    this.applyDithering(imageData);
    
    // Put back modified image
    ctx.putImageData(imageData, 0, 0);
    
    // Disable anti-aliasing for crisp pixels
    ctx.imageSmoothingEnabled = false;
  }

  /**
   * Render at pixel-perfect low resolution
   */
  renderPixelPerfect(sourceCanvas, targetCtx, targetSize) {
    // Disable anti-aliasing
    targetCtx.imageSmoothingEnabled = false;
    
    // Scale down to low res (64x64) then back up for pixel art effect
    const lowResSize = 64;
    const tempCanvas = this.createCanvas(lowResSize, lowResSize);
    const tempCtx = tempCanvas.getContext('2d');
    
    // Draw source at low resolution
    tempCtx.imageSmoothingEnabled = false;
    tempCtx.drawImage(sourceCanvas, 0, 0, lowResSize, lowResSize);
    
    // Apply palette reduction at low res
    const imageData = tempCtx.getImageData(0, 0, lowResSize, lowResSize);
    this.reduceToPalette(imageData);
    tempCtx.putImageData(imageData, 0, 0);
    
    // Scale back up with nearest-neighbor
    targetCtx.imageSmoothingEnabled = false;
    targetCtx.drawImage(tempCanvas, 0, 0, targetSize, targetSize);
    
    // Add pixel-perfect outline
    this.addPixelOutline(targetCtx, targetSize);
  }

  /**
   * Reduce colors to limited palette
   */
  reduceToPalette(imageData) {
    const data = imageData.data;
    const paletteStep = Math.floor(256 / this.paletteSize);
    
    for (let i = 0; i < data.length; i += 4) {
      // Skip fully transparent pixels
      if (data[i + 3] === 0) continue;
      
      // Reduce each color channel to palette
      data[i] = Math.round(data[i] / paletteStep) * paletteStep;
      data[i + 1] = Math.round(data[i + 1] / paletteStep) * paletteStep;
      data[i + 2] = Math.round(data[i + 2] / paletteStep) * paletteStep;
    }
  }

  /**
   * Apply dithering pattern for gradients
   */
  applyDithering(imageData) {
    const data = imageData.data;
    const width = imageData.width;
    
    // Floyd-Steinberg dithering pattern
    for (let y = 0; y < imageData.height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        
        // Skip transparent pixels
        if (data[i + 3] === 0) continue;
        
        // Calculate error for each channel
        for (let c = 0; c < 3; c++) {
          const oldValue = data[i + c];
          const newValue = Math.round(oldValue / 32) * 32;
          const error = oldValue - newValue;
          
          data[i + c] = newValue;
          
          // Distribute error to neighboring pixels
          if (x + 1 < width) {
            data[i + 4 + c] += error * 7 / 16;
          }
          if (y + 1 < imageData.height) {
            if (x > 0) {
              data[i + (width - 1) * 4 + c] += error * 3 / 16;
            }
            data[i + width * 4 + c] += error * 5 / 16;
            if (x + 1 < width) {
              data[i + (width + 1) * 4 + c] += error * 1 / 16;
            }
          }
        }
      }
    }
  }

  /**
   * Add pixel-perfect outline
   */
  addPixelOutline(ctx, size) {
    const imageData = ctx.getImageData(0, 0, size, size);
    const data = imageData.data;
    const width = size;
    const outlined = ctx.createImageData(width, size);
    
    // Copy original
    outlined.data.set(data);
    
    // Add outline where transparent meets opaque
    for (let y = 1; y < size - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = (y * width + x) * 4;
        
        // If pixel is opaque
        if (data[i + 3] > 128) {
          // Check neighbors for transparency
          const neighbors = [
            (y - 1) * width + x,
            (y + 1) * width + x,
            y * width + (x - 1),
            y * width + (x + 1)
          ];
          
          for (const ni of neighbors) {
            if (data[ni * 4 + 3] < 128) {
              // Draw outline
              outlined.data[i] = 0;
              outlined.data[i + 1] = 0;
              outlined.data[i + 2] = 0;
              outlined.data[i + 3] = 255;
              break;
            }
          }
        }
      }
    }
    
    ctx.putImageData(outlined, 0, 0);
  }

  /**
   * Create canvas helper
   */
  createCanvas(width, height) {
    // Use node-canvas in Node.js environment
    if (typeof require !== 'undefined') {
      const { createCanvas } = require('canvas');
      return createCanvas(width, height);
    }
    // Use browser canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  /**
   * Generate pixel art palette from base colors
   */
  generatePixelPalette(colors, paletteSize = 16) {
    const palette = [];
    
    // Add base colors
    Object.values(colors).forEach(color => {
      if (color) palette.push(color);
    });
    
    // Generate shades and tints
    const baseColor = colors.primary || '#FFFFFF';
    for (let i = 0; i < paletteSize; i++) {
      const brightness = i / paletteSize;
      palette.push(this.adjustBrightness(baseColor, brightness));
    }
    
    return palette.slice(0, paletteSize);
  }

  /**
   * Adjust brightness helper
   */
  adjustBrightness(color, brightness) {
    const hex = color.replace('#', '');
    const r = Math.floor(parseInt(hex.substr(0, 2), 16) * brightness);
    const g = Math.floor(parseInt(hex.substr(2, 2), 16) * brightness);
    const b = Math.floor(parseInt(hex.substr(4, 2), 16) * brightness);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
}

module.exports = PixelArtRenderer;
