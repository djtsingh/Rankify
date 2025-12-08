@echo off
REM Local testing script for Rankify API
echo.
echo ========================================
echo   Rankify API - Local Test Runner
echo ========================================
echo.

cd /d "%~dp0api"

echo [1/4] Cleaning build artifacts...
call npm run clean
if errorlevel 1 goto error

echo.
echo [2/4] Building project (Prisma + TypeScript)...
call npm run build
if errorlevel 1 goto error

echo.
echo [3/4] Starting Azure Functions locally...
echo.
echo API will be available at: http://localhost:7071
echo.
echo Test endpoints:
echo   - Health: http://localhost:7071/api/health
echo   - Test:   http://localhost:7071/api/test
echo.
echo Press Ctrl+C to stop the server
echo.

call func start --port 7071
goto end

:error
echo.
echo ERROR: Build or start failed!
echo.
pause
exit /b 1

:end
