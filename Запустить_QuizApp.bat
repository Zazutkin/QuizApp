@echo off
chcp 65001 >nul
title QuizApp AI Desktop
echo ========================================================
echo   Запуск QuizApp AI (Автономный режим для ПК)
echo ========================================================
echo.

:: 1. Проверяем Microsoft Edge (встроен в 100% Windows 10/11)
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --app="file:///%~dp0index.html" --window-size=1280,850
    exit
)

if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" --app="file:///%~dp0index.html" --window-size=1280,850
    exit
)

:: 2. Проверяем Google Chrome
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --app="file:///%~dp0index.html" --window-size=1280,850
    exit
)

if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" --app="file:///%~dp0index.html" --window-size=1280,850
    exit
)

:: 3. Универсальный запуск
start "" "%~dp0index.html"
exit
