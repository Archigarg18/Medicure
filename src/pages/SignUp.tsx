import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("patient"); // patient or doctor
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    bloodGroup: "", // patient specific
    specialty: "", // doctor specific
    experience: "", // doctor specific
    consultationFee: "", // doctor specific
    profilePic: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        role: role,
      };

      const res = await fetch("http://localhost:5002/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup Successful! Please Login.");
        navigate("/login");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      alert("Something went wrong during signup.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 pt-24 pb-12">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-center mb-2">Create Account</h2>
          <p className="text-center text-gray-500 mb-6">Sign up to access dashboard</p>

          {/* Role Selection */}
          <div className="flex justify-center mb-6 border rounded-lg overflow-hidden">
            <button
              type="button"
              className={`w-1/2 py-2 font-medium ${role === 'patient' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setRole('patient')}
            >
              Patient
            </button>
            <button
              type="button"
              className={`w-1/2 py-2 font-medium ${role === 'doctor' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setRole('doctor')}
            >
              Doctor
            </button>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Full Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>

            <div>
              <label className="block mb-1 font-medium">Phone</label>
              <input type="tel" name="phone" placeholder="Enter phone number" value={formData.phone} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>

            {role === 'patient' && (
              <div>
                <label className="block mb-1 font-medium">Blood Group</label>
                <input type="text" name="bloodGroup" placeholder="O+, A-, etc" value={formData.bloodGroup} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            )}

            {role === 'doctor' && (
              <>
                <div>
                  <label className="block mb-1 font-medium">Specialty</label>
                  <input type="text" name="specialty" required placeholder="Cardiology, Neurology, etc." value={formData.specialty} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium">Experience (Yrs)</label>
                    <input type="number" name="experience" required min="0" value={formData.experience} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Fee (₹)</label>
                    <input type="number" name="consultationFee" required min="0" value={formData.consultationFee} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Profile Pic URL (Optional)</label>
                  <input type="url" name="profilePic" placeholder="https://..." value={formData.profilePic} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </>
            )}

            <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition font-medium">
              Sign Up as {role === 'doctor' ? 'Doctor' : 'Patient'}
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Login here</Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SignUp;