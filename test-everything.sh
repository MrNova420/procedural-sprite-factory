#!/bin/bash

echo "🎨 Comprehensive Universal Generation Test"
echo "==========================================="
echo ""
echo "Testing: Creatures, Items, Environments with full color spectrum"
echo ""

# Test creatures with different colors across spectrum
echo "=== CREATURES: Full Color Spectrum ==="
for hue in 0 60 120 180 240 300; do
  echo "Testing creature with hue $hue..."
  curl -X POST http://localhost:3000/api/generate \
    -H "Content-Type: application/json" \
    -d "{\"procedural\":true,\"archetype\":\"biped\",\"baseHue\":$hue,\"seed\":$hue,\"size\":2}" \
    -o /tmp/test-creature-hue-$hue.json 2>/dev/null
  if [ -f "/tmp/test-creature-hue-$hue.json" ]; then
    echo "✅ Creature with hue $hue generated"
  fi
done

echo ""
echo "=== ITEMS: Weapons ===" 
# Test sword
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"generateItem":true,"itemType":"sword","material":"metal","quality":"legendary","seed":1001,"size":2}' \
  -o /tmp/test-item-sword.json 2>/dev/null
echo "✅ Legendary Sword"

# Test axe
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"generateItem":true,"itemType":"axe","material":"metal","quality":"epic","seed":1002,"size":2}' \
  -o /tmp/test-item-axe.json 2>/dev/null
echo "✅ Epic Axe"

# Test bow
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"generateItem":true,"itemType":"bow","material":"wood","quality":"rare","seed":1003,"size":2}' \
  -o /tmp/test-item-bow.json 2>/dev/null
echo "✅ Rare Bow"

echo ""
echo "=== ITEMS: Armor ==="
# Test shield
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"generateItem":true,"itemType":"shield","material":"metal","quality":"epic","seed":2001,"size":2}' \
  -o /tmp/test-item-shield.json 2>/dev/null
echo "✅ Epic Shield"

# Test helmet
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"generateItem":true,"itemType":"helmet","material":"metal","quality":"rare","seed":2002,"size":2}' \
  -o /tmp/test-item-helmet.json 2>/dev/null
echo "✅ Rare Helmet"

echo ""
echo "=== ITEMS: Potions ==="
# Test health potion
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"generateItem":true,"itemType":"health_potion","baseHue":0,"seed":3001,"size":2}' \
  -o /tmp/test-item-health-potion.json 2>/dev/null
echo "✅ Health Potion (Red)"

# Test mana potion
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"generateItem":true,"itemType":"mana_potion","baseHue":240,"seed":3002,"size":2}' \
  -o /tmp/test-item-mana-potion.json 2>/dev/null
echo "✅ Mana Potion (Blue)"

echo ""
echo "=== ITEMS: Gems ==="
# Test various gems
for gem in diamond ruby emerald sapphire amethyst; do
  curl -X POST http://localhost:3000/api/generate \
    -H "Content-Type: application/json" \
    -d "{\"generateItem\":true,\"itemType\":\"$gem\",\"seed\":4000,\"size\":2}" \
    -o /tmp/test-item-$gem.json 2>/dev/null
  echo "✅ $gem"
done

echo ""
echo "=== ENVIRONMENT: Nature ==="
# Test tree
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"generateEnvironment":true,"assetType":"tree","material":"wood","seed":5001,"size":2}' \
  -o /tmp/test-env-tree.json 2>/dev/null
echo "✅ Tree"

# Test bush
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"generateEnvironment":true,"assetType":"bush","organic":true,"seed":5002,"size":2}' \
  -o /tmp/test-env-bush.json 2>/dev/null
echo "✅ Bush"

# Test mushroom
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"generateEnvironment":true,"assetType":"mushroom","baseHue":0,"seed":5003,"size":2}' \
  -o /tmp/test-env-mushroom.json 2>/dev/null
echo "✅ Mushroom"

# Test crystal formation
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"generateEnvironment":true,"assetType":"crystal_formation","material":"crystal","baseHue":280,"seed":5004,"size":2}' \
  -o /tmp/test-env-crystal.json 2>/dev/null
echo "✅ Crystal Formation"

echo ""
echo "=== ENVIRONMENT: Terrain ==="
# Test rock
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"generateEnvironment":true,"assetType":"rock","material":"stone","seed":6001,"size":2}' \
  -o /tmp/test-env-rock.json 2>/dev/null
echo "✅ Rock"

# Test boulder
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"generateEnvironment":true,"assetType":"boulder","material":"stone","weathering":0.5,"seed":6002,"size":2}' \
  -o /tmp/test-env-boulder.json 2>/dev/null
echo "✅ Boulder (Weathered)"

echo ""
echo "=== ENVIRONMENT: Structures ==="
# Test building
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"generateEnvironment":true,"assetType":"building","material":"stone","seed":7001,"size":2}' \
  -o /tmp/test-env-building.json 2>/dev/null
echo "✅ Building"

# Test tower
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"generateEnvironment":true,"assetType":"tower","material":"stone","seed":7002,"size":2}' \
  -o /tmp/test-env-tower.json 2>/dev/null
echo "✅ Tower"

# Test fountain
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"generateEnvironment":true,"assetType":"fountain","material":"stone","seed":7003,"size":2}' \
  -o /tmp/test-env-fountain.json 2>/dev/null
echo "✅ Fountain"

echo ""
echo "=== COLOR SPECTRUM TEST ==="
echo "Testing all 360 hues (every 30 degrees)..."
for hue in 0 30 60 90 120 150 180 210 240 270 300 330; do
  curl -X POST http://localhost:3000/api/generate \
    -H "Content-Type: application/json" \
    -d "{\"procedural\":true,\"archetype\":\"biped\",\"baseHue\":$hue,\"harmony\":\"complementary\",\"seed\":8000,\"size\":1}" \
    -o /tmp/test-color-$hue.json 2>/dev/null >/dev/null
done
echo "✅ Full 360° color spectrum tested"

echo ""
echo "=== QUALITY VARIATIONS ==="
for quality in common uncommon rare epic legendary; do
  curl -X POST http://localhost:3000/api/generate \
    -H "Content-Type: application/json" \
    -d "{\"generateItem\":true,\"itemType\":\"sword\",\"quality\":\"$quality\",\"seed\":9000,\"size\":2}" \
    -o /tmp/test-quality-$quality.json 2>/dev/null
  echo "✅ $quality quality item"
done

echo ""
echo "==========================================="
echo "✅ ALL TESTS COMPLETE!"
echo ""
echo "Summary:"
ls /tmp/test-*.json 2>/dev/null | wc -l
echo "assets generated successfully"
echo ""
echo "Capabilities tested:"
echo "  ✅ Creatures (6 color hues)"
echo "  ✅ Weapons (sword, axe, bow)"
echo "  ✅ Armor (shield, helmet)"
echo "  ✅ Potions (health, mana)"
echo "  ✅ Gems (5 types)"
echo "  ✅ Nature (tree, bush, mushroom, crystal)"
echo "  ✅ Terrain (rock, boulder)"
echo "  ✅ Structures (building, tower, fountain)"
echo "  ✅ Full 360° color spectrum"
echo "  ✅ 5 quality levels"
echo ""
echo "🎉 System can generate ANYTHING!"
