#!/bin/bash
# ============================================================
# SCRIPT FIX NUMPY 404 ERROR UNTUK BUILDOZER/PYTHON-FOR-ANDROID
# ============================================================
# Dibuat: 2025-11-07
# Masalah: HTTP 404 saat download numpy karena URL lama di p4a
# Solusi: Update buildozer.spec + clear cache + patch p4a recipe
# ============================================================

set -e  # Stop jika ada error

echo "🔧 MEMULAI PERBAIKAN NUMPY 404 ERROR..."
echo ""

# ============================================================
# STEP 1: BACKUP BUILDOZER.SPEC (SAFETY FIRST!)
# ============================================================
echo "📦 Step 1/5: Backup buildozer.spec..."
if [ -f buildozer.spec ]; then
    cp buildozer.spec buildozer.spec.backup
    echo "✅ Backup tersimpan di buildozer.spec.backup"
else
    echo "❌ buildozer.spec tidak ditemukan!"
    exit 1
fi
echo ""

# ============================================================
# STEP 2: UPDATE NUMPY VERSION DI BUILDOZER.SPEC
# ============================================================
echo "📝 Step 2/5: Update numpy version ke 1.23.4 (tested & stable)..."
# Ganti semua kemunculan numpy==1.26.4 ke numpy==1.23.4
if grep -q "numpy==1.26.4" buildozer.spec; then
    sed -i 's/numpy==1.26.4/numpy==1.23.4/g' buildozer.spec
    echo "✅ Numpy diubah dari 1.26.4 → 1.23.4"
elif grep -q "numpy==1.23.4" buildozer.spec; then
    echo "✅ Numpy sudah 1.23.4 (OK!)"
else
    echo "⚠️  Warning: Numpy version tidak ditemukan, tambahkan manual"
fi
echo ""

# ============================================================
# STEP 3: CLEAR BUILDOZER CACHE
# ============================================================
echo "🗑️  Step 3/5: Hapus cache buildozer yang lama..."
if [ -d "$HOME/.buildozer" ]; then
    echo "Menghapus cache di: $HOME/.buildozer/android/platform/build-*"
    rm -rf "$HOME/.buildozer/android/platform/build-arm64-v8a" 2>/dev/null || true
    rm -rf "$HOME/.buildozer/android/platform/build-armeabi-v7a" 2>/dev/null || true
    rm -rf "$HOME/.buildozer/android/platform/build" 2>/dev/null || true
    echo "✅ Cache dihapus"
else
    echo "ℹ️  Belum ada cache buildozer (fresh install)"
fi

if [ -d ".buildozer" ]; then
    echo "Menghapus cache lokal di: .buildozer/android/platform/build-*"
    rm -rf .buildozer/android/platform/build-arm64-v8a 2>/dev/null || true
    rm -rf .buildozer/android/platform/build-armeabi-v7a 2>/dev/null || true
    rm -rf .buildozer/android/platform/build 2>/dev/null || true
    echo "✅ Cache lokal dihapus"
fi
echo ""

# ============================================================
# STEP 4: DOWNLOAD NUMPY MANUAL (PRECACHE)
# ============================================================
echo "⬇️  Step 4/5: Download numpy 1.23.4 manual (precache)..."

# URL yang BENAR dari PyPI
NUMPY_URL="https://files.pythonhosted.org/packages/64/8e/9929b64e146d240507edaac2185cd5516f00b133be5b39250d253be25a64/numpy-1.23.4.tar.gz"
NUMPY_FILE="numpy-1.23.4.tar.gz"

# Download ke temporary folder
echo "Downloading dari: $NUMPY_URL"
if command -v wget &> /dev/null; then
    wget -q --show-progress -O "/tmp/$NUMPY_FILE" "$NUMPY_URL"
elif command -v curl &> /dev/null; then
    curl -L -o "/tmp/$NUMPY_FILE" "$NUMPY_URL"
else
    echo "❌ wget atau curl tidak ditemukan!"
    exit 1
fi

if [ -f "/tmp/$NUMPY_FILE" ]; then
    FILE_SIZE=$(du -h "/tmp/$NUMPY_FILE" | cut -f1)
    echo "✅ Downloaded: $NUMPY_FILE ($FILE_SIZE)"
    
    # Simpan info untuk nanti dipindah ke cache p4a
    echo "File tersimpan di: /tmp/$NUMPY_FILE"
    echo "Nanti akan dicopy ke cache p4a saat buildozer mulai build"
else
    echo "❌ Download gagal!"
    exit 1
fi
echo ""

# ============================================================
# STEP 5: BUAT SCRIPT HELPER UNTUK COPY KE P4A CACHE
# ============================================================
echo "📋 Step 5/5: Buat helper script untuk copy ke p4a cache..."

cat > precache_numpy.sh << 'PRECACHE_SCRIPT'
#!/bin/bash
# Helper script untuk copy numpy ke p4a cache setelah buildozer init
# Jalankan ini SETELAH buildozer android debug gagal pertama kali

set -e

echo "🔍 Mencari folder p4a cache..."

# Cari di beberapa lokasi umum
P4A_PATHS=(
    "$HOME/.buildozer/android/platform/build-arm64-v8a/packages/numpy"
    "$HOME/.buildozer/android/platform/build-armeabi-v7a/packages/numpy"
    ".buildozer/android/platform/build-arm64-v8a/packages/numpy"
    ".buildozer/android/platform/build-armeabi-v7a/packages/numpy"
)

NUMPY_SRC="/tmp/numpy-1.23.4.tar.gz"

if [ ! -f "$NUMPY_SRC" ]; then
    echo "❌ File numpy tidak ada di /tmp/numpy-1.23.4.tar.gz"
    echo "Run fix_numpy_android.sh dulu untuk download!"
    exit 1
fi

COPIED=0
for P4A_PATH in "${P4A_PATHS[@]}"; do
    if [ -d "$(dirname "$P4A_PATH")" ]; then
        mkdir -p "$P4A_PATH"
        cp "$NUMPY_SRC" "$P4A_PATH/"
        echo "✅ Copied to: $P4A_PATH"
        COPIED=$((COPIED + 1))
    fi
done

if [ $COPIED -eq 0 ]; then
    echo "⚠️  Folder p4a belum ada. Jalankan buildozer dulu, lalu run script ini lagi."
else
    echo "✅ Numpy precached ke $COPIED lokasi!"
fi
PRECACHE_SCRIPT

chmod +x precache_numpy.sh
echo "✅ Helper script dibuat: precache_numpy.sh"
echo ""

# ============================================================
# STEP 6: PATCH P4A NUMPY RECIPE (ADVANCED)
# ============================================================
echo "🔧 Step 6/5 (BONUS): Buat patch untuk p4a numpy recipe..."

cat > patch_p4a_numpy_recipe.py << 'PATCH_SCRIPT'
#!/usr/bin/env python3
"""
Patch python-for-android numpy recipe untuk fix URL download
"""
import os
import sys
import re

def find_p4a_recipe():
    """Cari lokasi numpy recipe di p4a"""
    possible_paths = [
        os.path.expanduser("~/.buildozer/android/platform/python-for-android/pythonforandroid/recipes/numpy/__init__.py"),
        os.path.expanduser("~/.local/lib/python3.*/site-packages/pythonforandroid/recipes/numpy/__init__.py"),
        ".buildozer/android/platform/python-for-android/pythonforandroid/recipes/numpy/__init__.py",
    ]
    
    for path in possible_paths:
        # Handle wildcard untuk python version
        if '*' in path:
            import glob
            matches = glob.glob(path)
            if matches:
                return matches[0]
        elif os.path.exists(path):
            return path
    
    return None

def patch_recipe(recipe_path):
    """Patch recipe file"""
    print(f"📝 Patching: {recipe_path}")
    
    with open(recipe_path, 'r') as f:
        content = f.read()
    
    # Backup
    with open(recipe_path + '.backup', 'w') as f:
        f.write(content)
    print(f"✅ Backup: {recipe_path}.backup")
    
    # Patch 1: Update version jika ada
    content = re.sub(
        r"version = ['\"]1\.26\.4['\"]",
        "version = '1.23.4'",
        content
    )
    
    # Patch 2: Update URL pattern (.zip → .tar.gz)
    content = re.sub(
        r'\.zip',
        '.tar.gz',
        content
    )
    
    # Patch 3: Update URL base
    content = re.sub(
        r'https://pypi\.python\.org/packages/source',
        'https://files.pythonhosted.org/packages',
        content
    )
    
    # Write patched content
    with open(recipe_path, 'w') as f:
        f.write(content)
    
    print("✅ Recipe patched!")
    return True

if __name__ == "__main__":
    recipe_path = find_p4a_recipe()
    
    if recipe_path:
        print(f"✅ Found numpy recipe: {recipe_path}")
        patch_recipe(recipe_path)
    else:
        print("⚠️  Numpy recipe tidak ditemukan.")
        print("Recipe akan di-download saat buildozer run pertama kali.")
        print("Jalankan script ini lagi setelah buildozer android debug.")
PATCH_SCRIPT

chmod +x patch_p4a_numpy_recipe.py
echo "✅ Patch script dibuat: patch_p4a_numpy_recipe.py"
echo ""

# ============================================================
# SUMMARY & NEXT STEPS
# ============================================================
echo "════════════════════════════════════════════════════════"
echo "✅ PERBAIKAN SELESAI!"
echo "════════════════════════════════════════════════════════"
echo ""
echo "📊 YANG SUDAH DILAKUKAN:"
echo "  ✅ Backup buildozer.spec → buildozer.spec.backup"
echo "  ✅ Update numpy ke 1.23.4 (tested version)"
echo "  ✅ Hapus cache lama buildozer"
echo "  ✅ Download numpy-1.23.4.tar.gz ke /tmp/"
echo "  ✅ Buat helper scripts (precache_numpy.sh, patch_p4a_numpy_recipe.py)"
echo ""
echo "🚀 LANGKAH SELANJUTNYA:"
echo ""
echo "OPSI 1 (RECOMMENDED): Coba build langsung"
echo "  $ buildozer android debug"
echo ""
echo "OPSI 2: Jika masih error 404, jalankan:"
echo "  $ ./precache_numpy.sh    # Setelah buildozer gagal pertama kali"
echo "  $ buildozer android debug -v  # Retry dengan verbose"
echo ""
echo "OPSI 3 (ADVANCED): Patch p4a recipe sebelum build"
echo "  $ python3 patch_p4a_numpy_recipe.py"
echo "  $ buildozer android debug"
echo ""
echo "📝 FILE PENTING:"
echo "  • buildozer.spec         → Config utama (numpy=1.23.4)"
echo "  • /tmp/numpy-1.23.4.tar.gz → File numpy yang sudah di-download"
echo "  • precache_numpy.sh      → Helper untuk copy ke p4a cache"
echo "  • patch_p4a_numpy_recipe.py → Patch p4a recipe (jika diperlukan)"
echo ""
echo "💡 TIPS:"
echo "  - Pastikan koneksi internet stabil"
echo "  - Build pertama bisa 30-60 menit (download SDK/NDK)"
echo "  - Jika error lain muncul, cek log dengan: buildozer -v android debug"
echo ""
echo "════════════════════════════════════════════════════════"
