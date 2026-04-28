import io, { Socket } from "socket.io-client";

const SOCKET_SERVER_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5002";

class SocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;

  constructor() {}

  /**
   * Initialize and connect to Socket.io server
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      try {
        this.socket = io(SOCKET_SERVER_URL, {
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 10,
          transports: ["websocket", "polling"],
        });

        this.socket.on("connect", () => {
          console.log("✅ Connected to Socket.io server");
          this.isConnected = true;
          resolve();
        });

        this.socket.on("disconnect", () => {
          console.log("❌ Disconnected from Socket.io server");
          this.isConnected = false;
        });

        this.socket.on("error", (error: any) => {
          console.error("Socket error:", error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Disconnect from Socket.io server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
      console.log("🔌 Socket disconnected");
    }
  }

  /**
   * Check if socket is connected
   */
  getIsConnected(): boolean {
    return this.isConnected && !!this.socket?.connected;
  }

  /**
   * Join a room
   */
  joinRoom(data: {
    userId: string;
    userType: "admin" | "doctor" | "patient" | "ambulance";
    room: string;
  }): void {
    if (this.socket) {
      this.socket.emit("join_room", data);
      console.log(`📍 Joined room: ${data.room}`);
    }
  }

  /**
   * Leave a room
   */
  leaveRoom(room: string): void {
    if (this.socket) {
      this.socket.emit("leave_room", { room });
      console.log(`👋 Left room: ${room}`);
    }
  }

  /**
   * Send message
   */
  sendMessage(data: {
    from: string;
    to?: string;
    message: string;
    room?: string;
  }): void {
    if (this.socket) {
      this.socket.emit("message_sent", data);
    }
  }

  /**
   * Listen for incoming messages
   */
  onMessageReceived(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on("message_received", callback);
    }
  }

  /**
   * Emit typing start event
   */
  emitTypingStart(data: { room: string; userId: string }): void {
    if (this.socket) {
      this.socket.emit("typing_start", data);
    }
  }

  /**
   * Emit typing end event
   */
  emitTypingEnd(data: { room: string; userId: string }): void {
    if (this.socket) {
      this.socket.emit("typing_end", data);
    }
  }

  /**
   * Listen for typing start
   */
  onTypingStart(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on("typing_start", callback);
    }
  }

  /**
   * Listen for typing end
   */
  onTypingEnd(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on("typing_end", callback);
    }
  }

  // ==================== APPOINTMENT EVENTS ====================

  /**
   * Emit appointment created event
   */
  emitAppointmentCreated(data: any): void {
    if (this.socket) {
      this.socket.emit("appointment_created", data);
    }
  }

  /**
   * Listen for appointment created
   */
  onAppointmentCreated(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on("appointment_created", callback);
    }
  }

  /**
   * Emit appointment updated event
   */
  emitAppointmentUpdated(data: any): void {
    if (this.socket) {
      this.socket.emit("appointment_updated", data);
    }
  }

  /**
   * Listen for appointment updated
   */
  onAppointmentUpdated(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on("appointment_updated", callback);
    }
  }

  /**
   * Emit appointment cancelled event
   */
  emitAppointmentCancelled(data: any): void {
    if (this.socket) {
      this.socket.emit("appointment_cancelled", data);
    }
  }

  /**
   * Listen for appointment cancelled
   */
  onAppointmentCancelled(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on("appointment_cancelled", callback);
    }
  }

  // ==================== DOCTOR EVENTS ====================

  /**
   * Emit doctor status changed event
   */
  emitDoctorStatusChanged(data: any): void {
    if (this.socket) {
      this.socket.emit("doctor_status_changed", data);
    }
  }

  /**
   * Listen for doctor status changed
   */
  onDoctorStatusChanged(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on("doctor_status_changed", callback);
    }
  }

  // ==================== AMBULANCE EVENTS ====================

  /**
   * Emit ambulance requested event
   */
  emitAmbulanceRequested(data: any): void {
    if (this.socket) {
      this.socket.emit("ambulance_requested", data);
    }
  }

  /**
   * Listen for ambulance requested
   */
  onAmbulanceRequested(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on("ambulance_requested", callback);
    }
  }

  /**
   * Emit ambulance location update
   */
  emitAmbulanceLocationUpdate(data: any): void {
    if (this.socket) {
      this.socket.emit("ambulance_location_update", data);
    }
  }

  /**
   * Listen for ambulance location update
   */
  onAmbulanceLocationUpdate(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on("ambulance_location_update", callback);
    }
  }

  /**
   * Emit ambulance on way event
   */
  emitAmbulanceOnWay(data: any): void {
    if (this.socket) {
      this.socket.emit("ambulance_on_way", data);
    }
  }

  /**
   * Listen for ambulance on way
   */
  onAmbulanceOnWay(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on("ambulance_on_way", callback);
    }
  }

  // ==================== BLOOD BANK EVENTS ====================

  /**
   * Emit blood inventory updated event
   */
  emitBloodInventoryUpdated(data: any): void {
    if (this.socket) {
      this.socket.emit("blood_inventory_updated", data);
    }
  }

  /**
   * Listen for blood inventory updated
   */
  onBloodInventoryUpdated(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on("blood_inventory_updated", callback);
    }
  }

  /**
   * Emit blood request event
   */
  emitBloodRequest(data: any): void {
    if (this.socket) {
      this.socket.emit("blood_request", data);
    }
  }

  /**
   * Listen for blood request
   */
  onBloodRequest(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on("blood_request", callback);
    }
  }

  // ==================== NOTIFICATION EVENTS ====================

  /**
   * Listen for notifications
   */
  onNotificationReceived(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on("notification_sent", callback);
    }
  }

  // ==================== GENERIC EVENT LISTENERS ====================

  /**
   * Listen for generic events
   */
  on(event: string, callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  /**
   * Emit generic events
   */
  emit(event: string, data: any): void {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  /**
   * Remove event listener
   */
  off(event: string): void {
    if (this.socket) {
      this.socket.off(event);
    }
  }

  /**
   * Get socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }
}

// Singleton instance
const socketService = new SocketService();

export default socketService;
