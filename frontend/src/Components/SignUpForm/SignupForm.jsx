import React, { useState } from "react";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format.";
    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";
    if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Passwords do not match.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      setSuccess(false);

      try {
        // Call backend API
        const response = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Signup successful:", data);
          setSuccess(true);
          // Store token in localStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          
          // Reset form
          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
          
          // Optional: Redirect to dashboard after 2 seconds
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 2000);
        } else {
          setErrors({ form: data.message || "Signup failed" });
        }
      } catch (error) {
        console.error("Error:", error);
        setErrors({ form: "Failed to connect to server. Make sure backend is running." });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#0d1117" }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-[#161b22] p-8 rounded-2xl shadow-md w-full max-w-md border border-gray-700"
      >
        <h2 className="text-2xl font-semibold text-gray-100 mb-6 text-center">
          Create your account
        </h2>

        {success && (
          <p className="text-green-400 text-center mb-4">
            ✅ Signup successful!
          </p>
        )}

        {errors.form && (
          <p className="text-red-400 text-center mb-4">
            ❌ {errors.form}
          </p>
        )}

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 bg-[#0d1117] text-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                errors.name ? "border-red-500" : "border-gray-600"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 bg-[#0d1117] text-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                errors.email ? "border-red-500" : "border-gray-600"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-2 bg-[#0d1117] text-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                errors.password ? "border-red-500" : "border-gray-600"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-300 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full p-2 bg-[#0d1117] text-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-600"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
