import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      alert("No account found. Please Sign Up first.");
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    // ✅ Check credentials
    if (
      email === parsedUser.email &&
      password === parsedUser.password
    ) {
      // ✅ Store login state
      localStorage.setItem("isLoggedIn", "true");

      // ✅ Store full logged in user separately for dashboard
      localStorage.setItem(
        "loggedUser",
        JSON.stringify(parsedUser)
      );

      navigate("/dashboard");
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 pt-24 pb-12">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-center mb-2">
            Welcome Back
          </h2>

          <p className="text-center text-gray-500 mb-6">
            Login to access your dashboard
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block mb-1 font-medium">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Login
            </button>
          </form>

          {/* Signup Link */}
          <p className="text-center text-sm mt-4">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-green-600 font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;