@echo off
chcp 65001 >nul
title Восстановление интернета
echo ========================================================
echo   Сброс системного прокси Windows
echo ========================================================
echo.
echo Отключаем прокси (127.0.0.1:10809)...
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable /t REG_DWORD /d 0 /f >nul
echo Обновляем параметры сети...
powershell -Command "$sig = @' [DllImport(\"wininet.dll\")] public static extern bool InternetSetOption(IntPtr h, int o, IntPtr b, int l); '@; $w = Add-Type -MemberDefinition $sig -Name 'W' -PassThru; $w::InternetSetOption(0, 39, 0, 0); $w::InternetSetOption(0, 37, 0, 0);" >nul 2>&1
echo.
echo [OK] Системный прокси отключен! Интернет работает напрямую.
echo.
pause
