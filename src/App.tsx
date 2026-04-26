import { Toaster } from "@/components/ui/toaster";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Index from "./pages/Index";
import Doctors from "./pages/Doctors";
import Pharmacy from "./pages/Pharmacy";
import BloodBank from "./pages/BloodBank";
import Ambulance from "./pages/Ambulance";
import Beds from "./pages/Beds";
import Canteen from "./pages/Canteen";
import PeriodTracker from "./pages/PeriodTracker";
import Contact from "./pages/Contact";
import Appointment from "./pages/Appointment";
import NotFound from "./pages/NotFound";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";

const queryClient = new QueryClient();

// ✅ Protected Route Component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ✅ Doctor Protected Route
const DoctorRoute = ({ children }: { children: JSX.Element }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const role = localStorage.getItem("userRole");

  if (!isLoggedIn || role !== "doctor") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          {/* 🔐 Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* 🔥 Protected Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* 🩺 Doctor Routes */}
          <Route
            path="/doctor/dashboard"
            element={
              <DoctorRoute>
                <DoctorDashboard />
              </DoctorRoute>
            }
          />

          {/* Other Routes (Optional: You can protect these later too) */}
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/blood-bank" element={<BloodBank />} />
          <Route path="/ambulance" element={<Ambulance />} />
          <Route path="/beds" element={<Beds />} />
          <Route path="/canteen" element={<Canteen />} />
          <Route path="/period-tracker" element={<PeriodTracker />} />
          
          <Route path="/contact" element={<Contact />} />
          <Route path="/appointment" element={<Appointment />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;