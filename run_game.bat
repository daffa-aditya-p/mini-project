@echo off
REM Quick test script for Windows

echo 🎮 Testing Modern Flappy Bird
echo ==============================
echo.

REM Check Python
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python is not installed!
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)
echo ✅ Python found

REM Check dependencies
echo Checking dependencies...
python -c "import pygame; import numpy" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Installing dependencies...
    pip install -r requirements.txt
)
echo ✅ Dependencies installed

echo.
echo 🚀 Launching game...
echo.
python main.py
