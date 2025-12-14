@echo off
echo ========================================
echo   AI Invoice Automation - Deployment
echo ========================================
echo.

:menu
echo Choose deployment option:
echo.
echo [1] Start Local Development Server
echo [2] Build for Production
echo [3] Deploy to Vercel
echo [4] Deploy Smart Contract to Sepolia
echo [5] Run All Tests
echo [6] Exit
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto local
if "%choice%"=="2" goto build
if "%choice%"=="3" goto vercel
if "%choice%"=="4" goto blockchain
if "%choice%"=="5" goto test
if "%choice%"=="6" goto end

:local
echo.
echo Starting local development server...
npm run dev
goto menu

:build
echo.
echo Building for production...
npm run build
echo.
echo Build complete! Run 'npm start' to test production build.
pause
goto menu

:vercel
echo.
echo Deploying to Vercel...
echo Make sure you have Vercel CLI installed: npm i -g vercel
echo.
vercel
pause
goto menu

:blockchain
echo.
echo Deploying smart contract to Sepolia...
echo Make sure you have:
echo 1. Sepolia ETH in your wallet
echo 2. .env file configured in blockchain folder
echo.
cd blockchain
npm run deploy:sepolia
cd ..
pause
goto menu

:test
echo.
echo Running all tests...
npm run test:contract
pause
goto menu

:end
echo.
echo Goodbye!
exit
