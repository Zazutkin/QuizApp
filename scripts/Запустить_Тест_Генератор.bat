@echo off
chcp 65001 >nul
title QuizApp B2B SaaS 67 - Умный запуск

echo ========================================================
echo    🚀 QuizApp B2B SaaS 67 — Запуск без зависаний
echo ========================================================
echo.

:: 1. Автоматическое отключение зависшего системного прокси Windows
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable /t REG_DWORD /d 0 /f >nul 2>&1

:: 2. Проверка службы Ollama (локальная нейросеть)
echo [1/3] Проверка нейросети Ollama...
curl -s --max-time 1 http://127.0.0.1:11434/ >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Запуск Ollama в фоне...
    start "" "%LOCALAPPDATA%\Programs\Ollama\ollama.exe" serve
    timeout /t 2 /nobreak >nul
) else (
    echo [OK] Ollama активна и готова к работе!
)

:: 3. Проверка сервера веб-поиска Qwen (порт 5005)
echo.
echo [2/3] Проверка сервера интернет-поиска (порт 5005)...
curl -s --max-time 1 http://127.0.0.1:5005/api/status >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Запуск Qwen моста в фоновом режиме...
    if exist "%LOCALAPPDATA%\Programs\Python\Python312\pythonw.exe" (
        start "" "%LOCALAPPDATA%\Programs\Python\Python312\pythonw.exe" "C:\Users\Zazuu\Desktop\qwen_search_agent\qwen_server.py"
    ) else (
        start /min "" python "C:\Users\Zazuu\Desktop\qwen_search_agent\qwen_server.py"
    )
    timeout /t 1 /nobreak >nul
) else (
    echo [OK] Сервер поиска уже запущен и онлайн!
)

:: 4. Открытие приложения в Google Chrome или браузере
echo.
echo [3/3] Открытие QuizApp...
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --app="file:///C:/Users/Zazuu/Desktop/freelance tasks/QuizApp/index.html" --window-size=1360,900
    exit
)

start "" "C:\Users\Zazuu\Desktop\freelance tasks\QuizApp\index.html"
exit
