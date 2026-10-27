# CampusPulse Full-Stack Project

CampusPulse frontend (React + Vite) and backend (FastAPI + MongoDB).

## Authentication and security
- JWT access tokens (HS256, 12-hour expiry)
- bcrypt password hashing and verification
- Student/admin role-based authorization
- Public registration is student-only; admin account is provisioned with the seed command
- Password hashes are never returned by the API

## Requirements
- Docker Desktop
- Node.js and npm

## 1. Configure backend
Copy `backend/.env.example` to `backend/.env`.
Set `JWT_SECRET` to a long, random secret before use.

## 2. Start MongoDB and FastAPI
Run from the project root:
```bash
docker compose up --build -d
docker compose exec backend python -m app.seed_admin
```
API docs: http://localhost:8000/docs
Health: http://localhost:8000/api/health

Demo administrator (change/remove for real use):
- Email: admin@campuspulse.com
- Password: admin123

## 3. Start React
Open another terminal in the project root:
```bash
npm install
npm run dev
```
Frontend: http://localhost:5173

## API endpoints
- `POST /api/auth/register` — register student
- `POST /api/auth/login` — authenticate and return JWT
- `GET /api/auth/me` — current authenticated user
- `PATCH /api/profile` — update profile
- `GET /api/problems` — student's own reports or all reports for admins
- `POST /api/problems` — submit a student report
- `PATCH /api/problems/{id}/status` — admin-only status update
- `GET /api/admin/stats` — admin dashboard statistics

## Notes
- This is a development case-study project. Before deployment, configure a strong secret, HTTPS, secure token storage, backups, rate limiting, and production-grade logging.
- Existing browser localStorage data is not automatically migrated to MongoDB.
- Run and test on your machine; this package has not been verified against your local Docker setup.
