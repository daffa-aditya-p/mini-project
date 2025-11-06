# 🎮 Modern Flappy Bird

[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![Pygame](https://img.shields.io/badge/Pygame-2.5.2-green.svg)](https://www.pygame.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, feature-rich remake of the classic Flappy Bird game with stunning visual effects, multiple platforms support, and advanced gameplay mechanics!

![Game Preview](https://via.placeholder.com/800x400/88101f2/FFFFFF?text=Modern+Flappy+Bird)

## ✨ Features

🎨 **Modern UI/UX**
- Beautiful gradient backgrounds with dynamic animations
- Smooth particle effects system
- Screen shake and visual feedback
- Animated menus with hover effects

🎮 **Advanced Gameplay**
- **3 Difficulty Levels:** Easy, Normal, Hardcore
- **Combo System:** Chain perfect passes for bonus points
- **Score Multipliers:** Higher difficulty = more points
- **Invincibility Frames:** Second chance system
- **Progressive Difficulty:** Speed increases as you improve

💎 **Shop & Customization**
- Unlock bird skins (Golden, Rainbow, Robot)
- Collect obstacle styles (Crystal, Neon, Gold)
- Earn coins through gameplay
- Persistent save system

🔊 **Dynamic Audio**
- Procedurally generated sound effects
- Volume controls (Music & SFX)
- Satisfying audio feedback

⚙️ **Settings & Options**
- Adjustable difficulty
- Particle effects toggle
- Screen shake control
- VSync and fullscreen support
- Customizable controls

## 👥 Credits

- **Daffa Aditya Pratama** - Lead Developer
- **Samsul Bahrur** - Game Designer

## 🚀 Quick Start

### Prerequisites
```bash
Python 3.12+
pip (Python package manager)
```

### Installation & Run
```bash
# Clone the repository
git clone https://github.com/daffa-aditya-p/mini-project.git
cd mini-project

# Install dependencies
pip install -r requirements.txt

# Run the game
python main.py
```

## 📦 Downloads

### Pre-built Binaries

#### 🪟 Windows
Download `ModernFlappyBird.exe` from [Releases](https://github.com/daffa-aditya-p/mini-project/releases)

#### 🤖 Android
Download `modernflappybird.apk` from [Releases](https://github.com/daffa-aditya-p/mini-project/releases)

#### 🌐 Web Version
Play online: [Game Link](https://daffa-aditya-p.github.io/mini-project/)

## 🔨 Build From Source

### Windows (.exe)
```bash
pip install -r requirements.txt
python build_exe.py
```
Output: `dist/windows/ModernFlappyBird.exe`

### Android (.apk)
```bash
# Install buildozer (Linux only)
pip install buildozer cython

# Install Android dependencies
sudo apt install -y git zip unzip openjdk-17-jdk python3-pip \
    autoconf libtool pkg-config zlib1g-dev libncurses5-dev \
    libncursesw5-dev libtinfo5 cmake libffi-dev libssl-dev

# Build APK
chmod +x build_android.sh
./build_android.sh
```
Output: `bin/modernflappybird-1.0-debug.apk`

### Web (HTML5)
```bash
pip install pygbag
python -m pygbag --build main_web.py
```
Output: `build/web/`

For detailed build instructions, see [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md)

## 🎯 How to Play

### Controls
- **Desktop:** Press `SPACE` to jump, `ESC` for menu
- **Mobile:** Tap screen to jump
- **Web:** Click or press `SPACE` to jump

### Objective
- Navigate through pipes by jumping
- Pass through the center for perfect passes
- Chain combos for bonus points
- Collect coins to unlock items in the shop
- Beat your high score!

### Scoring
- **Normal Pass:** 1-3 points (based on difficulty)
- **Perfect Pass:** +2 bonus points
- **Combo Multiplier:** Every 3 combos increases coin rewards
- **Speed Bonus:** Score multiplier increases every 10 points

## 🎨 Difficulty Levels

| Difficulty | Gravity | Pipe Gap | Speed | Multiplier |
|-----------|---------|----------|-------|------------|
| Easy      | 0.35    | 220px    | 2.5x  | 1x         |
| Normal    | 0.50    | 200px    | 3.5x  | 2x         |
| Hardcore  | 0.65    | 180px    | 4.5x  | 3x         |

## 📊 Stats & Progression

The game tracks:
- **High Score:** Your best run
- **Total Coins:** Currency for shop
- **Perfect Passes:** Center-line passes
- **Max Combo:** Longest combo streak
- **Unlockables:** Skins and themes

## 🛠️ Technology Stack

- **Game Engine:** Pygame 2.5.2
- **Math/Physics:** NumPy 1.26.2
- **Packaging:** PyInstaller 6.3.0
- **Mobile Build:** Buildozer (python-for-android)
- **Web Build:** Pygbag 0.9.2

## 📁 Project Structure

```
mini-project/
├── main.py                 # Full game (desktop)
├── main_web.py            # Web-optimized version
├── build_exe.py           # Windows build script
├── build_android.sh       # Android build script
├── buildozer.spec         # Android config
├── requirements.txt       # Dependencies
├── BUILD_INSTRUCTIONS.md  # Detailed build guide
├── README.md             # This file
└── dist/                 # Build outputs
    ├── windows/          # Windows builds
    └── web/              # Web builds
```

## 🐛 Known Issues & Troubleshooting

### Windows
- Antivirus may flag the .exe (false positive)
- Solution: Add exception or build from source

### Android
- First build takes 30-60 minutes
- Requires 4GB RAM minimum
- Linux environment recommended

### Web
- Use `main_web.py` not `main.py`
- Some features simplified for web

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- Original Flappy Bird by Dong Nguyen
- Pygame community for excellent documentation
- All contributors and players!

## 📧 Contact

- **Developer:** Daffa Aditya Pratama
- **Designer:** Samsul Bahrur
- **Repository:** [github.com/daffa-aditya-p/mini-project](https://github.com/daffa-aditya-p/mini-project)

## 🎮 Screenshots

<details>
<summary>Click to view more screenshots</summary>

### Main Menu
![Main Menu](https://via.placeholder.com/400x300/88101f2/FFFFFF?text=Main+Menu)

### Gameplay
![Gameplay](https://via.placeholder.com/400x300/88101f2/FFFFFF?text=Gameplay)

### Shop
![Shop](https://via.placeholder.com/400x300/88101f2/FFFFFF?text=Shop)

### Settings
![Settings](https://via.placeholder.com/400x300/88101f2/FFFFFF?text=Settings)

</details>

---

<p align="center">
Made with ❤️ by Daffa Aditya Pratama & Samsul Bahrur
</p>

<p align="center">
⭐ Star this repo if you enjoy playing!
</p>