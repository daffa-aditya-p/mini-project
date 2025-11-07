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
