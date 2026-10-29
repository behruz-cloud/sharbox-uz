@echo off
title GitHub ga yuklash (sharbox.uz)
echo =========================================================
echo   GitHub repozitoriyangizga kodlarni yuklash:
echo   https://github.com/behruz-cloud/sharbox-uz.git
echo =========================================================
set "PATH=%LOCALAPPDATA%\Programs\MinGit\cmd;%PATH%"
git push -u origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo =========================================================
    echo  [MUVAFFAQIYATLI] Barcha kodlar GitHub ga yuklandi!
    echo =========================================================
) else (
    echo Agar xatolik bersa, GitHub Personal Access Token (PAT) kiriting.
)
pause
