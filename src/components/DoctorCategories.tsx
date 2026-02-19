import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Stethoscope, Brain, Bone, Eye, Baby, HeartPulse, Pill, Smile,
} from "lucide-react";

const categories = [
  { icon: HeartPulse, name: "Cardiologist", color: "bg-medical-coral-light text-medical-coral", path: "/doctors?cat=cardiology" },
  { icon: Brain, name: "Neurologist", color: "bg-medical-purple-light text-medical-purple", path: "/doctors?cat=neurology" },
  { icon: Bone, name: "Orthopedic", color: "bg-medical-blue-light text-medical-blue", path: "/doctors?cat=orthopedic" },
  { icon: Eye, name: "Ophthalmologist", color: "bg-medical-amber-light text-medical-amber", path: "/doctors?cat=ophthalmology" },
  { icon: Baby, name: "Pediatrician", color: "bg-medical-teal-light text-medical-teal", path: "/doctors?cat=pediatrics" },
  { icon: Stethoscope, name: "General", color: "bg-secondary text-primary", path: "/doctors?cat=general" },
  { icon: Pill, name: "Dermatologist", color: "bg-medical-coral-light text-medical-coral", path: "/doctors?cat=dermatology" },
  { icon: Smile, name: "Dentist", color: "bg-medical-blue-light text-medical-blue", path: "/doctors?cat=dentist" },
];

const DoctorCategories = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
          Find a Doctor by <span className="text-gradient-hero">Specialty</span>
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Browse our verified specialists and book appointments instantly.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={cat.path}
              className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card shadow-card hover:shadow-card-hover transition-all duration-300 group border border-border/50"
            >
              <div className={`w-14 h-14 rounded-xl ${cat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                <cat.icon className="w-7 h-7" />
              </div>
              <span className="font-display font-semibold text-sm text-foreground">{cat.name}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default DoctorCategories;
