/**
 * Gallery System for Sprite Factory
 * Manages saved sprites in localStorage
 */

class Gallery {
  constructor() {
    this.storageKey = 'sprite-factory-gallery';
    this.maxSprites = 100;
  }

  /**
   * Save a sprite to the gallery
   */
  save(sprite) {
    const gallery = this.getAll();
    
    // Add timestamp if not present
    if (!sprite.savedAt) {
      sprite.savedAt = Date.now();
    }
    
    // Remove oldest if at capacity
    if (gallery.length >= this.maxSprites) {
      gallery.sort((a, b) => a.savedAt - b.savedAt);
      gallery.shift();
    }
    
    // Add to gallery
    gallery.push(sprite);
    
    // Save to localStorage
    this.saveAll(gallery);
    
    return true;
  }

  /**
   * Get all sprites from gallery
   */
  getAll() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Gallery load error:', error);
      return [];
    }
  }

  /**
   * Save all sprites to localStorage
   */
  saveAll(gallery) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(gallery));
      return true;
    } catch (error) {
      console.error('Gallery save error:', error);
      return false;
    }
  }

  /**
   * Get sprite by ID
   */
  getById(id) {
    const gallery = this.getAll();
    return gallery.find(sprite => sprite.id === id);
  }

  /**
   * Delete sprite by ID
   */
  delete(id) {
    let gallery = this.getAll();
    gallery = gallery.filter(sprite => sprite.id !== id);
    this.saveAll(gallery);
    return true;
  }

  /**
   * Clear entire gallery
   */
  clear() {
    localStorage.removeItem(this.storageKey);
    return true;
  }

  /**
   * Get sprites by species
   */
  getBySpecies(species) {
    const gallery = this.getAll();
    return gallery.filter(sprite => sprite.dna.species === species);
  }

  /**
   * Get recent sprites
   */
  getRecent(count = 10) {
    const gallery = this.getAll();
    return gallery
      .sort((a, b) => b.savedAt - a.savedAt)
      .slice(0, count);
  }

  /**
   * Export gallery as JSON
   */
  exportJSON() {
    const gallery = this.getAll();
    const dataStr = JSON.stringify(gallery, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportName = `sprite-gallery-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportName);
    linkElement.click();
  }

  /**
   * Import gallery from JSON
   */
  importJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          if (Array.isArray(imported)) {
            // Merge with existing gallery
            const existing = this.getAll();
            const merged = [...existing, ...imported];
            
            // Remove duplicates by ID
            const unique = merged.filter((sprite, index, self) =>
              index === self.findIndex((s) => s.id === sprite.id)
            );
            
            // Keep only most recent if over limit
            if (unique.length > this.maxSprites) {
              unique.sort((a, b) => b.savedAt - a.savedAt);
              unique.splice(this.maxSprites);
            }
            
            this.saveAll(unique);
            resolve(unique.length);
          } else {
            reject(new Error('Invalid gallery format'));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('File read error'));
      reader.readAsText(file);
    });
  }
}

// Create global instance
window.SpriteGallery = new Gallery();
