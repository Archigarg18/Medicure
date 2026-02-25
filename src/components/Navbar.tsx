import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Heart, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Doctors", path: "/doctors" },
  { label: "Pharmacy", path: "/pharmacy" },
  { label: "Blood Bank", path: "/blood-bank" },
  { label: "Ambulance", path: "/ambulance" },
  { label: "Beds", path: "/beds" },
  { label: "Canteen", path: "/canteen" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Get logged user
  const user = JSON.parse(
    localStorage.getItem("loggedUser") || "{}"
  );

  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedUser");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-hero flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>

          <span className="font-display font-bold text-xl">
            Heal Home <span className="text-gradient-hero">Net</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                location.pathname === link.path
                  ? "bg-secondary text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* ✅ User Section */}
        <div className="hidden lg:flex items-center gap-3">

          <a
            href="tel:108"
            className="flex items-center gap-1.5 text-sm font-semibold text-accent"
          >
            <Phone className="w-4 h-4" />
            108
          </a>

          {/* If Logged In */}
          {isLoggedIn ? (
            <>
              <span className="text-sm font-medium">
                {user?.name}
              </span>

              <Link to="/profile">
                <Button variant="outline">Profile</Button>
              </Link>

              <Button
                variant="destructive"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>

              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}

          <Link to="/appointment">
            <Button className="bg-gradient-hero text-primary-foreground font-semibold hover:opacity-90">
              Book Appointment
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-card border-b border-border overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 rounded-md text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                to="/appointment"
                onClick={() => setOpen(false)}
              >
                <Button className="w-full bg-gradient-hero text-white">
                  Book Appointment
                </Button>
              </Link>

              {/* Mobile Login/Logout */}
              {isLoggedIn ? (
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full"
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Link to="/login">
                    <Button className="w-full">Login</Button>
                  </Link>

                  <Link to="/signup">
                    <Button variant="outline" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;