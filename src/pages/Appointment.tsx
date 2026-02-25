import { useState } from "react";
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
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    date: "",
    time: "",
    notes: "",
  });

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
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.date ||
      !formData.time
    ) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // ✅ Save appointment to backend
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

      // ✅ ALSO store in localStorage for reminder system
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
          "We received your request. You will get a reminder 1 day before.",
      });

      // ✅ Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        department: "",
        date: "",
        time: "",
        notes: "",
      });
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
              Fill in your details and we'll confirm your appointment.
              You'll get a reminder 1 day before.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-lg mx-auto p-8 rounded-xl bg-card shadow-card border border-border/50"
          >
            <div className="flex flex-col gap-5">
              {/* Name */}
              <div>
                <label className="text-sm font-medium block mb-1.5">
                  Full Name
                </label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium block mb-1.5">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-medium block mb-1.5">
                  Phone
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              {/* Department */}
              <div>
                <label className="text-sm font-medium block mb-1.5">
                  Department
                </label>
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
                      <SelectItem
                        key={d}
                        value={d.toLowerCase()}
                      >
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1.5">
                    Date
                  </label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1.5">
                    Time
                  </label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-medium block mb-1.5">
                  Notes (optional)
                </label>
                <Textarea
                  id="notes"
                  placeholder="Any specific concerns..."
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>

              {/* Submit */}
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