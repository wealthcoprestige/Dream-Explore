"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";

function Login() {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      if (!formData.phone || !formData.password) {
        throw new Error("Phone number and password are required");
      }

      if (formData.phone.length < 10) {
        throw new Error("Please enter a valid phone number");
      }

      const formattedPhone = formData.phone.replace(/\D/g, "");

      const response = await fetch(
        `https://api.olapy.app/api/v1/accounts/login/?phone=phone`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: formattedPhone,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);

        if (data.tokens && data.tokens.length > 0) {
          localStorage.setItem("accessToken", data.tokens[0].access_token);
          localStorage.setItem("refreshToken", data.tokens[0].refresh_token);
        }

        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        if (data.worker) {
          localStorage.setItem("worker", JSON.stringify(data.worker));
        }

        window.location.href = "/list-workers";
      } else {
        if (response.status === 400) {
          throw new Error(data.message || "Invalid request. Please check your inputs.");
        } else if (response.status === 401) {
          throw new Error(data.message || "Invalid phone number or password.");
        } else if (response.status === 404) {
          throw new Error(data.message || "Account not found.");
        } else if (response.status >= 500) {
          throw new Error(data.message || "Server error. Please try again later.");
        } else {
          throw new Error(data.message || `Login failed with status ${response.status}.`);
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full">
        {/* Left Side - Form */}
        <div className="w-full md:w-3/5 p-5 md:p-12">
          <div className="text-left">
            <h1 className="font-bold text-3xl md:text-4xl text-blue-800">Welcome Back</h1>
            <p className="text-gray-500 mt-2 mb-8 md:mb-10">
              Please enter your credentials to access your account.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 
                  0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 
                  1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 
                  16zm3.707-9.293a1 1 0 00-1.414-1.414L9 
                  10.586 7.707 9.293a1 1 0 00-1.414 
                  1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Login successful! Redirecting...
            </div>
          )}

          {/* Login Form */}
          <form className="mt-4" onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="phone"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`${
                isLoading ? "bg-blue-400" : "bg-blue-700 hover:bg-blue-800"
              } text-white font-medium py-3 px-4 rounded-lg transition duration-300 w-full flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 
                      0 5.373 0 12h4zm2 
                      5.291A7.962 7.962 0 014 
                      12H0c0 3.042 1.135 5.824 3 
                      7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Don&apos;t have an account?{" "}
              <a
                href="#"
                className="text-blue-600 font-medium hover:underline"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>

        {/* Right Side - Banner */}
        <div className="w-full md:w-2/5 bg-gradient-to-br from-blue-700 to-blue-900 text-white p-12 flex flex-col justify-center items-center text-center hidden md:block">
          <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full mb-6 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 
                012 2v5a2 2 0 01-2 2H5a2 2 0 
                01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 
                3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="font-bold text-2xl mb-4">Secure Access</h2>
          <p className="text-sm text-blue-100">
            Your data security is our priority. Sign in to access your
            personalized dashboard.
          </p>

          <div className="mt-10 bg-white bg-opacity-20 p-4 rounded-xl">
            <p className="text-sm italic">
              &quot;This login system has improved our workflow efficiency by 40%.
              Highly intuitive!&quot;
            </p>
            <p className="text-sm mt-2 font-medium">- Alex Johnson, CTO</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
