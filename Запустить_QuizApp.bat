@echo off
start chrome --app="%~dp0index.html"
if errorlevel 1 start chrome "%~dp0index.html"
if errorlevel 1 start "" "%~dp0index.html"
exit
