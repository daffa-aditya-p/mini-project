# 🎮 Modern Flappy Bird - Release Notes

## Version 1.0.0 - Initial Release

### 🎉 What's New

This is the first official release of Modern Flappy Bird - a complete remake of the classic game with modern features and multi-platform support!

### ✨ Features

#### Gameplay
- **3 Difficulty Levels:** Easy, Normal, and Hardcore modes with different physics and scoring
- **Combo System:** Chain perfect passes for massive score bonuses
- **Perfect Pass Mechanic:** Fly through the center of pipes for extra points
- **Progressive Difficulty:** Game speed increases as you improve
- **Invincibility Frames:** Get a second chance after hitting obstacles
- **Dynamic Scoring:** Difficulty-based score multipliers

#### Visual Effects
- **Particle System:** Stunning visual effects for jumps, explosions, and achievements
- **Dynamic Backgrounds:** Animated gradient backgrounds with parallax effects
- **Screen Shake:** Impactful collision feedback
- **Smooth Animations:** Butter-smooth 60 FPS gameplay
- **Modern UI:** Clean, animated menus with hover effects

#### Customization
- **Shop System:** Unlock new bird skins and obstacle styles
- **Multiple Bird Skins:** Default, Golden, Rainbow, and Robot birds
- **Obstacle Themes:** Crystal, Neon, and Gold pipe styles
- **Persistent Progress:** Your unlocks and high scores are saved

#### Audio
- **Procedural Sound Effects:** Unique sounds generated using NumPy
- **Volume Controls:** Separate music and SFX volume sliders
- **Dynamic Audio:** Sound pitch changes based on combo multiplier

#### Settings
- Difficulty selection
- Graphics options (particles, screen shake, VSync)
- Fullscreen support
- Customizable controls
- FPS display toggle

### 📦 Platform Support

#### ✅ Windows (Ready to Use)
- **File:** `ModernFlappyBird.exe`
- **Size:** ~61 MB
- **Requirements:** Windows 7+ (64-bit)
- **Installation:** Just download and run!

#### ✅ Web Browser (Play Online)
- **Access:** Open `build/web/index.html` in any modern browser
- **Size:** ~20 KB + assets
- **Requirements:** Modern browser with WebAssembly support
- **Features:** Simplified version optimized for web

#### 📱 Android (Build Script Included)
- **Script:** `build_android.sh`
- **Output:** APK file for Android devices
- **Requirements:** Linux build environment
- **Instructions:** See BUILD_INSTRUCTIONS.md

### 🎯 Game Modes

| Mode     | Gravity | Pipe Gap | Speed | Score Multiplier |
|----------|---------|----------|-------|------------------|
| Easy     | 0.35    | 220px    | 2.5x  | 1x              |
| Normal   | 0.50    | 200px    | 3.5x  | 2x              |
| Hardcore | 0.65    | 180px    | 4.5x  | 3x              |

### 📊 Scoring System

- **Pass Pipe:** 1-3 points (based on difficulty)
- **Perfect Pass:** +2 bonus points (within 10px of center)
- **Near Miss:** +1 bonus point (within 30px of center)
- **Combo Bonus:** Coin multiplier increases every 3 combos
- **Speed Multiplier:** Game speeds up every 10 points

### 🏪 Shop Items

#### Bird Skins
- **Default:** Free (Yellow bird)
- **Golden:** 100 coins
- **Rainbow:** 500 coins
- **Robot:** 999 coins

#### Obstacle Styles
- **Default:** Free (Blurple pipes)
- **Crystal:** 150 coins
- **Neon:** 300 coins
- **Gold:** 750 coins

### 🎮 Controls

#### Desktop
- **SPACE:** Jump
- **ESC:** Pause / Return to menu
- **R:** Quick restart (when game over)
- **Mouse:** Navigate menus

#### Mobile/Touch
- **Tap Screen:** Jump
- **Tap Buttons:** Navigate menus

#### Web
- **SPACE / Click:** Jump
- **ESC:** Return to menu

### 🔧 Technical Details

- **Engine:** Pygame 2.5.2
- **Math Library:** NumPy 1.26.2
- **Python Version:** 3.12+
- **Resolution:** 1024x768 (scalable)
- **Target FPS:** 60

### 📥 Download & Installation

#### Windows
1. Download `ModernFlappyBird.exe` from the releases page
2. Double-click to run
3. If Windows Defender warns you, click "More info" → "Run anyway"
   (This is a false positive due to PyInstaller)

#### Python (All Platforms)
```bash
git clone https://github.com/daffa-aditya-p/mini-project.git
cd mini-project
pip install -r requirements.txt
python main.py
```

#### Web
1. Download the repository
2. Navigate to `build/web/`
3. Open `index.html` in your browser
4. Or host it on any web server

### 🐛 Known Issues

1. **Windows Antivirus:** May flag the .exe as suspicious (false positive)
   - **Solution:** Add to antivirus exceptions or build from source

2. **Web Version:** Some features are simplified
   - No shop system
   - Simplified audio
   - Limited particle effects

3. **Android Build:** Requires specific Linux environment
   - First build takes 30-60 minutes
   - Needs 4GB+ RAM
   - See BUILD_INSTRUCTIONS.md for details

### 🔮 Future Plans

- Online leaderboards
- Daily challenges
- More bird skins and themes
- Multiplayer race mode
- Mobile touch controls optimization
- Additional power-ups
- Achievement system
- Cloud save support

### 👥 Credits

- **Developer:** Daffa Aditya Pratama
- **Designer:** Samsul Bahrur

### 🙏 Acknowledgments

- Original Flappy Bird by Dong Nguyen
- Pygame community
- All playtesters and contributors

### 📜 License

MIT License - Free to use and modify

### 🔗 Links

- **Repository:** https://github.com/daffa-aditya-p/mini-project
- **Issues:** https://github.com/daffa-aditya-p/mini-project/issues
- **Discussions:** https://github.com/daffa-aditya-p/mini-project/discussions

### 📧 Support

Having issues? Check our troubleshooting guide in BUILD_INSTRUCTIONS.md or open an issue on GitHub!

---

## Changelog

### [1.0.0] - 2025-11-06

#### Added
- Initial release
- Complete game with all core features
- Multi-platform support (Windows, Web, Android build)
- Shop system with unlockables
- Settings and customization options
- High score tracking
- Complete documentation

#### Features
- 3 difficulty modes
- Particle effects system
- Dynamic audio generation
- Combo and scoring system
- Modern UI with animations
- Persistent save system

#### Platform Specific
- Windows: Standalone .exe build
- Web: Browser-playable HTML5 version
- Android: Build script and configuration

---

**Enjoy playing! 🎮✨**

If you enjoy the game, please:
- ⭐ Star the repository
- 🐛 Report bugs
- 💡 Suggest features
- 🎨 Share your high scores!
