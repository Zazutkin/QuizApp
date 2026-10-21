@echo off
chcp 65001 >nul
title Установка нейросети Qwen 3.5 (9B) для QuizApp
color 0b

echo =======================================================================
echo          🧠 УСТАНОВКА ЛОКАЛЬНОГО ИИ QWEN 3.5 (9 МЛРД ПАРАМЕТРОВ)
echo =======================================================================
echo.
echo Это превратит QuizApp в полноценную автономную станцию с искусственным
echo интеллектом (генерация тестов, ИИ-ассистент, умные карточки, чат).
echo.

:: 1. Проверяем, установлен ли Ollama
where ollama >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [OK] Движок Ollama обнаружен на твоём компьютере!
    goto PULL_MODEL
)

if exist "%LOCALAPPDATA%\Programs\Ollama\ollama.exe" (
    echo [OK] Движок Ollama обнаружен в AppData!
    set "PATH=%LOCALAPPDATA%\Programs\Ollama;%PATH%"
    goto PULL_MODEL
)

echo [!] Движок Ollama пока не установлен.
echo Сейчас мы его скачаем (он бесплатный, безопасный и работает без интернета).
echo.
echo Вариант 1: Пытаемся установить автоматически через Windows Winget...
winget install Ollama.Ollama --accept-source-agreements --accept-package-agreements >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo [OK] Ollama успешно установлен через Winget!
    set "PATH=%LOCALAPPDATA%\Programs\Ollama;%PATH%"
    timeout /t 3 >nul
    goto PULL_MODEL
)

echo.
echo Вариант 2: Открываем официальную страницу Ollama...
start https://ollama.com/download/windows
echo.
echo 1. Нажми кнопку Download for Windows на открывшемся сайте.
echo 2. Запусти скачанный файл OllamaSetup.exe и нажми Install.
echo 3. Как только установка завершится, нажми любую клавишу в этом окне...
pause >nul

:PULL_MODEL
echo.
echo =======================================================================
echo          СКАЧИВАНИЕ НЕЙРОСЕТИ QWEN 3.5 (9B) (~6.6 ГБ)
echo =======================================================================
echo Идёт загрузка модели qwen3.5:9b...
echo Если прервётся интернет — можно запустить снова, загрузка продолжится.
echo.
ollama pull qwen3.5:9b

echo.
echo =======================================================================
echo 🎉 ПОЗДРАВЛЯЕМ! НЕЙРОСЕТЬ QWEN 3.5 УСПЕШНО УСТАНОВЛЕНА И ГОТОВА К РАБОТЕ!
echo =======================================================================
echo.
echo Теперь закрой это окно и дважды кликни по «Запустить_QuizApp.bat».
echo Вся мощь ИИ теперь работает на твоём ПК быстро, точно и приватно!
echo.
pause
