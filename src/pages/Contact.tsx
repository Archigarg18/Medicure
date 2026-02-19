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
    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Message Sent!",
          description: "We'll get back to you shortly.",
        });
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        throw new Error("Failed to send");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not send message. Please try again.",
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

              {/* Map placeholder */}
              <div className="rounded-xl overflow-hidden border border-border/50 h-64 bg-secondary flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Map integration coming soon</p>
                  <p className="text-xs">Main Home Office Road, India</p>
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
