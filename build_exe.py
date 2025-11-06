"""
Build script for creating Windows executable
Run: python build_exe.py
"""
import PyInstaller.__main__
import os

# Create the executable
PyInstaller.__main__.run([
    'main.py',
    '--onefile',
    '--windowed',
    '--name=ModernFlappyBird',
    '--clean',
    '--noconfirm',
    f'--distpath={os.path.join(os.getcwd(), "dist", "windows")}',
    f'--workpath={os.path.join(os.getcwd(), "build", "windows")}',
    '--hidden-import=pygame',
    '--hidden-import=numpy',
    '--hidden-import=pygame.mixer',
    '--hidden-import=pygame.gfxdraw',
    '--collect-all=pygame',
])

print("\n" + "="*60)
print("BUILD COMPLETED!")
print("="*60)
print(f"Executable location: {os.path.join(os.getcwd(), 'dist', 'windows', 'ModernFlappyBird.exe')}")
print("="*60)
