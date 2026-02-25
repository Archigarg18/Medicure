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

  // ✅ Protect Dashboard (No direct access without login)
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // ✅ Appointment Reminder Logic
  useEffect(() => {
    const appointments = JSON.parse(
      localStorage.getItem("appointments") || "[]"
    );

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
  }, [user]);

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
              <p className="mb-4">
                Manage your appointments from here.
              </p>

              <button
                onClick={handleAppointmentClick}
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