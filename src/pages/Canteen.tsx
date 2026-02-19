import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { UtensilsCrossed, QrCode, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const menuItems = [
  { name: "Vegetable Khichdi", price: "₹80", category: "Light Meal", veg: true },
  { name: "Dal Rice Combo", price: "₹100", category: "Full Meal", veg: true },
  { name: "Chicken Soup", price: "₹120", category: "Soup", veg: false },
  { name: "Fruit Salad", price: "₹60", category: "Healthy", veg: true },
  { name: "Paneer Roti", price: "₹110", category: "Full Meal", veg: true },
  { name: "Egg Sandwich", price: "₹70", category: "Snack", veg: false },
];

const Canteen = () => (
  <PageLayout>
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3"><span className="text-gradient-hero">Canteen</span></h1>
          <p className="text-muted-foreground max-w-md mx-auto">Order food to your room or bed. Just enter your room/bed number.</p>
        </motion.div>

        {/* How it works */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {[
            { icon: UtensilsCrossed, label: "Choose food" },
            { icon: QrCode, label: "Scan QR to pay" },
            { icon: CreditCard, label: "Food delivered!" },
          ].map((step, i) => (
            <div key={step.label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-medical-amber-light flex items-center justify-center">
                <step.icon className="w-5 h-5 text-medical-amber" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Step {i + 1}</span>
                <p className="font-display font-semibold text-sm text-foreground">{step.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Room input */}
        <div className="max-w-xs mx-auto mb-10">
          <label className="text-sm font-medium text-foreground mb-2 block">Room / Bed Number</label>
          <Input placeholder="e.g. Room 204 / Bed 12B" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {menuItems.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-xl bg-card shadow-card border border-border/50 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-medical-amber-light flex items-center justify-center shrink-0">
                <UtensilsCrossed className="w-5 h-5 text-medical-amber" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold text-sm text-foreground">{item.name}</h3>
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.veg ? "bg-medical-emerald" : "bg-destructive"}`} />
                </div>
                <p className="text-xs text-muted-foreground">{item.category}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display font-bold text-foreground">{item.price}</p>
                <Button size="sm" variant="outline" className="mt-1 text-xs h-7 border-primary text-primary hover:bg-primary hover:text-primary-foreground">Add</Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Canteen;
