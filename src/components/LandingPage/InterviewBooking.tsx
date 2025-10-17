"use client"
import React, { useState, useEffect } from 'react';

// Define TypeScript interfaces
interface Interview {
  id: number;
  jobTitle: string;
  company: string;
  interviewer: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  status: string;
  description: string;
  meetingLink?: string | null;
}

interface TimeSlots {
  [key: string]: string[];
}

interface Tab {
  id: string;
  label: string;
  icon: string;
  count?: number;
}

function InterviewBooking() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [interviewType, setInterviewType] = useState('video');
  const [interviewDescription, setInterviewDescription] = useState('');
  const [bookingStep, setBookingStep] = useState(1);
  const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>([]);
  const [pastInterviews, setPastInterviews] = useState<Interview[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlots>({});

  // Generate available slots for all dates dynamically
  const generateAvailableSlots = (): TimeSlots => {
    const slots: TimeSlots = {};
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      
      // Generate random time slots for each date
      slots[dateKey] = [
        '09:00', '10:00', '11:00', 
        '14:00', '15:00', '16:00'
      ];
    }
    return slots;
  };

  useEffect(() => {
    // Initialize available slots when component mounts
    setAvailableSlots(generateAvailableSlots());
    
    const now = new Date();
    const upcoming = sampleInterviews.filter(interview => {
      const interviewDateTime = new Date(`${interview.date}T${interview.time}`);
      return interviewDateTime > now && interview.status === 'scheduled';
    });
    const past = sampleInterviews.filter(interview => {
      const interviewDateTime = new Date(`${interview.date}T${interview.time}`);
      return interviewDateTime <= now || interview.status === 'completed';
    });

    setUpcomingInterviews(upcoming);
    setPastInterviews(past);
  }, []);

  const interviewTypes = [
    { value: 'video', label: 'Video', icon: 'fas fa-video' },
    { value: 'phone', label: 'Phone', icon: 'fas fa-phone' },
    { value: 'in_person', label: 'In Person', icon: 'fas fa-building' }
  ];

  // Sample interviews data
  const sampleInterviews: Interview[] = [
    {
      id: 1,
      jobTitle: "Senior ICU Nurse",
      company: "St. Thomas Hospital",
      interviewer: "Dr. Sarah Mitchell",
      date: "2024-02-01",
      time: "14:00",
      duration: 45,
      type: "video",
      status: "scheduled",
      description: "Technical interview focusing on ICU nursing experience and patient care scenarios."
    }
  ];

  const tabs: Tab[] = [
    { id: 'schedule', label: 'Schedule', icon: 'fas fa-calendar-plus' },
    { id: 'upcoming', label: 'Upcoming', icon: 'fas fa-clock', count: upcomingInterviews.length },
    { id: 'past', label: 'Past', icon: 'fas fa-history' }
  ];

  const getDaysOfWeek = (): Date[] => {
    const days: Date[] = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const formatDateKey = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const handleDateSelect = (date: Date) => {
    const dateString = formatDateKey(date);
    console.log('Selected date:', dateString);
    setSelectedDate(dateString);
  };

  const handleTimeSelect = (time: string) => {
    console.log('Selected time:', time);
    setSelectedTime(time);
  };

  const handleNextStep = () => {
    if (bookingStep === 1 && selectedDate) {
      setBookingStep(2);
    } else if (bookingStep === 2 && selectedTime) {
      setBookingStep(3);
    } else if (bookingStep === 3 && interviewDescription.trim()) {
      handleBookingConfirm();
    }
  };

  const handleBackStep = () => {
    if (bookingStep > 1) {
      setBookingStep(bookingStep - 1);
    }
  };

  const handleBookingConfirm = () => {
    const newInterview: Interview = {
      id: upcomingInterviews.length + pastInterviews.length + 1,
      jobTitle: "Senior ICU Nurse",
      company: "St. Thomas Hospital",
      interviewer: "Dr. Sarah Mitchell",
      date: selectedDate,
      time: selectedTime,
      duration: selectedDuration,
      type: interviewType,
      description: interviewDescription,
      status: "scheduled",
      meetingLink: interviewType === 'video' ? "https://meet.google.com/new-meeting" : null,
    };

    setUpcomingInterviews(prev => [newInterview, ...prev]);
    setBookingStep(4);
  };

  const formatDisplayDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string): string => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center py-4">
            <div className="flex items-center text-xl font-bold text-blue-800">
              <i className="fas fa-globe-americas mr-2"></i>
              <span>DreamExplore</span>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold">
              Back to Dashboard
            </button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Interview Scheduling
            </h1>
            <p className="text-gray-600">Book interviews and join meetings seamlessly</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg mb-6">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
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

          {activeTab === 'schedule' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex justify-between mb-8">
                    {[1, 2, 3, 4].map((step) => (
                      <div key={step} className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                          step === bookingStep
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : step < bookingStep
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 text-gray-400'
                        }`}>
                          {step < bookingStep ? (
                            <i className="fas fa-check text-sm"></i>
                          ) : (
                            <span className="text-sm font-semibold">{step}</span>
                          )}
                        </div>
                        <span className="text-xs mt-2 text-gray-600">
                          {step === 1 && 'Select Date'}
                          {step === 2 && 'Select Time'}
                          {step === 3 && 'Confirm'}
                          {step === 4 && 'Booked'}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Step 1: Select Date */}
                  {bookingStep === 1 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Select a Date</h3>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 mb-6">
                        {getDaysOfWeek().map((date, index) => {
                          const dateKey = formatDateKey(date);
                          const isSelected = selectedDate === dateKey;
                          
                          return (
                            <button
                              key={index}
                              onClick={() => handleDateSelect(date)}
                              className={`p-3 rounded-lg border-2 text-center transition-all duration-300 ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md'
                                  : 'border-gray-200 hover:border-blue-400 hover:shadow-md text-gray-700 bg-white'
                              }`}
                            >
                              <div className="text-xs font-semibold">
                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                              </div>
                              <div className="text-base font-bold mt-1">
                                {date.getDate()}
                              </div>
                              <div className="text-xs mt-1">
                                {date.toLocaleDateString('en-US', { month: 'short' })}
                              </div>
                              <div className="text-xs text-green-600 mt-1">
                                <i className="fas fa-check-circle mr-1"></i>
                                Available
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          onClick={handleNextStep}
                          disabled={!selectedDate}
                          className={`px-6 py-3 rounded-xl font-semibold ${
                            selectedDate
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Next: Select Time
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Select Time */}
                  {bookingStep === 2 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Select a Time</h3>
                        <button
                          onClick={handleBackStep}
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          <i className="fas fa-arrow-left mr-1"></i>
                          Back to Dates
                        </button>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-700 mb-4 text-lg">
                          {formatDisplayDate(selectedDate)}
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {availableSlots[selectedDate]?.map((time, index) => (
                            <button
                              key={index}
                              onClick={() => handleTimeSelect(time)}
                              className={`p-4 rounded-lg border-2 text-center transition-all duration-300 ${
                                selectedTime === time
                                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md'
                                  : 'border-gray-200 hover:border-blue-400 hover:shadow-md text-gray-700'
                              }`}
                            >
                              <div className="font-semibold text-base">{formatTime(time)}</div>
                              <div className="text-xs text-gray-500 mt-1">Available</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <button
                          onClick={handleBackStep}
                          className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleNextStep}
                          disabled={!selectedTime}
                          className={`px-6 py-3 rounded-xl font-semibold ${
                            selectedTime
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Next: Confirm Details
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Confirm Details */}
                  {bookingStep === 3 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Confirm Details</h3>
                        <button
                          onClick={handleBackStep}
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          <i className="fas fa-arrow-left mr-1"></i>
                          Back to Time
                        </button>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-6 mb-6">
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-3 text-lg">Interview Details</h4>
                            <div className="space-y-3 text-base">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Date:</span>
                                <span className="font-semibold">{formatDisplayDate(selectedDate)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Time:</span>
                                <span className="font-semibold">{formatTime(selectedTime)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Duration:</span>
                                <span className="font-semibold">{selectedDuration} minutes</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-3 text-lg">Interview Type</h4>
                            <div className="space-y-3">
                              {interviewTypes.map((type) => (
                                <label key={type.value} className="flex items-center space-x-3 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="interviewType"
                                    value={type.value}
                                    checked={interviewType === type.value}
                                    onChange={(e) => setInterviewType(e.target.value)}
                                    className="text-blue-600 focus:ring-blue-500"
                                  />
                                  <i className={`${type.icon} text-gray-600`}></i>
                                  <span className="font-medium text-gray-700">{type.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* REQUIRED Description Field */}
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-3 text-lg">
                              Interview Description <span className="text-red-500">*</span>
                            </h4>
                            <div className="space-y-2">
                              <textarea
                                value={interviewDescription}
                                onChange={(e) => setInterviewDescription(e.target.value)}
                                placeholder="Please describe the purpose of this interview, topics to be discussed, or any specific preparation needed..."
                                className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                required
                              />
                              {!interviewDescription.trim() && (
                                <p className="text-red-500 text-sm flex items-center">
                                  <i className="fas fa-exclamation-circle mr-1"></i>
                                  Description is required to confirm booking
                                </p>
                              )}
                              {interviewDescription.trim() && (
                                <p className="text-green-500 text-sm flex items-center">
                                  <i className="fas fa-check-circle mr-1"></i>
                                  Description provided
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {interviewType === 'video' && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center">
                              <i className="fas fa-video text-blue-600 mr-3 text-base"></i>
                              <div>
                                <div className="font-semibold text-blue-800 text-base">Video Call</div>
                                <div className="text-sm text-blue-700">
                                  Google Meet link will be sent to your email
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between">
                        <button
                          onClick={handleBackStep}
                          className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleNextStep}
                          disabled={!interviewDescription.trim()}
                          className={`px-6 py-3 rounded-xl font-semibold ${
                            interviewDescription.trim()
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Confirm Booking
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Success Message */}
                  {bookingStep === 4 && (
                    <div className="text-center py-8">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i className="fas fa-check text-green-600 text-2xl"></i>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">Interview Scheduled Successfully!</h3>
                      <p className="text-gray-600 mb-6 text-lg">
                        Your interview has been booked for {formatDisplayDate(selectedDate)} at {formatTime(selectedTime)}
                      </p>
                      <div className="bg-gray-50 rounded-xl p-6 mb-6 max-w-md mx-auto">
                        <div className="text-base space-y-3 text-left">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date:</span>
                            <span className="font-semibold">{formatDisplayDate(selectedDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Time:</span>
                            <span className="font-semibold">{formatTime(selectedTime)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-semibold capitalize">{interviewType.replace('_', ' ')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-semibold">{selectedDuration} minutes</span>
                          </div>
                          <div className="border-t pt-3 mt-3">
                            <div className="text-gray-600 mb-1">Description:</div>
                            <div className="font-semibold text-gray-800">{interviewDescription}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                          onClick={() => {
                            setBookingStep(1);
                            setSelectedDate('');
                            setSelectedTime('');
                            setInterviewDescription('');
                          }}
                          className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
                        >
                          Schedule Another Interview
                        </button>
                        <button
                          onClick={() => setActiveTab('upcoming')}
                          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                        >
                          View Upcoming Interviews
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Interview Tips</h3>
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

          {activeTab === 'upcoming' && (
            <div className="text-center py-8">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {upcomingInterviews.length} Upcoming Interview(s)
              </h3>
              <p className="text-gray-600">Your scheduled interviews will appear here</p>
            </div>
          )}

          {activeTab === 'past' && (
            <div className="text-center py-8">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {pastInterviews.length} Past Interview(s)
              </h3>
              <p className="text-gray-600">Your completed interviews will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InterviewBooking;