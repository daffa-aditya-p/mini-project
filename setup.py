from setuptools import setup
import sys

APP = ['main.py']
DATA_FILES = []
OPTIONS = {
    'argv_emulation': True,
    'packages': ['pygame', 'numpy'],
    'iconfile': None,
}

if sys.platform == 'win32':
    import PyInstaller.__main__
    
    PyInstaller.__main__.run([
        'main.py',
        '--onefile',
        '--windowed',
        '--name=ModernFlappyBird',
        '--add-data=settings.json:.',
        '--hidden-import=pygame',
        '--hidden-import=numpy',
        '--icon=NONE',
    ])

setup(
    app=APP,
    data_files=DATA_FILES,
    options={'py2app': OPTIONS},
    setup_requires=['py2app'],
    name='Modern Flappy Bird',
    version='1.0',
    description='A modern take on Flappy Bird with pygame',
    author='Daffa Aditya Pratama',
    author_email='',
)
