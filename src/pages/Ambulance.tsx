import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { Truck, MapPin, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const ambulances = [
  { id: "AMB-001", location: "Sector 22, Near City Mall", eta: "3 min", status: "available" },
  { id: "AMB-002", location: "Main Hospital Road", eta: "1 min", status: "available" },
  { id: "AMB-003", location: "Highway Junction", eta: "7 min", status: "en-route" },
  { id: "AMB-004", location: "Green Park Area", eta: "5 min", status: "available" },
  { id: "AMB-005", location: "Station Road", eta: "10 min", status: "en-route" },
];

const Ambulance = () => (
  <PageLayout>
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3"><span className="text-gradient-hero">Ambulance</span></h1>
          <p className="text-muted-foreground max-w-md mx-auto">Find the nearest ambulance and get emergency help fast.</p>
        </motion.div>

        {/* Emergency CTA */}
        <div className="max-w-md mx-auto mb-12">
          <a href="tel:108">
            <Button size="lg" className="w-full bg-destructive text-destructive-foreground hover:opacity-90 font-bold text-lg py-6">
              <Phone className="w-5 h-5 mr-2" /> Call 108 — Emergency
            </Button>
          </a>
        </div>

        <h2 className="font-display font-semibold text-xl mb-6 text-center">Nearby Ambulances</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {ambulances.map((amb, i) => (
            <motion.div
              key={amb.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-xl bg-card shadow-card border border-border/50"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-medical-coral" />
                  <span className="font-display font-semibold text-sm">{amb.id}</span>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  amb.status === "available" ? "bg-medical-teal-light text-medical-teal" : "bg-medical-amber-light text-medical-amber"
                }`}>
                  {amb.status === "available" ? "Available" : "En Route"}
                </span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground mb-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                {amb.location}
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Clock className="w-4 h-4 text-primary" />
                ETA: {amb.eta}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Ambulance;
