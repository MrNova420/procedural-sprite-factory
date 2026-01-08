/**
 * Main Application Controller
 */

// State
let currentSprite = null;
let currentZoom = 2;
let savedParents = [null, null]; // For breeding

// DOM Elements
const speciesSelect = document.getElementById('species');
const sizeSlider = document.getElementById('size');
const sizeValue = document.getElementById('size-value');
const styleSelect = document.getElementById('style');
const primaryColorPicker = document.getElementById('primary-color');
const generateBtn = document.getElementById('generate-btn');
const randomBtn = document.getElementById('random-btn');
const mutateBtn = document.getElementById('mutate-btn');
const canvas = document.getElementById('preview-canvas');
const ctx = canvas.getContext('2d');
const loading = document.getElementById('loading');
const stats = document.getElementById('stats');
const downloadPngBtn = document.getElementById('download-png');
const downloadMetadataBtn = document.getElementById('download-metadata');
const copyDnaBtn = document.getElementById('copy-dna');
const zoomButtons = document.querySelectorAll('[data-zoom]');

// DNA panel elements
const saveDnaBtn = document.getElementById('save-dna-btn');
const loadDnaBtn = document.getElementById('load-dna-btn');
const shareDnaBtn = document.getElementById('share-dna-btn');
const dnaInfo = document.getElementById('dna-info');
const breedBtn = document.getElementById('breed-btn');
const parent1Slot = document.getElementById('parent1-slot');
const parent2Slot = document.getElementById('parent2-slot');

// Initialize
function init() {
  // Event listeners
  sizeSlider.addEventListener('input', () => {
    sizeValue.textContent = `${sizeSlider.value}x`;
  });

  generateBtn.addEventListener('click', generateSprite);
  randomBtn.addEventListener('click', randomizeAndGenerate);
  mutateBtn.addEventListener('click', mutateSprite);
  
  downloadPngBtn.addEventListener('click', downloadPNG);
  downloadMetadataBtn.addEventListener('click', downloadMetadata);
  copyDnaBtn.addEventListener('click', copyDNA);

  // DNA panel listeners
  saveDnaBtn.addEventListener('click', saveDNAForBreeding);
  loadDnaBtn.addEventListener('click', loadDNAFromString);
  shareDnaBtn.addEventListener('click', shareDNA);
  breedBtn.addEventListener('click', breedSprites);

  zoomButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      zoomButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentZoom = parseInt(e.target.dataset.zoom);
      if (currentSprite) {
        displaySprite(currentSprite.image);
      }
    });
  });

  // Clear canvas with checkerboard pattern
  clearCanvas();
  
  console.log('🎨 Procedural Sprite Factory initialized');
}

/**
 * Get current DNA from UI
 */
function getCurrentDNA() {
  return {
    species: speciesSelect.value,
    size: parseFloat(sizeSlider.value),
    style: styleSelect.value,
    colors: {
      primary: primaryColorPicker.value
    }
  };
}

/**
 * Generate sprite
 */
async function generateSprite() {
  try {
    // Show loading
    loading.classList.remove('hidden');
    generateBtn.disabled = true;
    disableExportButtons();
    
    const dna = getCurrentDNA();
    console.log('Generating sprite:', dna);
    
    // Call API
    const result = await API.generate(dna);
    
    if (result.success) {
      currentSprite = result;
      
      // Display sprite
      displaySprite(result.image);
      
      // Update stats
      updateStats(result);
      
      // Enable export buttons
      enableExportButtons();
      
      console.log('✓ Sprite generated:', result.id);
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Generation error:', error);
    alert(`Error: ${error.message}`);
  } finally {
    loading.classList.add('hidden');
    generateBtn.disabled = false;
  }
}

/**
 * Randomize DNA and generate
 */
async function randomizeAndGenerate() {
  const species = ['dragon', 'wolf', 'goblin', 'robot', 'human'];
  const styles = ['pixel', 'dark-fantasy', 'cyberpunk', 'cute'];
  
  speciesSelect.value = species[Math.floor(Math.random() * species.length)];
  sizeSlider.value = (0.5 + Math.random() * 2.5).toFixed(1);
  sizeValue.textContent = `${sizeSlider.value}x`;
  styleSelect.value = styles[Math.floor(Math.random() * styles.length)];
  primaryColorPicker.value = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
  
  await generateSprite();
}

/**
 * Display sprite on canvas
 */
function displaySprite(imageDataUrl) {
  const img = new Image();
  img.onload = () => {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate scaled size
    const scaledWidth = img.width * currentZoom;
    const scaledHeight = img.height * currentZoom;
    
    // Center the image
    const x = (canvas.width - scaledWidth) / 2;
    const y = (canvas.height - scaledHeight) / 2;
    
    // Disable image smoothing for pixel-perfect rendering
    ctx.imageSmoothingEnabled = false;
    
    // Draw image
    ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
  };
  img.src = imageDataUrl;
}

/**
 * Clear canvas
 */
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Update statistics display
 */
function updateStats(result) {
  document.getElementById('stat-size').textContent = `${result.metadata.size[0]}x${result.metadata.size[1]}`;
  document.getElementById('stat-time').textContent = result.metadata.generationTime;
  document.getElementById('stat-species').textContent = result.dna.species;
  stats.classList.remove('hidden');
  
  // Update DNA info
  if (result.dna.meta) {
    document.getElementById('dna-id').textContent = result.dna.id.substring(0, 8) + '...';
    document.getElementById('dna-species').textContent = result.dna.species;
    document.getElementById('dna-variant').textContent = result.dna.variant || 'N/A';
    document.getElementById('dna-generation').textContent = result.dna.meta.generation || 1;
    document.getElementById('dna-rarity').textContent = result.dna.meta.rarity || 'common';
    document.getElementById('dna-name').textContent = result.dna.meta.name || 'Unnamed';
    dnaInfo.classList.remove('hidden');
  }
}

/**
 * Mutate current sprite
 */
async function mutateSprite() {
  if (!currentSprite || !currentSprite.dna) {
    alert('No sprite to mutate. Generate one first!');
    return;
  }

  try {
    loading.classList.remove('hidden');
    mutateBtn.disabled = true;
    
    console.log('Mutating sprite...');
    
    // Mutate DNA
    const mutateResult = await API.mutateDNA(currentSprite.dna, 0.3);
    
    if (mutateResult.success) {
      // Generate sprite with mutated DNA
      const result = await API.generate(mutateResult.dna);
      
      if (result.success) {
        currentSprite = result;
        displaySprite(result.image);
        updateStats(result);
        enableExportButtons();
        console.log('✓ Sprite mutated');
      }
    }
  } catch (error) {
    console.error('Mutation error:', error);
    alert(`Error: ${error.message}`);
  } finally {
    loading.classList.add('hidden');
    mutateBtn.disabled = false;
  }
}

/**
 * Save DNA for breeding
 */
function saveDNAForBreeding() {
  if (!currentSprite || !currentSprite.dna) {
    alert('No sprite to save. Generate one first!');
    return;
  }

  // Find empty slot
  if (savedParents[0] === null) {
    savedParents[0] = currentSprite.dna;
    parent1Slot.innerHTML = `<span><strong>Parent 1:</strong> ${currentSprite.dna.meta.name}</span>`;
    parent1Slot.classList.add('filled');
  } else if (savedParents[1] === null) {
    savedParents[1] = currentSprite.dna;
    parent2Slot.innerHTML = `<span><strong>Parent 2:</strong> ${currentSprite.dna.meta.name}</span>`;
    parent2Slot.classList.add('filled');
  } else {
    // Both slots full, replace first
    savedParents[0] = currentSprite.dna;
    parent1Slot.innerHTML = `<span><strong>Parent 1:</strong> ${currentSprite.dna.meta.name}</span>`;
  }

  // Enable breed button if both parents set
  if (savedParents[0] && savedParents[1]) {
    breedBtn.disabled = false;
  }

  alert('DNA saved to breeding slot!');
}

/**
 * Breed two sprites
 */
async function breedSprites() {
  if (!savedParents[0] || !savedParents[1]) {
    alert('Need two parents to breed. Save two sprites first!');
    return;
  }

  try {
    loading.classList.remove('hidden');
    breedBtn.disabled = true;
    
    console.log('Breeding sprites...');
    
    // Breed DNA
    const breedResult = await API.breedDNA(savedParents[0], savedParents[1]);
    
    if (breedResult.success) {
      // Generate sprite with child DNA
      const result = await API.generate(breedResult.dna);
      
      if (result.success) {
        currentSprite = result;
        displaySprite(result.image);
        updateStats(result);
        enableExportButtons();
        console.log('✓ Offspring created:', result.dna.meta.name);
        alert(`Offspring created: ${result.dna.meta.name}!`);
      }
    }
  } catch (error) {
    console.error('Breeding error:', error);
    alert(`Error: ${error.message}`);
  } finally {
    loading.classList.add('hidden');
    breedBtn.disabled = false;
  }
}

/**
 * Load DNA from string
 */
async function loadDNAFromString() {
  const dnaString = prompt('Enter DNA string:');
  
  if (!dnaString) return;

  try {
    loading.classList.remove('hidden');
    
    // Deserialize DNA
    const deserializeResult = await API.deserializeDNA(dnaString);
    
    if (deserializeResult.success) {
      // Generate sprite with loaded DNA
      const result = await API.generate(deserializeResult.dna);
      
      if (result.success) {
        currentSprite = result;
        displaySprite(result.image);
        updateStats(result);
        enableExportButtons();
        console.log('✓ DNA loaded');
      }
    }
  } catch (error) {
    console.error('DNA loading error:', error);
    alert(`Error: ${error.message}`);
  } finally {
    loading.classList.add('hidden');
  }
}

/**
 * Share DNA as link
 */
async function shareDNA() {
  if (!currentSprite || !currentSprite.dna) {
    alert('No sprite to share. Generate one first!');
    return;
  }

  try {
    // Serialize DNA
    const serializeResult = await API.serializeDNA(currentSprite.dna);
    
    if (serializeResult.success) {
      const dnaString = serializeResult.dnaString;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(dnaString);
      
      // Visual feedback
      const originalText = shareDnaBtn.textContent;
      shareDnaBtn.textContent = '✓ Copied!';
      setTimeout(() => {
        shareDnaBtn.textContent = originalText;
      }, 2000);
      
      alert('DNA string copied to clipboard! Share it with others.');
    }
  } catch (error) {
    console.error('Share error:', error);
    alert(`Error: ${error.message}`);
  }
}

/**
 * Enable export buttons
 */
function enableExportButtons() {
  downloadPngBtn.disabled = false;
  downloadMetadataBtn.disabled = false;
  copyDnaBtn.disabled = false;
  mutateBtn.disabled = false;
  saveDnaBtn.disabled = false;
  shareDnaBtn.disabled = false;
}

/**
 * Disable export buttons
 */
function disableExportButtons() {
  downloadPngBtn.disabled = true;
  downloadMetadataBtn.disabled = true;
  copyDnaBtn.disabled = true;
  mutateBtn.disabled = true;
  saveDnaBtn.disabled = true;
  shareDnaBtn.disabled = true;
}

/**
 * Download PNG
 */
async function downloadPNG() {
  if (!currentSprite) return;
  
  try {
    await API.exportPNG(currentSprite.id);
  } catch (error) {
    console.error('Export error:', error);
    alert(`Error: ${error.message}`);
  }
}

/**
 * Download metadata
 */
async function downloadMetadata() {
  if (!currentSprite) return;
  
  try {
    const result = await API.getMetadata(currentSprite.id);
    
    if (result.success) {
      const dataStr = JSON.stringify(result.metadata, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportName = `sprite-${currentSprite.id}-metadata.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportName);
      linkElement.click();
    }
  } catch (error) {
    console.error('Metadata export error:', error);
    alert(`Error: ${error.message}`);
  }
}

/**
 * Copy DNA to clipboard
 */
async function copyDNA() {
  if (!currentSprite) return;
  
  try {
    const dnaString = JSON.stringify(currentSprite.dna, null, 2);
    await navigator.clipboard.writeText(dnaString);
    
    // Visual feedback
    const originalText = copyDnaBtn.textContent;
    copyDnaBtn.textContent = '✓ Copied!';
    setTimeout(() => {
      copyDnaBtn.textContent = originalText;
    }, 2000);
  } catch (error) {
    console.error('Copy error:', error);
    alert(`Error: ${error.message}`);
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
