@echo off
echo ===========================================
echo      Auto-Deploy to Render
echo ===========================================
echo.

REM Try to find git
WHERE git >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git command not found in PATH.
    echo Searching for standard installations...
    
    IF EXIST "C:\Program Files\Git\bin\git.exe" (
        SET "GIT_CMD=C:\Program Files\Git\bin\git.exe"
    ) ELSE IF EXIST "C:\Users\%USERNAME%\AppData\Local\Programs\Git\bin\git.exe" (
        SET "GIT_CMD=C:\Users\%USERNAME%\AppData\Local\Programs\Git\bin\git.exe"
    ) ELSE (
        echo [FATAL] Could not find Git. Please install Git or use VS Code Source Control.
        pause
        exit /b 1
    )
) ELSE (
    SET "GIT_CMD=git"
)

echo Using Git at: %GIT_CMD%
echo.

echo 1. Adding changes...
"%GIT_CMD%" add .

echo 2. Committing changes...
"%GIT_CMD%" commit -m "Add Admin Dashboard and Bookings API - Auto"

echo 3. Pushing to GitHub (Triggering Render)...
"%GIT_CMD%" push origin main

IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo [WARNING] Push to 'main' failed. Trying 'master'...
    "%GIT_CMD%" push origin master
)

echo.
echo ===========================================
echo      Deployment Triggered!
echo ===========================================
echo Please wait 1-2 minutes for Render to build.
echo Then check your Admin Dashboard (Live Mode).
pause
