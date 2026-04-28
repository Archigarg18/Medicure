# 🎨 Socket.io & SSR Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  React Components                                            │   │
│  ├──────────────────────────────────────────────────────────────┤   │
│  │ ├─ RealtimeNotifications.tsx                               │   │
│  │ ├─ RealtimeAppointments.tsx                                │   │
│  │ ├─ SocketIOExample.tsx                                     │   │
│  │ └─ Custom Pages (using useSocket hook)                    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              ▲                                        │
│                              │ import                                 │
│                              ▼                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  src/hooks/useSocket.ts                                      │   │
│  │  ├─ Connection management                                   │   │
│  │  ├─ Event listeners                                         │   │
│  │  ├─ Room management                                         │   │
│  │  └─ All Socket.io methods                                  │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              ▲                                        │
│                              │ uses                                   │
│                              ▼                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  src/services/socketService.ts                               │   │
│  │  ├─ Socket.io Client Initialization                         │   │
│  │  ├─ Connection handling                                     │   │
│  │  ├─ All event methods                                       │   │
│  │  └─ Singleton pattern                                       │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              ▼                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  main.tsx                                                    │   │
│  │  ├─ SSR Hydration Detection                                 │   │
│  │  ├─ Client-side Rendering Fallback                          │   │
│  │  └─ Global Type Definitions                                 │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              ▼                                        │
│                    WebSocket Connection                              │
│                    (port 5002)                                        │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ WebSocket
                              │ ws://localhost:5002
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     SERVER (Backend)                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  HTTP Server (Express)                                       │   │
│  │  - Port: 5002                                               │   │
│  │  - CORS enabled                                             │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              ▲                                        │
│                              │                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Socket.io Server                                            │   │
│  │  ├─ WebSocket support                                        │   │
│  │  ├─ Polling fallback                                         │   │
│  │  └─ Connection management                                   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              ▲                                        │
│                              │ uses                                   │
│                              ▼                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  backend/src/socket/handlers.ts                              │   │
│  │  ├─ Connection handlers                                     │   │
│  │  ├─ Appointment events                                      │   │
│  │  ├─ Doctor events                                           │   │
│  │  ├─ Ambulance events                                        │   │
│  │  ├─ Blood bank events                                       │   │
│  │  ├─ Message events                                          │   │
│  │  ├─ Notification events                                     │   │
│  │  ├─ Room management                                         │   │
│  │  └─ User tracking                                           │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              ▲                                        │
│                              │                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  backend/src/socket/events.ts                                │   │
│  │  ├─ CONNECT                                                  │   │
│  │  ├─ APPOINTMENT_* (3 events)                                 │   │
│  │  ├─ DOCTOR_STATUS_CHANGED                                   │   │
│  │  ├─ AMBULANCE_* (3 events)                                  │   │
│  │  ├─ BLOOD_* (2 events)                                      │   │
│  │  ├─ MESSAGE_* (3 events)                                    │   │
│  │  └─ NOTIFICATION_*                                          │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              ▲                                        │
│                              │                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  backend/src/server.ts                                       │   │
│  │  ├─ Initialize HTTP Server                                  │   │
│  │  ├─ Initialize Socket.io                                    │   │
│  │  ├─ Setup handlers                                          │   │
│  │  ├─ SSR Route (app.get(\"*\"))                               │   │
│  │  ├─ API Routes                                              │   │
│  │  └─ Error handling                                          │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              ▲                                        │
│                              │ uses                                   │
│                              ▼                                        │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Database (Prisma + MongoDB/PostgreSQL)                      │   │
│  │  ├─ Appointments                                             │   │
│  │  ├─ Users                                                    │   │
│  │  ├─ Doctors                                                  │   │
│  │  ├─ Ambulances                                               │   │
│  │  ├─ Blood records                                            │   │
│  │  └─ Messages                                                 │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  SSR Module (Optional)                                        │   │
│  │  ├─ backend/src/ssr.tsx                                     │   │
│  │  │  ├─ renderAppToString()                                  │   │
│  │  │  └─ fetchInitialData()                                   │   │
│  │  └─ Serves pre-rendered HTML                                │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow - Real-time Appointment Update

```
┌─────────────────┐
│  Frontend User  │
│  Books Appt     │
└────────┬────────┘
         │
         ▼
    ┌─────────────────────────────────┐
    │  Component sends via API/Socket │
    │  appointmentCreated event       │
    └────────┬────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────┐
    │ Backend Route Handler           │
    │ Saves to Database              │
    │ Emits Socket.io event          │
    └────────┬────────────────────────┘
             │
             ▼ (Socket.io Broadcast)
    ┌─────────────────────────────────┐
    │ Socket handlers dispatch to:    │
    ├─────────────────────────────────┤
    │ 1. Doctor connected to socket   │
    │ 2. Patient (appointment room)   │
    │ 3. Admin                        │
    └────────┬────────────────────────┘
             │
    ┌────────┴────────────┬───────────────────┐
    ▼                     ▼                   ▼
┌─────────┐        ┌──────────┐        ┌─────────┐
│ Doctor  │        │ Patient  │        │ Admin   │
│Component│        │Component │        │Component│
│Updates  │        │Updates   │        │Updates  │
│State    │        │State     │        │State    │
└─────────┘        └──────────┘        └─────────┘
   Sees new         Notification       Dashboard
   appointment      sent               updated
```

---

## Socket.io Event Flow

```
                    BACKEND
┌─────────────────────────────────────┐
│  Event Triggered (API call)         │
│  io.emit(\"event_name\", data)        │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Socket.io Server                   │
│  Receives and broadcasts event      │
└────────┬────────────────────────────┘
         │
    ┌────┴───────────────┬────────────┐
    ▼                    ▼            ▼
  Room 1               Room 2      All Clients
┌──────────┐      ┌──────────┐  ┌──────────────┐
│Connected │      │Connected │  │Connected     │
│Sockets   │      │Sockets   │  │Sockets       │
│in Room 1 │      │in Room 2 │  │(broadcast)   │
└────┬─────┘      └────┬─────┘  └───┬──────────┘
     │                 │             │
     ▼                 ▼             ▼
  Client 1        Client 3       All Clients
  listens         listens         listen
  onEvent()       onEvent()       onEvent()

                    FRONTEND
┌─────────────────────────────────────┐
│  useSocket hook listeners            │
│  Receives in callback                │
│  Updates component state             │
│  Triggers re-render                  │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Component renders                  │
│  User sees real-time update         │
│  No refresh needed                  │
└─────────────────────────────────────┘
```

---

## Room-Based Communication

```
Backend (Socket.io)
│
├─ Room: "appointments-user-1"
│  ├─ Socket: abc123 (Patient)
│  ├─ Socket: def456 (Doctor)
│  └─ Socket: ghi789 (Staff)
│
├─ Room: "appointments-user-2"
│  ├─ Socket: jkl012 (Patient)
│  └─ Socket: mno345 (Doctor)
│
├─ Room: "chat-room-user-1"
│  ├─ Socket: abc123 (Patient)
│  └─ Socket: pqr678 (Support)
│
└─ General (No room)
   ├─ Socket: stu901 (Doctor)
   ├─ Socket: vwx234 (Admin)
   └─ Socket: yz5678 (Ambulance)

When event emitted to a room:
io.to("appointments-user-1").emit("event") 
→ Only abc123, def456, ghi789 receive it
```

---

## useSocket Hook Lifecycle

```
┌─────────────────────────────────────┐
│  Component Mounts                   │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  useSocket() called with config     │
│  ├─ userId: \"user-1\"               │
│  ├─ userType: \"patient\"             │
│  ├─ room: \"room-1\"                  │
│  └─ autoConnect: true               │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  socketService.connect()            │
│  ├─ Check if already connected     │
│  ├─ Initialize Socket.io client    │
│  ├─ Listen for connect event       │
│  └─ Set isConnected = true         │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  joinRoom({userId, userType, room})│
│  ├─ Emit join_room event           │
│  ├─ Server adds socket to room     │
│  └─ Room members notified          │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Hook returns object                │
│  ├─ isConnected (boolean)           │
│  ├─ onAppointmentUpdated()          │
│  ├─ sendMessage()                   │
│  └─ ... (25+ methods)               │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Component can use methods          │
│  ├─ Listen: onAppointmentUpdated()  │
│  ├─ Send: sendMessage()             │
│  └─ Emit: emit()                    │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Component Unmounts                 │
│  ├─ Clean up listeners              │
│  ├─ Optional: leaveRoom()           │
│  └─ Socket stays connected          │
└─────────────────────────────────────┘
```

---

## SSR Flow

```
Request URL: http://localhost:5002/appointment/123

     ▼
┌────────────────────────────────┐
│ Express receives request        │
│ Route: app.get(\"*\")            │
└────────┬───────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ Check if SSR enabled            │
└────────┬───────────────────────┘
         │
    ┌────┴───────────────┐
    ▼                    ▼
┌─────────┐        ┌──────────────┐
│ SSR ON  │        │ SSR OFF      │
└────┬────┘        │ (Dev Mode)   │
     │             └──────┬───────┘
     ▼                    ▼
┌────────────────────────────────┐
│ fetchInitialData()             │
│ ├─ Query database              │
│ ├─ Get user data               │
│ ├─ Get appointment data         │
│ └─ Return initial state         │
└────────┬───────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ renderAppToString()            │
│ ├─ Render React component      │
│ ├─ Generate HTML string        │
│ ├─ Inject state into <script>  │
│ └─ Return complete HTML        │
└────────┬───────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ Send HTML to client            │
│ Content-Type: text/html        │
└────────┬───────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ Browser receives HTML           │
│ ├─ Renders immediately          │
│ ├─ User sees content fast       │
│ └─ JavaScript loads             │
└────────┬───────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ React hydration in main.tsx    │
│ ├─ Attach listeners to HTML    │
│ ├─ Initialize state             │
│ ├─ Connect to Socket.io         │
│ └─ App becomes interactive      │
└────────────────────────────────┘
```

---

## Event Broadcasting Pattern

```
Code in Route/Controller:
                │
                ▼
    const io = req.app.locals.io;
    io.emit("event_name", { data })
                │
                ▼
        ┌───────────────────┐
        │ Socket.io Server  │
        │ Broadcasts Event  │
        └────────┬──────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
    To Rooms         To All Clients
    │                │
    ├─ io.to(\"room\")  ├─ io.emit()
    │   .emit()       │
    │                └─ All sockets
    └─ Only in room    receive
```

---

## Error Handling Flow

```
Socket Connection Issue
        │
        ▼
┌──────────────────────────┐
│ Automatic Reconnection   │
│ Attempt 1: 1s delay      │
│ Attempt 2: 2s delay      │
│ ... up to 10 attempts    │
└────────┬─────────────────┘
         │
    ┌────┴────────────┐
    ▼                 ▼
Success            Failed
  │                  │
  ▼                  ▼
isConnected        User notified
= true             Connection lost
Socket works       Manual reconnect
App updates        button shown
```

---

This architecture provides:
- ✅ Real-time communication
- ✅ Scalable event handling
- ✅ Room-based grouping
- ✅ Automatic reconnection
- ✅ SSR support
- ✅ Type safety
- ✅ Easy to use hooks
