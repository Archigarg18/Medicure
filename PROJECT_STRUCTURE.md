# Project Structure Overview

## Complete Restructured Layout

```
heal-home-net-main/
│
├── frontend/                          # React Frontend Application
│   ├── src/
│   │   ├── components/               # React Components
│   │   │   ├── ui/                  # UI Library (Radix UI)
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── PageLayout.tsx
│   │   │   └── ...
│   │   ├── pages/                    # Page Components
│   │   │   ├── Index.tsx            # Home Page
│   │   │   ├── Doctors.tsx          # Doctor Listing (Specialty Filter)
│   │   │   ├── Pharmacy.tsx         # Medicine Search & Ordering (UPI QR)
│   │   │   ├── Canteen.tsx          # Food Ordering (Quantity Controls, UPI QR)
│   │   │   ├── Contact.tsx          # Contact Form + Embedded Map
│   │   │   ├── Ambulance.tsx
│   │   │   ├── Appointments.tsx
│   │   │   ├── BloodBank.tsx
│   │   │   ├── Beds.tsx
│   │   │   ├── PeriodTracker.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   └── ...
│   │   ├── hooks/                    # Custom React Hooks
│   │   │   ├── use-mobile.tsx
│   │   │   └── use-toast.ts
│   │   ├── lib/                      # Utility Functions
│   │   │   ├── api.ts               # API calls
│   │   │   └── utils.ts
│   │   ├── App.tsx                   # Main App Component
│   │   ├── main.tsx                  # Entry Point
│   │   ├── index.css                 # Global Styles
│   │   └── vite-env.d.ts            # Vite Type Declarations
│   ├── public/                        # Static Assets
│   │   └── robots.txt
│   ├── index.html                     # HTML Template
│   ├── package.json                   # Dependencies (React, Vite, Tailwind, etc)
│   ├── tsconfig.json                  # TypeScript Config
│   ├── tsconfig.app.json             # App TypeScript Config
│   ├── tsconfig.node.json            # Node TypeScript Config
│   ├── vite.config.ts                # Vite Build Config
│   ├── vitest.config.ts              # Test Config
│   ├── tailwind.config.ts            # Tailwind CSS Config
│   ├── postcss.config.js             # PostCSS Config
│   ├── components.json               # shadcn Config
│   ├── eslint.config.js              # ESLint Config
│   └── README.md                      # Frontend Documentation
│
│
├── backend/                           # Node.js/Express Backend
│   ├── src/
│   │   ├── server.ts                # Main Entry Point
│   │   │                            # - Express server setup
│   │   │                            # - Middleware configuration
│   │   │                            # - Error handling
│   │   │                            # - CORS, body parser setup
│   │   │
│   │   ├── middleware/               # Express Middleware
│   │   │   ├── auth.ts              # JWT authentication & authorization
│   │   │   │                        # - authenticate()
│   │   │   │                        # - authorize(roles)
│   │   │   │                        # - generateToken()
│   │   │   │
│   │   │   └── validation.ts        # Request validation
│   │   │                            # - validate() middleware
│   │   │                            # - emailValidation()
│   │   │                            # - passwordValidation()
│   │   │                            # - doctorValidation()
│   │   │                            # - medicineValidation()
│   │   │
│   │   ├── controllers/              # Business Logic
│   │   │   ├── doctorController.ts  # Doctor CRUD operations
│   │   │   │                        # - getDoctors()
│   │   │   │                        # - getDoctor()
│   │   │   │                        # - createDoctor()
│   │   │   │                        # - updateDoctor()
│   │   │   │                        # - deleteDoctor()
│   │   │   │
│   │   │   ├── appointmentController.ts  # Appointment logic
│   │   │   ├── pharmacyController.ts     # Pharmacy orders
│   │   │   ├── ambulanceController.ts    # Ambulance requests
│   │   │   ├── bloodController.ts        # Blood bank
│   │   │   ├── canteenController.ts      # Canteen orders
│   │   │   ├── bedController.ts          # Bed management
│   │   │   └── contactController.ts      # Contact form
│   │   │
│   │   ├── routes/                   # API Route Definitions
│   │   │   ├── doctorRoutes.ts      # GET /api/doctors
│   │   │   ├── appointmentRoutes.ts # GET /api/appointments
│   │   │   ├── pharmacyRoutes.ts    # GET /api/pharmacy
│   │   │   ├── ambulanceRoutes.ts   # GET /api/ambulance
│   │   │   ├── bloodRoutes.ts       # GET /api/blood
│   │   │   ├── canteenRoutes.ts     # GET /api/canteen
│   │   │   ├── bedRoutes.ts         # GET /api/beds
│   │   │   ├── contactRoutes.ts     # POST /api/contact
│   │   │   └── authRoutes.ts        # POST /api/auth/login
│   │   │
│   │   └── utils/                    # Utility Functions
│   │       ├── db.ts                # Database helpers
│   │       ├── fileHandler.ts       # File upload helpers
│   │       └── response.ts          # Response formatting
│   │
│   ├── prisma/                       # Prisma ORM
│   │   ├── schema.prisma            # MongoDB Schema Definition
│   │   │                            # - User, Doctor, Appointment
│   │   │                            # - Medicine, Prescription
│   │   │                            # - BloodStock, BloodRequest
│   │   │                            # - Ambulance, AmbulanceRequest
│   │   │                            # - Bed, Contact, PeriodLog
│   │   │                            # - CanteenOrder
│   │   │
│   │   └── migrations/              # Database migrations (auto-generated)
│   │
│   ├── data/                         # Sample/Initial Data (if needed)
│   │   ├── doctors.json
│   │   ├── medicines.json
│   │   └── appointments.json
│   │
│   ├── dist/                         # Compiled Output (TypeScript → JavaScript)
│   │   └── (auto-generated)
│   │
│   ├── node_modules/                # Dependencies (git ignored)
│   │
│   ├── package.json                  # Backend Dependencies
│   │                                # - @prisma/client
│   │                                # - express, cors, morgan
│   │                                # - jsonwebtoken, bcryptjs
│   │                                # - express-validator
│   │                                # - typescript, tsx (dev)
│   │
│   ├── tsconfig.json                 # TypeScript Configuration
│   │
│   ├── .env.example                  # Environment Variables Template
│   ├── .env                          # Local env (git ignored, create from .env.example)
│   ├── .gitignore                    # Git ignore rules
│   ├── README.md                     # Backend Documentation
│   └── .prettierrc / .eslintrc       # Code formatting & linting
│
│
├── package.json                      # Root Package (optional)
├── bun.lockb                         # Bun lock file (if using bun)
├── .gitignore                        # Git ignore (root level)
└── README.md                         # Root Project Documentation
```

## 🎯 Technology & Dependencies by Layer

### Frontend Stack
```
UI Layer (React + TypeScript)
    ↓
Component Library (Radix UI, shadcn/ui)
    ↓
Styling (Tailwind CSS, Framer Motion)
    ↓
State Management (React Query, React Hook Form)
    ↓
Routing (React Router v6)
    ↓
API Client (custom fetch wrapper, axios, etc)
```

### Backend Stack
```
Express.js Server
    ↓
Middleware (Auth, Validation, CORS, Logger)
    ↓
Route Handlers
    ↓
Controllers (Business Logic)
    ↓
Prisma ORM
    ↓
MongoDB Database
```

## 📂 Key Files & Their Purpose

| File | Purpose |
|------|---------|
| `backend/src/server.ts` | Main server entry, middleware setup |
| `backend/src/middleware/auth.ts` | JWT authentication logic |
| `backend/src/middleware/validation.ts` | Request validation rules |
| `backend/controllers/*` | Business logic for each feature |
| `backend/routes/*` | API endpoint definitions |
| `backend/prisma/schema.prisma` | Database schema |
| `backend/.env.example` | Environment template |
| `frontend/src/App.tsx` | Main React App component |
| `frontend/src/main.tsx` | React entry point |
| `frontend/src/pages/*` | Page components |
| `frontend/vite.config.ts` | Vite build configuration |
| `README.md` | Project overview & setup |
| `backend/README.md` | Backend documentation |
| `frontend/README.md` | Frontend documentation |

## 🚀 Startup Sequence

1. **Backend First**
   ```bash
   cd backend
   npm install
   npm run prisma:migrate
   npm run dev
   # Runs on http://localhost:5000
   ```

2. **Frontend Second** (new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   # Runs on http://localhost:5173
   ```

3. **Access**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api
   - Database GUI: http://localhost:5555 (npm run prisma:studio)

## 🔄 Data Flow

```
User Action in Frontend
    ↓
React Component State Update
    ↓
API Call to Backend (fetch/axios)
    ↓
Express Router matches route
    ↓
Middleware validates request (auth, input)
    ↓
Controller processes business logic
    ↓
Prisma queries MongoDB
    ↓
Response sent back to Frontend
    ↓
Component re-renders with data
```

## 📊 Database Relationships

- **User** → has many Appointments, Prescriptions, BloodRequests, CanteenOrders
- **Doctor** → belongs to User, has many Appointments
- **Appointment** → belongs to User, Doctor
- **Medicine** → has many Prescriptions
- **Prescription** → belongs to User, Medicine
- **BloodStock** → has many BloodRequests
- **Ambulance** → has many AmbulanceRequests
- **Contact** → independent collection

## ✨ Features by Module

### 👨‍⚕️ Doctor Module
- List doctors with specialty filter
- View doctor details
- Book appointments
- Rate & review doctors

### 💊 Pharmacy Module
- Search medicines by name/category/type
- Add to cart with quantity controls
- Generate UPI QR for payment
- Track prescriptions

### 🚑 Ambulance Module
- Emergency & regular ambulance booking
- Real-time tracking
- Call history
- Fare estimation

### 🏥 Blood Bank Module
- Check blood stock by type
- Request blood donation
- Donation history
- Inventory management

### 🛏️ Beds Module
- Check bed availability
- Reserve bed
- View room/bed details
- Admission tracking

### 🍽️ Canteen Module
- Search food items
- Quantity management (+/- buttons)
- Room/bed input for delivery
- UPI QR payment generation

### 📅 Appointments Module
- Schedule appointments with doctors
- View appointment history
- Cancel/reschedule
- Reminders

### 📍 Contact Module
- Contact form submission
- Embedded Google Map
- Emergency numbers
- Location info

### ❤️ Period Tracker Module
- Log menstrual cycle
- Track symptoms
- Predictions & alerts
- Health insights

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control (RBAC)
- Request validation
- CORS protection
- Error handling middleware
- Environment variables for secrets

## 📝 Development Workflow

1. Create feature branch
2. Backend: Create migrations, models, controllers, routes
3. Frontend: Create components, hooks, pages
4. Test both
5. Commit with meaningful messages
6. Create pull request

---

**This clean, modular structure allows for:**
- ✅ Easy maintenance
- ✅ Scalability
- ✅ Team collaboration
- ✅ Clear separation of concerns
- ✅ Reusable components & logic
- ✅ Independent frontend/backend deployment

**Ready for production deployment!** 🚀
