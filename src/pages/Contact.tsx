import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const apiUrl = "http://localhost:5002/api/contact";
    
    try {
      console.log("📤 Sending contact form to:", apiUrl);
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log("📥 Response status:", response.status);
      const responseData = await response.json();
      console.log("📥 Response data:", responseData);

      if (response.ok) {
        toast({
          title: "Message Sent!",
          description: "We'll get back to you shortly.",
        });
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        throw new Error(responseData.message || `Failed to send message (${response.status})`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("❌ Contact form error:", errorMsg);
      toast({
        title: "Error",
        description: `${errorMsg} - Make sure backend is running on http://localhost:5000`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3"><span className="text-gradient-hero">Contact Us</span></h1>
            <p className="text-muted-foreground max-w-md mx-auto">Get in touch with us or find our location.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Info + Map */}
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  { icon: Phone, label: "Emergency", value: "108" },
                  { icon: Phone, label: "Reception", value: "+91 98765 43210" },
                  { icon: Mail, label: "Email", value: "contact@healhome.net" },
                  { icon: Clock, label: "Hours", value: "24/7 Open" },
                ].map((info) => (
                  <div key={info.label} className="flex items-start gap-3 p-4 rounded-xl bg-card shadow-card border border-border/50">
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <info.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{info.label}</p>
                      <p className="font-display font-semibold text-sm text-foreground">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Embedded map for Chitkara University, Rajpura, Punjab */}
              <div className="rounded-xl overflow-hidden border border-border/50">
                <div className="w-full h-64 sm:h-80">
                  <iframe
                    title="Chitkara University Rajpura Map"
                    src="https://maps.google.com/maps?q=Chitkara%20University%20Rajpura%20Punjab&z=15&output=embed"
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="p-3 bg-card/40 flex justify-end">
                  <a href="https://www.google.com/maps/search/?api=1&query=Chitkara+University+Rajpura+Punjab" target="_blank" rel="noreferrer" className="text-sm text-primary underline">Open in Google Maps</a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-xl bg-card shadow-card border border-border/50"
            >
              <h2 className="font-display font-semibold text-xl mb-6 text-foreground">Send a Message</h2>
              <div className="flex flex-col gap-4">
                <Input id="name" placeholder="Your Name" value={formData.name} onChange={handleChange} />
                <Input id="email" placeholder="Email Address" type="email" value={formData.email} onChange={handleChange} />
                <Input id="phone" placeholder="Phone Number" type="tel" value={formData.phone} onChange={handleChange} />
                <Textarea id="message" placeholder="Your message..." rows={4} value={formData.message} onChange={handleChange} />
                <Button className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-semibold" onClick={handleSubmit} disabled={loading}>
                  {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Contact;
