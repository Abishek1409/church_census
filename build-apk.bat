@echo off
echo Building Church Census APK...
echo.
echo This will take 5-10 minutes on first run.
echo Please be patient...
echo.

cd android

echo Step 1: Cleaning previous builds...
call gradlew.bat clean

echo Step 2: Building APK...
call gradlew.bat assembleDebug

echo.
echo ==========================================
echo BUILD COMPLETE!
echo ==========================================
echo.
echo Your APK is located at:
echo android\app\build\outputs\apk\debug\app-debug.apk
echo.
pause
