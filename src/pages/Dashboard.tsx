import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const user = JSON.parse(localStorage.getItem("loggedUser") || "{}");

  const [upcomingReminder, setUpcomingReminder] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);

  // ✅ Protect Dashboard (No direct access without login)
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // ✅ Load appointments for this specific user from localStorage
  useEffect(() => {
    const storageKey = `appointments_${user?.email}`;
    // migrate legacy global key if present
    const legacy = JSON.parse(localStorage.getItem("appointments") || "[]");
    if (legacy.length) {
      const mine = (legacy as any[]).filter((apt) => apt.email === user?.email);
      if (mine.length) {
        localStorage.setItem(storageKey, JSON.stringify(mine));
      }
      // optionally remove the old global list to avoid confusion
      localStorage.removeItem("appointments");
    }
    const storedAppointments = JSON.parse(
      localStorage.getItem(storageKey) || "[]"
    );
    setAppointments(storedAppointments);
  }, [user]);

  // ✅ Also fetch from backend to stay synchronized
  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/api/appointments?email=${encodeURIComponent(
        user.email
      )}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data)) {
            setAppointments(data.data);
            // update localStorage copy as well
            const storageKey = `appointments_${user.email}`;
            localStorage.setItem(storageKey, JSON.stringify(data.data));
          }
        })
        .catch((err) => {
          console.error("Error fetching appointments from backend:", err);
        });
    }
  }, [user]);

  // ✅ Appointment Reminder Logic
  useEffect(() => {
    const today = new Date();

    appointments.forEach((appointment: any) => {
      const appointmentDate = new Date(appointment.date);

      const diffTime = appointmentDate.getTime() - today.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);

      if (diffDays <= 1 && diffDays > 0) {
        setUpcomingReminder(
          `🔔 Reminder: Your appointment is tomorrow at ${appointment.time}`
        );

        // ✅ Simulated Email Notification
        console.log(
          `Email Sent To ${user?.email}: Your appointment is tomorrow at ${appointment.time}`
        );
      }
    });
  }, [appointments, user]);

  // ✅ Protect Appointment Button
  const handleAppointmentClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate("/appointment");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* USER NAME */}
          <h1 className="text-3xl font-bold mb-4">
            Welcome, {user?.name || "User"}
          </h1>

          {/* PATIENT DETAILS */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Details</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Phone:</strong> {user?.phone}</p>
              <p><strong>Blood Group:</strong> {user?.bloodGroup}</p>

              <p className="text-red-500 text-sm mt-2">
                ⚠ Details cannot be edited after signup.
              </p>
            </CardContent>
          </Card>

          {/* APPOINTMENT REMINDER */}
          {upcomingReminder && (
            <Card className="mb-6 border-green-500">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-green-600 font-semibold">
                  {upcomingReminder}
                </p>
              </CardContent>
            </Card>
          )}

          {/* APPOINTMENT SECTION */}
          <Card>
            <CardHeader>
              <CardTitle>Appointments</CardTitle>
            </CardHeader>

            <CardContent>
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2 font-semibold">Department</th>
                          <th className="text-left p-2 font-semibold">Doctor</th>
                          <th className="text-left p-2 font-semibold">Date</th>
                          <th className="text-left p-2 font-semibold">Time</th>
                          <th className="text-left p-2 font-semibold">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((apt, idx) => (
                          <tr key={idx} className="border-b hover:bg-secondary/50">
                            <td className="p-2">{apt.department || "N/A"}</td>
                            <td className="p-2">{apt.doctor || "Not specified"}</td>
                            <td className="p-2">{apt.date}</td>
                            <td className="p-2">{apt.time}</td>
                            <td className="p-2 text-xs text-muted-foreground">{apt.notes || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button
                    onClick={handleAppointmentClick}
                    className="bg-gradient-hero text-white px-4 py-2 rounded-lg"
                  >
                    Book New Appointment
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    No appointments booked yet.
                  </p>
                  <button
                    onClick={handleAppointmentClick}
                    className="bg-gradient-hero text-white px-4 py-2 rounded-lg"
                  >
                    Book an Appointment
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;