# Full-Stack Blog Platform

A modern blog platform built with Django REST Framework and React, using PostgreSQL database.

## Prerequisites

- Python 3.8+
- Node.js 14+
- PostgreSQL 12+

## Quick Setup

1. **Clone and navigate to project:**
   ```bash
   cd "Full-Stack Blog Platform"
   ```

2. **Run setup script:**
   ```bash
   setup.bat
   ```

3. **Configure PostgreSQL:**
   - Install PostgreSQL if not already installed
   - Create database: `CREATE DATABASE blog_db;`
   - Update `blog_backend/.env` with your credentials

4. **Start development:**
   ```bash
   start_development.bat
   ```

## Manual Setup

### Backend Setup (Django + PostgreSQL)

1. **Create virtual environment:**
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   cd blog_backend
   pip install -r requirements.txt
   ```

3. **Configure database:**
   ```bash
   # Create .env file with:
   DB_NAME=blog_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   ```

4. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   ```

5. **Start server:**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup (React)

1. **Install dependencies:**
   ```bash
   cd blog_frontend
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

## Project Structure

```
Full-Stack Blog Platform/
├── venv/                 # Python virtual environment
├── blog_backend/         # Django REST API
│   ├── .env             # Environment variables
│   ├── requirements.txt # Python dependencies
│   └── ...
├── blog_frontend/        # React frontend
│   ├── package.json     # Node.js dependencies
│   └── ...
└── README.md
```

## Database

This project uses **PostgreSQL** for data storage:
- Development: Local PostgreSQL instance
- Production: Configure with your PostgreSQL service

## Technologies

- **Backend:** Django 4.2.5, DRF, PostgreSQL, JWT Authentication
- **Frontend:** React 18, Axios, React Router
- **Database:** PostgreSQL with psycopg2-binary