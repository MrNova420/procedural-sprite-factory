/**
 * Main Application Controller
 */

// Global error and log tracking
window.APP_LOGS = [];
window.APP_ERRORS = [];

// Enhanced console logging
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

console.log = function(...args) {
  window.APP_LOGS.push({ time: new Date().toISOString(), type: 'log', args });
  originalLog.apply(console, args);
};

console.error = function(...args) {
  window.APP_ERRORS.push({ time: new Date().toISOString(), type: 'error', args });
  originalError.apply(console, args);
  
  // Check for placeholders and TODOs
  const argsStr = JSON.stringify(args);
  if (argsStr.includes('PLACEHOLDER') || argsStr.includes('TODO') || argsStr.includes('FIXME')) {
    originalError.call(console, '⚠️  PLACEHOLDER/TODO/FIXME DETECTED!', args);
  }
};

console.warn = function(...args) {
  window.APP_LOGS.push({ time: new Date().toISOString(), type: 'warn', args });
  originalWarn.apply(console, args);
};

// Catch all uncaught errors
window.addEventListener('error', (event) => {
  console.error('🚨 UNCAUGHT ERROR:', event.error);
  window.APP_ERRORS.push({ 
    time: new Date().toISOString(), 
    type: 'uncaught', 
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});

// Catch unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 UNHANDLED PROMISE REJECTION:', event.reason);
  window.APP_ERRORS.push({ 
    time: new Date().toISOString(), 
    type: 'promise-rejection', 
    reason: event.reason
  });
});

console.log('🔍 Comprehensive logging enabled. Check window.APP_LOGS and window.APP_ERRORS');

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
  // Tab switching functionality
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.dataset.tab;
      
      // Remove active class from all tabs and panels
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanels.forEach(panel => panel.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding panel
      button.classList.add('active');
      document.getElementById(`${targetTab}-tab`).classList.add('active');
    });
  });
  
  // Basic Generator event listeners
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
      
      // Save to gallery automatically
      if (window.SpriteGallery) {
        window.SpriteGallery.save(currentSprite);
        updateGallery();
      }
      
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

/**
 * TEXT TO ASSET FUNCTIONALITY
 */

// Text to Asset elements
const textPrompt = document.getElementById('text-prompt');
const generateFromTextBtn = document.getElementById('generate-from-text-btn');
const generateVariationsBtn = document.getElementById('generate-variations-btn');
const textToAssetCanvas = document.getElementById('text-to-asset-canvas');
const textToAssetLoading = document.getElementById('text-to-asset-loading');
const textToAssetInfo = document.getElementById('text-to-asset-info');
const downloadTextAsset = document.getElementById('download-text-asset');
const variationsGrid = document.getElementById('variations-grid');
const exampleButtons = document.querySelectorAll('.btn-example');

let currentTextAsset = null;

// Example button handlers
exampleButtons.forEach(button => {
  button.addEventListener('click', () => {
    textPrompt.value = button.dataset.prompt;
  });
});

// Generate from text handler
if (generateFromTextBtn) {
  generateFromTextBtn.addEventListener('click', generateFromText);
}

// Generate variations handler
if (generateVariationsBtn) {
  generateVariationsBtn.addEventListener('click', generateVariations);
}

async function generateFromText() {
  const prompt = textPrompt.value.trim();
  
  if (!prompt) {
    alert('Please enter a description');
    return;
  }
  
  try {
    textToAssetLoading.classList.remove('hidden');
    generateFromTextBtn.disabled = true;
    downloadTextAsset.disabled = true;
    
    console.log('Generating from text:', prompt);
    
    // Call text-to-asset API
    const response = await fetch('/api/universal/from-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });
    
    const result = await response.json();
    
    if (result.success) {
      currentTextAsset = result;
      
      // Display generated image
      const img = new Image();
      img.onload = () => {
        const ctx = textToAssetCanvas.getContext('2d');
        ctx.clearRect(0, 0, textToAssetCanvas.width, textToAssetCanvas.height);
        
        // Center and scale image
        const scale = Math.min(
          textToAssetCanvas.width / img.width,
          textToAssetCanvas.height / img.height
        ) * 0.8;
        
        const x = (textToAssetCanvas.width - img.width * scale) / 2;
        const y = (textToAssetCanvas.height - img.height * scale) / 2;
        
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      };
      img.src = result.image;
      
      // Update info panel
      textToAssetInfo.classList.remove('hidden');
      document.getElementById('interpreted-prompt').textContent = prompt;
      document.getElementById('interpreted-species').textContent = result.parsedData?.species || 'auto-detected';
      document.getElementById('interpreted-style').textContent = result.parsedData?.style || 'auto-detected';
      
      downloadTextAsset.disabled = false;
      
      console.log('✓ Asset generated from text');
    } else {
      throw new Error(result.error || 'Generation failed');
    }
  } catch (error) {
    console.error('Text-to-asset error:', error);
    alert(`Error: ${error.message}`);
  } finally {
    textToAssetLoading.classList.add('hidden');
    generateFromTextBtn.disabled = false;
  }
}

// Generate variations function
async function generateVariations() {
  const prompt = textPrompt.value.trim();
  
  if (!prompt) {
    alert('Please enter a description');
    return;
  }
  
  try {
    textToAssetLoading.classList.remove('hidden');
    generateVariationsBtn.disabled = true;
    variationsGrid.style.display = 'none';
    variationsGrid.innerHTML = '';
    
    console.log('Generating 5 variations for:', prompt);
    
    // Call variations API
    const response = await fetch('/api/universal/variations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        prompt,
        count: 5 
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Display variations in grid
      variationsGrid.style.display = 'grid';
      
      result.variations.forEach((variation, index) => {
        const item = document.createElement('div');
        item.className = 'variation-item';
        
        const img = document.createElement('img');
        img.src = variation.image;
        img.alt = `Variation ${index + 1}`;
        
        const label = document.createElement('div');
        label.className = 'variation-label';
        label.textContent = `Variant ${index + 1}`;
        
        item.appendChild(img);
        item.appendChild(label);
        
        // Click to select and display on main canvas
        item.addEventListener('click', () => {
          currentTextAsset = variation;
          
          const mainImg = new Image();
          mainImg.onload = () => {
            const ctx = textToAssetCanvas.getContext('2d');
            ctx.clearRect(0, 0, textToAssetCanvas.width, textToAssetCanvas.height);
            
            const scale = Math.min(
              textToAssetCanvas.width / mainImg.width,
              textToAssetCanvas.height / mainImg.height
            ) * 0.8;
            
            const x = (textToAssetCanvas.width - mainImg.width * scale) / 2;
            const y = (textToAssetCanvas.height - mainImg.height * scale) / 2;
            
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(mainImg, x, y, mainImg.width * scale, mainImg.height * scale);
          };
          mainImg.src = variation.image;
          
          // Highlight selected
          document.querySelectorAll('.variation-item').forEach(v => v.style.borderColor = '');
          item.style.borderColor = 'var(--primary-color)';
          
          downloadTextAsset.disabled = false;
          textToAssetInfo.classList.remove('hidden');
        });
        
        variationsGrid.appendChild(item);
      });
      
      console.log('✓ Generated 5 variations');
    } else {
      throw new Error(result.error || 'Variation generation failed');
    }
  } catch (error) {
    console.error('Variation generation error:', error);
    alert(`Error: ${error.message}`);
  } finally {
    textToAssetLoading.classList.add('hidden');
    generateVariationsBtn.disabled = false;
  }
}

// Download text asset
if (downloadTextAsset) {
  downloadTextAsset.addEventListener('click', () => {
    if (!currentTextAsset) return;
    
    // Create download link
    const link = document.createElement('a');
    link.href = currentTextAsset.image;
    link.download = `text-asset-${Date.now()}.png`;
    link.click();
  });
}

/**
 * ANIMATION TAB
 */
const generateAnimationBtn = document.getElementById('generate-animation-btn');
const animationTypeSelect = document.getElementById('animation-type');
const frameCountSlider = document.getElementById('frame-count');
const frameCountValue = document.getElementById('frame-count-value');
const animationPreview = document.getElementById('animation-preview');
const animationCanvas = document.getElementById('animation-canvas');
const playAnimationBtn = document.getElementById('play-animation-btn');
const pauseAnimationBtn = document.getElementById('pause-animation-btn');
const animationFpsInput = document.getElementById('animation-fps');

let currentAnimation = null;
let animationFrames = [];
let animationInterval = null;
let currentFrame = 0;

if (frameCountSlider) {
  frameCountSlider.addEventListener('input', () => {
    frameCountValue.textContent = frameCountSlider.value;
  });
}

if (generateAnimationBtn) {
  generateAnimationBtn.addEventListener('click', async () => {
    try {
      generateAnimationBtn.disabled = true;
      
      const animationType = animationTypeSelect.value;
      const frameCount = parseInt(frameCountSlider.value);
      const dna = getCurrentDNA();
      
      console.log('Generating animation:', animationType, frameCount);
      
      const response = await fetch('/api/animations/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dna, animationType, frameCount })
      });
      
      const result = await response.json();
      
      if (result.success) {
        currentAnimation = result;
        animationFrames = result.frames;
        animationPreview.classList.remove('hidden');
        
        // Display first frame
        displayAnimationFrame(0);
        
        console.log('✓ Animation generated:', frameCount, 'frames');
      } else {
        throw new Error(result.error || 'Animation generation failed');
      }
    } catch (error) {
      console.error('Animation error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      generateAnimationBtn.disabled = false;
    }
  });
}

function displayAnimationFrame(frameIndex) {
  if (!animationFrames[frameIndex]) return;
  
  const ctx = animationCanvas.getContext('2d');
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, animationCanvas.width, animationCanvas.height);
    ctx.imageSmoothingEnabled = false;
    
    const scale = Math.min(animationCanvas.width / img.width, animationCanvas.height / img.height) * 0.8;
    const x = (animationCanvas.width - img.width * scale) / 2;
    const y = (animationCanvas.height - img.height * scale) / 2;
    
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  };
  img.src = animationFrames[frameIndex].image;
}

if (playAnimationBtn) {
  playAnimationBtn.addEventListener('click', () => {
    if (!animationFrames.length) return;
    
    if (animationInterval) {
      clearInterval(animationInterval);
    }
    
    const fps = parseInt(animationFpsInput.value) || 12;
    const frameDelay = 1000 / fps;
    
    animationInterval = setInterval(() => {
      displayAnimationFrame(currentFrame);
      currentFrame = (currentFrame + 1) % animationFrames.length;
    }, frameDelay);
    
    playAnimationBtn.disabled = true;
    pauseAnimationBtn.disabled = false;
  });
}

if (pauseAnimationBtn) {
  pauseAnimationBtn.addEventListener('click', () => {
    if (animationInterval) {
      clearInterval(animationInterval);
      animationInterval = null;
    }
    
    playAnimationBtn.disabled = false;
    pauseAnimationBtn.disabled = true;
  });
}

/**
 * PARTICLE EFFECTS TAB
 */
const generateParticlesBtn = document.getElementById('generate-particles-btn');
const particleTypeSelect = document.getElementById('particle-type');
const particleCountSlider = document.getElementById('particle-count');
const particleCountValue = document.getElementById('particle-count-value');
const particleCanvas = document.getElementById('particle-canvas');

let currentParticles = null;

if (particleCountSlider) {
  particleCountSlider.addEventListener('input', () => {
    particleCountValue.textContent = particleCountSlider.value;
  });
}

if (generateParticlesBtn) {
  generateParticlesBtn.addEventListener('click', async () => {
    try {
      generateParticlesBtn.disabled = true;
      
      const effectType = particleTypeSelect.value;
      const particleCount = parseInt(particleCountSlider.value);
      
      console.log('Generating particles:', effectType, particleCount);
      
      const response = await fetch('/api/effects/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ effectType, particleCount, duration: 60 })
      });
      
      const result = await response.json();
      
      if (result.success) {
        currentParticles = result;
        
        // Display particle effect
        const ctx = particleCanvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
          ctx.imageSmoothingEnabled = false;
          
          const scale = Math.min(particleCanvas.width / img.width, particleCanvas.height / img.height);
          const x = (particleCanvas.width - img.width * scale) / 2;
          const y = (particleCanvas.height - img.height * scale) / 2;
          
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        };
        img.src = result.image;
        
        console.log('✓ Particle effect generated');
      } else {
        throw new Error(result.error || 'Particle generation failed');
      }
    } catch (error) {
      console.error('Particle error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      generateParticlesBtn.disabled = false;
    }
  });
}

/**
 * WORLD GENERATOR TAB
 */
const generateWorldBtn = document.getElementById('generate-world-btn');
const worldSizeSelect = document.getElementById('world-size');
const biomeTypeSelect = document.getElementById('biome-type');
const worldCanvas = document.getElementById('world-canvas');

let currentWorld = null;

if (generateWorldBtn) {
  generateWorldBtn.addEventListener('click', async () => {
    try {
      generateWorldBtn.disabled = true;
      
      const sizeMap = { small: 16, medium: 32, large: 64 };
      const size = sizeMap[worldSizeSelect.value] || 32;
      const biome = biomeTypeSelect.value;
      
      console.log('Generating world:', size, biome);
      
      const response = await fetch('/api/world/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ width: size, height: size, biome })
      });
      
      const result = await response.json();
      
      if (result.success) {
        currentWorld = result;
        
        // Display world
        const ctx = worldCanvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, worldCanvas.width, worldCanvas.height);
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(img, 0, 0, worldCanvas.width, worldCanvas.height);
        };
        img.src = result.image;
        
        console.log('✓ World generated:', size + 'x' + size);
      } else {
        throw new Error(result.error || 'World generation failed');
      }
    } catch (error) {
      console.error('World error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      generateWorldBtn.disabled = false;
    }
  });
}

/**
 * ITEMS TAB
 */
const generateItemBtn = document.getElementById('generate-item-btn');
const itemCategorySelect = document.getElementById('item-category');
const itemRaritySelect = document.getElementById('item-rarity');
const itemCanvas = document.getElementById('item-canvas');
const itemStats = document.getElementById('item-stats');

let currentItem = null;

if (generateItemBtn) {
  generateItemBtn.addEventListener('click', async () => {
    try {
      generateItemBtn.disabled = true;
      
      const category = itemCategorySelect.value;
      const rarity = itemRaritySelect.value;
      
      console.log('Generating item:', category, rarity);
      
      const response = await fetch('/api/items/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, rarity })
      });
      
      const result = await response.json();
      
      if (result.success) {
        currentItem = result;
        
        // Display item
        const ctx = itemCanvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, itemCanvas.width, itemCanvas.height);
          ctx.imageSmoothingEnabled = false;
          
          const scale = Math.min(itemCanvas.width / img.width, itemCanvas.height / img.height) * 0.8;
          const x = (itemCanvas.width - img.width * scale) / 2;
          const y = (itemCanvas.height - img.height * scale) / 2;
          
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        };
        img.src = result.image;
        
        // Show stats
        itemStats.classList.remove('hidden');
        document.getElementById('item-name').textContent = result.item.name;
        document.getElementById('item-type').textContent = category;
        document.getElementById('item-rarity-display').textContent = rarity;
        
        console.log('✓ Item generated:', result.item.name);
      } else {
        throw new Error(result.error || 'Item generation failed');
      }
    } catch (error) {
      console.error('Item error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      generateItemBtn.disabled = false;
    }
  });
}

/**
 * UI ELEMENTS TAB
 */
const generateUIBtn = document.getElementById('generate-ui-btn');
const uiElementTypeSelect = document.getElementById('ui-element-type');
const uiStyleSelect = document.getElementById('ui-style');
const uiCanvas = document.getElementById('ui-canvas');

let currentUIElement = null;

if (generateUIBtn) {
  generateUIBtn.addEventListener('click', async () => {
    try {
      generateUIBtn.disabled = true;
      
      const elementType = uiElementTypeSelect.value;
      const style = uiStyleSelect.value;
      
      console.log('Generating UI element:', elementType, style);
      
      const response = await fetch('/api/ui/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ elementType, style })
      });
      
      const result = await response.json();
      
      if (result.success) {
        currentUIElement = result;
        
        // Display UI element
        const ctx = uiCanvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
          ctx.imageSmoothingEnabled = false;
          
          const scale = Math.min(uiCanvas.width / img.width, uiCanvas.height / img.height) * 0.8;
          const x = (uiCanvas.width - img.width * scale) / 2;
          const y = (uiCanvas.height - img.height * scale) / 2;
          
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        };
        img.src = result.image;
        
        console.log('✓ UI element generated');
      } else {
        throw new Error(result.error || 'UI generation failed');
      }
    } catch (error) {
      console.error('UI element error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      generateUIBtn.disabled = false;
    }
  });
}

/**
 * BATCH GENERATOR TAB
 */
const generateBatchBtn = document.getElementById('generate-batch-btn');
const batchCountSlider = document.getElementById('batch-count');
const batchCountValue = document.getElementById('batch-count-value');
const batchProgress = document.getElementById('batch-progress');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const batchResults = document.getElementById('batch-results');
const downloadBatchBtn = document.getElementById('download-batch-btn');

if (batchCountSlider) {
  batchCountSlider.addEventListener('input', () => {
    batchCountValue.textContent = batchCountSlider.value;
  });
}

if (generateBatchBtn) {
  generateBatchBtn.addEventListener('click', async () => {
    const count = parseInt(document.getElementById('batch-count').value);
    const speciesMix = document.getElementById('batch-species').value;
    
    batchProgress.classList.remove('hidden');
    batchResults.innerHTML = '';
    generateBatchBtn.disabled = true;
    downloadBatchBtn.disabled = true;
    
    const species = speciesMix === 'random' 
      ? ['dragon', 'wolf', 'goblin', 'robot', 'human']
      : [speciesMix];
    
    for (let i = 0; i < count; i++) {
      try {
        const selectedSpecies = species[Math.floor(Math.random() * species.length)];
        const dna = {
          species: selectedSpecies,
          size: 1.0,
          style: 'pixel',
          colors: {
            primary: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`
          }
        };
        
        const result = await API.generate(dna);
        
        if (result.success) {
          // Create sprite preview
          const spriteDiv = document.createElement('div');
          spriteDiv.className = 'batch-sprite';
          
          const canvas = document.createElement('canvas');
          canvas.width = 64;
          canvas.height = 64;
          const ctx = canvas.getContext('2d');
          
          const img = new Image();
          img.onload = () => {
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(img, 0, 0, 64, 64);
          };
          img.src = result.image;
          
          const label = document.createElement('p');
          label.textContent = `${selectedSpecies} ${i + 1}`;
          
          spriteDiv.appendChild(canvas);
          spriteDiv.appendChild(label);
          batchResults.appendChild(spriteDiv);
        }
        
        // Update progress
        const progress = ((i + 1) / count) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `Generated ${i + 1} / ${count}`;
        
      } catch (error) {
        console.error(`Batch generation error ${i + 1}:`, error);
      }
    }
    
    progressText.textContent = `Complete! Generated ${count} sprites`;
    generateBatchBtn.disabled = false;
    downloadBatchBtn.disabled = false;
  });
}

console.log('✓ All tab handlers initialized');

/**
 * GALLERY SYSTEM
 */
const exportGalleryBtn = document.getElementById('export-gallery-btn');
const importGalleryBtn = document.getElementById('import-gallery-btn');
const clearGalleryBtn = document.getElementById('clear-gallery-btn');
const importGalleryInput = document.getElementById('import-gallery-input');
const galleryFilterSelect = document.getElementById('gallery-filter-species');
const galleryGrid = document.getElementById('gallery-grid');
const galleryCount = document.getElementById('gallery-count');

// Gallery controls
if (exportGalleryBtn) {
  exportGalleryBtn.addEventListener('click', () => {
    if (window.SpriteGallery) {
      window.SpriteGallery.exportJSON();
    }
  });
}

if (importGalleryBtn) {
  importGalleryBtn.addEventListener('click', () => {
    importGalleryInput.click();
  });
}

if (importGalleryInput) {
  importGalleryInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const count = await window.SpriteGallery.importJSON(file);
      alert(`Successfully imported ${count} sprites!`);
      updateGallery();
    } catch (error) {
      console.error('Import error:', error);
      alert(`Error importing gallery: ${error.message}`);
    }
    
    // Reset input
    importGalleryInput.value = '';
  });
}

if (clearGalleryBtn) {
  clearGalleryBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the entire gallery? This cannot be undone.')) {
      if (window.SpriteGallery) {
        window.SpriteGallery.clear();
        updateGallery();
      }
    }
  });
}

if (galleryFilterSelect) {
  galleryFilterSelect.addEventListener('change', updateGallery);
}

function updateGallery() {
  if (!window.SpriteGallery || !galleryGrid || !galleryCount) return;
  
  const filterSpecies = galleryFilterSelect ? galleryFilterSelect.value : 'all';
  let sprites = window.SpriteGallery.getAll();
  
  // Apply filter
  if (filterSpecies !== 'all') {
    sprites = sprites.filter(sprite => sprite.dna.species === filterSpecies);
  }
  
  // Sort by newest first
  sprites.sort((a, b) => b.savedAt - a.savedAt);
  
  // Update count
  galleryCount.textContent = window.SpriteGallery.getAll().length;
  
  // Clear grid
  galleryGrid.innerHTML = '';
  
  if (sprites.length === 0) {
    galleryGrid.innerHTML = '<p class="info-text">No sprites in gallery. Generate some sprites to populate your gallery!</p>';
    return;
  }
  
  // Populate grid
  sprites.forEach(sprite => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.onload = () => {
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.9;
      const x = (canvas.width - img.width * scale) / 2;
      const y = (canvas.height - img.height * scale) / 2;
      
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    };
    img.src = sprite.image;
    
    const info = document.createElement('div');
    info.className = 'gallery-item-info';
    info.innerHTML = `
      <p><strong>${sprite.dna.meta?.name || 'Unnamed'}</strong></p>
      <p>${sprite.dna.species}</p>
      <p class="gallery-date">${new Date(sprite.savedAt).toLocaleDateString()}</p>
    `;
    
    const actions = document.createElement('div');
    actions.className = 'gallery-item-actions';
    
    const loadBtn = document.createElement('button');
    loadBtn.className = 'btn-small';
    loadBtn.textContent = '📂 Load';
    loadBtn.addEventListener('click', () => loadFromGallery(sprite));
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-small';
    deleteBtn.textContent = '🗑️ Delete';
    deleteBtn.addEventListener('click', () => {
      if (confirm('Delete this sprite from gallery?')) {
        window.SpriteGallery.delete(sprite.id);
        updateGallery();
      }
    });
    
    actions.appendChild(loadBtn);
    actions.appendChild(deleteBtn);
    
    item.appendChild(canvas);
    item.appendChild(info);
    item.appendChild(actions);
    
    galleryGrid.appendChild(item);
  });
}

function loadFromGallery(sprite) {
  // Switch to basic tab
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
  
  document.querySelector('[data-tab="basic"]').classList.add('active');
  document.getElementById('basic-tab').classList.add('active');
  
  // Load sprite
  currentSprite = sprite;
  displaySprite(sprite.image);
  updateStats(sprite);
  enableExportButtons();
  
  // Update controls to match DNA
  if (sprite.dna) {
    if (sprite.dna.species) speciesSelect.value = sprite.dna.species;
    if (sprite.dna.size) {
      sizeSlider.value = sprite.dna.size;
      sizeValue.textContent = `${sprite.dna.size}x`;
    }
    if (sprite.dna.style) styleSelect.value = sprite.dna.style;
    if (sprite.dna.colors?.primary) primaryColorPicker.value = sprite.dna.colors.primary;
  }
  
  console.log('✓ Loaded sprite from gallery:', sprite.dna.meta?.name || sprite.id);
}

// Initialize gallery on page load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(updateGallery, 500);
});

console.log('✓ Gallery system initialized');
