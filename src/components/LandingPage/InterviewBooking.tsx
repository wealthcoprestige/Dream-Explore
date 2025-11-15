"use client";
import React, { useState, useEffect } from "react";
import api, { AxiosError } from "../axios/axiosInsatance";
import Header from "./Header";

interface Slot {
  id: string;
  updated_at: string;
  created_at: string;
  date: string;
  time: string;
  duration_minutes: number;
  interview_type: string;
  is_booked: boolean;
}

interface Applicant {
  id: string;
  // Add other applicant fields if needed
}

interface Interview {
  id: string;
  jobTitle: string;
  company: string;
  type: "video" | "phone" | "in-person";
  date: string;
  time: string;
  duration: number;
  interviewer: string;
  preparation?: string[];
  meetingLink?: string;
  feedback?: string;
  rating?: number;
}

function InterviewBooking() {
  const [activeTab, setActiveTab] = useState("schedule");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [interviewType, setInterviewType] = useState("video");
  const [bookingStep, setBookingStep] = useState(1);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [interviewDescription, setInterviewDescription] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [error, setError] = useState<string | null>(null);

  const interviewTypes = [
    { value: "video", label: "Video", icon: "fas fa-video" },
    { value: "phone", label: "Phone", icon: "fas fa-phone" },
  ];

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        setIsAuthenticated(true);
        try {
          const response = await api.get<{ applicant: Applicant }>(
            "dashboard/applicant/"
          );
          setApplicant(response.applicant);
        } catch (err) {
          console.error("Failed to fetch applicant data:", err);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    const fetchAvailableSlots = async () => {
      try {
        const response = await api.get<Slot[]>("/available/appointment/slot/");
        setAvailableSlots(response); // Assuming the endpoint returns the array directly
      } catch (error) {
        console.error("Failed to fetch available slots:", error);
      }
    };
    fetchAvailableSlots();
    checkAuthAndFetchData();
  }, []);

  const handleSlotSelect = (slot: Slot) => {
    setSelectedSlot(slot);
    setSelectedTime(slot.time);
    setSelectedDate(slot.date);
    setBookingStep(3); // Go directly to confirmation
  };

  const handleBookingConfirm = async () => {
    setError(null);
    if (!selectedSlot || !interviewDescription.trim()) {
      setError("Please provide a description for the interview.");
      return;
    }

    const requestBody: {
      slot: string;
      description: string;
      applicant?: string;
      customer_email?: string;
      meeting_link: string;
    } = {
      slot: selectedSlot.id,
      description: interviewDescription,
      meeting_link:
        interviewType === "video" ? `https://meet.google.com/new` : "N/A",
    };

    if (isAuthenticated && applicant) {
      requestBody.applicant = applicant.id;
    } else {
      if (!customerEmail.trim()) {
        setError("Please provide your email address.");
        return;
      }
      requestBody.customer_email = customerEmail;
    }

    try {
      await api.post("/book-applicant-appointment/", requestBody);
      setBookingStep(4); // Move to confirmation step
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.error("Booking failed:", err.response?.data);
        setError(
          err.response?.data?.detail || "An error occurred during booking."
        );
      } else {
        console.error("Booking failed with an unexpected error:", err);
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const upcomingInterviews: Interview[] = [];
  const pastInterviews: Interview[] = [];
  const selectedDuration = 30;
  const resetBooking = () => {
    window.location.reload();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isToday = (dateString: string) => {
    const today = new Date().toDateString();
    return new Date(dateString).toDateString() === today;
  };

  const isTomorrow = (dateString: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return new Date(dateString).toDateString() === tomorrow.toDateString();
  };

  const canJoinMeeting = (interview: Interview) => {
    const interviewDateTime = new Date(`${interview.date}T${interview.time}`);
    const now = new Date();

    // Allow joining 5 minutes before the start time
    const startTime = new Date(interviewDateTime.getTime() - 5 * 60 * 1000);
    const endTime = new Date(
      interviewDateTime.getTime() + interview.duration * 60 * 1000
    );

    return now >= startTime && now <= endTime;
  };

  // Mobile tab navigation
  const tabs = [
    { id: "schedule", label: "Schedule", icon: "fas fa-calendar-plus" },
    {
      id: "upcoming",
      label: "Upcoming",
      icon: "fas fa-clock",
      count: upcomingInterviews.length, // This will be 0 for now
    },
    { id: "past", label: "Past", icon: "fas fa-history" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Interview Scheduling
            </h1>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
              Book interviews and join meetings seamlessly
            </p>
          </div>

          {/* Mobile Navigation Tabs */}
          <div className="sm:hidden bg-white rounded-2xl shadow-lg mb-6">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-0 py-3 px-2 text-center transition-all duration-300 ${
                    activeTab === tab.id
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <i className={`${tab.icon} text-sm mb-1 block`}></i>
                  <span className="text-xs font-medium">
                    {tab.label}
                    {tab.count && tab.count > 0 && (
                      <span className="ml-1 bg-blue-600 text-white rounded-full w-4 h-4 text-xs inline-flex items-center justify-center">
                        {tab.count}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="hidden sm:block bg-white rounded-2xl shadow-lg mb-6">
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {tab.label}
                  {tab.count && tab.count > 0 && (
                    <span className="ml-2 bg-blue-600 text-white rounded-full px-2 py-1 text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "schedule" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Booking Steps */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                  {/* Progress Steps - Mobile */}
                  <div className="sm:hidden flex justify-between mb-6">
                    {[1, 2, 3, 4].map((step) => (
                      <div key={step} className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                            step === bookingStep
                              ? "bg-blue-600 border-blue-600 text-white"
                              : step < bookingStep
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-gray-300 text-gray-400"
                          }`}
                        >
                          {step < bookingStep ? (
                            <i className="fas fa-check text-xs"></i>
                          ) : (
                            <span className="text-xs font-semibold">
                              {step}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Progress Steps - Desktop */}
                  <div className="hidden sm:flex justify-between mb-8">
                    {[1, 2, 3, 4].map((step) => (
                      <div key={step} className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                            step === bookingStep
                              ? "bg-blue-600 border-blue-600 text-white"
                              : step < bookingStep
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-gray-300 text-gray-400"
                          }`}
                        >
                          {step < bookingStep ? (
                            <i className="fas fa-check text-sm"></i>
                          ) : (
                            <span className="text-sm font-semibold">
                              {step}
                            </span>
                          )}
                        </div>
                        <span className="text-xs mt-2 text-gray-600 text-center hidden sm:block">
                          {step === 1 && "Select Date"}
                          {step === 2 && "Select Time"}
                          {step === 3 && "Confirm"}
                          {step === 4 && "Booked"}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Step 1: Select Date */}
                  {bookingStep === 1 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-6">
                        Select an Available Appointment
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {availableSlots.map((slot) =>
                          !slot.is_booked ? (
                            <button
                              key={slot.id}
                              onClick={() => handleSlotSelect(slot)}
                              className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                                selectedSlot?.id === slot.id
                                  ? "border-blue-600 bg-blue-50 shadow-lg"
                                  : "border-gray-200 hover:border-blue-400 hover:shadow-md"
                              }`}
                            >
                              <div className="font-bold text-gray-800">
                                {formatDate(slot.date)}
                              </div>
                              <div className="text-lg font-semibold text-blue-700 my-2">
                                {formatTime(slot.time)}
                              </div>
                              <div className="text-sm text-gray-600">
                                Duration: {slot.duration_minutes} minutes
                              </div>
                            </button>
                          ) : null
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Select Time */}

                  {/* Step 3: Confirm Details */}
                  {bookingStep === 3 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                          Confirm Details
                        </h3>
                        <button
                          onClick={() => setBookingStep(1)} // Corrected this line
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                        >
                          <i className="fas fa-arrow-left mr-1"></i>
                          Back
                        </button>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2 text-sm">
                              Interview Details
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Date:</span>
                                <span className="font-semibold">
                                  {formatDate(selectedDate)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Time:</span>
                                <span className="font-semibold">
                                  {formatTime(selectedTime)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Duration:</span>
                                <span className="font-semibold">
                                  {selectedDuration} min
                                </span>
                              </div>
                            </div>
                          </div>

                          {!isAuthenticated && (
                            <div>
                              <label
                                htmlFor="customerEmail"
                                className="font-semibold text-gray-700 mb-2 text-sm block"
                              >
                                Your Email Address
                              </label>
                              <input
                                id="customerEmail"
                                type="email"
                                value={customerEmail}
                                onChange={(e) =>
                                  setCustomerEmail(e.target.value)
                                }
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                              />
                            </div>
                          )}

                          <div>
                            <label
                              htmlFor="interviewDescription"
                              className="font-semibold text-gray-700 mb-2 text-sm block"
                            >
                              Interview Description{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              id="interviewDescription"
                              value={interviewDescription}
                              onChange={(e) =>
                                setInterviewDescription(e.target.value)
                              }
                              placeholder="Purpose of the interview, topics, etc."
                              className="w-full h-24 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2 text-sm">
                              Interview Type
                            </h4>
                            <div className="space-y-2">
                              {interviewTypes.map((type) => (
                                <label
                                  key={type.value}
                                  className="flex items-center space-x-3 cursor-pointer"
                                >
                                  <input
                                    type="radio"
                                    name="interviewType"
                                    value={type.value}
                                    checked={interviewType === type.value}
                                    onChange={(e) =>
                                      setInterviewType(e.target.value)
                                    }
                                    className="text-blue-600 focus:ring-blue-500"
                                  />
                                  <i
                                    className={`${type.icon} text-gray-600 text-sm`}
                                  ></i>
                                  <span className="text-sm font-medium text-gray-700">
                                    {type.label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>

                        {interviewType === "video" && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center">
                              <i className="fas fa-video text-blue-600 mr-2 text-sm"></i>
                              <div>
                                <div className="font-semibold text-blue-800 text-sm">
                                  Video Call
                                </div>
                                <div className="text-xs text-blue-700">
                                  Google Meet link will be sent to your email
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {error && (
                        <div className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-lg">
                          {error}
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <button
                          onClick={() => setBookingStep(1)} // Corrected this line
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-300 text-sm"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleBookingConfirm}
                          disabled={
                            !interviewDescription.trim() ||
                            (!isAuthenticated && !customerEmail.trim())
                          }
                          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-300 font-semibold text-sm"
                        >
                          Confirm Booking
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Booking Confirmed */}
                  {bookingStep === 4 && (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-check text-green-600 text-xl"></i>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        Interview Scheduled!
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm">
                        Your interview is scheduled for{" "}
                        {formatDate(selectedDate)} at {formatTime(selectedTime)}
                        .
                      </p>
                      <div className="bg-gray-50 rounded-xl p-4 mb-4 max-w-md mx-auto">
                        <div className="text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date:</span>
                            <span className="font-semibold">
                              {formatDate(selectedDate)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Time:</span>
                            <span className="font-semibold">
                              {formatTime(selectedTime)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-semibold capitalize">
                              {interviewType.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <button
                          onClick={resetBooking} // Correct
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-300 text-sm"
                        >
                          Schedule Another
                        </button>
                        <button
                          onClick={() => setActiveTab("upcoming")}
                          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-300 text-sm"
                        >
                          View Upcoming
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Help Section - Hidden on mobile, shown on desktop */}
              <div className="hidden lg:block space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">
                    Interview Tips
                  </h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start">
                      <i className="fas fa-check text-green-500 mt-1 mr-3"></i>
                      <span>Test your audio and video equipment</span>
                    </div>
                    <div className="flex items-start">
                      <i className="fas fa-check text-green-500 mt-1 mr-3"></i>
                      <span>Join the meeting 5 minutes early</span>
                    </div>
                    <div className="flex items-start">
                      <i className="fas fa-check text-green-500 mt-1 mr-3"></i>
                      <span>Have your resume ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Interviews Tab */}
          {activeTab === "upcoming" && (
            <div className="space-y-4 sm:space-y-6">
              {upcomingInterviews.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                  <i className="fas fa-calendar-times text-3xl text-gray-300 mb-4"></i>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No Upcoming Interviews
                  </h3>
                  <p className="text-gray-500 mb-6 text-sm">
                    Schedule your first interview to get started
                  </p>
                  <button
                    onClick={() => setActiveTab("schedule")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-300 text-sm"
                  >
                    Schedule Interview
                  </button>
                </div>
              ) : (
                upcomingInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
                  >
                    <div className="flex flex-col space-y-4">
                      {/* Header */}
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800">
                            {interview.jobTitle}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {interview.company}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                            {interview.type === "video"
                              ? "Video"
                              : interview.type === "phone"
                              ? "Phone"
                              : "In Person"}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            {isToday(interview.date)
                              ? "Today"
                              : isTomorrow(interview.date)
                              ? "Tomorrow"
                              : formatDate(interview.date)}
                          </div>
                        </div>
                      </div>

                      {/* Interview Details */}
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2 text-sm">
                            Interview Details
                          </h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Time:</span>
                              <span className="font-semibold">
                                {interview.time} ({interview.duration} min)
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Interviewer:
                              </span>
                              <span className="font-semibold">
                                {interview.interviewer}
                              </span>
                            </div>
                          </div>
                        </div>

                        {interview.preparation && (
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2 text-sm">
                              Preparation
                            </h4>
                            <ul className="space-y-1 text-xs text-gray-600">
                              {interview.preparation
                                .slice(0, 2)
                                .map((item: string, index: number) => (
                                  <li key={index} className="flex items-start">
                                    <i className="fas fa-check text-green-500 mt-1 mr-2 text-xs"></i>
                                    <span>{item}</span>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        {interview.type === "video" && (
                          <div className="space-y-2">
                            {canJoinMeeting(interview) ? (
                              <a
                                href={interview.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors duration-300 flex items-center justify-center text-sm"
                              >
                                <i className="fas fa-video mr-2"></i>
                                Join Meeting Now
                              </a>
                            ) : (
                              <div className="text-center p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                                <i className="fas fa-clock text-yellow-600 text-sm mb-1"></i>
                                <div className="text-xs text-yellow-700">
                                  Join available 5 minutes before meeting
                                </div>
                              </div>
                            )}

                            <div className="bg-blue-50 rounded-lg p-3">
                              <h5 className="font-semibold text-blue-800 text-xs mb-1">
                                Meeting Info
                              </h5>
                              {interview.meetingLink && (
                                <div className="text-xs text-blue-700 break-all">
                                  {interview.meetingLink}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex space-x-2">
                          <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-xs">
                            Reschedule
                          </button>
                          <button className="flex-1 border border-red-300 text-red-700 py-2 rounded-lg hover:bg-red-50 transition-colors duration-300 text-xs">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Past Interviews Tab */}
          {activeTab === "past" && (
            <div className="space-y-4 sm:space-y-6">
              {pastInterviews.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                  <i className="fas fa-history text-3xl text-gray-300 mb-4"></i>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No Past Interviews
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Your completed interviews will appear here
                  </p>
                </div>
              ) : (
                pastInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
                  >
                    <div className="flex flex-col space-y-4">
                      {/* Header */}
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800">
                            {interview.jobTitle}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {interview.company}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                            Completed
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            {formatDate(interview.date)} at {interview.time}
                          </div>
                        </div>
                      </div>

                      {/* Interview Details */}
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2 text-sm">
                            Interview Details
                          </h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Interviewer:
                              </span>
                              <span className="font-semibold">
                                {interview.interviewer}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Duration:</span>
                              <span className="font-semibold">
                                {interview.duration} minutes
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Type:</span>
                              <span className="font-semibold capitalize">
                                {interview.type.replace("_", " ")}
                              </span>
                            </div>
                          </div>
                        </div>

                        {interview.feedback && (
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2 text-sm">
                              Feedback
                            </h4>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                              {interview.rating && (
                                <div className="flex items-center mb-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <i
                                      key={star}
                                      className={`fas fa-star ${
                                        interview.rating &&
                                        star <= Math.floor(interview.rating)
                                          ? "text-yellow-400"
                                          : interview.rating &&
                                            star ===
                                              Math.ceil(interview.rating) &&
                                            !Number.isInteger(interview.rating)
                                          ? "text-yellow-400"
                                          : "text-gray-300"
                                      } text-xs`}
                                    ></i>
                                  ))}
                                  <span className="text-xs text-gray-600 ml-2">
                                    {interview.rating}/5
                                  </span>
                                </div>
                              )}
                              <p className="text-sm text-gray-700">
                                {interview.feedback}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InterviewBooking;
