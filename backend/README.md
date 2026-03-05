# Heal Home Net - Backend

Hospital Management System Backend built with Node.js, Express, TypeScript, and Prisma ORM with MongoDB.

## 📁 Project Structure

```
backend/
├── src/
│   ├── server.ts           # Main server entry point
│   ├── middleware/
│   │   ├── auth.ts        # JWT authentication & authorization
│   │   └── validation.ts  # Request validation middleware
│   ├── controllers/        # Business logic & route handlers
│   │   └── doctorController.ts
│   ├── routes/            # Route definitions
│   │   └── doctorRoutes.ts
│   └── utils/             # Utility functions
├── prisma/
│   └── schema.prisma      # Database schema (MongoDB)
├── dist/                  # Compiled TypeScript output
├── package.json           # Dependencies & scripts
├── tsconfig.json          # TypeScript configuration
├── .env.example           # Environment variables template
└── .env                   # Local environment variables (git ignored)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB account (local or Atlas cloud)
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB connection string:
```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/heal-home-net"
JWT_SECRET="your-secret-key"
PORT=5000
```

3. **Generate Prisma Client:**
```bash
npm run prisma:generate
```

4. **Run database migrations:**
```bash
npm run prisma:migrate
```

5. **Start the development server:**
```bash
npm run dev
```

Server will start at `http://localhost:5000`

## 📝 Available Scripts

```bash
npm run dev              # Start development server with hot reload
npm run build            # Compile TypeScript to JavaScript
npm start                # Start production server
npm run prisma:migrate   # Create/apply database migrations
npm run prisma:generate  # Generate Prisma Client
npm run prisma:studio    # Open Prisma Studio (database GUI)
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
```

## 🗄️ Database Models

The Prisma schema includes models for:
- **User** - System users (base for all entities)
- **Doctor** - Doctor profiles with specialties
- **Appointment** - Doctor appointment scheduling
- **Medicine** - Pharmacy medicines
- **Prescription** - Medicine prescriptions
- **BloodStock** - Blood bank inventory
- **BloodRequest** - Blood donation requests
- **Ambulance** - Ambulance fleet management
- **AmbulanceRequest** - Emergency ambulance requests
- **Bed** - Hospital bed management
- **Contact** - Contact form submissions
- **PeriodLog** - Period tracker logs
- **CanteenOrder** - Food order management

## 🔐 Authentication

JWT-based authentication with role-based access control:
- User roles: `user`, `doctor`, `admin`
- Protected routes require valid JWT token in Authorization header
- Token expires based on JWT_EXPIRATION env variable

Example:
```bash
Authorization: Bearer <your-jwt-token>
```

## 📡 API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/doctors` | ✗ | - | Get all doctors |
| GET | `/api/doctors/:id` | ✗ | - | Get doctor by ID |
| POST | `/api/doctors` | ✓ | admin | Create doctor |
| PUT | `/api/doctors/:id` | ✓ | admin | Update doctor |
| DELETE | `/api/doctors/:id` | ✓ | admin | Delete doctor |

## 🛠️ Middleware

### Authentication Middleware (`auth.ts`)
- `authenticate` - Validates JWT token
- `authorize(...roles)` - Checks user role
- `generateToken(userId, role)` - Creates JWT token

### Validation Middleware (`validation.ts`)
- `validate` - Runs express-validator rules
- Pre-built validators for emails, passwords, appointments, etc.

## 📦 Dependencies

**Core:**
- `express` - Web framework
- `@prisma/client` - ORM for MongoDB
- `typescript` - Type safety

**Authentication & Security:**
- `jsonwebtoken` - JWT tokens
- `bcryptjs` - Password hashing
- `cors` - Cross-Origin Resource Sharing

**Validation & Logging:**
- `express-validator` - Request validation
- `morgan` - HTTP request logging

**Development:**
- `tsx` - TypeScript executor
- `eslint` & `prettier` - Code quality & formatting

## 🔧 Configuration

### Environment Variables
See `.env.example` for all available configurations:

```env
# Database
DATABASE_URL=mongodb+srv://...

# Server
PORT=5000
ENV=development

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
```

## 🗄️ MongoDB Atlas Setup

1. Create account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a cluster (free tier available)
3. Get connection string
4. Replace in `.env`: `DATABASE_URL=mongodb+srv://...`
5. Whitelist IP in Network Access

## 🔄 Prisma Studio

View and manage database data with GUI:
```bash
npm run prisma:studio
```

Opens at `http://localhost:5555`

## 📚 Useful Links

- [Express.js Docs](https://expressjs.com/)
- [Prisma ORM Docs](https://www.prisma.io/docs/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [JWT Guide](https://jwt.io/introduction)

## 🤝 Contributing

Follow the code structure and naming conventions. Use TypeScript for type safety.

## 📄 License

MIT License - Chitkara University

## 📧 Support

For issues and questions, contact the Heal Home Net team.
