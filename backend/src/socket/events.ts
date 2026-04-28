// Socket.io Event Names
export const SOCKET_EVENTS = {
  // Connection Events
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  JOIN_ROOM: "join_room",
  LEAVE_ROOM: "leave_room",

  // Appointment Events
  APPOINTMENT_CREATED: "appointment_created",
  APPOINTMENT_UPDATED: "appointment_updated",
  APPOINTMENT_CANCELLED: "appointment_cancelled",
  APPOINTMENT_COMPLETED: "appointment_completed",

  // Doctor Events
  DOCTOR_AVAILABLE: "doctor_available",
  DOCTOR_BUSY: "doctor_busy",
  DOCTOR_OFFLINE: "doctor_offline",
  DOCTOR_STATUS_CHANGED: "doctor_status_changed",

  // Ambulance Events
  AMBULANCE_REQUESTED: "ambulance_requested",
  AMBULANCE_ACCEPTED: "ambulance_accepted",
  AMBULANCE_ON_WAY: "ambulance_on_way",
  AMBULANCE_ARRIVED: "ambulance_arrived",
  AMBULANCE_LOCATION_UPDATE: "ambulance_location_update",

  // Blood Bank Events
  BLOOD_INVENTORY_UPDATED: "blood_inventory_updated",
  BLOOD_REQUEST: "blood_request",
  BLOOD_REQUEST_FULFILLED: "blood_request_fulfilled",

  // Message Events
  MESSAGE_SENT: "message_sent",
  MESSAGE_RECEIVED: "message_received",
  TYPING_START: "typing_start",
  TYPING_END: "typing_end",

  // Notification Events
  NOTIFICATION_SENT: "notification_sent",
  NOTIFICATION_RECEIVED: "notification_received",

  // Error Events
  ERROR: "error",
  RECONNECT: "reconnect",
};

export type SocketEventKeys = keyof typeof SOCKET_EVENTS;
