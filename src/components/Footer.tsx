import { Link } from "react-router-dom";
import { Heart, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-background">
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-gradient-hero flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">Heal Home Net</span>
          </div>
          <p className="text-background/60 text-sm leading-relaxed">
            Your trusted partner in home healthcare. Modern networking with care at its core.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display font-semibold mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2">
            {["Doctors", "Pharmacy", "Blood Bank", "Ambulance", "Beds"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase().replace(" ", "-")}`}
                className="text-sm text-background/60 hover:text-background transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-display font-semibold mb-4">Services</h4>
          <div className="flex flex-col gap-2">
            {["Appointments", "Period Tracker", "Canteen", "Contact Us"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-sm text-background/60 hover:text-background transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-display font-semibold mb-4">Emergency</h4>
          <div className="flex flex-col gap-3">
            <a href="tel:108" className="flex items-center gap-2 text-sm text-accent font-semibold">
              <Phone className="w-4 h-4" /> 108 (Ambulance)
            </a>
            <div className="flex items-center gap-2 text-sm text-background/60">
              <Mail className="w-4 h-4" /> contact@healhome.net
            </div>
            <div className="flex items-center gap-2 text-sm text-background/60">
              <MapPin className="w-4 h-4" /> Main Home Office Road, India
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-background/10 mt-12 pt-6 text-center text-sm text-background/40">
        © 2026 Heal Home Net. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
