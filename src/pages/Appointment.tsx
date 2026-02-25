import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { Calendar, Loader2 } from "lucide-react";
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
    date: "",
    time: "",
    notes: "",
  });

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
    if (!formData.department || !formData.date || !formData.time) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/appointments",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to book");
      }

      // ✅ Store locally for reminder system
      const existingAppointments = JSON.parse(
        localStorage.getItem("appointments") || "[]"
      );

      const updatedAppointments = [
        ...existingAppointments,
        formData,
      ];

      localStorage.setItem(
        "appointments",
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
        date: "",
        time: "",
        notes: "",
      });

      navigate("/dashboard");

    } catch (error) {
      toast({
        title: "Error",
        description:
          "Could not book appointment. Please try again.",
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
                  {[
                    "Cardiology",
                    "Neurology",
                    "Orthopedic",
                    "Ophthalmology",
                    "Pediatrics",
                    "General",
                    "Dermatology",
                    "Dentistry",
                  ].map((d) => (
                    <SelectItem key={d} value={d.toLowerCase()}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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