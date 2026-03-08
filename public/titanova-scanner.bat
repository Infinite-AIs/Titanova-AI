@echo off
echo Titanova Security Scanner
echo Starting Windows Defender full scan...
echo.

"C:\Program Files\Windows Defender\MpCmdRun.exe" -Scan -ScanType 2

echo.
echo Scan complete.
pause