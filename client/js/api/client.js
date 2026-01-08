/**
 * API Client for Sprite Factory
 */
const API = {
  baseURL: '/api',

  /**
   * Generate a sprite
   */
  async generate(dna) {
    const response = await fetch(`${this.baseURL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dna)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Generation failed');
    }

    return await response.json();
  },

  /**
   * Generate batch of sprites
   */
  async generateBatch(count, template) {
    const response = await fetch(`${this.baseURL}/generate/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ count, template })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Batch generation failed');
    }

    return await response.json();
  },

  /**
   * Export PNG
   */
  async exportPNG(id) {
    window.open(`${this.baseURL}/export/png/${id}`, '_blank');
  },

  /**
   * Get metadata
   */
  async getMetadata(id) {
    const response = await fetch(`${this.baseURL}/export/metadata`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get metadata');
    }

    return await response.json();
  }
};
