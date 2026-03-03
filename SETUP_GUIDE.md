# 🚀 Quick Start Setup Guide

## ⚡ 5-Minute Setup

### Step 1: Backend Setup (5 min)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env - Add your MongoDB connection string
# DATABASE_URL="mongodb+srv://user:password@cluster..."
# JWT_SECRET="your-secret-key"

# Generate Prisma Client
npm run prisma:generate

# Create database tables
npm run prisma:migrate

# Start backend development server
npm run dev
```

**Backend ready at:** `http://localhost:5000`

---

### Step 2: Frontend Setup (3 min)

**Open a NEW terminal/PowerShell**

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend ready at:** `http://localhost:5173`

---

## ✅ What's Been Set Up

### Backend (`/backend`)
✅ **Express.js Server**
- Entry point: `src/server.ts`
- Middleware: Auth, Validation, CORS, Logger
- Controllers: Business logic for each feature
- Routes: API endpoint definitions
- Prisma ORM: MongoDB integration

✅ **Database Schema**
- 13 Prisma models (User, Doctor, Appointment, etc)
- MongoDB ready
- Prisma Studio GUI for data management

✅ **Authentication**
- JWT-based auth middleware
- Role-based access control (User, Doctor, Admin)
- Password hashing with bcryptjs

✅ **API Endpoints** (all routes ready)
- Doctors: GET, POST, PUT, DELETE
- Appointments, Pharmacy, Ambulance, Blood, Beds, Canteen, Contact
- Authentication routes

### Frontend (`/frontend`)
✅ **React Application**
- All components intact (Navbar, Footer, etc)
- All pages working (Doctors, Pharmacy, Canteen, Contact, etc)
- Styling with Tailwind CSS
- Vite build tool
- TypeScript support

✅ **Features Already Built**
- Doctor listing with specialty filter ✓
- Pharmacy with search & UPI QR ✓
- Canteen with quantity controls & UPI QR ✓
- Contact form with embedded map ✓
- Footer with newsletter & social links ✓
- Responsive design ✓

---

## 📁 Cleaner Structure

```
Before:
├── backend/
├── src/ (frontend)
└── config files

After:
├── backend/          [Clean TypeScript + Prisma setup]
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── .env.example
│
├── frontend/         [React + Vite ready to go]
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
│
└── README.md         [Complete documentation]
```

---

## 🔧 Common Commands

### Backend
```bash
cd backend

npm run dev              # Start development server (auto-reload)
npm run build            # Compile TypeScript
npm start                # Run production build
npm run prisma:migrate   # Update database schema
npm run prisma:studio    # Open database GUI (http://localhost:5555)
npm run prisma:generate  # Generate Prisma Client
npm run lint             # Check code quality
npm run format           # Auto-format code
```

### Frontend
```bash
cd frontend

npm run dev              # Start development server
npm run build            # Create production build
npm run preview          # Preview production build
npm run test             # Run tests
npm run lint             # Check code quality
```

---

## 📝 Environment Variables

### Backend (.env)
Required variables:
```env
# Database (MongoDB Atlas)
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/heal-home-net"

# Server
PORT=5000
ENV=development

# JWT Authentication
JWT_SECRET="your_super_secret_key_here_change_in_production"
JWT_EXPIRATION=24

# Frontend URL (CORS)
CORS_ORIGIN=http://localhost:5173

# Optional (Email, SMS, Payment)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Frontend
No authentication required. Automatically connects to `http://localhost:5000`

---

## 🔗 API Connection

Frontend automatically connects to backend. If backend runs on different port:

Edit `frontend/src/lib/api.ts`:
```typescript
const API_BASE = "http://localhost:5000/api"  // Change port here if needed
```

---

## 🗄️ Database Setup

### MongoDB Atlas (Cloud - Recommended)
1. Sign up: https://mongodb.com/cloud/atlas
2. Create cluster (free tier available)
3. Get connection string
4. Add to `.env`: `DATABASE_URL="mongodb+srv://..."`
5. Whitelist your IP in MongoDB (Network Access)

### MongoDB Local
```bash
# Install MongoDB locally
# Connection string: mongodb://localhost:27017/heal-home-net
```

---

## 🔐 MongoDB Atlas IP Whitelist

If you get connection error:
1. Go to MongoDB Atlas Dashboard
2. Network Access → IP Whitelist
3. Add current IP or allow all (0.0.0.0/0)
4. Wait 1-2 minutes for changes to apply

---

## 📊 Database GUI

View and manage data easily:
```bash
cd backend
npm run prisma:studio
```

Opens at: `http://localhost:5555`

---

## ✨ Key Features Ready to Use

| Feature | Status | File |
|---------|--------|------|
| Doctor Listing + Filter | ✅ | `frontend/src/pages/Doctors.tsx` |
| Pharmacy Search + QR | ✅ | `frontend/src/pages/Pharmacy.tsx` |
| Canteen with Qty Controls | ✅ | `frontend/src/pages/Canteen.tsx` |
| Contact + Map | ✅ | `frontend/src/pages/Contact.tsx` |
| Footer with Newsletter | ✅ | `frontend/src/components/Footer.tsx` |
| API Controllers | ✅ | `backend/src/controllers/` |
| Auth Middleware | ✅ | `backend/src/middleware/auth.ts` |
| Database Schema | ✅ | `backend/prisma/schema.prisma` |

---

## 🚀 Ready to Deploy?

### Frontend
```bash
cd frontend
npm run build
# dist/ folder ready for deployment
```

Deploy to: Vercel, Netlify, GitHub Pages, AWS S3

### Backend
```bash
cd backend
npm run build
npm start
```

Deploy to: Railway, Render, Heroku, AWS EC2

---

## 🐛 Troubleshooting

### Port already in use
```bash
# Frontend (try different port)
npm run dev -- --port 3000

# Backend (update PORT in .env)
PORT=3001 npm run dev
```

### MongoDB connection error
- ✓ Check CONNECTION STRING in .env
- ✓ Check WHITELIST in MongoDB Atlas
- ✓ Verify cluster is RUNNING
- ✓ Check internet connection

### Cannot find module errors
```bash
# Regenerate dependencies
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Prisma issues
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

---

## 📚 Documentation

- **Full Project Guide**: [README.md](README.md)
- **Project Structure**: [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
- **Backend Docs**: [backend/README.md](backend/README.md)
- **Frontend Docs**: [frontend/README.md](frontend/README.md)
- **Database Schema**: [backend/prisma/schema.prisma](backend/prisma/schema.prisma)

---

## 🎓 Next Steps

1. ✅ Setup Backend & Frontend (done!)
2. ⏭️ Create MongoDB database
3. ⏭️ Configure JWT secrets
4. ⏭️ Test API endpoints
5. ⏭️ Connect to payment gateway (optional)
6. ⏭️ Deploy to production

---

## 💡 Tips

- Use Prisma Studio for easy database browsing
- Frontend can run without backend (uses placeholder data)
- Backend can be tested with Postman/Insomnia
- Check browser console for frontend errors
- Check terminal for backend errors

---

## 🎯 Project Status

✅ **All files reorganized**
✅ **Backend fully structured with TypeScript**
✅ **Prisma ORM with MongoDB ready**
✅ **All API routes scaffolded**
✅ **Frontend features working**
✅ **Documentation complete**

**Ready for development!** 🚀

---

**Questions?** Check the README files or project documentation.

**Last Updated**: March 2026
