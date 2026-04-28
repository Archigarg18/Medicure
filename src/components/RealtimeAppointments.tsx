import { useEffect, useState, useCallback } from "react";
import { useSocket } from "../hooks/useSocket";
import { safeLocalStorageGet } from "../lib/browser";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface AppointmentUpdate {
  appointmentId: string;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  patientName?: string;
  doctorName?: string;
  timestamp: Date;
}

/**
 * Real-time Appointments Component
 * Demonstrates Socket.io usage for appointment updates
 */
export function RealtimeAppointments() {
  const [appointments, setAppointments] = useState<AppointmentUpdate[]>([]);
  const [filter, setFilter] = useState<string>("all");

  const userId = safeLocalStorageGet("userId") || "user-default";
  const userType = (safeLocalStorageGet("userType") as any) || "patient";

  const {
    isConnected,
    onAppointmentCreated,
    onAppointmentUpdated,
    onAppointmentCancelled,
  } = useSocket({
    userId,
    userType,
    room: `appointments-${userId}`,
    autoConnect: true,
  });

  // Listen for appointment created
  useEffect(() => {
    onAppointmentCreated((data) => {
      const update: AppointmentUpdate = {
        appointmentId: data.appointmentId,
        status: "pending",
        patientName: data.appointmentData?.patientName,
        doctorName: data.appointmentData?.doctorName,
        timestamp: new Date(data.timestamp),
      };

      setAppointments((prev) => [update, ...prev]);
      console.log("📅 Appointment created:", update);
    });
  }, [onAppointmentCreated]);

  // Listen for appointment updated
  useEffect(() => {
    onAppointmentUpdated((data) => {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.appointmentId === data.appointmentId
            ? {
                ...apt,
                status: data.status,
                timestamp: new Date(data.timestamp),
              }
            : apt
        )
      );

      console.log("📅 Appointment updated:", data.appointmentId, data.status);
    });
  }, [onAppointmentUpdated]);

  // Listen for appointment cancelled
  useEffect(() => {
    onAppointmentCancelled((data) => {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.appointmentId === data.appointmentId
            ? {
                ...apt,
                status: "cancelled",
                timestamp: new Date(data.timestamp),
              }
            : apt
        )
      );

      console.log("❌ Appointment cancelled:", data.appointmentId);
    });
  }, [onAppointmentCancelled]);

  const filteredAppointments =
    filter === "all"
      ? appointments
      : appointments.filter((apt) => apt.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Real-time Appointments</CardTitle>
          <Badge variant="outline">
            {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          {["all", "pending", "confirmed", "in-progress", "completed", "cancelled"].map(
            (status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            )
          )}
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredAppointments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No appointments found
            </p>
          ) : (
            filteredAppointments.map((apt) => (
              <div
                key={apt.appointmentId}
                className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(apt.status)}
                    <div>
                      <h4 className="font-semibold">
                        Appointment #{apt.appointmentId.slice(0, 8)}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Patient: {apt.patientName || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Doctor: {apt.doctorName || "Pending"}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {apt.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(apt.status)}>
                    {apt.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default RealtimeAppointments;
