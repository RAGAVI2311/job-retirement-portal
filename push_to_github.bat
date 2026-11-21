@echo off
echo ========================================================
echo   Pushing Employee Retirement Portal to GitHub
echo   Repository: https://github.com/RAGAVI2311/job-retirement-portal.git
echo ========================================================
echo.

set GIT_PATH="C:\Users\RAGAVI\AppData\Local\GitHubDesktop\app-3.6.11\resources\app\git\cmd\git.exe"

if not exist %GIT_PATH% (
    echo Git not found at expected path. Using system git...
    git push -u origin main
) else (
    %GIT_PATH% push -u origin main
)

echo.
if %ERRORLEVEL% equ 0 (
    echo [SUCCESS] Code pushed successfully to GitHub!
) else (
    echo [NOTE] If authentication is required, a browser window may appear to log in.
)
echo.
pause
