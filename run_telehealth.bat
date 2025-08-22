@echo off
echo ================================================
echo    TELEHEALTH MVP - COMPLETE SETUP AND TEST
echo ================================================

echo.
echo [1/6] Checking Python and Node.js versions...
python --version
node --version
npm --version

echo.
echo [2/6] Installing Python dependencies...
pip install fastapi uvicorn sqlalchemy pydantic python-jose passlib bcrypt python-multipart reportlab PyJWT

echo.
echo [3/6] Testing backend imports...
cd /d "D:\telehealth\backend"
python -c "import main; print('✅ Backend imports successfully!')"

echo.
echo [4/6] Installing frontend dependencies...
cd /d "D:\telehealth\frontend"
npm install

echo.
echo [5/6] Testing backend startup...
cd /d "D:\telehealth\backend"
echo Starting backend on port 8001...
start /b uvicorn main:app --reload --host 0.0.0.0 --port 8001
echo Backend started on http://localhost:8001

echo.
echo [6/6] Setup complete!
echo ================================================
echo    TO RUN THE APPLICATION:
echo ================================================
echo.
echo Terminal 1 - Backend:
echo cd /d "D:\telehealth\backend"
echo uvicorn main:app --reload --host 0.0.0.0 --port 8001
echo.
echo Terminal 2 - Frontend:
echo cd /d "D:\telehealth\frontend"
echo npm start
echo.
echo Access URLs:
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8001
echo API Docs: http://localhost:8001/docs
echo.
pause