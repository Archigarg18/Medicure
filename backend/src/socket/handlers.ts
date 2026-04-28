import { Server, Socket } from "socket.io";
import { SOCKET_EVENTS } from "./events.js";

// Store active users
interface UserConnection {
  socketId: string;
  userId?: string;
  userType?: "admin" | "doctor" | "patient" | "ambulance";
  room?: string;
}

const connectedUsers: Map<string, UserConnection> = new Map();

export function setupSocketHandlers(io: Server) {
  io.on(SOCKET_EVENTS.CONNECT, (socket: Socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // Store connection
    connectedUsers.set(socket.id, {
      socketId: socket.id,
    });

    // ==================== USER EVENTS ====================

    // Join Room (User joins a specific room)
    socket.on(SOCKET_EVENTS.JOIN_ROOM, (data: any) => {
      const { userId, userType, room } = data;

      // Update user info
      const userConn = connectedUsers.get(socket.id);
      if (userConn) {
        userConn.userId = userId;
        userConn.userType = userType;
        userConn.room = room;
      }

      socket.join(room);
      console.log(`📍 User ${userId} joined room: ${room}`);

      // Notify room members
      io.to(room).emit(SOCKET_EVENTS.NOTIFICATION_SENT, {
        type: "user_joined",
        userId,
        message: `User ${userId} joined the room`,
        timestamp: new Date(),
      });
    });

    // Leave Room
    socket.on(SOCKET_EVENTS.LEAVE_ROOM, (data: any) => {
      const { room } = data;
      socket.leave(room);
      console.log(`👋 User left room: ${room}`);

      io.to(room).emit(SOCKET_EVENTS.NOTIFICATION_SENT, {
        type: "user_left",
        message: `User left the room`,
        timestamp: new Date(),
      });
    });

    // ==================== APPOINTMENT EVENTS ====================

    socket.on(SOCKET_EVENTS.APPOINTMENT_CREATED, (data: any) => {
      const { appointmentId, userId, doctorId, appointmentData } = data;

      console.log(`📅 Appointment created: ${appointmentId}`);

      // Broadcast to doctor
      const doctorSockets = Array.from(connectedUsers.entries())
        .filter(([_, user]) => user.userId === doctorId)
        .map(([id, _]) => id);

      doctorSockets.forEach((socketId) => {
        io.to(socketId).emit(SOCKET_EVENTS.APPOINTMENT_CREATED, {
          appointmentId,
          userId,
          appointmentData,
          timestamp: new Date(),
        });
      });
    });

    socket.on(SOCKET_EVENTS.APPOINTMENT_UPDATED, (data: any) => {
      const { appointmentId, status, updatedData } = data;

      console.log(`📅 Appointment updated: ${appointmentId} - ${status}`);

      // Broadcast to all interested parties
      io.emit(SOCKET_EVENTS.APPOINTMENT_UPDATED, {
        appointmentId,
        status,
        updatedData,
        timestamp: new Date(),
      });
    });

    socket.on(SOCKET_EVENTS.APPOINTMENT_CANCELLED, (data: any) => {
      const { appointmentId, reason } = data;

      console.log(`❌ Appointment cancelled: ${appointmentId}`);

      io.emit(SOCKET_EVENTS.APPOINTMENT_CANCELLED, {
        appointmentId,
        reason,
        timestamp: new Date(),
      });
    });

    // ==================== DOCTOR EVENTS ====================

    socket.on(SOCKET_EVENTS.DOCTOR_STATUS_CHANGED, (data: any) => {
      const { doctorId, status, userType } = data;

      console.log(`🏥 Doctor status changed: ${doctorId} - ${status}`);

      // Update user info
      const userConn = connectedUsers.get(socket.id);
      if (userConn) {
        userConn.userId = doctorId;
        userConn.userType = userType || "doctor";
      }

      // Broadcast status to all connected clients
      io.emit(SOCKET_EVENTS.DOCTOR_STATUS_CHANGED, {
        doctorId,
        status,
        timestamp: new Date(),
      });
    });

    // ==================== AMBULANCE EVENTS ====================

    socket.on(SOCKET_EVENTS.AMBULANCE_REQUESTED, (data: any) => {
      const { ambulanceId, patientId, location, requestData } = data;

      console.log(`🚑 Ambulance requested: ${ambulanceId}`);

      // Broadcast to all ambulance drivers
      io.emit(SOCKET_EVENTS.AMBULANCE_REQUESTED, {
        ambulanceId,
        patientId,
        location,
        requestData,
        timestamp: new Date(),
      });
    });

    socket.on(SOCKET_EVENTS.AMBULANCE_LOCATION_UPDATE, (data: any) => {
      const { ambulanceId, latitude, longitude, status } = data;

      // Broadcast location to subscribed clients
      io.emit(SOCKET_EVENTS.AMBULANCE_LOCATION_UPDATE, {
        ambulanceId,
        latitude,
        longitude,
        status,
        timestamp: new Date(),
      });
    });

    socket.on(SOCKET_EVENTS.AMBULANCE_ON_WAY, (data: any) => {
      const { ambulanceId, patientId } = data;

      console.log(`🚑 Ambulance on way: ${ambulanceId}`);

      io.emit(SOCKET_EVENTS.AMBULANCE_ON_WAY, {
        ambulanceId,
        patientId,
        timestamp: new Date(),
      });
    });

    // ==================== BLOOD BANK EVENTS ====================

    socket.on(SOCKET_EVENTS.BLOOD_INVENTORY_UPDATED, (data: any) => {
      const { bloodType, quantity, operation } = data;

      console.log(
        `🩸 Blood inventory updated: ${bloodType} - ${operation} - ${quantity}`
      );

      // Broadcast to all connected clients
      io.emit(SOCKET_EVENTS.BLOOD_INVENTORY_UPDATED, {
        bloodType,
        quantity,
        operation,
        timestamp: new Date(),
      });
    });

    socket.on(SOCKET_EVENTS.BLOOD_REQUEST, (data: any) => {
      const { requestId, bloodType, quantity, patientId } = data;

      console.log(`🩸 Blood request: ${requestId} - ${bloodType}`);

      io.emit(SOCKET_EVENTS.BLOOD_REQUEST, {
        requestId,
        bloodType,
        quantity,
        patientId,
        timestamp: new Date(),
      });
    });

    // ==================== MESSAGE EVENTS ====================

    socket.on(SOCKET_EVENTS.MESSAGE_SENT, (data: any) => {
      const { from, to, message, room } = data;

      console.log(`💬 Message from ${from} to ${to}`);

      if (room) {
        io.to(room).emit(SOCKET_EVENTS.MESSAGE_RECEIVED, {
          from,
          to,
          message,
          timestamp: new Date(),
          read: false,
        });
      } else {
        // Direct message
        const recipientSockets = Array.from(connectedUsers.entries())
          .filter(([_, user]) => user.userId === to)
          .map(([id, _]) => id);

        recipientSockets.forEach((socketId) => {
          io.to(socketId).emit(SOCKET_EVENTS.MESSAGE_RECEIVED, {
            from,
            to,
            message,
            timestamp: new Date(),
            read: false,
          });
        });
      }
    });

    socket.on(SOCKET_EVENTS.TYPING_START, (data: any) => {
      const { room, userId } = data;

      if (room) {
        socket.to(room).emit(SOCKET_EVENTS.TYPING_START, {
          userId,
        });
      }
    });

    socket.on(SOCKET_EVENTS.TYPING_END, (data: any) => {
      const { room, userId } = data;

      if (room) {
        socket.to(room).emit(SOCKET_EVENTS.TYPING_END, {
          userId,
        });
      }
    });

    // ==================== DISCONNECT EVENT ====================

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      const userConn = connectedUsers.get(socket.id);
      console.log(`❌ User disconnected: ${socket.id}`);

      if (userConn?.room) {
        io.to(userConn.room).emit(SOCKET_EVENTS.NOTIFICATION_SENT, {
          type: "user_disconnected",
          userId: userConn.userId,
          message: `User disconnected`,
          timestamp: new Date(),
        });
      }

      // If it was a doctor, notify about offline status
      if (userConn?.userType === "doctor") {
        io.emit(SOCKET_EVENTS.DOCTOR_STATUS_CHANGED, {
          doctorId: userConn.userId,
          status: "offline",
          timestamp: new Date(),
        });
      }

      connectedUsers.delete(socket.id);
    });

    // ==================== ERROR HANDLING ====================

    socket.on("error", (error: any) => {
      console.error(`❌ Socket error: ${error}`);
      socket.emit(SOCKET_EVENTS.ERROR, {
        message: "An error occurred",
        error: error?.message,
      });
    });
  });
}

// Helper function to get all connected users count
export function getConnectedUsersCount(): number {
  return connectedUsers.size;
}

// Helper function to get all users in a specific room
export function getUsersInRoom(
  io: Server,
  room: string
): (string | number)[] {
  return io.sockets.adapter.rooms.get(room)
    ? Array.from(io.sockets.adapter.rooms.get(room)!)
    : [];
}

// Helper function to emit to specific user type
export function emitToUserType(
  io: Server,
  userType: string,
  event: string,
  data: any
) {
  const userSockets = Array.from(connectedUsers.entries())
    .filter(([_, user]) => user.userType === userType)
    .map(([id, _]) => id);

  userSockets.forEach((socketId) => {
    io.to(socketId).emit(event, data);
  });
}
