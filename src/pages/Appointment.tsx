import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { Calendar, Loader2 } from "lucide-react";
import allDoctors from "@/lib/doctors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const Appointment = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const user = JSON.parse(localStorage.getItem("loggedUser") || "{}");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    doctor: "",
    date: "",
    time: "",
    notes: "",
  });

  const [availableDoctors, setAvailableDoctors] = useState<any[]>([]);

  // Get unique specialties from allDoctors, sorted alphabetically
  const departmentOptions = Array.from(
    new Set(allDoctors.map((d) => d.specialty))
  ).sort();

  const handleDoctorChange = (value: string) => {
    setFormData((prev) => ({ ...prev, doctor: value }));
  };

  // ✅ Protect page + auto-fill user data
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    }));
  }, [isLoggedIn, navigate, user]);

  // Prefill from link state (when coming from Doctors page)
  const location = useLocation();
  useEffect(() => {
    const state = (location as any).state;
    if (state) {
      const { doctor, department } = state as { doctor?: string; department?: string };
      setFormData((prev) => ({
        ...prev,
        doctor: doctor || prev.doctor,
        department: department || prev.department,
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep available doctors in sync when department changes
  useEffect(() => {
    if (!formData.department) {
      setAvailableDoctors([]);
      return;
    }
    const matches = allDoctors.filter((d) => d.specialty === formData.department);
    setAvailableDoctors(matches);
    // if only one doctor and none selected, preselect
    if (matches.length === 1 && !formData.doctor) {
      setFormData((prev) => ({ ...prev, doctor: matches[0].name }));
    }
  }, [formData.department]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      department: value,
    });
  };

  const handleSubmit = async () => {
    // Validate all required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.department || !formData.date || !formData.time) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields including name, email, phone, department, date, and time.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const apiUrl = "http://localhost:5002/api/appointments";

    try {
      console.log("📤 Sending appointment form to:", apiUrl);
      console.log("📋 Form data:", formData);
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log("📥 Response status:", response.status);
      const responseData = await response.json();
      console.log("📥 Response data:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || `Failed to book appointment (${response.status})`);
      }

      // ✅ Store locally per-user for reminder system using server's copy
      const storedAppointment = responseData.appointment || formData;
      const storageKey = `appointments_${user?.email}`;
      const existingAppointments = JSON.parse(
        localStorage.getItem(storageKey) || "[]"
      );

      const updatedAppointments = [
        ...existingAppointments,
        storedAppointment,
      ];

      localStorage.setItem(
        storageKey,
        JSON.stringify(updatedAppointments)
      );

      toast({
        title: "Appointment Booked!",
        description:
          "You will receive a reminder 1 day before your appointment.",
      });

      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        department: "",
        doctor: "",
        date: "",
        time: "",
        notes: "",
      });

      navigate("/dashboard");

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("❌ Appointment form error:", errorMsg);
      toast({
        title: "Error",
        description: `${errorMsg} - Make sure backend is running on http://localhost:5000`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Book an{" "}
              <span className="text-gradient-hero">
                Appointment
              </span>
            </h1>

            <p className="text-muted-foreground max-w-md mx-auto">
              Your personal details are auto-filled and cannot be edited.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-lg mx-auto p-8 rounded-xl bg-card shadow-card border border-border/50"
          >
            <div className="flex flex-col gap-5">

              {/* Name (Disabled) */}
              <Input
                id="name"
                value={formData.name}
                disabled
              />

              {/* Email (Disabled) */}
              <Input
                id="email"
                value={formData.email}
                disabled
              />

              {/* Phone (Disabled) */}
              <Input
                id="phone"
                value={formData.phone}
                disabled
              />

              {/* Department */}
              <Select
                onValueChange={handleSelectChange}
                value={formData.department}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>

                <SelectContent>
                  {departmentOptions.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Doctor (filtered by department) */}
              {availableDoctors.length > 0 ? (
                <Select onValueChange={handleDoctorChange} value={formData.doctor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>

                  <SelectContent>
                    {availableDoctors.map((d) => (
                      <SelectItem key={d.name} value={d.name}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input id="doctor" value={formData.doctor} placeholder="Select department to choose doctor" disabled />
              )}

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                />

                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                />
              </div>

              {/* Notes */}
              <Textarea
                id="notes"
                placeholder="Any specific concerns..."
                rows={3}
                value={formData.notes}
                onChange={handleChange}
              />

              <Button
                size="lg"
                className="w-full font-semibold mt-2"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Calendar className="w-5 h-5 mr-2" />
                )}

                {loading
                  ? "Confirming..."
                  : "Confirm Appointment"}
              </Button>

            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Appointment;