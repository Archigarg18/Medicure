import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import {
  Stethoscope, Brain, Bone, Eye, Baby, HeartPulse, Pill, Smile, Star, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const doctors = [
  { name: "Dr. Priya Sharma", specialty: "Cardiologist", rating: 4.9, exp: 15, icon: HeartPulse, color: "bg-medical-coral-light text-medical-coral" },
  { name: "Dr. Arjun Patel", specialty: "Neurologist", rating: 4.8, exp: 12, icon: Brain, color: "bg-medical-purple-light text-medical-purple" },
  { name: "Dr. Neha Gupta", specialty: "Orthopedic", rating: 4.7, exp: 10, icon: Bone, color: "bg-medical-blue-light text-medical-blue" },
  { name: "Dr. Ravi Kumar", specialty: "Ophthalmologist", rating: 4.9, exp: 18, icon: Eye, color: "bg-medical-amber-light text-medical-amber" },
  { name: "Dr. Sneha Reddy", specialty: "Pediatrician", rating: 4.8, exp: 8, icon: Baby, color: "bg-medical-teal-light text-medical-teal" },
  { name: "Dr. Vikram Singh", specialty: "General Physician", rating: 4.6, exp: 20, icon: Stethoscope, color: "bg-secondary text-primary" },
  { name: "Dr. Meera Joshi", specialty: "Dermatologist", rating: 4.7, exp: 9, icon: Pill, color: "bg-medical-coral-light text-medical-coral" },
  { name: "Dr. Ankit Verma", specialty: "Dentist", rating: 4.8, exp: 11, icon: Smile, color: "bg-medical-blue-light text-medical-blue" },
];

const Doctors = () => (
  <PageLayout>
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">Our <span className="text-gradient-hero">Doctors</span></h1>
          <p className="text-muted-foreground max-w-md mx-auto">All doctors are verified by our admin panel to ensure quality care.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {doctors.map((doc, i) => (
            <motion.div
              key={doc.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-xl bg-card shadow-card border border-border/50 flex flex-col items-center text-center"
            >
              <div className={`w-16 h-16 rounded-full ${doc.color} flex items-center justify-center mb-4`}>
                <doc.icon className="w-8 h-8" />
              </div>
              <h3 className="font-display font-semibold text-foreground">{doc.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{doc.specialty}</p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-medical-amber" />{doc.rating}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{doc.exp}y exp</span>
              </div>
              <Link to="/appointment" className="w-full">
                <Button size="sm" className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90 font-semibold">
                  Book Appointment
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Doctors;
