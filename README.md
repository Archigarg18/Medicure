# Heal Home Net - Hospital Management System

A comprehensive hospital management system with doctor scheduling, pharmacy, ambulance booking, blood bank, and more. Built with modern web technologies.

## 📁 Project Structure

```
heal-home-net/
├── frontend/                 # React + Vite + TypeScript
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
│
├── backend/                  # Node.js + Express + TypeScript + Prisma + MongoDB
│   ├── src/
│   │   ├── server.ts        # Main entry point
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── controllers/     # Business logic
│   │   ├── routes/          # API routes
│   │   └── utils/           # Utility functions
│   ├── prisma/
│   │   └── schema.prisma    # MongoDB schema
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
│
├── package.json             # Root package.json (optional, for scripts)
└── README.md               # This file
```

## 🎯 Features

- ✅ Doctor Listing & Filtering by Specialty
- ✅ Appointment Scheduling
- ✅ Pharmacy with Medicine Search & UPI Payment
- ✅ Ambulance Booking (Emergency & Regular)
- ✅ Blood Bank Inventory & Requests
- ✅ Hospital Bed Management
- ✅ Canteen Food Ordering with UPI Payment
- ✅ Period Tracker
- ✅ Contact Form with Embedded Map
- ✅ Admin Dashboard (planned)
- ✅ User Authentication & JWT
- ✅ Role-Based Access Control (User, Doctor, Admin)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB account (local or Atlas cloud)
- Git

### Installation & Running

#### 1. Clone Repository
```bash
git clone <repository-url>
cd heal-home-net
```

#### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your MongoDB connection and JWT secret
```

Add MongoDB connection string to `.env`:
```env
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/heal-home-net"
JWT_SECRET="your-super-secret-key"
PORT=5000
```

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations (creates database schema)
npm run prisma:migrate

# Start backend development server
npm run dev
```

Backend runs at: `http://localhost:5000`

#### 3. Setup Frontend (in new terminal)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:5173` (or next available port)

#### 4. Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **API Docs**: http://localhost:5000/docs

## 💻 Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (Build Tool)
- Tailwind CSS (Styling)
- Radix UI + shadcn/ui (Components)
- React Router (Navigation)
- React Query (State Management)
- Framer Motion (Animations)

### Backend
- Node.js + Express + TypeScript
- MongoDB (Database)
- Prisma ORM
- JWT Authentication
- Express Validator

## 📝 Environment Setup

### Backend .env

```env
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/heal-home-net"
PORT=5000
ENV=development
JWT_SECRET="your_secret_key"
JWT_EXPIRATION=24
CORS_ORIGIN=http://localhost:5173
```

## 🏗️ Architecture

```
Frontend (React)  →  API Calls  →  Backend (Express) →  MongoDB
   ↓                                    ↓
[Components]                   [Controllers/Routes]
[Pages]                        [Prisma ORM]
[Hooks]                        [Middleware]
```

## 📚 Documentation

- **Frontend Guide**: [frontend/README.md](frontend/README.md)
- **Backend Guide**: [backend/README.md](backend/README.md)
- **Database Schema**: [backend/prisma/schema.prisma](backend/prisma/schema.prisma)

## 📱 API Endpoints

### Doctors
```
GET    /api/doctors          # All doctors
GET    /api/doctors/:id      # Single doctor
POST   /api/doctors          # Create (admin)
```

### Other Services
- `/api/appointments` - Appointment booking
- `/api/pharmacy` - Medicine ordering
- `/api/ambulance` - Ambulance calls
- `/api/blood-bank` - Blood requests
- `/api/beds` - Bed availability
- `/api/canteen` - Food orders

## 🔐 Authentication

JWT tokens required for protected routes:
```bash
Authorization: Bearer <token>
```

User Roles: `user`, `doctor`, `admin`

## 🛠️ Development Commands

```bash
# Frontend
cd frontend
npm run dev          # Development server
npm run build        # Production build
npm run test         # Run tests

# Backend
cd backend
npm run dev          # Development server
npm run build        # Build
npm start            # Production
npm run prisma:studio  # Database GUI
```

## 🚀 Deployment

Suitable for:
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Heroku, Railway, Render, AWS EC2

## 📧 Support

For issues: Create a GitHub issue or contact support@healhome.net

## 📄 License

MIT License - Chitkara University, Rajpura, Punjab

**Version**: 1.0.0  
**Last Updated**: March 2026  
**Status**: Active Development ✨

### Running the application

To start the development server:

```sh
npm run dev
```

The application will be available at `http://localhost:8080`.

### Building for production

To create a production build:

```sh
npm run build
```

The output will be in the `dist` folder.
