# 🚀 NEXT STEPS - How to Use Socket.io & SSR

## 📌 CURRENT STATUS

✅ **Socket.io** - Fully implemented & ready to use immediately  
✅ **SSR** - Backend ready, frontend hydration ready  
✅ **Documentation** - Complete with examples  

---

## ⚡ STEP 1: INSTALL PACKAGES (5 minutes)

### Backend
```bash
cd backend
npm install socket.io
npm install --save-dev @types/socket.io
npm run dev
```

### Frontend
```bash
npm install socket.io-client
npm run dev
```

**Verify:**
- Backend runs on: `http://localhost:5002` ✅
- Frontend runs on: `http://localhost:8080` ✅
- No errors in console ✅

---

## 🧪 STEP 2: TEST THE IMPLEMENTATION (5 minutes)

### Option A: Use Example Page
```
1. Open: http://localhost:8080/socket-example
2. You should see: 🟢 Connected
3. Try features:
   - Send messages
   - Simulate doctor status
   - View real-time notifications
```

**If not connected:**
- Check backend is running
- Check browser console (F12)
- Check network tab for WebSocket
- See "Troubleshooting" section below

### Option B: Check Components
```typescript
// View existing working components
src/components/RealtimeNotifications.tsx
src/components/RealtimeAppointments.tsx
```

---

## 🎯 STEP 3: ADD TO YOUR PAGES (10-15 minutes)

### Example 1: Add Notifications
```typescript
// In any page/component
import RealtimeNotifications from "@/components/RealtimeNotifications";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <RealtimeNotifications />
    </div>
  );
}
```

### Example 2: Add Appointments Tracking
```typescript
import RealtimeAppointments from "@/components/RealtimeAppointments";

export default function AppointmentPage() {
  return (
    <div>
      <h1>Appointments</h1>
      <RealtimeAppointments />
    </div>
  );
}
```

### Example 3: Custom Real-time Feature
```typescript
import { useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";

export function MyComponent() {
  const userId = localStorage.getItem("userId") || "user-1";
  
  const { 
    isConnected,
    onDoctorStatusChanged,
    onAppointmentUpdated 
  } = useSocket({
    userId,
    userType: "patient",
    room: `user-${userId}`,
    autoConnect: true,
  });

  useEffect(() => {
    // Listen for doctor status changes
    onDoctorStatusChanged((data) => {
      console.log(`Doctor ${data.doctorId} is now ${data.status}`);
      // Update your UI here
    });
  }, [onDoctorStatusChanged]);

  useEffect(() => {
    // Listen for appointment updates
    onAppointmentUpdated((data) => {
      console.log(`Appointment ${data.appointmentId} status: ${data.status}`);
      // Update your UI here
    });
  }, [onAppointmentUpdated]);

  return (
    <div>
      Status: {isConnected ? "🟢 Online" : "🔴 Offline"}
      {/* Your component JSX */}
    </div>
  );
}
```

---

## 📡 STEP 4: EMIT REAL-TIME EVENTS FROM BACKEND

### When Creating an Appointment
```typescript
// In your appointment controller/route
const io = req.app.locals.io;

// After saving to database:
io.emit("appointment_created", {
  appointmentId: appointment.id,
  userId: appointment.patientId,
  appointmentData: {
    patientName: patient.name,
    doctorName: doctor.name,
    dateTime: appointment.dateTime,
  },
  timestamp: new Date(),
});
```

### When Doctor Changes Status
```typescript
const io = req.app.locals.io;

io.emit("doctor_status_changed", {
  doctorId: doctor.id,
  status: "busy", // "available", "busy", "offline"
  timestamp: new Date(),
});
```

### Real-time Ambulance Tracking
```typescript
const io = req.app.locals.io;

// Emit location updates (do this every 5 seconds or when location changes)
io.emit("ambulance_location_update", {
  ambulanceId: ambulance.id,
  latitude: 40.7128,
  longitude: -74.0060,
  status: "on_way",
  timestamp: new Date(),
});
```

### Blood Bank Inventory Updates
```typescript
const io = req.app.locals.io;

io.emit("blood_inventory_updated", {
  bloodType: "O+",
  quantity: 50,
  operation: "add", // "add" or "remove"
  timestamp: new Date(),
});
```

---

## 📚 STEP 5: READ DOCUMENTATION

### Quick Reference
```
SOCKET_IO_CHEATSHEET.md
- Common use cases
- Code snippets
- Troubleshooting
```

### Complete Guide
```
SOCKET_IO_SSR_GUIDE.md
- Full API reference
- All methods explained
- Real-time features guide
- SSR setup instructions
```

### Architecture
```
ARCHITECTURE_DIAGRAM.md
- System design
- Data flow diagrams
- Event flows
- Component relationships
```

---

## 🔧 STEP 6: OPTIONAL - ENABLE SSR FOR PRODUCTION

### When Ready to Deploy
```typescript
// Uncomment in backend/src/server.ts

app.get("*", async (req, res) => {
  try {
    const { renderAppToString, fetchInitialData } = await import(
      "./ssr.js"
    );

    const userId = (req as any).user?.id;
    const initialData = await fetchInitialData(userId);

    const html = await renderAppToString({
      userId,
      initialData,
    });

    res.set("Content-Type", "text/html");
    res.send(html);
  } catch (error) {
    console.error("SSR Error:", error);
    next(error);
  }
});
```

### Update Vite Config (Optional)
```typescript
// vite.config.ts - Add SSR build support
export default defineConfig({
  build: {
    ssr: "src/main.tsx",  // Add this line
    outDir: "dist-ssr",   // Add this line
  },
  // ... rest of config
});
```

---

## 📋 QUICK CHECKLIST

- [ ] Install Socket.io packages
- [ ] Backend running on port 5002
- [ ] Frontend running on port 8080
- [ ] Visit example page (✅ Connected)
- [ ] Add RealtimeNotifications to a page
- [ ] Add RealtimeAppointments to a page
- [ ] Create custom component using useSocket
- [ ] Emit events from backend
- [ ] Test with 2 browser tabs
- [ ] Read full documentation
- [ ] Deploy to production

---

## 🐛 TROUBLESHOOTING

### Issue: "Connection refused"
```
✅ Fix: Make sure backend is running
cd backend && npm run dev
```

### Issue: "WebSocket connection failed"
```
✅ Fix: Check CORS configuration
- Backend should have cors enabled
- Frontend should point to correct URL
```

### Issue: "Events not received"
```
✅ Fix: Check useSocket configuration
- Verify userId is provided
- Verify room is joined
- Check browser console for errors
```

### Issue: "useSocket hook not found"
```
✅ Fix: Make sure you're importing correctly
import { useSocket } from "@/hooks/useSocket";
```

### Issue: "TypeScript errors"
```
✅ Fix: Update tsconfig or restart IDE
- Make sure @types/socket.io is installed
- Restart TypeScript server: Cmd+K, Cmd+D (VS Code)
```

---

## 📞 TESTING SCENARIOS

### Test 1: Real-time Notifications
1. User A creates appointment
2. User B should see notification instantly
3. No page refresh needed

### Test 2: Doctor Status
1. Doctor goes offline
2. Other users see "offline" status instantly
3. Doctor comes back online - status updates

### Test 3: Ambulance Tracking
1. User requests ambulance
2. Ambulance driver accepts
3. User sees real-time location updates on map

### Test 4: Message Delivery
1. User A sends message
2. User B receives instantly
3. Typing indicators show/hide

### Test 5: Reconnection
1. Disconnect network (DevTools > Offline)
2. Try to send message
3. Reconnect network
4. Message should send when reconnected

---

## 🎓 LEARNING PATH

1. **Day 1**: Install packages + test example page
2. **Day 2**: Add notifications and appointments components
3. **Day 3**: Create custom real-time feature
4. **Day 4**: Emit events from backend for all features
5. **Day 5**: Test with multiple users
6. **Day 6**: Enable SSR for production
7. **Day 7**: Deploy and monitor

---

## 📊 FILES TO STUDY

### Essential (Must Read)
1. `SOCKET_IO_CHEATSHEET.md` - Quick reference
2. `src/hooks/useSocket.ts` - Hook implementation
3. `src/components/RealtimeNotifications.tsx` - Example component

### Important (Should Read)
4. `SOCKET_IO_SSR_GUIDE.md` - Complete guide
5. `backend/src/socket/handlers.ts` - All event handlers
6. `src/pages/SocketIOExample.tsx` - Full working page

### Reference (For Deep Dive)
7. `ARCHITECTURE_DIAGRAM.md` - System design
8. `backend/src/socket/events.ts` - Event definitions
9. `backend/src/server.ts` - Server setup

---

## 🚀 QUICK START COMMANDS

```bash
# 1. Install dependencies
cd backend && npm install socket.io
npm install --save-dev @types/socket.io
cd .. && npm install socket.io-client

# 2. Start servers
# Terminal 1
cd backend && npm run dev

# Terminal 2
npm run dev

# 3. Test
# Open: http://localhost:8080/socket-example
# Should see: 🟢 Connected

# 4. Check logs
# Browser: F12 > Console
# Backend terminal: Watch for connection logs
```

---

## ✨ SUMMARY

| Task | Time | Status |
|------|------|--------|
| Install packages | 5 min | ⏭️ Next |
| Test example | 5 min | ⏭️ After install |
| Add to pages | 15 min | ⏭️ After test |
| Emit backend events | 20 min | ⏭️ After adding |
| Test with 2 users | 10 min | ⏭️ After events |
| Read docs | 30 min | ⏭️ Anytime |
| Enable SSR | 20 min | ⏭️ Optional |

**Total estimated time: 1-2 hours to get fully up and running**

---

## 🎯 NEXT: INSTALL PACKAGES

```bash
cd backend
npm install socket.io
npm install --save-dev @types/socket.io

cd ..
npm install socket.io-client

npm run dev
```

**Then visit: http://localhost:8080/socket-example** ✅

---

**Questions? Check the documentation files or look at the example components!**
