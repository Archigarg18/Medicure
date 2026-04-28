import PageLayout from "../components/PageLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { UtensilsCrossed, QrCode, CreditCard } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const menuItems = [
  { name: "Vegetable Khichdi", price: "₹80", category: "Light Meal", veg: true },
  { name: "Dal Rice Combo", price: "₹100", category: "Full Meal", veg: true },
  { name: "Chicken Soup", price: "₹120", category: "Soup", veg: false },
  { name: "Fruit Salad", price: "₹60", category: "Healthy", veg: true },
  { name: "Paneer Roti", price: "₹110", category: "Full Meal", veg: true },
  { name: "Egg Sandwich", price: "₹70", category: "Snack", veg: false },
];

const Canteen = () => {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [room, setRoom] = useState("");
  const [qrUrl, setQrUrl] = useState<string | null>(null);

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
    return menuItems.reduce((sum, item) => {
      const qty = cart[item.name] || 0;
      const price = Number(String(item.price).replace(/[^0-9.]/g, "")) || 0;
      return sum + price * qty;
    }, 0);
  };

  const generateUpiQr = () => {
    const total = getTotal();
    if (total <= 0) return;
    const upi = `upi://pay?pa=gargjashan222@okicici&pn=Gargjashan&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent(
      `Room ${room || "-"} Order from Canteen`
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
        <div className="max-w-xs mx-auto mb-6">
          <label className="text-sm font-medium text-foreground mb-2 block">Room / Bed Number</label>
          <Input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="e.g. Room 204 / Bed 12B" />
        </div>

        {/* Cart summary & payment */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="p-4 rounded-xl bg-card shadow-card border border-border/50 mb-4">
            <h3 className="font-display font-semibold mb-2">Your Order</h3>
            {Object.keys(cart).length === 0 ? (
              <p className="text-sm text-muted-foreground">No items selected.</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(cart).map(([name, qty]) => (
                  <div key={name} className="flex justify-between">
                    <span className="text-sm">{name} x {qty}</span>
                    <span className="font-display font-semibold">₹{(menuItems.find((m) => m.name === name) ? Number(String(menuItems.find((m) => m.name === name)!.price).replace(/[^0-9.]/g, "")) : 0) * qty}</span>
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
              <div className="text-right shrink-0 flex flex-col items-end gap-2">
                <p className="font-display font-bold text-foreground">{item.price}</p>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => decrease(item.name)} className="h-7 w-8">-</Button>
                  <div className="w-10 text-center">{cart[item.name] || 0}</div>
                  <Button size="sm" onClick={() => increase(item.name)} className="h-7 w-8">+</Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </PageLayout>
);
};
export default Canteen;
