import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
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
