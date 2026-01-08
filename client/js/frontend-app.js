/**
 * Frontend Application for Procedural Sprite Factory
 * Matches all backend capabilities
 */

// State management
const state = {
    gallery: [],
    currentSprite: null,
    stats: {
        total: 0,
        creatures: 0,
        items: 0,
        environment: 0
    }
};

// Item type mappings
const itemTypes = {
    weapon: ['sword', 'axe', 'spear', 'dagger', 'bow', 'staff', 'hammer', 'mace', 'whip', 'scythe'],
    armor: ['helmet', 'chestplate', 'shield', 'gauntlets', 'boots', 'pauldrons'],
    potion: ['health_potion', 'mana_potion', 'elixir', 'flask', 'vial'],
    gem: ['diamond', 'ruby', 'emerald', 'sapphire', 'amethyst', 'crystal'],
    tool: ['pickaxe', 'shovel', 'hoe', 'fishing_rod', 'wrench', 'saw']
};

const envTypes = {
    nature: ['tree', 'bush', 'flower', 'grass', 'mushroom', 'vine', 'cactus', 'crystal_formation'],
    terrain: ['rock', 'boulder', 'cliff', 'hill', 'mountain', 'crater', 'canyon'],
    structure: ['building', 'tower', 'wall', 'gate', 'bridge', 'ruins', 'statue', 'pillar'],
    water: ['waterfall', 'fountain', 'pond', 'river', 'geyser'],
    decoration: ['banner', 'torch', 'lantern', 'sign', 'fence', 'barrel', 'crate', 'chest']
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    initializeControls();
    initializeGenerators();
    loadGalleryFromStorage();
    updateStats();
});

// Tab Management
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            
            // Update active states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
}

// Control Initialization
function initializeControls() {
    // Creature mode toggle
    document.getElementById('creature-mode').addEventListener('change', (e) => {
        const isProcedural = e.target.value === 'procedural';
        document.getElementById('species-controls').style.display = isProcedural ? 'none' : 'block';
        document.getElementById('procedural-controls').style.display = isProcedural ? 'block' : 'none';
    });

    // Item category changes
    document.getElementById('item-category').addEventListener('change', updateItemTypes);
    updateItemTypes();

    // Environment category changes
    document.getElementById('env-category').addEventListener('change', updateEnvTypes);
    updateEnvTypes();

    // Value displays
    setupValueDisplay('base-hue', 'hue-value', (val) => `${val}° ${getColorName(val)}`);
    setupValueDisplay('item-hue', 'item-hue-value', (val) => `${val}° ${getColorName(val)}`);
    setupValueDisplay('env-hue', 'env-hue-value', (val) => `${val}° ${getColorName(val)}`);
    setupValueDisplay('size', 'size-value', (val) => `${val}x`);
    setupValueDisplay('eye-count', 'eye-count-value');
    setupValueDisplay('weathering', 'weathering-value', (val) => `${Math.round(val * 100)}%`);
    setupValueDisplay('batch-count', 'batch-count-value');
}

function setupValueDisplay(inputId, displayId, formatter = (v) => v) {
    const input = document.getElementById(inputId);
    const display = document.getElementById(displayId);
    if (input && display) {
        input.addEventListener('input', (e) => {
            display.textContent = formatter(e.target.value);
        });
    }
}

function updateItemTypes() {
    const category = document.getElementById('item-category').value;
    const select = document.getElementById('item-type');
    select.innerHTML = itemTypes[category].map(type => 
        `<option value="${type}">${type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>`
    ).join('');
}

function updateEnvTypes() {
    const category = document.getElementById('env-category').value;
    const select = document.getElementById('env-type');
    select.innerHTML = envTypes[category].map(type => 
        `<option value="${type}">${type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>`
    ).join('');
}

function getColorName(hue) {
    hue = parseInt(hue);
    if (hue < 30) return '(Red)';
    if (hue < 60) return '(Orange)';
    if (hue < 90) return '(Yellow)';
    if (hue < 150) return '(Green)';
    if (hue < 210) return '(Cyan)';
    if (hue < 270) return '(Blue)';
    if (hue < 330) return '(Purple)';
    return '(Magenta)';
}

// Generator Initialization
function initializeGenerators() {
    // Creature generator
    document.getElementById('generate-creature').addEventListener('click', generateCreature);
    document.getElementById('random-creature').addEventListener('click', randomizeCreature);
    document.getElementById('download-creature').addEventListener('click', () => downloadSprite(state.currentSprite));
    document.getElementById('add-to-gallery-creature').addEventListener('click', () => addToGallery(state.currentSprite, 'creature'));

    // Item generator
    document.getElementById('generate-item').addEventListener('click', generateItem);
    document.getElementById('random-item').addEventListener('click', randomizeItem);
    document.getElementById('download-item').addEventListener('click', () => downloadSprite(state.currentSprite));
    document.getElementById('add-to-gallery-item').addEventListener('click', () => addToGallery(state.currentSprite, 'item'));
    document.getElementById('generate-loot').addEventListener('click', generateRandomLoot);

    // Environment generator
    document.getElementById('generate-env').addEventListener('click', generateEnvironment);
    document.getElementById('random-env').addEventListener('click', randomizeEnvironment);
    document.getElementById('download-env').addEventListener('click', () => downloadSprite(state.currentSprite));
    document.getElementById('add-to-gallery-env').addEventListener('click', () => addToGallery(state.currentSprite, 'environment'));

    // Batch generator
    document.getElementById('generate-batch').addEventListener('click', generateBatch);

    // Gallery
    document.getElementById('clear-gallery').addEventListener('click', clearGallery);
}

// Generate Creature
async function generateCreature() {
    const mode = document.getElementById('creature-mode').value;
    const params = {
        size: parseFloat(document.getElementById('size').value),
        style: document.getElementById('style').value,
        baseHue: parseInt(document.getElementById('base-hue').value),
        harmony: document.getElementById('harmony').value,
        seed: parseInt(document.getElementById('seed').value)
    };

    if (mode === 'species') {
        params.species = document.getElementById('species').value;
    } else {
        params.procedural = true;
        params.archetype = document.getElementById('archetype').value;
        params.material = document.getElementById('material').value;
        params.eyeCount = parseInt(document.getElementById('eye-count').value);
    }

    try {
        showLoading('creature-preview');
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        });

        const data = await response.json();
        if (data.success) {
            displaySprite(data.image, 'creature-preview');
            state.currentSprite = { image: data.image, params, type: 'creature' };
            updateInfoBox('creature-info', params);
        } else {
            showError('creature-preview', data.error || 'Generation failed');
        }
    } catch (error) {
        showError('creature-preview', error.message);
    }
}

// Generate Item
async function generateItem() {
    const params = {
        generateItem: true,
        itemType: document.getElementById('item-type').value,
        itemCategory: document.getElementById('item-category').value,
        quality: document.getElementById('quality').value,
        baseHue: parseInt(document.getElementById('item-hue').value),
        seed: parseInt(document.getElementById('item-seed').value),
        size: 2
    };

    try {
        showLoading('item-preview');
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        });

        const data = await response.json();
        if (data.success) {
            displaySprite(data.image, 'item-preview');
            state.currentSprite = { image: data.image, params, type: 'item' };
            updateInfoBox('item-info', params);
        } else {
            showError('item-preview', data.error || 'Generation failed');
        }
    } catch (error) {
        showError('item-preview', error.message);
    }
}

// Generate Environment
async function generateEnvironment() {
    const params = {
        generateEnvironment: true,
        assetType: document.getElementById('env-type').value,
        assetCategory: document.getElementById('env-category').value,
        material: document.getElementById('env-material').value,
        weathering: parseFloat(document.getElementById('weathering').value),
        baseHue: parseInt(document.getElementById('env-hue').value),
        seed: parseInt(document.getElementById('env-seed').value),
        size: 2
    };

    try {
        showLoading('env-preview');
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        });

        const data = await response.json();
        if (data.success) {
            displaySprite(data.image, 'env-preview');
            state.currentSprite = { image: data.image, params, type: 'environment' };
            updateInfoBox('env-info', params);
        } else {
            showError('env-preview', data.error || 'Generation failed');
        }
    } catch (error) {
        showError('env-preview', error.message);
    }
}

// Randomize functions
function randomizeCreature() {
    document.getElementById('base-hue').value = Math.floor(Math.random() * 360);
    document.getElementById('seed').value = Math.floor(Math.random() * 100000);
    document.getElementById('base-hue').dispatchEvent(new Event('input'));
    generateCreature();
}

function randomizeItem() {
    document.getElementById('item-hue').value = Math.floor(Math.random() * 360);
    document.getElementById('item-seed').value = Math.floor(Math.random() * 100000);
    document.getElementById('item-hue').dispatchEvent(new Event('input'));
    generateItem();
}

function randomizeEnvironment() {
    document.getElementById('env-hue').value = Math.floor(Math.random() * 360);
    document.getElementById('env-seed').value = Math.floor(Math.random() * 100000);
    document.getElementById('env-hue').dispatchEvent(new Event('input'));
    generateEnvironment();
}

async function generateRandomLoot() {
    const categories = Object.keys(itemTypes);
    const category = categories[Math.floor(Math.random() * categories.length)];
    const types = itemTypes[category];
    const type = types[Math.floor(Math.random() * types.length)];
    const qualities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    const quality = qualities[Math.floor(Math.random() * qualities.length)];

    document.getElementById('item-category').value = category;
    updateItemTypes();
    document.getElementById('item-type').value = type;
    document.getElementById('quality').value = quality;
    await generateItem();
}

// Batch Generation
async function generateBatch() {
    const count = parseInt(document.getElementById('batch-count').value);
    const gallery = document.getElementById('batch-gallery');
    gallery.innerHTML = '<p>Generating batch...</p>';

    const promises = [];
    for (let i = 0; i < count; i++) {
        const params = {
            procedural: true,
            archetype: ['biped', 'quadruped', 'flying'][Math.floor(Math.random() * 3)],
            baseHue: Math.floor(Math.random() * 360),
            seed: Math.floor(Math.random() * 100000),
            size: 1
        };

        promises.push(
            fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params)
            }).then(r => r.json())
        );
    }

    const results = await Promise.all(promises);
    gallery.innerHTML = '';
    
    results.forEach((data, i) => {
        if (data.success) {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `<img src="${data.image}" alt="Batch ${i+1}">`;
            item.addEventListener('click', () => {
                displaySprite(data.image, 'creature-preview');
                // Switch to creatures tab
                document.querySelector('[data-tab="creatures"]').click();
            });
            gallery.appendChild(item);
        }
    });
}

// UI Helper Functions
function showLoading(previewId) {
    const preview = document.getElementById(previewId);
    preview.innerHTML = '<div class="loading"></div><p>Generating...</p>';
}

function showError(previewId, message) {
    const preview = document.getElementById(previewId);
    preview.innerHTML = `<p style="color: #ff6b6b;">❌ Error: ${message}</p>`;
}

function displaySprite(imageData, previewId) {
    const preview = document.getElementById(previewId);
    preview.innerHTML = `<img src="${imageData}" alt="Generated Sprite">`;
}

function updateInfoBox(infoId, params) {
    const info = document.getElementById(infoId);
    let html = '<strong>Generation Parameters:</strong><br>';
    for (const [key, value] of Object.entries(params)) {
        if (key !== 'image') {
            html += `${key}: ${value}<br>`;
        }
    }
    info.innerHTML = html;
}

// Gallery Management
function addToGallery(sprite, type) {
    if (!sprite) return;
    
    state.gallery.push({ ...sprite, timestamp: Date.now() });
    state.stats.total++;
    state.stats[type]++;
    
    saveGalleryToStorage();
    updateMainGallery();
    updateStats();
}

function updateMainGallery() {
    const gallery = document.getElementById('main-gallery');
    gallery.innerHTML = '';
    
    state.gallery.slice().reverse().forEach((item, i) => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.innerHTML = `<img src="${item.image}" alt="Gallery ${i}">`;
        div.addEventListener('click', () => {
            state.currentSprite = item;
            displaySprite(item.image, 'creature-preview');
            document.querySelector('[data-tab="creatures"]').click();
        });
        gallery.appendChild(div);
    });
}

function clearGallery() {
    if (confirm('Clear all gallery items?')) {
        state.gallery = [];
        state.stats = { total: 0, creatures: 0, items: 0, environment: 0 };
        saveGalleryToStorage();
        updateMainGallery();
        updateStats();
    }
}

function updateStats() {
    document.getElementById('stat-total').textContent = state.stats.total;
    document.getElementById('stat-creatures').textContent = state.stats.creatures;
    document.getElementById('stat-items').textContent = state.stats.items;
    document.getElementById('stat-env').textContent = state.stats.environment;
}

function saveGalleryToStorage() {
    localStorage.setItem('spriteGallery', JSON.stringify(state.gallery));
    localStorage.setItem('spriteStats', JSON.stringify(state.stats));
}

function loadGalleryFromStorage() {
    const gallery = localStorage.getItem('spriteGallery');
    const stats = localStorage.getItem('spriteStats');
    
    if (gallery) state.gallery = JSON.parse(gallery);
    if (stats) state.stats = JSON.parse(stats);
    
    updateMainGallery();
    updateStats();
}

function downloadSprite(sprite) {
    if (!sprite || !sprite.image) return;
    
    const link = document.createElement('a');
    link.href = sprite.image;
    link.download = `sprite-${Date.now()}.png`;
    link.click();
}

console.log('🎨 Procedural Sprite Factory - Frontend Loaded');
console.log('Ready to generate AAA quality assets!');
