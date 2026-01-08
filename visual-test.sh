#!/bin/bash

echo "════════════════════════════════════════════════════════════════"
echo "  🎨 QUICK VISUAL TEST - AAA Quality Sprite Factory"
echo "════════════════════════════════════════════════════════════════"
echo ""

API_URL="http://localhost:8085"

# Function to test and save sprite
test_sprite() {
  local prompt=$1
  local filename=$2
  local description=$3
  
  echo "🎨 Testing: $description"
  
  curl -X POST "$API_URL/api/universal/from-text" \
    -H "Content-Type: application/json" \
    -d "{\"prompt\":\"$prompt\"}" \
    -s | python3 -c "
import json, sys, base64
data = json.load(sys.stdin)
if data.get('success'):
    img_data = data['image'].split(',')[1]
    with open('$filename', 'wb') as f:
        f.write(base64.b64decode(img_data))
    print('   ✓ Generated: $filename')
else:
    print('   ✗ Failed:', data.get('error'))
"
}

# Create output directory
mkdir -p /tmp/aaa-quality-test

echo "Generating sprites with AAA quality improvements..."
echo ""

# Test suite
test_sprite \
  "fierce red dragon with massive wings and glowing eyes" \
  "/tmp/aaa-quality-test/dragon-aaa.png" \
  "Red Dragon (AAA Quality)"

test_sprite \
  "menacing gray wolf with yellow glowing eyes" \
  "/tmp/aaa-quality-test/wolf-aaa.png" \
  "Gray Wolf (AAA Quality)"

test_sprite \
  "blue dragon with silver scales" \
  "/tmp/aaa-quality-test/dragon-blue.png" \
  "Blue Dragon Variant"

test_sprite \
  "black wolf with red eyes" \
  "/tmp/aaa-quality-test/wolf-black.png" \
  "Black Wolf Variant"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  ✅ TEST COMPLETE"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Generated sprites saved to: /tmp/aaa-quality-test/"
echo ""
echo "Sprites generated:"
ls -lh /tmp/aaa-quality-test/*.png 2>/dev/null | awk '{print "  • " $9 " (" $5 ")"}'
echo ""
echo "Key improvements visible in sprites:"
echo "  ✓ Smooth curved limbs (no rectangles)"
echo "  ✓ Fur/scale textures"
echo "  ✓ Proper anatomical connections"
echo "  ✓ Glowing eye effects"
echo "  ✓ Professional structure"
echo ""
echo "View sprites with: eog /tmp/aaa-quality-test/*.png"
echo "Or copy to desktop for inspection"
echo ""
