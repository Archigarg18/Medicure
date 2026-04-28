# Socket.io & SSR - Quick Reference Cheat Sheet

## 🚀 SOCKET.IO USAGE QUICK START

### Basic Component Setup
```typescript
import { useSocket } from "@/hooks/useSocket";

export function MyComponent() {
  const { isConnected } = useSocket({
    userId: "user-1",
    userType: "patient",
    room: "my-room",
    autoConnect: true,
  });

  return <div>Status: {isConnected ? "Connected" : "Disconnected"}</div>;
}
```

---

## 📡 COMMON USE CASES

### 1. Display Real-time Notifications
```typescript
import RealtimeNotifications from "@/components/RealtimeNotifications";

export default function Dashboard() {
  return <RealtimeNotifications />;
}
```

### 2. Track Live Appointments
```typescript
import RealtimeAppointments from "@/components/RealtimeAppointments";

export default function AppointmentPage() {
  return <RealtimeAppointments />;
}
```

### 3. Send/Receive Messages
```typescript
const { sendMessage, onMessageReceived } = useSocket({
  userId: "user-1",
  userType: "patient",
});

useEffect(() => {
  onMessageReceived((data) => {
    console.log("Message:", data.message);
  });
}, [onMessageReceived]);

const handleSend = () => {
  sendMessage({
    to: "doctor-1",
    message: "Hello doctor!",
  });
};
```

### 4. Listen for Doctor Status
```typescript
const { onDoctorStatusChanged } = useSocket({
  userId: "patient-1",
  userType: "patient",
});

useEffect(() => {
  onDoctorStatusChanged((data) => {
    console.log(`Doctor ${data.doctorId} is ${data.status}`);
  });
}, [onDoctorStatusChanged]);
```

### 5. Track Ambulance in Real-time
```typescript
const { onAmbulanceLocationUpdate } = useSocket({
  userId: "patient-1",
  userType: "patient",
});

useEffect(() => {
  onAmbulanceLocationUpdate((data) => {
    // Update map with new location
    const { latitude, longitude } = data;
    console.log(`Ambulance at: ${latitude}, ${longitude}`);
  });
}, [onAmbulanceLocationUpdate]);
```

### 6. Monitor Blood Bank Inventory
```typescript
const { onBloodInventoryUpdated } = useSocket({
  userId: "staff-1",
  userType: "admin",
});

useEffect(() => {
  onBloodInventoryUpdated((data) => {
    console.log(`${data.bloodType}: ${data.quantity} units`);
  });
}, [onBloodInventoryUpdated]);
```

---

## 🎯 ALL AVAILABLE HOOKS

```typescript
const {
  // Connection State
  isConnected,           // boolean
  isConnecting,          // boolean

  // Connection Management
  connect,               // async () => void
  disconnect,            // () => void

  // Room Management
  joinRoom,              // (data) => void
  leaveRoom,             // (room) => void

  // Messaging
  sendMessage,           // (data) => void
  onMessageReceived,     // (callback) => void
  onTypingStart,         // (callback) => void
  onTypingEnd,           // (callback) => void

  // Appointment Events
  onAppointmentCreated,  // (callback) => void
  onAppointmentUpdated,  // (callback) => void
  onAppointmentCancelled,// (callback) => void

  // Doctor Events
  onDoctorStatusChanged, // (callback) => void

  // Ambulance Events
  onAmbulanceRequested,  // (callback) => void
  onAmbulanceLocationUpdate, // (callback) => void
  onAmbulanceOnWay,      // (callback) => void

  // Blood Bank Events
  onBloodInventoryUpdated, // (callback) => void
  onBloodRequest,        // (callback) => void

  // Notifications
  onNotification,        // (callback) => void

  // Generic
  on,                    // (event, callback) => void
  emit,                  // (event, data) => void
  off,                   // (event) => void
} = useSocket(options);
```

---

## 📤 EMITTING DATA (From Backend)

### Appointment Event
```typescript
// In backend route/controller
const io = req.app.locals.io;

io.emit("appointment_updated", {
  appointmentId: "apt-123",
  status: "confirmed",
  updatedData: { /* data */ },
  timestamp: new Date(),
});
```

### Doctor Status
```typescript
io.emit("doctor_status_changed", {
  doctorId: "doc-1",
  status: "available",
  timestamp: new Date(),
});
```

### Ambulance Location
```typescript
io.emit("ambulance_location_update", {
  ambulanceId: "amb-1",
  latitude: 40.7128,
  longitude: -74.0060,
  status: "on_way",
  timestamp: new Date(),
});
```

### Blood Bank Update
```typescript
io.emit("blood_inventory_updated", {
  bloodType: "O+",
  quantity: 50,
  operation: "add",
  timestamp: new Date(),
});
```

### Message
```typescript
io.emit("message_sent", {
  from: "user-1",
  to: "user-2",
  message: "Hello!",
  timestamp: new Date(),
});
```

---

## 🔍 DEBUGGING

### Check if Connected
```typescript
const { isConnected } = useSocket();
console.log("Connected:", isConnected);
```

### Log All Events
```typescript
const { on } = useSocket();

on("*", (event, data) => {
  console.log("Event:", event, "Data:", data);
});
```

### Check Socket Service Directly
```typescript
import socketService from "@/services/socketService";

console.log("Connected:", socketService.getIsConnected());
console.log("Socket:", socketService.getSocket());
```

### Browser DevTools
```javascript
// In browser console
// Find connection logs
// Check Network tab for WebSocket traffic
// Use Redux DevTools if using Redux
```

---

## ⚙️ CONFIGURATION

### Change Backend URL
```typescript
// In frontend .env
VITE_API_URL=http://localhost:5002

// Or in socketService.ts
const SOCKET_SERVER_URL = "http://your-server:5002";
```

### Change Backend Port
```typescript
// In backend .env or server.ts
const PORT = 5002;
```

### Modify CORS
```typescript
// In backend/src/server.ts
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "http://localhost:8080",
    credentials: true,
  },
});
```

---

## 🐛 TROUBLESHOOTING

### Not Connecting?
```typescript
// 1. Check backend is running on port 5002
// 2. Check frontend .env has correct URL
// 3. Check browser console for errors
// 4. Clear browser cache and reconnect

// Test connection
const { isConnected } = useSocket({ autoConnect: true });
console.log(isConnected);
```

### Messages Not Received?
```typescript
// 1. Verify socket is connected
// 2. Verify room is joined
// 3. Check event name matches
// 4. Check browser console for errors
```

### Performance Issues?
```typescript
// 1. Reduce event frequency
// 2. Batch updates
// 3. Use selective listeners
// 4. Monitor network tab in DevTools
```

---

## 📊 EVENT DATA FORMATS

### Appointment Event
```typescript
{
  appointmentId: "apt-123",
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled",
  patientName: "John Doe",
  doctorName: "Dr. Smith",
  timestamp: Date,
}
```

### Doctor Event
```typescript
{
  doctorId: "doc-1",
  status: "available" | "busy" | "offline",
  timestamp: Date,
}
```

### Ambulance Event
```typescript
{
  ambulanceId: "amb-1",
  latitude: 40.7128,
  longitude: -74.0060,
  status: "requested" | "accepted" | "on_way" | "arrived",
  patientId: "pat-1",
  timestamp: Date,
}
```

### Blood Event
```typescript
{
  bloodType: "O+" | "O-" | "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-",
  quantity: 50,
  operation: "add" | "remove",
  requestId: "req-123",
  timestamp: Date,
}
```

### Message Event
```typescript
{
  from: "user-1",
  to: "user-2",
  message: "Hello!",
  room: "chat-room-123",
  read: false,
  timestamp: Date,
}
```

---

## 🔐 SECURITY BEST PRACTICES

### 1. Add Authentication
```typescript
// Verify JWT on socket connection
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return next(new Error("Authentication error"));
    socket.userId = user.id;
    next();
  });
});
```

### 2. Rate Limiting
```typescript
// Add rate limiting middleware
io.use((socket, next) => {
  // Check rate limits
  next();
});
```

### 3. Validate Data
```typescript
socket.on("message_sent", (data) => {
  // Validate message
  if (!data.message || data.message.length > 1000) {
    return socket.emit("error", "Invalid message");
  }
});
```

---

## 💾 PERSISTENCE (Optional)

### Save Messages to Database
```typescript
socket.on("message_sent", async (data) => {
  const message = await prisma.message.create({
    data: {
      from: data.from,
      to: data.to,
      content: data.message,
    },
  });
  io.emit("message_received", message);
});
```

### Load Chat History
```typescript
const history = await prisma.message.findMany({
  where: {
    OR: [
      { from: userId, to: targetUser },
      { from: targetUser, to: userId },
    ],
  },
  orderBy: { createdAt: "desc" },
  take: 50,
});

socket.emit("message_history", history);
```

---

## 📱 MOBILE SUPPORT

Socket.io works on mobile with automatic fallback:
```typescript
const io = new SocketIOServer(httpServer, {
  transports: ["websocket", "polling"],
});
```

---

## 🎯 EXAMPLE: Complete Chat Component

```typescript
import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";

export function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const userId = localStorage.getItem("userId") || "user-1";
  const { isConnected, sendMessage, onMessageReceived } = useSocket({
    userId,
    userType: "patient",
    room: "chat",
  });

  useEffect(() => {
    onMessageReceived((data) => {
      setMessages((prev) => [...prev, data]);
    });
  }, [onMessageReceived]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage({ to: "doctor-1", message: input });
      setInput("");
    }
  };

  return (
    <div>
      <div>{isConnected ? "🟢" : "🔴"} Connected</div>
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i}>{msg.from}: {msg.message}</div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
```

---

**Need more help? See SOCKET_IO_SSR_GUIDE.md**
