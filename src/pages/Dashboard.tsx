import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // ✅ Logged user
  const user = JSON.parse(
    localStorage.getItem("loggedUser") || "{}"
  );

  // ✅ Appointments
  const [upcomingReminder, setUpcomingReminder] = useState<string | null>(null);

  useEffect(() => {
    const appointments = JSON.parse(
      localStorage.getItem("appointments") || "[]"
    );

    const today = new Date();

    appointments.forEach((appointment: any) => {
      const appointmentDate = new Date(appointment.date);

      const diffTime =
        appointmentDate.getTime() - today.getTime();

      const diffDays =
        diffTime / (1000 * 3600 * 24);

      // ✅ If appointment is tomorrow
      if (diffDays <= 1 && diffDays > 0) {
        setUpcomingReminder(
          `🔔 Reminder: Your appointment is tomorrow at ${appointment.time}`
        );
      }
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >

          {/* ✅ USER NAME */}
          <h1 className="text-3xl font-bold mb-4">
            Welcome, {user?.name || "User"}
          </h1>

          {/* ✅ PATIENT DETAILS (NON EDITABLE) */}
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

          {/* ✅ APPOINTMENT REMINDER SECTION */}
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

          {/* ✅ APPOINTMENT SUMMARY */}
          <Card>
            <CardHeader>
              <CardTitle>Appointments</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="mb-4">
                Manage your appointments from here.
              </p>

              <button
                onClick={() => navigate("/appointment")}
                className="bg-gradient-hero text-white px-4 py-2 rounded-lg"
              >
                Book / Manage Appointment
              </button>
            </CardContent>
          </Card>

        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;