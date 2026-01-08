# 🚀 Quick Start Guide

Get started with the Procedural Sprite Factory in under 5 minutes!

---

## 📋 Prerequisites

- **Node.js** 14.0.0 or higher
- **npm** 6.0.0 or higher

Check your versions:
```bash
node --version
npm --version
```

---

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/MrNova420/procedural-sprite-factory.git
cd procedural-sprite-factory
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Server

```bash
npm start
```

You should see:
```
🎨 Procedural Sprite Factory running on http://localhost:3000
🎉 COMPLETE: All 11 Phases Implemented!
```

### 4. Open Your Browser

Navigate to **http://localhost:3000**

---

## 🎮 First Generation

### Option 1: Use the Web Dashboard

1. Open http://localhost:3000
2. Select a species (dragon, wolf, goblin, robot, human)
3. Choose variant (fire, ice, shadow, etc.)
4. Click "Generate"

### Option 2: Use the API

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"species": "dragon", "size": 1.5}'
```

### Text-to-Asset

```bash
curl -X POST http://localhost:3000/api/universal/from-text \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A fierce red dragon"}'
```

---

## 📚 Next Steps

1. **[API-REFERENCE.md](./API-REFERENCE.md)** - Complete API docs
2. **[README.md](./README.md)** - Full feature list
3. **Explore the dashboard** - Try all generation types

---

## 🐛 Troubleshooting

### Port in Use
```bash
PORT=8080 npm start
```

### Canvas Issues

**macOS:**
```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg
npm install
```

**Ubuntu/Debian:**
```bash
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
npm install
```

**Windows:**
- Install [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/)
- Then run `npm install`

---

## 💡 Tips

1. Use **seeds** for reproducible results
2. Start with **size 1.0** before scaling
3. **Experiment** with different styles
4. **Batch generate** to see variations
5. **Save DNA** for favorite sprites

---

**You're ready! 🎨 Happy generating!**
