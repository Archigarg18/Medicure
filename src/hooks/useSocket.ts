import { useEffect, useState, useCallback, useRef } from "react";
import socketService from "@/services/socketService";

interface UseSocketOptions {
  userId?: string;
  userType?: "admin" | "doctor" | "patient" | "ambulance";
  room?: string;
  autoConnect?: boolean;
}

/**
 * Custom hook for Socket.io integration
 * Handles connection management and event listeners
 */
export function useSocket(options: UseSocketOptions = {}) {
  const { userId, userType, room, autoConnect = true } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const listenersCleaned = useRef(false);

  // Connect on mount
  useEffect(() => {
    if (!autoConnect) return;

    const initializeSocket = async () => {
      try {
        setIsConnecting(true);
        await socketService.connect();
        setIsConnected(true);

        // Join room if provided
        if (userId && userType && room) {
          socketService.joinRoom({
            userId,
            userType,
            room,
          });
        }

        setIsConnecting(false);
      } catch (error) {
        console.error("Failed to connect socket:", error);
        setIsConnecting(false);
      }
    };

    initializeSocket();

    // Cleanup on unmount
    return () => {
      if (!listenersCleaned.current) {
        listenersCleaned.current = true;
        // Don't disconnect here - keep connection alive
        // socketService.disconnect();
      }
    };
  }, [autoConnect, userId, userType, room]);

  // Handle connection state
  useEffect(() => {
    const socket = socketService.getSocket();
    if (!socket) return;

    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  // Manual connection function
  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);
      await socketService.connect();
      setIsConnected(true);

      if (userId && userType && room) {
        socketService.joinRoom({
          userId,
          userType,
          room,
        });
      }
    } catch (error) {
      console.error("Failed to connect:", error);
    } finally {
      setIsConnecting(false);
    }
  }, [userId, userType, room]);

  // Manual disconnect function
  const disconnect = useCallback(() => {
    socketService.disconnect();
    setIsConnected(false);
  }, []);

  // Join room function
  const joinRoom = useCallback(
    (
      joinRoomData: Omit<
        Parameters<typeof socketService.joinRoom>[0],
        "userId" | "userType"
      > & {
        userId?: string;
        userType?: "admin" | "doctor" | "patient" | "ambulance";
      }
    ) => {
      socketService.joinRoom({
        userId: joinRoomData.userId || userId || "",
        userType: joinRoomData.userType || userType || "patient",
        room: joinRoomData.room,
      });
    },
    [userId, userType]
  );

  // Leave room function
  const leaveRoom = useCallback((leaveRoom: string) => {
    socketService.leaveRoom(leaveRoom);
  }, []);

  // Send message function
  const sendMessage = useCallback(
    (data: {
      to?: string;
      message: string;
      room?: string;
    }) => {
      socketService.sendMessage({
        from: userId || "anonymous",
        ...data,
      });
    },
    [userId]
  );

  // Emit event function
  const emit = useCallback((event: string, data: any) => {
    socketService.emit(event, data);
  }, []);

  // Listen for event function
  const on = useCallback((event: string, callback: (data: any) => void) => {
    socketService.on(event, callback);
  }, []);

  // Remove listener function
  const off = useCallback((event: string) => {
    socketService.off(event);
  }, []);

  // Appointment events
  const onAppointmentCreated = useCallback(
    (callback: (data: any) => void) => {
      socketService.onAppointmentCreated(callback);
    },
    []
  );

  const onAppointmentUpdated = useCallback(
    (callback: (data: any) => void) => {
      socketService.onAppointmentUpdated(callback);
    },
    []
  );

  const onAppointmentCancelled = useCallback(
    (callback: (data: any) => void) => {
      socketService.onAppointmentCancelled(callback);
    },
    []
  );

  // Doctor events
  const onDoctorStatusChanged = useCallback(
    (callback: (data: any) => void) => {
      socketService.onDoctorStatusChanged(callback);
    },
    []
  );

  // Ambulance events
  const onAmbulanceRequested = useCallback(
    (callback: (data: any) => void) => {
      socketService.onAmbulanceRequested(callback);
    },
    []
  );

  const onAmbulanceLocationUpdate = useCallback(
    (callback: (data: any) => void) => {
      socketService.onAmbulanceLocationUpdate(callback);
    },
    []
  );

  const onAmbulanceOnWay = useCallback(
    (callback: (data: any) => void) => {
      socketService.onAmbulanceOnWay(callback);
    },
    []
  );

  // Blood bank events
  const onBloodInventoryUpdated = useCallback(
    (callback: (data: any) => void) => {
      socketService.onBloodInventoryUpdated(callback);
    },
    []
  );

  const onBloodRequest = useCallback(
    (callback: (data: any) => void) => {
      socketService.onBloodRequest(callback);
    },
    []
  );

  // Notification events
  const onNotification = useCallback(
    (callback: (data: any) => void) => {
      socketService.onNotificationReceived(callback);
    },
    []
  );

  // Message events
  const onMessageReceived = useCallback(
    (callback: (data: any) => void) => {
      socketService.onMessageReceived(callback);
    },
    []
  );

  const onTypingStart = useCallback(
    (callback: (data: any) => void) => {
      socketService.onTypingStart(callback);
    },
    []
  );

  const onTypingEnd = useCallback(
    (callback: (data: any) => void) => {
      socketService.onTypingEnd(callback);
    },
    []
  );

  return {
    // Connection state
    isConnected,
    isConnecting,

    // Connection management
    connect,
    disconnect,

    // Room management
    joinRoom,
    leaveRoom,

    // Messaging
    sendMessage,
    onMessageReceived,
    onTypingStart,
    onTypingEnd,

    // Appointment events
    onAppointmentCreated,
    onAppointmentUpdated,
    onAppointmentCancelled,

    // Doctor events
    onDoctorStatusChanged,

    // Ambulance events
    onAmbulanceRequested,
    onAmbulanceLocationUpdate,
    onAmbulanceOnWay,

    // Blood bank events
    onBloodInventoryUpdated,
    onBloodRequest,

    // Notifications
    onNotification,

    // Generic event handlers
    on,
    emit,
    off,
  };
}
