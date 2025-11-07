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
