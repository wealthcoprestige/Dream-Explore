"use client"
import React, { useState } from 'react';

function ApplicantDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sample applicant data
  const applicantData = {
    profile: {
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      location: "London, UK",
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      resume: "sarah_johnson_resume.pdf",
      coverLetter: "Experienced healthcare professional seeking new challenges...",
      skills: ["ICU Nursing", "Patient Care", "Emergency Response", "Medical Documentation", "Team Leadership"],
      certifications: ["RN License", "ACLS Certified", "PALS Certified", "BLS Certified"]
    },
    applications: [
      {
        id: 1,
        jobTitle: "Registered Nurse - ICU Specialist",
        company: "Royal London Hospital",
        location: "London, UK",
        status: "under_review",
        statusText: "Under Review",
        appliedDate: "2024-01-15",
        lastUpdate: "2024-01-20",
        salary: "£45,000 - £55,000",
        type: "Full-time",
        timeline: [
          { date: "2024-01-15", event: "Application Submitted", status: "completed" },
          { date: "2024-01-18", event: "Application Viewed", status: "completed" },
          { date: "2024-01-20", event: "Under Review", status: "current" },
          { date: "2024-01-25", event: "Interview Scheduled", status: "upcoming" }
        ],
        nextSteps: "The hiring team is reviewing your application. You may be contacted for an interview within the next week."
      },
      {
        id: 2,
        jobTitle: "Senior ICU Nurse",
        company: "St. Thomas Hospital",
        location: "London, UK",
        status: "interview",
        statusText: "Interview Scheduled",
        appliedDate: "2024-01-10",
        lastUpdate: "2024-01-22",
        salary: "£48,000 - £58,000",
        type: "Full-time",
        interviewDate: "2024-01-29",
        interviewTime: "14:00",
        interviewType: "Video Call",
        timeline: [
          { date: "2024-01-10", event: "Application Submitted", status: "completed" },
          { date: "2024-01-15", event: "Application Viewed", status: "completed" },
          { date: "2024-01-18", event: "Under Review", status: "completed" },
          { date: "2024-01-22", event: "Interview Scheduled", status: "current" },
          { date: "2024-01-29", event: "Technical Interview", status: "upcoming" }
        ],
        nextSteps: "Prepare for your video interview. The hiring manager will discuss your experience and clinical scenarios."
      },
      {
        id: 3,
        jobTitle: "Emergency Room Nurse",
        company: "Manchester General Hospital",
        location: "Manchester, UK",
        status: "offered",
        statusText: "Offer Received",
        appliedDate: "2024-01-05",
        lastUpdate: "2024-01-25",
        salary: "£42,000 - £52,000",
        type: "Full-time",
        offerAmount: "£48,000",
        offerDeadline: "2024-02-05",
        timeline: [
          { date: "2024-01-05", event: "Application Submitted", status: "completed" },
          { date: "2024-01-08", event: "Application Viewed", status: "completed" },
          { date: "2024-01-12", event: "First Interview", status: "completed" },
          { date: "2024-01-18", event: "Second Interview", status: "completed" },
          { date: "2024-01-25", event: "Offer Received", status: "current" }
        ],
        nextSteps: "Review the offer details and respond by February 5, 2024. Contact HR for any questions."
      }
    ],
    statistics: {
      totalApplications: 12,
      underReview: 3,
      interviews: 2,
      offers: 1,
      rejectionRate: "25%",
      averageResponseTime: "5 days"
    },
    savedOpportunities: [
      {
        id: 101,
        title: "Nurse Practitioner - Cardiology",
        company: "London Heart Clinic",
        location: "London, UK",
        salary: "£55,000 - £65,000",
        deadline: "2024-02-15",
        type: "Full-time"
      },
      {
        id: 102,
        title: "Clinical Nurse Specialist",
        company: "Imperial College Healthcare",
        location: "London, UK",
        salary: "£50,000 - £60,000",
        deadline: "2024-02-20",
        type: "Full-time"
      }
    ],
    billing: {
      balance: 125.00,
      bills: [
        {
          id: 1,
          name: "Premium Membership Fee",
          type: "Subscription",
          amount: 99.00,
          dueDate: "2024-02-01",
          status: "pending",
          description: "Monthly premium membership fee for enhanced job search features, priority application processing, and dedicated career support.",
          features: [
            "Priority application review",
            "Enhanced profile visibility",
            "Dedicated career coach",
            "Unlimited job applications",
            "Advanced analytics"
          ]
        },
        {
          id: 2,
          name: "Visa Processing Fee",
          type: "Service",
          amount: 26.00,
          dueDate: "2024-01-28",
          status: "overdue",
          description: "Administrative fee for international visa application processing and documentation support services.",
          features: [
            "Visa application review",
            "Document verification",
            "Processing assistance",
            "Status tracking"
          ]
        },
        {
          id: 3,
          name: "Background Check",
          type: "Verification",
          amount: 45.00,
          dueDate: "2024-02-15",
          status: "pending",
          description: "Comprehensive background verification and credential checking service for employment purposes.",
          features: [
            "Criminal record check",
            "Employment verification",
            "Education verification",
            "Professional license check"
          ]
        }
      ],
      paymentHistory: [
        {
          id: 1,
          description: "Premium Membership - December",
          amount: 99.00,
          date: "2023-12-01",
          status: "completed"
        },
        {
          id: 2,
          description: "Document Processing Fee",
          amount: 15.00,
          date: "2023-11-15",
          status: "completed"
        }
      ]
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      under_review: 'bg-yellow-100 text-yellow-800',
      interview: 'bg-blue-100 text-blue-800',
      offered: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      accepted: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      under_review: 'fas fa-eye',
      interview: 'fas fa-video',
      offered: 'fas fa-trophy',
      rejected: 'fas fa-times-circle',
      accepted: 'fas fa-check-circle',
      pending: 'fas fa-clock',
      overdue: 'fas fa-exclamation-triangle',
      completed: 'fas fa-check-circle'
    };
    return icons[status] || 'fas fa-clock';
  };

  const handlePayment = (bill) => {
    setSelectedBill(bill);
    setShowPaymentModal(true);
  };

  const processPayment = () => {
    // Handle payment processing logic here
    console.log('Processing payment for:', selectedBill);
    setShowPaymentModal(false);
    setSelectedBill(null);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'fas fa-home' },
    { id: 'applications', label: 'Applications', icon: 'fas fa-file-alt' },
    { id: 'saved', label: 'Saved', icon: 'fas fa-bookmark' },
    { id: 'billing', label: 'Billing', icon: 'fas fa-credit-card' },
    { id: 'profile', label: 'Profile', icon: 'fas fa-user' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center py-4">
            <a href="#" className="flex items-center text-xl md:text-2xl font-bold text-blue-800">
              <i className="fas fa-globe-americas mr-2 text-xl md:text-2xl"></i>
              <span className="hidden sm:inline">DreamExplore</span>
              <span className="sm:hidden">DE</span>
            </a>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-sm">
                Find Opportunities
              </button>
              <div className="relative">
                <button className="flex items-center space-x-3 bg-white border border-gray-200 rounded-xl px-4 py-2 hover:shadow-md transition-all duration-300">
                  <img 
                    src={applicantData.profile.profileImage} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-gray-700 font-medium hidden lg:inline">{applicantData.profile.name}</span>
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-2 md:hidden">
              <button className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-3 py-2 rounded-full font-semibold text-sm">
                <i className="fas fa-search"></i>
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-gray-600 text-lg`}></i>
              </button>
            </div>
          </nav>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <button className="flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-50 transition-colors duration-300">
                  <img 
                    src={applicantData.profile.profileImage} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <div className="font-semibold text-gray-800">{applicantData.profile.name}</div>
                    <div className="text-sm text-gray-600">View Profile</div>
                  </div>
                </button>
                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold">
                  Find New Opportunities
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-2xl shadow-xl p-6 mb-6 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {applicantData.profile.name}!</h1>
              <p className="text-blue-100 text-sm sm:text-lg">Track your applications and discover new opportunities</p>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-xl sm:text-2xl font-bold">{applicantData.statistics.totalApplications}</div>
              <div className="text-blue-100 text-sm">Total Applications</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Hidden on mobile, shown in tabs */}
          <div className="hidden lg:block lg:w-1/4">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="text-center">
                <img 
                  src={applicantData.profile.profileImage} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-blue-100"
                />
                <h3 className="text-lg font-bold text-gray-800 mb-1">{applicantData.profile.name}</h3>
                <p className="text-gray-600 text-sm mb-4">Registered Nurse</p>
                <button className="w-full bg-blue-50 text-blue-700 py-2 rounded-xl font-semibold hover:bg-blue-100 transition-all duration-300 text-sm">
                  <i className="fas fa-edit mr-2"></i>
                  Edit Profile
                </button>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center text-gray-600 text-sm">
                  <i className="fas fa-envelope mr-3 text-blue-600"></i>
                  <span className="truncate">{applicantData.profile.email}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <i className="fas fa-phone mr-3 text-blue-600"></i>
                  <span>{applicantData.profile.phone}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <i className="fas fa-map-marker-alt mr-3 text-blue-600"></i>
                  <span>{applicantData.profile.location}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="font-bold text-gray-800 mb-4">Application Stats</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Under Review</span>
                  <span className="font-bold text-yellow-600">{applicantData.statistics.underReview}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Interviews</span>
                  <span className="font-bold text-blue-600">{applicantData.statistics.interviews}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Offers</span>
                  <span className="font-bold text-green-600">{applicantData.statistics.offers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Response Time</span>
                  <span className="font-bold text-gray-600 text-sm">{applicantData.statistics.averageResponseTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Mobile Navigation Tabs */}
            <div className="lg:hidden bg-white rounded-2xl shadow-lg mb-6 overflow-x-auto">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-0 py-3 px-2 text-center transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    <i className={`${tab.icon} text-sm mb-1 block`}></i>
                    <span className="text-xs font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-lg mb-6">
              <div className="flex border-b border-gray-200">
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
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Recent Applications */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg md:text-xl font-bold text-gray-800">Recent Applications</h3>
                    <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    {applicantData.applications.slice(0, 2).map((application) => (
                      <div key={application.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300">
                        <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(application.status)}`}>
                            <i className={`${getStatusIcon(application.status)} text-sm`}></i>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{application.jobTitle}</h4>
                            <p className="text-gray-600 text-xs sm:text-sm">{application.company}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                            {application.statusText}
                          </span>
                          <p className="text-gray-500 text-xs mt-1">
                            Applied {new Date(application.appliedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Interviews */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6">Upcoming Interviews</h3>
                  <div className="space-y-4">
                    {applicantData.applications
                      .filter(app => app.status === 'interview')
                      .map((application) => (
                        <div key={application.id} className="p-4 border border-blue-200 rounded-xl bg-blue-50">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                            <div className="mb-3 sm:mb-0">
                              <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{application.jobTitle}</h4>
                              <p className="text-gray-600 text-xs sm:text-sm">{application.company}</p>
                              <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-600">
                                <span><i className="fas fa-calendar mr-1"></i> {new Date(application.interviewDate).toLocaleDateString()}</span>
                                <span><i className="fas fa-clock mr-1"></i> {application.interviewTime}</span>
                                <span><i className="fas fa-video mr-1"></i> {application.interviewType}</span>
                              </div>
                            </div>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm w-full sm:w-auto">
                              Join Interview
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6">All Applications</h3>
                <div className="space-y-4">
                  {applicantData.applications.map((application) => (
                    <div 
                      key={application.id} 
                      className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedApplication(application)}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                            <div>
                              <h4 className="text-base sm:text-lg font-semibold text-gray-800">{application.jobTitle}</h4>
                              <p className="text-gray-600 text-sm">{application.company} • {application.location}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium mt-2 sm:mt-0 ${getStatusColor(application.status)}`}>
                              {application.statusText}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="flex items-center text-gray-600">
                              <i className="fas fa-dollar-sign mr-2 text-blue-600"></i>
                              {application.salary}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <i className="fas fa-clock mr-2 text-blue-600"></i>
                              {application.type}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <i className="fas fa-calendar mr-2 text-blue-600"></i>
                              Applied {new Date(application.appliedDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <i className="fas fa-sync mr-2 text-blue-600"></i>
                              Updated {new Date(application.lastUpdate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                  <h3 className="text-lg md:text-xl font-bold text-gray-800">Billing & Payments</h3>
                  <div className="mt-2 sm:mt-0">
                    <span className="text-lg font-bold text-blue-600">Balance: ${applicantData.billing.balance}</span>
                  </div>
                </div>

                {/* Current Bills */}
                <div className="mb-8">
                  <h4 className="font-semibold text-gray-800 mb-4">Current Bills</h4>
                  <div className="space-y-4">
                    {applicantData.billing.bills.map((bill) => (
                      <div key={bill.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                          <div className="flex-1 mb-3 sm:mb-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <h5 className="font-semibold text-gray-800">{bill.name}</h5>
                                <p className="text-gray-600 text-sm">{bill.type}</p>
                              </div>
                              <div className="mt-2 sm:mt-0 text-right">
                                <span className="text-lg font-bold text-gray-800">${bill.amount}</span>
                                <div className="flex items-center justify-end mt-1">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                                    {bill.status === 'overdue' ? 'Overdue' : 'Pending'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mt-2">{bill.description}</p>
                            <div className="flex flex-wrap gap-1 mt-3">
                              {bill.features.slice(0, 3).map((feature, index) => (
                                <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                                  {feature}
                                </span>
                              ))}
                              {bill.features.length > 3 && (
                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                  +{bill.features.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 pt-4 border-t border-gray-200">
                          <div className="text-sm text-gray-600 mb-2 sm:mb-0">
                            Due: {new Date(bill.dueDate).toLocaleDateString()}
                          </div>
                          <button 
                            onClick={() => handlePayment(bill)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm w-full sm:w-auto"
                          >
                            Pay Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment History */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">Payment History</h4>
                  <div className="space-y-3">
                    {applicantData.billing.paymentHistory.map((payment) => (
                      <div key={payment.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-800 text-sm">{payment.description}</div>
                          <div className="text-gray-500 text-xs">{new Date(payment.date).toLocaleDateString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-800">${payment.amount}</div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                            Paid
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs remain the same as before */}
            {activeTab === 'saved' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6">Saved Opportunities</h3>
                <div className="grid grid-cols-1 gap-6">
                  {applicantData.savedOpportunities.map((opportunity) => (
                    <div key={opportunity.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div className="mb-3 sm:mb-0">
                          <h4 className="font-semibold text-gray-800">{opportunity.title}</h4>
                          <p className="text-gray-600 text-sm">{opportunity.company} • {opportunity.location}</p>
                        </div>
                        <button className="text-red-500 hover:text-red-700 self-start">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600 mt-3">
                        <div className="flex justify-between">
                          <span>Salary:</span>
                          <span className="font-semibold">{opportunity.salary}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span>{opportunity.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Deadline:</span>
                          <span>{new Date(opportunity.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4">
                        <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm">
                          Apply Now
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-sm">
                          <i className="fas fa-ellipsis-h"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6">My Profile</h3>
                <div className="grid grid-cols-1 gap-6">
                  {/* Personal Information */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4">Personal Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input 
                          type="text" 
                          defaultValue={applicantData.profile.name}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input 
                          type="email" 
                          defaultValue={applicantData.profile.email}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input 
                          type="tel" 
                          defaultValue={applicantData.profile.phone}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Skills & Certifications */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4">Professional Details</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                        <div className="flex flex-wrap gap-2">
                          {applicantData.profile.skills.map((skill, index) => (
                            <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-8">
                  <button className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-300 text-sm">
                    Cancel
                  </button>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-300 text-sm">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Make Payment</h2>
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                  <i className="fas fa-times text-lg"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">{selectedBill.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{selectedBill.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Amount Due:</span>
                  <span className="text-2xl font-bold text-blue-600">${selectedBill.amount}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                  <input 
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                    <input 
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                    <input 
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Holder Name</label>
                  <input 
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button 
                  onClick={processPayment}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-300"
                >
                  Pay ${selectedBill.amount}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Detail Modal (same as before) */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* ... application detail modal content ... */}
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicantDashboard;