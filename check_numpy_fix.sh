#!/bin/bash
# Script untuk verifikasi numpy fix dan check environment

echo "🔍 CHECKING NUMPY FIX FOR BUILDOZER/P4A"
echo "========================================"
echo ""

# 1. Check buildozer.spec requirements
echo "📋 1. Checking buildozer.spec requirements:"
echo "-------------------------------------------"
NUMPY_VERSION=$(grep "numpy==" buildozer.spec | sed 's/.*numpy==\([0-9.]*\).*/\1/')
echo "   Configured numpy version: $NUMPY_VERSION"
echo ""

# 2. Verify numpy availability on PyPI
echo "📦 2. Verifying numpy $NUMPY_VERSION on PyPI:"
echo "----------------------------------------------"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://pypi.org/pypi/numpy/$NUMPY_VERSION/json")
if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Numpy $NUMPY_VERSION is available on PyPI"
    
    # Get download URLs
    echo ""
    echo "   Available source distributions:"
    curl -s "https://pypi.org/pypi/numpy/$NUMPY_VERSION/json" | python3 -c "
import sys, json
data = json.load(sys.stdin)
for url in data['urls']:
    if 'tar.gz' in url['filename'] or '.zip' in url['filename']:
        print(f\"      - {url['filename']}: {url['url'][:80]}...\")
" 2>/dev/null || echo "      (Could not parse JSON)"
else
    echo "   ❌ ERROR: Numpy $NUMPY_VERSION NOT found (HTTP $HTTP_CODE)"
    echo "   Recommendation: Use numpy==1.23.4 or numpy==1.24.3"
fi
echo ""

# 3. Check for old problematic URL pattern
echo "🔎 3. Checking for old PyPI URL patterns:"
echo "-----------------------------------------"
if grep -q "pypi.python.org/packages/source" buildozer.spec 2>/dev/null; then
    echo "   ⚠️  WARNING: Found old PyPI URL pattern in buildozer.spec"
    echo "   This will cause 404 errors!"
else
    echo "   ✅ No old URL patterns found in buildozer.spec"
fi
echo ""

# 4. Check python-for-android numpy recipe (if available)
echo "🧪 4. Checking python-for-android numpy recipe:"
echo "------------------------------------------------"
P4A_RECIPE_PATH="$HOME/.buildozer/android/platform/python-for-android/pythonforandroid/recipes/numpy"
if [ -d "$P4A_RECIPE_PATH" ]; then
    echo "   Found p4a numpy recipe at: $P4A_RECIPE_PATH"
    
    # Check for versioned_url in recipe
    if grep -q "versioned_url" "$P4A_RECIPE_PATH/__init__.py" 2>/dev/null; then
        echo "   Current versioned_url:"
        grep "versioned_url" "$P4A_RECIPE_PATH/__init__.py" | head -n 1
    fi
    
    # Check for problematic .zip references
    if grep -q "\.zip" "$P4A_RECIPE_PATH/__init__.py" 2>/dev/null; then
        echo "   ⚠️  WARNING: Recipe references .zip files (may cause issues)"
        echo "   Recommendation: Patch recipe to use .tar.gz"
    fi
else
    echo "   ℹ️  P4A recipe not found (will be downloaded on first build)"
fi
echo ""

# 5. List buildozer cache (if exists)
echo "💾 5. Checking buildozer cache:"
echo "-------------------------------"
CACHE_DIR="$HOME/.buildozer/android/platform/build-*/packages/numpy"
if ls $CACHE_DIR 2>/dev/null | grep -q .; then
    echo "   Found cached numpy packages:"
    ls -lh $CACHE_DIR 2>/dev/null | grep "numpy.*\(tar.gz\|zip\)"
else
    echo "   ℹ️  No cached numpy packages found"
fi
echo ""

# 6. Final recommendations
echo "✅ RECOMMENDATIONS:"
echo "==================="
if [ "$NUMPY_VERSION" = "1.23.4" ] || [ "$NUMPY_VERSION" = "1.24.3" ]; then
    echo "   ✅ You're using a stable numpy version ($NUMPY_VERSION)"
    echo "   This should work without 404 errors"
else
    echo "   ⚠️  Consider using numpy==1.23.4 for Android builds"
    echo "   Edit buildozer.spec and change numpy version"
fi
echo ""

echo "🚀 NEXT STEPS TO BUILD APK:"
echo "============================"
echo "   1. Clean previous build (if needed):"
echo "      rm -rf .buildozer/android/platform/build"
echo ""
echo "   2. Run buildozer:"
echo "      buildozer android debug"
echo ""
echo "   3. If you get 404 errors, try:"
echo "      - Use numpy==1.23.4 (most stable)"
echo "      - OR manually download numpy-1.23.4.tar.gz to:"
echo "        ~/.buildozer/android/platform/build-arm64-v8a/packages/numpy/"
echo ""
echo "✅ Check complete!"
