# Modern Flappy Bird - Build Instructions

## 📦 Overview
Modern Flappy Bird adalah game modern dengan pygame yang dapat di-compile ke berbagai platform:
- 🪟 Windows (.exe)
- 🤖 Android (.apk)  
- 🌐 Web (HTML5)

## 👥 Credits
- **Daffa Aditya Pratama** - Developer
- **Samsul Bahrur** - Designer

## 🎮 Features
- Modern UI dengan animasi smooth
- Particle effects yang memukau
- Multiple difficulty levels (Easy, Normal, Hardcore)
- Sistem combo dan perfect pass bonus
- Shop system untuk unlock skins
- High score tracking
- Sound effects procedural
- Dynamic gradient backgrounds
- Screen shake effects

## 🚀 Quick Start

### Running Python Version
```bash
pip install -r requirements.txt
python main.py
```

## 🔨 Building

### Windows .exe
```bash
python build_exe.py
```
Output: `dist/windows/ModernFlappyBird.exe`

### Android .apk

**Requirements:**
- Linux environment (Ubuntu 20.04+ recommended)
- 4GB RAM minimum
- 10GB free disk space

**Install Dependencies:**
```bash
# Install buildozer
pip install buildozer cython

# Install Android build dependencies
sudo apt update
sudo apt install -y git zip unzip openjdk-17-jdk python3-pip autoconf \
    libtool pkg-config zlib1g-dev libncurses5-dev libncursesw5-dev \
    libtinfo5 cmake libffi-dev libssl-dev build-essential libsqlite3-dev \
    sqlite3 bzip2 libbz2-dev libgdbm-dev libgdbm-compat-dev liblzma-dev \
    libreadline-dev uuid-dev
```

**Build:**
```bash
chmod +x build_android.sh
./build_android.sh
```
Output: `bin/modernflappybird-1.0-debug.apk`

**Note:** First build akan memakan waktu 30-60 menit karena download Android SDK/NDK.

### Web Version

**Install Pygbag:**
```bash
pip install pygbag
```

**Build for Web:**
```bash
python -m pygbag main_web.py
```

Atau deploy langsung:
```bash
pygbag --build main_web.py
```

Output akan ada di folder `build/web/`

**Test Web Version:**
```bash
python -m http.server 8000 -d build/web
```
Buka browser: `http://localhost:8000`

## 📁 Project Structure
```
mini-project/
├── main.py              # Game utama (full version)
├── main_web.py          # Web-optimized version
├── build_exe.py         # Script build Windows
├── build_android.sh     # Script build Android
├── buildozer.spec       # Config untuk Android build
├── setup.py             # Setup file
├── requirements.txt     # Python dependencies
├── README.md           # Dokumentasi ini
├── BUILD_INSTRUCTIONS.md # Instruksi build lengkap
└── settings.json       # Game settings (auto-generated)
```

## 🎯 Game Controls

### Desktop (Windows/Linux/Mac)
- **SPACE** - Jump
- **ESC** - Pause/Back to menu
- **R** - Quick reset (saat game over)
- **Mouse** - Navigate menu

### Mobile (Android)
- **TAP** - Jump
- **TAP Menu Button** - Navigate

### Web
- **SPACE / CLICK** - Jump
- **ESC** - Back to menu

## 🎨 Difficulty Levels

### Easy
- Gravity: 0.35
- Pipe gap: 220px
- Speed: 2.5x
- Score multiplier: 1x

### Normal
- Gravity: 0.5
- Pipe gap: 200px
- Speed: 3.5x
- Score multiplier: 2x

### Hardcore
- Gravity: 0.65
- Pipe gap: 180px
- Speed: 4.5x
- Score multiplier: 3x

## 💰 Shop System
Collect coins by playing! Unlock:
- Bird skins (Golden, Rainbow, Robot)
- Obstacle styles (Crystal, Neon, Gold)

## 🔧 Settings
- Difficulty selection
- Volume controls (Music & SFX)
- Visual effects toggle
- Screen shake toggle
- VSync toggle
- Fullscreen mode

## 📊 Statistics
Game tracks:
- High score
- Total score
- Coins earned
- Perfect passes
- Combo streaks

## 🐛 Troubleshooting

### Windows Build Issues
- Pastikan PyInstaller terinstall
- Jalankan `pip install --upgrade pyinstaller`
- Disable antivirus sementara saat build

### Android Build Issues
- **Out of memory:** Tingkatkan RAM atau gunakan swap
- **SDK/NDK error:** Hapus folder `.buildozer` dan build ulang
- **Permission denied:** Jalankan `chmod +x build_android.sh`

### Web Build Issues
- **Module not found:** Install pygbag dengan `pip install pygbag`
- **Async errors:** Pastikan menggunakan `main_web.py` bukan `main.py`

## 🌐 Deployment

### GitHub Pages (Web)
1. Build web version: `pygbag --build main_web.py`
2. Copy contents dari `build/web/` ke GitHub Pages
3. Commit dan push

### Google Play Store (Android)
1. Build release APK: `buildozer android release`
2. Sign APK dengan keystore Anda
3. Upload ke Play Console

### Itch.io
Bisa upload versi Windows, Web, atau keduanya!

## 📝 License
Free to use and modify. Credit appreciated!

## 🤝 Contributing
Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📧 Contact
- Developer: Daffa Aditya Pratama
- Designer: Samsul Bahrur

## 🎮 Enjoy Playing!
