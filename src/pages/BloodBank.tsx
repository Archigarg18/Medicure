import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";

const bloodGroups = [
  { group: "A+", available: 15, urgent: false },
  { group: "A-", available: 3, urgent: true },
  { group: "B+", available: 22, urgent: false },
  { group: "B-", available: 5, urgent: false },
  { group: "O+", available: 30, urgent: false },
  { group: "O-", available: 2, urgent: true },
  { group: "AB+", available: 8, urgent: false },
  { group: "AB-", available: 1, urgent: true },
];

const BloodBank = () => (
  <PageLayout>
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3"><span className="text-gradient-hero">Blood Bank</span></h1>
          <p className="text-muted-foreground max-w-md mx-auto">Check blood availability and become a donor to save lives.</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 max-w-2xl mx-auto">
          {bloodGroups.map((bg, i) => (
            <motion.div
              key={bg.group}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`p-6 rounded-xl bg-card shadow-card border text-center ${bg.urgent ? "border-destructive/50" : "border-border/50"}`}
            >
              <div className={`w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center ${bg.urgent ? "bg-destructive/10" : "bg-medical-coral-light"}`}>
                <Droplets className={`w-7 h-7 ${bg.urgent ? "text-destructive" : "text-medical-coral"}`} />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">{bg.group}</h3>
              <p className="text-sm text-muted-foreground mb-1">{bg.available} units</p>
              {bg.urgent && <span className="text-xs font-semibold text-destructive animate-pulse-soft">Urgent Need</span>}
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button size="lg" className="bg-destructive text-destructive-foreground hover:opacity-90 font-semibold">
            Become a Donor
          </Button>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default BloodBank;
