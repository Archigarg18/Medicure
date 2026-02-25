import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    bloodGroup: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Store patient details permanently
    const userData = {
      ...formData,
      role: "patient",
    };

    // ✅ Save for login authentication
    localStorage.setItem("user", JSON.stringify(userData));

    alert("Signup Successful! Please Login.");

    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 pt-24 pb-12">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-center mb-2">
            Create Account
          </h2>

          <p className="text-center text-gray-500 mb-6">
            Sign up to access dashboard
          </p>

          <form onSubmit={handleSignup} className="space-y-4">

            {/* Name */}
            <div>
              <label className="block mb-1 font-medium">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-1 font-medium">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Blood Group */}
            <div>
              <label className="block mb-1 font-medium">
                Blood Group
              </label>
              <input
                type="text"
                name="bloodGroup"
                placeholder="O+, A-, etc"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-600 font-medium"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SignUp;