#!/bin/bash
# Build script untuk Android APK
# Catatan: Script ini harus dijalankan di Linux environment dengan semua dependencies terinstall

echo "========================================="
echo "Android APK Build Script"
echo "========================================="
echo ""
echo "PERHATIAN: Build APK memerlukan:"
echo "1. Linux environment (Ubuntu 20.04+ recommended)"
echo "2. Buildozer installed (pip install buildozer)"
echo "3. Android SDK, NDK, dan dependencies"
echo "4. Minimal 4GB RAM dan 10GB disk space"
echo ""
echo "Untuk menginstall buildozer:"
echo "  pip install buildozer"
echo "  pip install cython"
echo ""
echo "Install Android build dependencies:"
echo "  sudo apt update"
echo "  sudo apt install -y git zip unzip openjdk-17-jdk python3-pip autoconf libtool pkg-config zlib1g-dev libncurses5-dev libncursesw5-dev libtinfo5 cmake libffi-dev libssl-dev"
echo "  sudo apt install -y build-essential libsqlite3-dev sqlite3 bzip2 libbz2-dev zlib1g-dev libssl-dev openssl libgdbm-dev libgdbm-compat-dev liblzma-dev libreadline-dev libncursesw5-dev libffi-dev uuid-dev"
echo ""
echo "========================================="
echo ""

# Check if buildozer is installed
if ! command -v buildozer &> /dev/null; then
    echo "ERROR: Buildozer is not installed!"
    echo "Install it with: pip install buildozer"
    exit 1
fi

# Clean previous builds
echo "Cleaning previous builds..."
rm -rf .buildozer
rm -rf bin

# Initialize and build
echo "Starting Android APK build..."
echo "This may take 30-60 minutes on first build..."
buildozer android debug

echo ""
echo "========================================="
echo "Build completed!"
echo "APK location: bin/modernflappybird-1.0-debug.apk"
echo "========================================="
