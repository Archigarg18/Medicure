import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Heart } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => (
  <section className="relative min-h-[90vh] flex items-center overflow-hidden">
    {/* Background image overlay */}
    <div className="absolute inset-0">
      <img src={heroBg} alt="Medical healthcare" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-foreground/70" />
    </div>

    <div className="container mx-auto px-4 relative z-10">
      <div className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4" /> Trusted Healthcare
          </span>

          <h1 className="font-display text-4xl md:text-6xl font-extrabold text-primary-foreground leading-tight mb-6">
            Your Health, <br />
            <span className="text-accent">Home Healthcare</span>
          </h1>

          <p className="text-primary-foreground/80 text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
            Book appointments, find nearby ambulances, manage prescriptions, and access all hospital services — all in one place.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/appointment">
              <Button size="lg" className="bg-accent text-accent-foreground hover:opacity-90 font-semibold text-base px-8 shadow-hero">
                Book Appointment <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/doctors">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold text-base px-8">
                Find a Doctor
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap gap-8 mt-14"
        >
          {[
            { icon: Shield, label: "Verified Doctors", value: "200+" },
            { icon: Clock, label: "24/7 Emergency", value: "Always" },
            { icon: Heart, label: "Patients Served", value: "50K+" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-display font-bold text-primary-foreground text-lg">{stat.value}</p>
                <p className="text-primary-foreground/60 text-sm">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

export default HeroSection;
