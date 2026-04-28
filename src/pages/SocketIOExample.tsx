import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { Button } from "@/components/ui/button";
import { safeLocalStorageGet } from "@/lib/browser";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RealtimeNotifications from "@/components/RealtimeNotifications";
import RealtimeAppointments from "@/components/RealtimeAppointments";

/**
 * Example page showing Socket.io usage
 * Copy this pattern to add real-time features to your pages
 */
export default function SocketIOExamplePage() {
  const [messages, setMessages] = useState<Array<{ id: string; text: string; from: string }>>([]);
  const [messageInput, setMessageInput] = useState("");
  const [doctors, setDoctors] = useState<
    Array<{ id: string; name: string; status: "available" | "busy" | "offline" }>
  >([]);

  const userId = safeLocalStorageGet("userId") || "user-1";
  const userType = (safeLocalStorageGet("userType") as any) || "patient";

  // Initialize Socket.io
  const {
    isConnected,
    isConnecting,
    joinRoom,
    sendMessage,
    onMessageReceived,
    onDoctorStatusChanged,
    emit,
  } = useSocket({
    userId,
    userType,
    room: `chat-room-${userId}`,
    autoConnect: true,
  });

  // Listen for incoming messages
  useEffect(() => {
    onMessageReceived((data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: data.message,
          from: data.from,
        },
      ]);
    });
  }, [onMessageReceived]);

  // Listen for doctor status changes
  useEffect(() => {
    onDoctorStatusChanged((data) => {
      setDoctors((prev) =>
        prev.map((doc) =>
          doc.id === data.doctorId ? { ...doc, status: data.status } : doc
        )
      );

      // Add notification
      console.log(`🏥 Doctor ${data.doctorId} is now ${data.status}`);
    });
  }, [onDoctorStatusChanged]);

  // Send message handler
  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage({
        to: "doctor-1", // Example doctor ID
        message: messageInput,
        room: `chat-room-${userId}`,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: messageInput,
          from: userId,
        },
      ]);

      setMessageInput("");
    }
  };

  // Test emit custom event
  const handleTestEvent = () => {
    emit("test_event", {
      userId,
      message: "Test message from frontend",
      timestamp: new Date(),
    });

    console.log("✅ Test event emitted");
  };

  // Simulate doctor status change (for testing)
  const simulateDoctorStatus = () => {
    emit("doctor_status_changed", {
      doctorId: "doc-123",
      status: "busy",
      userType: "doctor",
    });

    console.log("✅ Doctor status change emitted");
  };

  return (
    <div className="w-full p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Socket.io Example Page</h1>
        <Badge variant={isConnected ? "default" : "destructive"}>
          {isConnected
            ? "🟢 Connected"
            : isConnecting
              ? "🟡 Connecting..."
              : "🔴 Disconnected"}
        </Badge>
      </div>

      {/* Real-time Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <RealtimeNotifications />

        {/* Appointments */}
        <RealtimeAppointments />
      </div>

      {/* Messaging Section */}
      <Card>
        <CardHeader>
          <CardTitle>Real-time Messaging</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 max-h-64 overflow-y-auto bg-gray-50 p-3 rounded">
            {messages.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No messages yet</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2 rounded ${
                    msg.from === userId
                      ? "bg-blue-100 ml-8"
                      : "bg-gray-200 mr-8"
                  }`}
                >
                  <p className="text-sm font-semibold">{msg.from}</p>
                  <p className="text-sm">{msg.text}</p>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={!isConnected}
            />
            <Button onClick={handleSendMessage} disabled={!isConnected}>
              Send
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Doctor Status Section */}
      <Card>
        <CardHeader>
          <CardTitle>Doctor Status Monitoring</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {doctors.length === 0 ? (
              <p className="text-gray-500">No doctors online</p>
            ) : (
              doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="flex justify-between items-center p-2 border rounded"
                >
                  <span>{doctor.name}</span>
                  <Badge
                    variant={
                      doctor.status === "available"
                        ? "default"
                        : doctor.status === "busy"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {doctor.status}
                  </Badge>
                </div>
              ))
            )}
          </div>

          <Button
            onClick={simulateDoctorStatus}
            disabled={!isConnected}
            className="w-full"
            variant="outline"
          >
            Simulate Doctor Status Change
          </Button>
        </CardContent>
      </Card>

      {/* Testing Section */}
      <Card>
        <CardHeader>
          <CardTitle>Testing & Debugging</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Use these buttons to test Socket.io functionality:
          </p>

          <div className="space-y-2">
            <Button
              onClick={handleTestEvent}
              disabled={!isConnected}
              variant="outline"
              className="w-full"
            >
              📤 Emit Test Event
            </Button>

            <Button
              onClick={simulateDoctorStatus}
              disabled={!isConnected}
              variant="outline"
              className="w-full"
            >
              🏥 Test Doctor Status
            </Button>

            <Button
              onClick={() => {
                console.log("Socket connected:", isConnected);
              }}
              variant="outline"
              className="w-full"
            >
              🔍 Log Socket Info
            </Button>
          </div>

          <div className="p-3 bg-gray-100 rounded text-sm">
            <p className="font-semibold mb-2">Debug Info:</p>
            <p>User ID: {userId}</p>
            <p>User Type: {userType}</p>
            <p>Connected: {isConnected ? "Yes" : "No"}</p>
            <p>Messages: {messages.length}</p>
          </div>

          <p className="text-xs text-gray-500">
            Open browser console (F12) to see Socket.io logs
          </p>
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>✅ <strong>Socket.io is now fully integrated!</strong></p>
          <p>
            1. Open this page - Socket will connect automatically
          </p>
          <p>
            2. Try sending a message (requires another user/tab)
          </p>
          <p>
            3. Watch for doctor status updates in real-time
          </p>
          <p>
            4. Check browser console (F12) for debug logs
          </p>
          <p className="text-gray-600 mt-4">
            📚 For full documentation, see <code>SOCKET_IO_SSR_GUIDE.md</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
