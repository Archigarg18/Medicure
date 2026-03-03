# HEAL HOME NET - BACKEND COMPLETE GUIDE

## 📋 OVERVIEW

Our backend is a **Node.js + Express.js** server that handles:
- Appointment bookings
- Contact messages
- User data management
- File-based JSON storage (no database required for now)

---

## 🏗️ BACKEND FILE STRUCTURE

```
backend/
├── src/
│   └── server.ts              ⭐ MAIN SERVER FILE (TypeScript)
├── routes/
│   ├── contact.js             ✉️  Contact form submissions
│   └── appointments.js        📅 Appointment bookings
├── utils/
│   ├── fileHandler.js         📁 Read/write JSON files
│   └── db.js                  🗄️  Database utilities
├── data/
│   ├── messages.json          💬 Stores contact messages
│   └── appointments.json      📋 Stores appointments
├── models/ (Old - not used)
├── prisma/
│   └── schema.prisma          🗂️  Database schema definition
├── package.json               📦 Dependencies & scripts
└── server-simple.js           🆘 Backup simple server (if needed)
```

---

## 🔧 WHAT EACH FILE DOES

### 1. **backend/src/server.ts** ⭐ (MAIN FILE)

**Purpose:** Start the Express server and register all routes

**What it does:**
- Imports Express, CORS, Morgan (logging), and routes
- Sets up middleware (CORS, JSON parser, logging)
- Registers API routes:
  - `/api/contact` → contact form handling
  - `/api/appointments` → appointment booking
- Starts server on port 5000-5010 (auto-retry if port busy)

**Key Features:**
- ✅ Auto-detects and uses available port
- ✅ CORS enabled (allows frontend to communicate)
- ✅ Error handling for port conflicts
- ✅ Health check endpoint: `/health`

---

### 2. **backend/routes/contact.js** ✉️

**Purpose:** Handle contact form submissions

**What it does:**
- **POST /api/contact** - Receives form data
  - Validates: name, email, message (required)
  - Creates unique message ID
  - Saves to `backend/data/messages.json`
  - Returns success response

- **GET /api/contact** - Fetches all messages
  - Returns all stored messages as JSON

**Request Example:**
```json
{
  "name": "Garg",
  "email": "garg45@gmail.com",
  "phone": "09463209845",
  "message": "I need help booking an appointment"
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "messageData": {
    "id": 1709472000000,
    "name": "Garg",
    "email": "garg45@gmail.com",
    "phone": "09463209845",
    "message": "I need help booking an appointment",
    "createdAt": "2026-03-03T10:30:00.000Z"
  }
}
```

---

### 3. **backend/routes/appointments.js** 📅

**Purpose:** Handle appointment booking

**What it does:**
- **POST /api/appointments** - Books new appointment
  - Validates: name, email, phone, department, date, time (required)
  - Doctor is optional (defaults to "Not specified")
  - Creates unique appointment ID
  - Saves to `backend/data/appointments.json`
  - Returns appointment details

- **GET /api/appointments** - Fetches all appointments
  - Returns all stored appointments

**Request Example:**
```json
{
  "name": "Garg",
  "email": "garg45@gmail.com",
  "phone": "09463209845",
  "department": "Cardiology",
  "doctor": "Dr. Priya Sharma",
  "date": "03-03-2026",
  "time": "20:58",
  "notes": "Regular checkup"
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "appointment": {
    "id": 1709472000000,
    "name": "Garg",
    "email": "garg45@gmail.com",
    "phone": "09463209845",
    "department": "Cardiology",
    "doctor": "Dr. Priya Sharma",
    "date": "03-03-2026",
    "time": "20:58",
    "notes": "Regular checkup",
    "createdAt": "2026-03-03T10:30:00.000Z"
  }
}
```

---

### 4. **backend/utils/fileHandler.js** 📁

**Purpose:** Read and write JSON files

**What it does:**
- **readData(filename)** - Reads JSON file from `backend/data/` folder
  - Returns empty array `[]` if file doesn't exist
  - Parses JSON and returns data

- **writeData(filename, data)** - Writes data to JSON file
  - Creates `backend/data/` directory if missing
  - Saves data as formatted JSON

**Example Usage in routes:**
```javascript
const messages = await readData("messages.json");  // Read
await writeData("messages.json", messages);        // Write
```

---

### 5. **backend/prisma/schema.prisma** 🗂️

**Purpose:** Define database models (ready for future MongoDB integration)

**What it defines:**
- User model (name, email, password, role)
- Doctor model (specialty, rating, available slots)
- Appointment model (user, doctor, department, date, time)
- Blood bank, Ambulance, Pharmacy, etc.

**Note:** ⚠️ Currently we're using JSON files, NOT MongoDB. This schema is ready for when you want to add a real database.

---

## 🌍 WHAT WE CHANGED IN THE BACKEND

### Change 1: Fixed Port Issue ✅
**Problem:** Backend was failing to start because port conflicts
**Solution:** Added auto-retry logic
```typescript
// Tries ports 5000, 5001, 5002, 5003... up to 5009
if (err && err.code === "EADDRINUSE") {
  PORT += 1;  // Try next port
}
```

### Change 2: Registered Routes ✅
**Problem:** Routes weren't being used
**Solution:** Added route imports and registration in server.ts
```typescript
import contactRouter from "../routes/contact.js";
import appointmentsRouter from "../routes/appointments.js";

app.use("/api/contact", contactRouter);
app.use("/api/appointments", appointmentsRouter);
```

### Change 3: Added File Handler 📁 ✅
**Problem:** No way to save/read appointment data
**Solution:** Created fileHandler.js to handle JSON file operations
```javascript
export const readData = async (filename) => { ... }
export const writeData = async (filename, data) => { ... }
```

### Change 4: Updated package.json Scripts ✅
**Problem:** npm start was looking for compiled code
**Solution:** Changed to use `tsx` (TypeScript executor)
```json
"start": "tsx src/server.ts",
"dev": "tsx watch src/server.ts"
```

---

## 🚀 HOW TO RUN THE BACKEND

### Step 1: Navigate to Backend Folder
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run Server (Choose One)

**For Development (with auto-reload):**
```bash
npm run dev
```

**For Production:**
```bash
npm start
```

**Backup Simple Server (if having issues):**
```bash
npm run simple
```

### Step 4: Check if Running
Open browser and go to:
```
http://localhost:5004/health
```

You should see:
```json
{
  "status": "healthy",
  "timestamp": "2026-03-03T...",
  "uptime": 12.345
}
```

---

## 📊 API ENDPOINTS

| Method | Endpoint | Purpose | Body |
|--------|----------|---------|------|
| POST | `/api/contact` | Send contact message | `{name, email, phone, message}` |
| GET | `/api/contact` | Get all messages | None |
| POST | `/api/appointments` | Book appointment | `{name, email, phone, department, doctor, date, time, notes}` |
| GET | `/api/appointments` | Get all appointments | None |
| GET | `/health` | Check if server is running | None |

---

## ⚙️ ENVIRONMENT VARIABLES (Optional)

Create `.env` file in backend folder:
```
PORT=5000
DATABASE_URL=mongodb+srv://...  (for future MongoDB)
CORS_ORIGIN=http://localhost:5173
ENV=development
```

---

## 🐛 TROUBLESHOOTING

### Problem: Port already in use
**Solution:** Backend auto-retries (5000 → 5001 → 5002... → 5004)
- Check terminal output to see which port it's running on
- Frontend must use same port (update API URLs if needed)

### Problem: "Cannot find module error"
**Solution:** Install dependencies
```bash
npm install
```

### Problem: File permission errors
**Solution:** Check that `backend/data/` folder exists and is writable

### Problem: Appointments not saving
**Solution:** Check `backend/data/appointments.json` file exists
```bash
ls backend/data/  # or dir backend\data\ on Windows
```

---

## 📁 DATA STORAGE

### Messages stored in: `backend/data/messages.json`
```json
[
  {
    "id": 1709472000000,
    "name": "Garg",
    "email": "garg45@gmail.com",
    "phone": "09463209845",
    "message": "Message text",
    "createdAt": "2026-03-03T10:30:00.000Z"
  }
]
```

### Appointments stored in: `backend/data/appointments.json`
```json
[
  {
    "id": 1709472000000,
    "name": "Garg",
    "department": "Cardiology",
    "doctor": "Dr. Priya Sharma",
    "date": "03-03-2026",
    "time": "20:58",
    "notes": "Regular checkup",
    "createdAt": "2026-03-03T10:30:00.000Z"
  }
]
```

---

## ✨ SUMMARY

**Backend Flow:**
1. User fills form on frontend (Appointment.tsx or Contact.tsx)
2. Frontend sends POST request to backend
3. Backend validates data using routes
4. Backend saves data to JSON file using fileHandler
5. Backend returns success response
6. Frontend shows success toast and displays data on dashboard

**All working together:**
- ✅ server.ts = Start server + register routes
- ✅ routes/*.js = Handle form data + validate
- ✅ fileHandler.js = Save/read from JSON files
- ✅ package.json = Run with npm start/dev

---

## 🔄 NEXT STEPS

1. ✅ Backend running on **http://localhost:5004**
2. ✅ Contact form working
3. ✅ Appointment form working
4. 📌 Frontend connected to port 5004
5. 📌 Test form submissions
6. 📌 Display appointments on Dashboard

