@echo off
echo Setting up Full-Stack Blog Platform with PostgreSQL...

echo.
echo Creating virtual environment...
python -m venv venv

echo.
echo Activating virtual environment...
call venv\Scripts\activate

echo.
echo Installing Python dependencies...
cd blog_backend
pip install -r requirements.txt

echo.
echo Please ensure PostgreSQL is installed and running.
echo Create database 'blog_db' if it doesn't exist.
echo Update .env file with your PostgreSQL credentials.
echo.
pause

echo.
echo Setting up Django database...
python manage.py makemigrations
python manage.py migrate

echo.
echo Installing Node.js dependencies...
cd ..\blog_frontend
npm install

echo.
echo Setup complete!
echo.
echo To start development, run: start_development.bat
echo.
pause