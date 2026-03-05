import { Link } from "react-router-dom";
import { useState } from "react";
import { Heart, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Send, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/healhomenet", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/healhomenet", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com/healhomenet", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com/company/healhomenet", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-hero flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">Heal Home Net</span>
            </div>
            <p className="text-background/60 text-sm leading-relaxed mb-4">
              Your trusted partner in home healthcare. Modern networking with care at its core.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.2 }}
                  className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-gradient-hero transition-colors"
                  title={social.label}
                >
                  <social.icon className="w-4 h-4 text-background" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { name: "Doctors", path: "/doctors" },
                { name: "Pharmacy", path: "/pharmacy" },
                { name: "Blood Bank", path: "/bloodbank" },
                { name: "Ambulance", path: "/ambulance" },
                { name: "Beds", path: "/beds" },
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-sm text-background/60 hover:text-background transition-colors flex items-center gap-1"
                >
                  <span className="w-1 h-1 rounded-full bg-background/40" /> {item.name}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h4 className="font-display font-semibold mb-4">Services</h4>
            <div className="flex flex-col gap-2">
              {[
                { name: "Appointments", path: "/appointment" },
                { name: "Period Tracker", path: "/period-tracker" },
                { name: "Canteen", path: "/canteen" },
                { name: "Contact Us", path: "/contact" },
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-sm text-background/60 hover:text-background transition-colors flex items-center gap-1"
                >
                  <span className="w-1 h-1 rounded-full bg-background/40" /> {item.name}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Emergency Contact */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h4 className="font-display font-semibold mb-4">Emergency</h4>
            <div className="flex flex-col gap-3">
              <a href="tel:108" className="flex items-center gap-2 text-sm text-accent font-semibold hover:text-background transition-colors">
                <Phone className="w-4 h-4" /> 108 (Ambulance)
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-2 text-sm text-background/60 hover:text-background transition-colors">
                <Phone className="w-4 h-4" /> +91 98765 43210
              </a>
              <a href="mailto:contact@healhome.net" className="flex items-center gap-2 text-sm text-background/60 hover:text-background transition-colors">
                <Mail className="w-4 h-4" /> contact@healhome.net
              </a>
              <div className="flex items-center gap-2 text-sm text-background/60">
                <MapPin className="w-4 h-4" /> Rajpura, Punjab
              </div>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h4 className="font-display font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-background/60 mb-3">Subscribe for health tips and updates.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/40 h-9"
                />
                <Button type="submit" size="sm" className="bg-gradient-hero hover:opacity-90 px-3">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              {subscribed && (
                <p className="text-xs text-accent">✓ Thanks for subscribing!</p>
              )}
            </form>
          </motion.div>
        </div>

        {/* Divider & Bottom Section */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="border-t border-background/10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-background/40">
              © 2026 Heal Home Net. All rights reserved. | Chitkara University, Rajpura, Punjab
            </div>
            <div className="flex gap-4 text-xs text-background/40">
              <a href="#" className="hover:text-background transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-background transition-colors">Terms of Service</a>
            </div>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-background/10 hover:bg-gradient-hero transition-colors"
              title="Scroll to top"
            >
              <ArrowUp className="w-4 h-4 text-background" />
            </button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
