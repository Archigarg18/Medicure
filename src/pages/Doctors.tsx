import PageLayout from "@/components/PageLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Stethoscope, Brain, Bone, Eye, Baby, HeartPulse, Pill, Smile, Star, Clock,
  Zap, Droplet, Microscope, Heart, Ear,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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

const allDoctors = [
  // Cardiology
  { name: "Dr. Priya Sharma", specialty: "Cardiology", rating: 4.9, exp: 15, color: "bg-medical-coral-light text-medical-coral" },
  { name: "Dr. Rajesh Kumar", specialty: "Cardiology", rating: 4.8, exp: 12, color: "bg-medical-coral-light text-medical-coral" },
  { name: "Dr. Anjali Desai", specialty: "Cardiology", rating: 4.7, exp: 10, color: "bg-medical-coral-light text-medical-coral" },
  { name: "Dr. Vikram Singh", specialty: "Cardiology", rating: 4.9, exp: 18, color: "bg-medical-coral-light text-medical-coral" },
  
  // Neurology
  { name: "Dr. Arjun Patel", specialty: "Neurology", rating: 4.8, exp: 12, color: "bg-medical-purple-light text-medical-purple" },
  { name: "Dr. Neha Reddy", specialty: "Neurology", rating: 4.9, exp: 14, color: "bg-medical-purple-light text-medical-purple" },
  { name: "Dr. Sanjay Rao", specialty: "Neurology", rating: 4.6, exp: 9, color: "bg-medical-purple-light text-medical-purple" },
  { name: "Dr. Isha Verma", specialty: "Neurology", rating: 4.8, exp: 11, color: "bg-medical-purple-light text-medical-purple" },
  
  // Orthopedics
  { name: "Dr. Neha Gupta", specialty: "Orthopedics", rating: 4.7, exp: 10, color: "bg-medical-blue-light text-medical-blue" },
  { name: "Dr. Arun Menon", specialty: "Orthopedics", rating: 4.8, exp: 13, color: "bg-medical-blue-light text-medical-blue" },
  { name: "Dr. Priya Singh", specialty: "Orthopedics", rating: 4.9, exp: 16, color: "bg-medical-blue-light text-medical-blue" },
  { name: "Dr. Rohit Kumar", specialty: "Orthopedics", rating: 4.6, exp: 8, color: "bg-medical-blue-light text-medical-blue" },
  
  // Pediatrics
  { name: "Dr. Sneha Reddy", specialty: "Pediatrics", rating: 4.8, exp: 8, color: "bg-medical-teal-light text-medical-teal" },
  { name: "Dr. Meera Joshi", specialty: "Pediatrics", rating: 4.9, exp: 7, color: "bg-medical-teal-light text-medical-teal" },
  { name: "Dr. Kavya Nair", specialty: "Pediatrics", rating: 4.7, exp: 6, color: "bg-medical-teal-light text-medical-teal" },
  { name: "Dr. Pooja Sharma", specialty: "Pediatrics", rating: 4.8, exp: 9, color: "bg-medical-teal-light text-medical-teal" },
  
  // Dermatology
  { name: "Dr. Avni Kapoor", specialty: "Dermatology", rating: 4.7, exp: 9, color: "bg-medical-amber-light text-medical-amber" },
  { name: "Dr. Ritika Das", specialty: "Dermatology", rating: 4.8, exp: 11, color: "bg-medical-amber-light text-medical-amber" },
  { name: "Dr. Swati Pal", specialty: "Dermatology", rating: 4.9, exp: 13, color: "bg-medical-amber-light text-medical-amber" },
  { name: "Dr. Divya Sinha", specialty: "Dermatology", rating: 4.6, exp: 7, color: "bg-medical-amber-light text-medical-amber" },
  
  // Ophthalmology
  { name: "Dr. Ravi Kumar", specialty: "Ophthalmology", rating: 4.9, exp: 18, color: "bg-medical-coral-light text-medical-coral" },
  { name: "Dr. Suresh Menon", specialty: "Ophthalmology", rating: 4.7, exp: 10, color: "bg-medical-coral-light text-medical-coral" },
  { name: "Dr. Lisa Johnson", specialty: "Ophthalmology", rating: 4.8, exp: 14, color: "bg-medical-coral-light text-medical-coral" },
  { name: "Dr. Ashok Patel", specialty: "Ophthalmology", rating: 4.6, exp: 8, color: "bg-medical-coral-light text-medical-coral" },
  
  // Gastroenterology
  { name: "Dr. Sanjay Verma", specialty: "Gastroenterology", rating: 4.8, exp: 12, color: "bg-medical-purple-light text-medical-purple" },
  { name: "Dr. Anita Singh", specialty: "Gastroenterology", rating: 4.7, exp: 10, color: "bg-medical-purple-light text-medical-purple" },
  { name: "Dr. Ramesh Gupta", specialty: "Gastroenterology", rating: 4.9, exp: 15, color: "bg-medical-purple-light text-medical-purple" },
  { name: "Dr. Nisha Kapoor", specialty: "Gastroenterology", rating: 4.6, exp: 7, color: "bg-medical-purple-light text-medical-purple" },
  
  // Pulmonology
  { name: "Dr. Vikram Rao", specialty: "Pulmonology", rating: 4.8, exp: 11, color: "bg-medical-blue-light text-medical-blue" },
  { name: "Dr. Harpreet Singh", specialty: "Pulmonology", rating: 4.7, exp: 9, color: "bg-medical-blue-light text-medical-blue" },
  { name: "Dr. Pooja Nair", specialty: "Pulmonology", rating: 4.9, exp: 13, color: "bg-medical-blue-light text-medical-blue" },
  { name: "Dr. Aditya Verma", specialty: "Pulmonology", rating: 4.6, exp: 8, color: "bg-medical-blue-light text-medical-blue" },
  
  // Endocrinology
  { name: "Dr. Meera Singh", specialty: "Endocrinology", rating: 4.8, exp: 10, color: "bg-medical-teal-light text-medical-teal" },
  { name: "Dr. Sameer Nair", specialty: "Endocrinology", rating: 4.7, exp: 8, color: "bg-medical-teal-light text-medical-teal" },
  { name: "Dr. Priya Kumar", specialty: "Endocrinology", rating: 4.9, exp: 12, color: "bg-medical-teal-light text-medical-teal" },
  
  // Nephrology
  { name: "Dr. Arun Singh", specialty: "Nephrology", rating: 4.7, exp: 11, color: "bg-medical-amber-light text-medical-amber" },
  { name: "Dr. Sumeeta Rao", specialty: "Nephrology", rating: 4.8, exp: 9, color: "bg-medical-amber-light text-medical-amber" },
  { name: "Dr. Deepak Verma", specialty: "Nephrology", rating: 4.9, exp: 14, color: "bg-medical-amber-light text-medical-amber" },
  
  // Urology
  { name: "Dr. Anand Kumar", specialty: "Urology", rating: 4.8, exp: 12, color: "bg-medical-coral-light text-medical-coral" },
  { name: "Dr. Rohan Sinha", specialty: "Urology", rating: 4.7, exp: 10, color: "bg-medical-coral-light text-medical-coral" },
  { name: "Dr. Varun Patel", specialty: "Urology", rating: 4.9, exp: 15, color: "bg-medical-coral-light text-medical-coral" },
  
  // Oncology
  { name: "Dr. Samit Rao", specialty: "Oncology", rating: 4.9, exp: 16, color: "bg-medical-purple-light text-medical-purple" },
  { name: "Dr. Anuradha Singh", specialty: "Oncology", rating: 4.8, exp: 13, color: "bg-medical-purple-light text-medical-purple" },
  { name: "Dr. Vivek Gupta", specialty: "Oncology", rating: 4.7, exp: 11, color: "bg-medical-purple-light text-medical-purple" },
  
  // Pathology
  { name: "Dr. Hemant Kumar", specialty: "Pathology", rating: 4.7, exp: 9, color: "bg-medical-blue-light text-medical-blue" },
  { name: "Dr. Shreya Nair", specialty: "Pathology", rating: 4.8, exp: 10, color: "bg-medical-blue-light text-medical-blue" },
  { name: "Dr. Rajiv Singh", specialty: "Pathology", rating: 4.9, exp: 14, color: "bg-medical-blue-light text-medical-blue" },
  
  // Hematology
  { name: "Dr. Kanika Patel", specialty: "Hematology", rating: 4.8, exp: 11, color: "bg-medical-teal-light text-medical-teal" },
  { name: "Dr. Siddharth Verma", specialty: "Hematology", rating: 4.7, exp: 9, color: "bg-medical-teal-light text-medical-teal" },
  { name: "Dr. Anjali Rao", specialty: "Hematology", rating: 4.9, exp: 13, color: "bg-medical-teal-light text-medical-teal" },
  
  // Radiology
  { name: "Dr. Manish Kumar", specialty: "Radiology", rating: 4.8, exp: 12, color: "bg-medical-amber-light text-medical-amber" },
  { name: "Dr. Priya Saxena", specialty: "Radiology", rating: 4.9, exp: 15, color: "bg-medical-amber-light text-medical-amber" },
  { name: "Dr. Arun Joshi", specialty: "Radiology", rating: 4.7, exp: 10, color: "bg-medical-amber-light text-medical-amber" },
  
  // Gynecology
  { name: "Dr. Shalini Desai", specialty: "Gynecology", rating: 4.9, exp: 14, color: "bg-medical-coral-light text-medical-coral" },
  { name: "Dr. Divya Rao", specialty: "Gynecology", rating: 4.8, exp: 11, color: "bg-medical-coral-light text-medical-coral" },
  { name: "Dr. Megha Rao", specialty: "Gynecology", rating: 4.7, exp: 9, color: "bg-medical-coral-light text-medical-coral" },
  
  // Psychiatry
  { name: "Dr. Rohit Nair", specialty: "Psychiatry", rating: 4.8, exp: 13, color: "bg-medical-purple-light text-medical-purple" },
  { name: "Dr. Neelam Verma", specialty: "Psychiatry", rating: 4.9, exp: 15, color: "bg-medical-purple-light text-medical-purple" },
  { name: "Dr. Arjun Das", specialty: "Psychiatry", rating: 4.7, exp: 10, color: "bg-medical-purple-light text-medical-purple" },
  
  // ENT
  { name: "Dr. Vimal Kumar", specialty: "ENT", rating: 4.8, exp: 10, color: "bg-medical-blue-light text-medical-blue" },
  { name: "Dr. Priyanka Singh", specialty: "ENT", rating: 4.9, exp: 12, color: "bg-medical-blue-light text-medical-blue" },
  { name: "Dr. Ajay Patel", specialty: "ENT", rating: 4.6, exp: 8, color: "bg-medical-blue-light text-medical-blue" },
];

const Doctors = () => {
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  const filteredDoctors = selectedDept
    ? allDoctors.filter((doc) => doc.specialty.toLowerCase() === selectedDept.toLowerCase())
    : allDoctors;


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
                ? `Found ${filteredDoctors.length} doctor(s) in ${departments.find((d) => d.id === selectedDept)?.name}`
                : `Showing all ${filteredDoctors.length} doctor(s)`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
              {filteredDoctors.map((doc, i) => (
                <motion.div
                  key={doc.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6 rounded-xl bg-card shadow-card border border-border/50 flex flex-col items-center text-center"
                >
                  <div className={`w-16 h-16 rounded-full ${doc.color} flex items-center justify-center mb-4`}>
                    <Stethoscope className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground">{doc.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{doc.specialty}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4 justify-center">
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-medical-amber" />{doc.rating}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{doc.exp}y exp</span>
                  </div>
                  <Link to="/appointment" className="w-full">
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
