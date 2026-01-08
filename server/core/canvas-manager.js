const { createCanvas, Image } = require('canvas');

/**
 * Canvas Manager
 * Handles canvas creation and pixel manipulation
 */
class CanvasManager {
  constructor() {
    this.canvasPool = []; // Pool of reusable canvases for performance
  }

  /**
   * Create a new canvas
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   * @returns {Canvas} - Canvas object
   */
  createCanvas(width, height) {
    const canvas = createCanvas(width, height);
    return canvas;
  }

  /**
   * Fill canvas with color
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {string} color - Fill color
   */
  fill(ctx, color) {
    const canvas = ctx.canvas;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  /**
   * Clear canvas (transparent)
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  clear(ctx) {
    const canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /**
   * Mirror canvas horizontally
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  mirrorHorizontal(ctx) {
    const canvas = ctx.canvas;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width / 2; x++) {
        const leftIndex = (y * width + x) * 4;
        const rightIndex = (y * width + (width - 1 - x)) * 4;

        // Copy right side to left side (mirror)
        data[leftIndex] = data[rightIndex];
        data[leftIndex + 1] = data[rightIndex + 1];
        data[leftIndex + 2] = data[rightIndex + 2];
        data[leftIndex + 3] = data[rightIndex + 3];
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Get pixel color at position
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {Array} - [r, g, b, a]
   */
  getPixel(ctx, x, y) {
    const imageData = ctx.getImageData(x, y, 1, 1);
    return Array.from(imageData.data);
  }

  /**
   * Set pixel color at position
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {Array} color - [r, g, b, a]
   */
  setPixel(ctx, x, y, color) {
    const imageData = ctx.createImageData(1, 1);
    imageData.data[0] = color[0];
    imageData.data[1] = color[1];
    imageData.data[2] = color[2];
    imageData.data[3] = color[3];
    ctx.putImageData(imageData, x, y);
  }
}

module.exports = CanvasManager;
