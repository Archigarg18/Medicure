import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { BedDouble } from "lucide-react";

const wards = [
  { name: "General Ward", total: 50, occupied: 38 },
  { name: "ICU", total: 20, occupied: 17 },
  { name: "Pediatric Ward", total: 15, occupied: 9 },
  { name: "Maternity Ward", total: 12, occupied: 8 },
  { name: "Orthopedic Ward", total: 18, occupied: 14 },
  { name: "Private Rooms", total: 25, occupied: 20 },
];

const Beds = () => (
  <PageLayout>
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3"><span className="text-gradient-hero">Bed Availability</span></h1>
          <p className="text-muted-foreground max-w-md mx-auto">Real-time bed status across all wards and departments.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {wards.map((ward, i) => {
            const free = ward.total - ward.occupied;
            const percent = Math.round((ward.occupied / ward.total) * 100);
            const isLow = free <= 3;
            return (
              <motion.div
                key={ward.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-6 rounded-xl bg-card shadow-card border ${isLow ? "border-destructive/50" : "border-border/50"}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isLow ? "bg-destructive/10" : "bg-medical-blue-light"}`}>
                    <BedDouble className={`w-5 h-5 ${isLow ? "text-destructive" : "text-medical-blue"}`} />
                  </div>
                  <h3 className="font-display font-semibold text-foreground">{ward.name}</h3>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 rounded-full bg-secondary mb-3">
                  <div
                    className={`h-full rounded-full transition-all ${isLow ? "bg-destructive" : "bg-primary"}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{ward.occupied}/{ward.total} occupied</span>
                  <span className={`font-semibold ${isLow ? "text-destructive" : "text-medical-emerald"}`}>
                    {free} free
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Beds;
