@echo off
echo Starting Full-Stack Blog Platform with PostgreSQL...

echo.
echo Activating virtual environment...
call venv\Scripts\activate

echo.
echo Checking PostgreSQL connection...
cd blog_backend
python manage.py check

if errorlevel 1 (
    echo.
    echo ERROR: Database connection failed!
    echo Please check:
    echo 1. PostgreSQL is running
    echo 2. Database credentials in .env file
    echo 3. Database 'blog_db' exists
    pause
    exit /b 1
)

echo.
echo Starting Django backend...
start cmd /k "python manage.py runserver"

echo.
echo Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo.
echo Starting React frontend...
cd ..\blog_frontend
start cmd /k "npm start"

echo.
echo Development servers starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo Database: PostgreSQL (blog_db)
echo.
pause