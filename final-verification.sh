#!/bin/bash
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  PROCEDURAL SPRITE FACTORY - FINAL VERIFICATION TEST      ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

SUCCESS=0
FAIL=0

test_endpoint() {
    local name="$1"
    local cmd="$2"
    echo -n "Testing $name... "
    if eval "$cmd" | grep -q '"success":true'; then
        echo "✓ PASS"
        ((SUCCESS++))
    else
        echo "✗ FAIL"
        ((FAIL++))
    fi
}

echo "=== SPECIES GENERATION TESTS ==="
test_endpoint "Dragon" "curl -s -X POST http://localhost:3000/api/generate -H 'Content-Type: application/json' -d '{\"species\":\"dragon\",\"size\":1.0,\"style\":\"pixel\"}'"
test_endpoint "Wolf" "curl -s -X POST http://localhost:3000/api/generate -H 'Content-Type: application/json' -d '{\"species\":\"wolf\",\"size\":1.0,\"style\":\"pixel\"}'"
test_endpoint "Goblin" "curl -s -X POST http://localhost:3000/api/generate -H 'Content-Type: application/json' -d '{\"species\":\"goblin\",\"size\":1.0,\"style\":\"pixel\"}'"
test_endpoint "Robot" "curl -s -X POST http://localhost:3000/api/generate -H 'Content-Type: application/json' -d '{\"species\":\"robot\",\"size\":1.0,\"style\":\"pixel\"}'"
test_endpoint "Human" "curl -s -X POST http://localhost:3000/api/generate -H 'Content-Type: application/json' -d '{\"species\":\"human\",\"size\":1.0,\"style\":\"pixel\"}'"

echo ""
echo "=== STYLE VARIATION TESTS ==="
test_endpoint "Pixel Style" "curl -s -X POST http://localhost:3000/api/generate -H 'Content-Type: application/json' -d '{\"species\":\"dragon\",\"style\":\"pixel\"}'"
test_endpoint "Dark Fantasy" "curl -s -X POST http://localhost:3000/api/generate -H 'Content-Type: application/json' -d '{\"species\":\"dragon\",\"style\":\"dark-fantasy\"}'"
test_endpoint "Cyberpunk" "curl -s -X POST http://localhost:3000/api/generate -H 'Content-Type: application/json' -d '{\"species\":\"dragon\",\"style\":\"cyberpunk\"}'"
test_endpoint "Cute" "curl -s -X POST http://localhost:3000/api/generate -H 'Content-Type: application/json' -d '{\"species\":\"dragon\",\"style\":\"cute\"}'"

echo ""
echo "=== TEXT-TO-ASSET TEST ==="
test_endpoint "Text Prompt" "curl -s -X POST http://localhost:3000/api/universal/from-text -H 'Content-Type: application/json' -d '{\"prompt\":\"A fierce red dragon\"}'"

echo ""
echo "=== COLOR CUSTOMIZATION TEST ==="
test_endpoint "Custom Color" "curl -s -X POST http://localhost:3000/api/generate -H 'Content-Type: application/json' -d '{\"species\":\"dragon\",\"colors\":{\"primary\":\"#FF0000\"}}'"

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                    TEST RESULTS                           ║"
echo "╠═══════════════════════════════════════════════════════════╣"
echo "║  ✓ Passed: $SUCCESS                                           ║"
echo "║  ✗ Failed: $FAIL                                            ║"
echo "╚═══════════════════════════════════════════════════════════╝"

if [ $FAIL -eq 0 ]; then
    echo ""
    echo "🎉 ALL TESTS PASSED! SYSTEM IS PRODUCTION READY! 🎉"
    echo ""
    echo "Access the Sprite Factory at: http://localhost:3000"
    exit 0
else
    echo ""
    echo "⚠️  Some tests failed. Please review above."
    exit 1
fi
