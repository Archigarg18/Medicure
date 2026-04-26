import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Stethoscope, Brain, Bone, Eye, Baby, HeartPulse, Pill, Smile, Star, Clock,
  Zap, Droplet, Microscope, Heart, Ear,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import allDoctors from "@/lib/doctors";

const departments = [
  { id: "cardiology", name: "Cardiology", icon: HeartPulse, color: "bg-medical-coral-light text-medical-coral" },
  { id: "neurology", name: "Neurology", icon: Brain, color: "bg-medical-purple-light text-medical-purple" },
  { id: "orthopedics", name: "Orthopedics", icon: Bone, color: "bg-medical-blue-light text-medical-blue" },
  { id: "pediatrics", name: "Pediatrics", icon: Baby, color: "bg-medical-teal-light text-medical-teal" },
  { id: "dermatology", name: "Dermatology", icon: Zap, color: "bg-medical-amber-light text-medical-amber" },
  { id: "ophthalmology", name: "Ophthalmology", icon: Eye, color: "bg-medical-coral-light text-medical-coral" },
  { id: "gastroenterology", name: "Gastroenterology", icon: Pill, color: "bg-medical-purple-light text-medical-purple" },
  { id: "pulmonology", name: "Pulmonology", icon: Zap, color: "bg-medical-blue-light text-medical-blue" },
  { id: "endocrinology", name: "Endocrinology", icon: Pill, color: "bg-medical-teal-light text-medical-teal" },
  { id: "nephrology", name: "Nephrology", icon: Droplet, color: "bg-medical-amber-light text-medical-amber" },
  { id: "urology", name: "Urology", icon: Pill, color: "bg-medical-coral-light text-medical-coral" },
  { id: "oncology", name: "Oncology", icon: Microscope, color: "bg-medical-purple-light text-medical-purple" },
  { id: "pathology", name: "Pathology", icon: Microscope, color: "bg-medical-blue-light text-medical-blue" },
  { id: "hematology", name: "Hematology", icon: Droplet, color: "bg-medical-teal-light text-medical-teal" },
  { id: "radiology", name: "Radiology", icon: Stethoscope, color: "bg-medical-amber-light text-medical-amber" },
  { id: "gynecology", name: "Gynecology", icon: Heart, color: "bg-medical-coral-light text-medical-coral" },
  { id: "psychiatry", name: "Psychiatry", icon: Brain, color: "bg-medical-purple-light text-medical-purple" },
  { id: "ent", name: "ENT", icon: Ear, color: "bg-medical-blue-light text-medical-blue" },
];


const Doctors = () => {
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [doctorsList, setDoctorsList] = useState<any[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("http://localhost:5002/api/doctors");
        const data = await res.json();
        if (data.success) {
           const formatted = data.data.map((doc: any) => ({
              id: doc.id,
              name: doc.user.name,
              specialty: doc.specialty,
              rating: doc.rating || 5.0,
              exp: doc.experience || 0,
              color: "bg-medical-blue-light text-medical-blue", // Default color
              profilePic: doc.user.profilePic
           }));
           setDoctorsList([...formatted, ...allDoctors]);
        } else {
           setDoctorsList(allDoctors);
        }
      } catch (err) {
        console.error("Failed to fetch doctors", err);
        setDoctorsList(allDoctors);
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = selectedDept
    ? doctorsList.filter((doc) => doc.specialty.toLowerCase() === selectedDept.toLowerCase())
    : doctorsList;

return (
    <PageLayout>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">Our <span className="text-gradient-hero">Doctors</span></h1>
            <p className="text-muted-foreground max-w-md mx-auto">Select a specialty to find the right doctor for you.</p>
          </motion.div>

          {/* Department Filter */}
          <div className="mb-12">
            <h2 className="font-display font-semibold text-lg mb-6 text-center">Select Specialty</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
              {/* All Departments Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedDept(null)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedDept === null
                    ? "border-primary bg-primary/10"
                    : "border-border/50 bg-card hover:border-primary/50"
                }`}
              >
                <div className="text-2xl mb-2">👨‍⚕️</div>
                <p className="text-xs font-semibold">All Doctors</p>
              </motion.button>

              {departments.map((dept) => (
                <motion.button
                  key={dept.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedDept(dept.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedDept === dept.id
                      ? "border-primary bg-primary/10"
                      : "border-border/50 bg-card hover:border-primary/50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg ${dept.color} flex items-center justify-center mx-auto mb-2`}>
                    <dept.icon className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-center">{dept.name}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Doctors Grid */}
          <div>
            <p className="text-sm text-muted-foreground text-center mb-6">
              {selectedDept
                ? `Found ${filteredDoctors.length} doctor(s) in ${departments.find((d) => d.id === selectedDept)?.name || selectedDept}`
                : `Showing all ${filteredDoctors.length} doctor(s)`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
              {filteredDoctors.length === 0 && (
                <div className="col-span-full text-center py-10 text-gray-500">
                   No doctors found for this specialty.
                </div>
              )}
              {filteredDoctors.map((doc, i) => (
                <motion.div
                  key={doc.id || doc.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6 rounded-xl bg-card shadow-card border border-border/50 flex flex-col items-center text-center"
                >
                  <div className={`w-16 h-16 rounded-full ${doc.profilePic ? 'bg-transparent' : doc.color} flex items-center justify-center mb-4 overflow-hidden`}>
                    {doc.profilePic ? (
                       <img src={doc.profilePic} alt={doc.name} className="w-full h-full object-cover" />
                    ) : (
                       <Stethoscope className="w-8 h-8" />
                    )}
                  </div>
                  <h3 className="font-display font-semibold text-foreground">{doc.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{doc.specialty}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4 justify-center">
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-medical-amber" />{doc.rating}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{doc.exp}y exp</span>
                  </div>
                  <Link to="/appointment" state={{ doctor: doc.name, doctorId: doc.id, department: doc.specialty }} className="w-full">
                    <Button size="sm" className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90 font-semibold">
                      Book Appointment
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Doctors;
