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
  },

  /**
   * Generate random DNA
   */
  async generateDNA(species, options = {}) {
    const response = await fetch(`${this.baseURL}/dna/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ species, options })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate DNA');
    }

    return await response.json();
  },

  /**
   * Mutate DNA
   */
  async mutateDNA(dna, mutationRate = 0.3) {
    const response = await fetch(`${this.baseURL}/dna/mutate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dna, mutationRate })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to mutate DNA');
    }

    return await response.json();
  },

  /**
   * Breed two DNAs
   */
  async breedDNA(parent1, parent2) {
    const response = await fetch(`${this.baseURL}/dna/breed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ parent1, parent2 })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to breed DNA');
    }

    return await response.json();
  },

  /**
   * Serialize DNA
   */
  async serializeDNA(dna) {
    const response = await fetch(`${this.baseURL}/dna/serialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dna })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to serialize DNA');
    }

    return await response.json();
  },

  /**
   * Deserialize DNA
   */
  async deserializeDNA(dnaString) {
    const response = await fetch(`${this.baseURL}/dna/deserialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dnaString })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to deserialize DNA');
    }

    return await response.json();
  }
};
