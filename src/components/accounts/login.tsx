"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "../axios/axiosInsatance";
import { AxiosError } from "axios";

interface LoginResponse {
  message: string;
  token: {
    access: string;
    refresh: string;
  };
}

interface LoginRequest {
  email: string;
  password: string;
}

function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Check for a message from the application page
    const message = sessionStorage.getItem("login_message");
    if (message) {
      setSuccessMessage(message);
      // Clear the message so it doesn't show again on refresh
      sessionStorage.removeItem("login_message");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleLogin = async (loginData: LoginRequest) => {
    try {
      setIsLoading(true);
      setError("");
      const response = await authApi.post<LoginResponse>("login/", loginData);
      // Remove .data since the API returns LoginResponse directly
      localStorage.setItem("access_token", response.token.access);
      localStorage.setItem("refresh_token", response.token.refresh);
      console.log("Login successful:", response.message);
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.message ||
            "Login failed. Please check your credentials."
        );
      } else if (err instanceof AxiosError && err.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Login validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    await handleLogin({
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center mr-2">
              <i className="fas fa-globe-americas text-white text-lg"></i>
            </div>
            <h1 className="text-xl font-bold">Dream Abroad</h1>
          </div>
          <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
          <p className="text-blue-100 text-sm">Sign in to your account</p>
        </div>
        <div className="p-6">
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm text-center">
                {successMessage}
              </p>
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Email Address"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Password"
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={isLoading}
                />
                <label htmlFor="remember-me" className="ml-2 text-gray-700">
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-bold text-sm shadow-lg transition-all duration-300 ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-xl hover:-translate-y-0.5"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isLoading}
                className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg font-medium text-sm hover:bg-gray-50 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
              >
                <i className="fab fa-google text-red-500 mr-2 text-sm"></i>
                Google
              </button>
              <button
                type="button"
                disabled={isLoading}
                className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg font-medium text-sm hover:bg-gray-50 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
              >
                <i className="fab fa-linkedin text-blue-600 mr-2 text-sm"></i>
                LinkedIn
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
