import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { Pill, Search, ShoppingCart, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const medicines = [
  { name: "Paracetamol 500mg", category: "Pain Relief", price: "₹25", stock: true },
  { name: "Amoxicillin 250mg", category: "Antibiotic", price: "₹85", stock: true },
  { name: "Cetirizine 10mg", category: "Allergy", price: "₹15", stock: true },
  { name: "Omeprazole 20mg", category: "Gastric", price: "₹45", stock: false },
  { name: "Metformin 500mg", category: "Diabetes", price: "₹30", stock: true },
  { name: "Atorvastatin 10mg", category: "Cholesterol", price: "₹60", stock: true },
];

const Pharmacy = () => (
  <PageLayout>
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3"><span className="text-gradient-hero">Pharmacy</span></h1>
          <p className="text-muted-foreground max-w-md mx-auto">Order medicines online and get them delivered to your room.</p>
        </motion.div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-10 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input placeholder="Search medicines..." className="pl-10" />
        </div>

        {/* Features strip */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          {[
            { icon: Pill, label: "10,000+ Medicines" },
            { icon: Truck, label: "Room Delivery" },
            { icon: ShoppingCart, label: "Easy Ordering" },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-2 text-sm text-muted-foreground">
              <f.icon className="w-4 h-4 text-primary" />
              {f.label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {medicines.map((med, i) => (
            <motion.div
              key={med.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-xl bg-card shadow-card border border-border/50 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-lg bg-medical-teal-light flex items-center justify-center shrink-0">
                <Pill className="w-6 h-6 text-medical-teal" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-foreground text-sm">{med.name}</h3>
                <p className="text-xs text-muted-foreground">{med.category}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display font-bold text-foreground">{med.price}</p>
                <span className={`text-xs font-medium ${med.stock ? "text-medical-emerald" : "text-destructive"}`}>
                  {med.stock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Pharmacy;
