import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Pill, Droplets, Truck, BedDouble, UtensilsCrossed, CalendarHeart, MapPin, UserCheck,
} from "lucide-react";

const features = [
  { icon: Pill, title: "Pharmacy", desc: "Order medicines & prescriptions online", path: "/pharmacy", color: "bg-medical-emerald" },
  { icon: Droplets, title: "Blood Bank", desc: "Find blood donors & availability", path: "/blood-bank", color: "bg-destructive" },
  { icon: Truck, title: "Ambulance", desc: "Nearby ambulance tracking system", path: "/ambulance", color: "bg-medical-coral" },
  { icon: BedDouble, title: "Bed Availability", desc: "Real-time bed status across wards", path: "/beds", color: "bg-medical-blue" },
  { icon: UtensilsCrossed, title: "Canteen", desc: "Order food to your bed via QR scan", path: "/canteen", color: "bg-medical-amber" },
  { icon: CalendarHeart, title: "Period Tracker", desc: "Track cycles & get health reminders", path: "/period-tracker", color: "bg-medical-purple" },
  { icon: MapPin, title: "Contact & Map", desc: "Find us easily with live directions", path: "/contact", color: "bg-medical-teal" },
  { icon: UserCheck, title: "Admin Panel", desc: "Verify doctors & manage operations", path: "/admin", color: "bg-foreground" },
];

const FeaturesGrid = () => (
  <section className="py-20 bg-secondary/50">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
          Everything You Need, <span className="text-gradient-hero">One Platform</span>
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          From emergency care to canteen orders — Heal Home Net covers it all.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={f.path}
              className="block p-6 rounded-xl bg-card shadow-card hover:shadow-card-hover border border-border/50 transition-all duration-300 group h-full"
            >
              <div className={`w-12 h-12 rounded-lg ${f.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                <f.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesGrid;
