import PageLayout from "../components/PageLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Pill, Search, ShoppingCart, Truck, Syringe } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const medicines = [
  { name: "Paracetamol 500mg", category: "Pain Relief", price: "₹25", stock: true, type: "Tablet" },
  { name: "Amoxicillin 250mg", category: "Antibiotic", price: "₹85", stock: true, type: "Tablet" },
  { name: "Cetirizine 10mg", category: "Allergy", price: "₹15", stock: false, type: "Tablet" },
  { name: "Omeprazole 20mg", category: "Gastric", price: "₹45", stock: true, type: "Capsule" },
  { name: "Metformin 500mg", category: "Diabetes", price: "₹30", stock: true, type: "Tablet" },
  { name: "Atorvastatin 10mg", category: "Cholesterol", price: "₹60", stock: true, type: "Tablet" },
  { name: "Aspirin 500mg", category: "Pain Relief", price: "₹20", stock: true, type: "Tablet" },
  { name: "Ibuprofen 400mg", category: "Anti-Inflammatory", price: "₹35", stock: true, type: "Tablet" },
  { name: "Insulin Injection", category: "Diabetes", price: "₹450", stock: false, type: "Injection" },
  { name: "Penicillin Injection", category: "Antibiotic", price: "₹120", stock: true, type: "Injection" },
  { name: "Vitamin B12 Injection", category: "Vitamin", price: "₹180", stock: true, type: "Injection" },
  { name: "Antihistamine Injection", category: "Allergy", price: "₹95", stock: true, type: "Injection" },
  { name: "Cough Syrup 100ml", category: "Cough Relief", price: "₹75", stock: true, type: "Syrup" },
  { name: "Multivitamin Syrup", category: "Vitamin", price: "₹120", stock: true, type: "Syrup" },
  { name: "Throat Lozenge", category: "Cough Relief", price: "₹40", stock: true, type: "Lozenge" },
  { name: "Antacid Gel 200ml", category: "Gastric", price: "₹85", stock: true, type: "Gel" },
  { name: "Hydrocortisone Cream", category: "Skin", price: "₹95", stock: true, type: "Cream" },
  { name: "Dextrose Injection", category: "IV Fluid", price: "₹150", stock: true, type: "Injection" },
];

const Pharmacy = () => {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [room, setRoom] = useState("");
  const [search, setSearch] = useState("");
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  const filteredMedicines = medicines.filter((med) =>
    med.name.toLowerCase().includes(search.toLowerCase()) ||
    med.category.toLowerCase().includes(search.toLowerCase()) ||
    med.type.toLowerCase().includes(search.toLowerCase())
  );

  const increase = (name: string) => {
    setCart((c) => ({ ...c, [name]: (c[name] || 0) + 1 }));
  };

  const decrease = (name: string) => {
    setCart((c) => {
      const next = { ...c };
      if (!next[name]) return next;
      next[name] = Math.max(0, next[name] - 1);
      if (next[name] === 0) delete next[name];
      return next;
    });
  };

  const getTotal = () => {
    return medicines.reduce((sum, item) => {
      const qty = cart[item.name] || 0;
      const price = Number(String(item.price).replace(/[^0-9.]/g, "")) || 0;
      return sum + price * qty;
    }, 0);
  };

  const generateUpiQr = () => {
    const total = getTotal();
    if (total <= 0) return;
    const upi = `upi://pay?pa=gargjashan222@okicici&pn=Pharmacy&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent(
      `Room ${room || "-"} Pharmacy Order`
    )}`;
    const qr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upi)}`;
    setQrUrl(qr);
  };

  const clearCart = () => {
    setCart({});
    setQrUrl(null);
  };


  return (
    <PageLayout>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3"><span className="text-gradient-hero">Pharmacy</span></h1>
            <p className="text-muted-foreground max-w-md mx-auto">Order medicines online and get them delivered to your room.</p>
          </motion.div>

          {/* Features strip */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {[
              { icon: Pill, label: "18+ Medicines" },
              { icon: Syringe, label: "Injections Available" },
              { icon: Truck, label: "Room Delivery" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <f.icon className="w-4 h-4 text-primary" />
                {f.label}
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, category, or type..." 
              className="pl-10" 
            />
          </div>

          {/* Room input */}
          <div className="max-w-xs mx-auto mb-6">
            <label className="text-sm font-medium text-foreground mb-2 block">Room / Bed Number</label>
            <Input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="e.g. Room 204 / Bed 12B" />
          </div>

          {/* Cart summary & payment */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="p-4 rounded-xl bg-card shadow-card border border-border/50 mb-4">
              <h3 className="font-display font-semibold mb-2">Your Cart</h3>
              {Object.keys(cart).length === 0 ? (
                <p className="text-sm text-muted-foreground">No items selected.</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(cart).map(([name, qty]) => (
                    <div key={name} className="flex justify-between">
                      <span className="text-sm">{name} x {qty}</span>
                      <span className="font-display font-semibold">₹{(medicines.find((m) => m.name === name) ? Number(String(medicines.find((m) => m.name === name)!.price).replace(/[^0-9.]/g, "")) : 0) * qty}</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-display font-semibold">Total</span>
                    <span className="font-display font-bold">₹{getTotal()}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button onClick={generateUpiQr} className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-semibold" disabled={getTotal() <= 0}>Generate UPI QR</Button>
                    <Button variant="outline" onClick={clearCart}>Clear</Button>
                  </div>
                </div>
              )}
            </div>

            {qrUrl ? (
              <div className="p-4 rounded-xl bg-card shadow-card border border-border/50 flex flex-col items-center gap-3">
                <img src={qrUrl} alt="UPI QR" className="w-48 h-48" />
                <a href={`upi://pay?pa=gargjashan222@okicici&am=${getTotal().toFixed(2)}`} className="text-sm text-primary underline">Open UPI intent</a>
                <p className="text-xs text-muted-foreground">Pay to: gargjashan222@okicici — Amount ₹{getTotal()}</p>
              </div>
            ) : null}
          </div>

          <div className="max-w-6xl mx-auto">
            <p className="text-sm text-muted-foreground mb-4">
              {search ? `Found ${filteredMedicines.length} item(s)` : `Showing all ${filteredMedicines.length} item(s)`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMedicines.map((med, i) => (
                <motion.div
                  key={med.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 rounded-xl bg-card shadow-card border border-border/50 flex flex-col gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-medical-teal-light flex items-center justify-center shrink-0">
                      {med.type === "Injection" ? (
                        <Syringe className="w-6 h-6 text-medical-teal" />
                      ) : (
                        <Pill className="w-6 h-6 text-medical-teal" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-foreground text-sm">{med.name}</h3>
                      <p className="text-xs text-muted-foreground">{med.category}</p>
                      <p className="text-xs text-muted-foreground">{med.type}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-display font-bold text-foreground">{med.price}</p>
                      <span className={`text-xs font-medium ${med.stock ? "text-medical-emerald" : "text-destructive"}`}>
                        {med.stock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => decrease(med.name)} className="h-7 w-8">-</Button>
                      <div className="w-8 text-center text-sm">{cart[med.name] || 0}</div>
                      <Button size="sm" onClick={() => increase(med.name)} className="h-7 w-8" disabled={!med.stock}>+</Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {filteredMedicines.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No medicines found matching "{search}"</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Pharmacy;
