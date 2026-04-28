import React, { useEffect, useState } from "react";
import { safeLocalStorageGet } from "@/lib/browser";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const API_BASE = "http://localhost:5002";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const isLoggedIn = safeLocalStorageGet("isLoggedIn");
  const user = JSON.parse(safeLocalStorageGet("loggedUser") || "{}");

  const [upcomingReminder, setUpcomingReminder] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // ✅ FIXED FETCH (using query parameter + correct port)
  useEffect(() => {
    if (user?.email) {
      const token = localStorage.getItem("token");
      fetch(
        `${API_BASE}/api/appointments`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data)) {
            setAppointments(data.data);
          }
        })
        .catch((err) => {
          console.error("Error fetching appointments:", err);
        });
    }
  }, [user]);

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
      }
    });
  }, [appointments]);

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
          <h1 className="text-3xl font-bold mb-4">
            Welcome, {user?.name || "User"}
          </h1>

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
                            <td className="p-2 text-xs text-muted-foreground">
                              {apt.notes || "-"}
                            </td>
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