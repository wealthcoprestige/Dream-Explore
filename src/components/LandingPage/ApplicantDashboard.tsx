"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AxiosError } from "axios";
import api from "../axios/axiosInsatance";

interface User {
  id: string;
  username: string | null;
  email: string;
  date_joined: string;
}

interface Applicant {
  id: string;
  user: User;
  updated_at: string;
  created_at: string;
  full_name: string;
  email: string;
  phone_number: string;
  whats_app: string;
  location: string;
  passport_number: string;
  nationality: string;
  id_card: string;
  card_image_front: string;
  card_image_back: string;
  date_of_birth: string;
  profile_photo: string;
  bio: string;
  linkedin_profile: string | null;
  website_or_portfolio: string | null;
  languages_spoken: string | null;
  education: string;
}

interface Campaign {
  id: string;
  title: string;
  image: string;
  location: string;
  country: string;
  city: string;
  category: {
    name: string;
  };
  employment_type: string;
  description: string;
  duration: string;
}

interface Application {
  id: string;
  updated_at: string;
  created_at: string;
  application_id: string;
  resume: string;
  certification: string;
  cover_letter: string;
  available_start_date: string;
  status: string;
  qualification: string;
  applicant: string;
  campaign: Campaign; // Updated to be a Campaign object
}

interface Appointment {
  id: string;
  updated_at: string;
  created_at: string;
  customer_email: string | null;
  description: string;
  meeting_link: string;
  status: string;
  applicant: string;
  slot: string;
}

interface Billing {
  id: string;
  updated_at: string;
  created_at: string;
  name: string;
  currency: string;
  charged_currency: string;
  amount: string;
  charged_amount: string;
  status: string;
  applicant: string;
  campaign: string;
}

interface DashboardData {
  applicant: Applicant;
  applicant_applicantions: Application[];
  applicant_appointment: Appointment[];
  applicant_billings: Billing[];
}

function ApplicantDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Billing | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [otherOpportunities, setOtherOpportunities] = useState<Campaign[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [dashboardResponse, campaignsResponse] = await Promise.all([
        api.get<DashboardData>("dashboard/applicant/"),
        api.get<{ results: Campaign[] }>("/campaigns/"),
      ]);

      setDashboardData(dashboardResponse);

      // Filter out campaigns the user has already applied to
      const appliedCampaignIds = new Set(
        dashboardResponse.applicant_applicantions.map((app) => app.campaign.id)
      );

      const filteredCampaigns = campaignsResponse.results.filter(
        (campaign) => !appliedCampaignIds.has(campaign.id)
      );
      setOtherOpportunities(filteredCampaigns);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.message ||
            "Failed to load dashboard data. Please try again."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get full image URL
  const getImageUrl = (imagePath: string | undefined): string => {
    if (!imagePath)
      return "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80"; // Fallback image
    if (imagePath.startsWith("http")) return imagePath;
    return `http://127.0.0.1:8000${imagePath}`;
  };
  // Calculate statistics from the API data
  const calculateStatistics = () => {
    if (!dashboardData) return null;

    const applications = dashboardData.applicant_applicantions;
    const totalApplications = applications.length;
    const underReview = applications.filter(
      (app) => app.status === "SUBMITTED"
    ).length;
    const interviews = dashboardData.applicant_appointment.length;
    const offers = applications.filter(
      (app) => app.status === "ACCEPTED"
    ).length;

    return {
      totalApplications,
      underReview,
      interviews,
      offers,
      rejectionRate: "0%", // You might want to calculate this based on your statuses
      averageResponseTime: "2 days", // This would need to be calculated from your data
    };
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      SUBMITTED: "bg-yellow-100 text-yellow-800",
      UNDER_REVIEW: "bg-yellow-100 text-yellow-800",
      INTERVIEW: "bg-blue-100 text-blue-800",
      ACCEPTED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
      overdue: "bg-red-100 text-red-800",
      completed: "bg-green-100 text-green-800",
      scheduled: "bg-blue-100 text-blue-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: string } = {
      SUBMITTED: "fas fa-paper-plane",
      UNDER_REVIEW: "fas fa-eye",
      INTERVIEW: "fas fa-video",
      ACCEPTED: "fas fa-trophy",
      REJECTED: "fas fa-times-circle",
      pending: "fas fa-clock",
      overdue: "fas fa-exclamation-triangle",
      completed: "fas fa-check-circle",
      scheduled: "fas fa-calendar-check",
    };
    return icons[status] || "fas fa-clock";
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      SUBMITTED: "Submitted",
      UNDER_REVIEW: "Under Review",
      INTERVIEW: "Interview",
      ACCEPTED: "Accepted",
      REJECTED: "Rejected",
      pending: "Pending",
      scheduled: "Scheduled",
    };
    return statusMap[status] || status;
  };

  const handlePayment = (bill: Billing) => {
    setSelectedBill(bill);
    setShowPaymentModal(true);
  };

  const processPayment = () => {
    // Handle payment processing logic here
    console.log("Processing payment for:", selectedBill);
    setShowPaymentModal(false);
    setSelectedBill(null);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "fas fa-home" },
    { id: "applications", label: "Applications", icon: "fas fa-file-alt" },
    { id: "appointment", label: "Appointments", icon: "fas fa-calendar" },
    { id: "billing", label: "Billing", icon: "fas fa-credit-card" },
    { id: "profile", label: "Profile", icon: "fas fa-user" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No data available</p>
        </div>
      </div>
    );
  }

  const statistics = calculateStatistics();
  const {
    applicant,
    applicant_applicantions,
    applicant_appointment,
    applicant_billings,
  } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center py-4">
            <a
              href="#"
              className="flex items-center text-xl md:text-2xl font-bold text-blue-800"
            >
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
                  <Image
                    src={getImageUrl(applicant.profile_photo)}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-gray-700 font-medium hidden lg:inline">
                    {applicant.full_name}
                  </span>
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
                <i
                  className={`fas ${
                    isMobileMenuOpen ? "fa-times" : "fa-bars"
                  } text-gray-600 text-lg`}
                ></i>
              </button>
            </div>
          </nav>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <button className="flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-50 transition-colors duration-300">
                  <Image
                    src={getImageUrl(applicant.profile_photo)}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <div className="font-semibold text-gray-800">
                      {applicant.full_name}
                    </div>
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
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Welcome back, {applicant.full_name}!
              </h1>
              <p className="text-blue-100 text-sm sm:text-lg">
                Track your applications and discover new opportunities
              </p>
            </div>
            {statistics && (
              <div className="text-center sm:text-right">
                <div className="text-xl sm:text-2xl font-bold">
                  {statistics.totalApplications}
                </div>
                <div className="text-blue-100 text-sm">Total Applications</div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="hidden lg:block lg:w-1/4">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="text-center">
                <Image
                  src={getImageUrl(applicant.profile_photo)}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-blue-100"
                />
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  {applicant.full_name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {applicant.nationality}
                </p>
                <button className="w-full bg-blue-50 text-blue-700 py-2 rounded-xl font-semibold hover:bg-blue-100 transition-all duration-300 text-sm">
                  <i className="fas fa-edit mr-2"></i>
                  Edit Profile
                </button>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center text-gray-600 text-sm">
                  <i className="fas fa-envelope mr-3 text-blue-600"></i>
                  <span className="truncate">{applicant.email}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <i className="fas fa-phone mr-3 text-blue-600"></i>
                  <span>{applicant.phone_number}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <i className="fas fa-map-marker-alt mr-3 text-blue-600"></i>
                  <span>{applicant.location}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            {statistics && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h4 className="font-bold text-gray-800 mb-4">
                  Application Stats
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Under Review</span>
                    <span className="font-bold text-yellow-600">
                      {statistics.underReview}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Interviews</span>
                    <span className="font-bold text-blue-600">
                      {statistics.interviews}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Offers</span>
                    <span className="font-bold text-green-600">
                      {statistics.offers}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Response Time</span>
                    <span className="font-bold text-gray-600 text-sm">
                      {statistics.averageResponseTime}
                    </span>
                  </div>
                </div>
              </div>
            )}
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
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-blue-600"
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
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Recent Applications */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg md:text-xl font-bold text-gray-800">
                      Recent Applications
                    </h3>
                    <button
                      onClick={() => setActiveTab("applications")}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center"
                    >
                      View All <i className="fas fa-arrow-right ml-2"></i>
                    </button>
                  </div>
                  <div className="space-y-4">
                    {applicant_applicantions.slice(0, 2).map((application) => (
                      <div
                        key={application.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                          <Image
                            src={getImageUrl(application.campaign.image)}
                            alt={application.campaign.title || "Campaign"}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                              {application.campaign_details?.title ||
                                `Application #${application.application_id}`}
                            </h4>
                            <p className="text-gray-600 text-xs sm:text-sm">
                              Submitted{" "}
                              {new Date(
                                application.created_at
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              application.status
                            )}`}
                          >
                            {getStatusText(application.status)}
                          </span>
                          <p className="text-gray-500 text-xs mt-1">
                            Updated{" "}
                            {new Date(
                              application.updated_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Appointments */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6">
                    Upcoming Appointments
                  </h3>
                  <div className="space-y-4">
                    {applicant_appointment.slice(0, 2).map((appointment) => (
                      <div
                        key={appointment.id}
                        className="p-4 border border-blue-200 rounded-xl bg-blue-50"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                          <div className="mb-3 sm:mb-0">
                            <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                              Appointment
                            </h4>
                            <p className="text-gray-600 text-xs sm:text-sm">
                              {appointment.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-600">
                              <span>
                                <i className="fas fa-calendar mr-1"></i>{" "}
                                {new Date(
                                  appointment.created_at
                                ).toLocaleDateString()}
                              </span>
                              <span>
                                <i className="fas fa-link mr-1"></i> Meeting
                                Link Available
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              window.open(appointment.meeting_link, "_blank")
                            }
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm w-full sm:w-auto"
                          >
                            Join Meeting
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "applications" && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6">
                  All Applications ({applicant_applicantions.length})
                </h3>
                <div className="space-y-4">
                  {applicant_applicantions.map((application) => (
                    <div
                      key={application.id}
                      className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedApplication(application)}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                            <div className="flex items-center space-x-4">
                              <Image
                                src={getImageUrl(application.campaign.image)}
                                alt={application.campaign.title || "Campaign"}
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div>
                                <h4 className="text-base sm:text-lg font-semibold text-gray-800">
                                  {application.campaign.title ||
                                    `Application #${application.application_id}`}
                                </h4>
                                <p className="text-gray-600 text-sm">
                                  {application.campaign.location}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium mt-2 sm:mt-0 ${getStatusColor(
                                application.status
                              )}`}
                            >
                              {getStatusText(application.status)}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="flex items-center text-gray-600">
                              <i className="fas fa-file-pdf mr-2 text-blue-600"></i>
                              <a
                                href={application.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-600"
                              >
                                View Resume
                              </a>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <i className="fas fa-calendar mr-2 text-blue-600"></i>
                              Available from{" "}
                              {new Date(
                                application.available_start_date
                              ).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <i className="fas fa-calendar mr-2 text-blue-600"></i>
                              Applied{" "}
                              {new Date(
                                application.created_at
                              ).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <i className="fas fa-sync mr-2 text-blue-600"></i>
                              Updated{" "}
                              {new Date(
                                application.updated_at
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Other Opportunities Section */}
                <div className="mt-8">
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6">
                    Other Opportunities You Might Like
                  </h3>
                  {otherOpportunities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {otherOpportunities.map((opportunity) => (
                        <div
                          key={opportunity.id}
                          className="bg-white rounded-2xl shadow-lg overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group border border-gray-100"
                        >
                          <div className="relative h-40 overflow-hidden">
                            <Image
                              src={getImageUrl(opportunity.image)}
                              alt={opportunity.title}
                              width={400}
                              height={160}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-3 right-3 bg-blue-800 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              {opportunity.category.name}
                            </div>
                          </div>
                          <div className="p-5">
                            <h4 className="text-md font-bold text-gray-800 mb-2 line-clamp-2">
                              {opportunity.title}
                            </h4>
                            <div className="flex justify-between text-gray-500 text-xs mb-3">
                              <span className="flex items-center">
                                <i className="fas fa-map-marker-alt mr-2 text-blue-600"></i>
                                {opportunity.location}
                              </span>
                              <span className="flex items-center">
                                <i className="fas fa-clock mr-2 text-blue-600"></i>
                                {opportunity.duration}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {opportunity.description}
                            </p>
                            <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 text-sm">
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-xl">
                      <p className="text-gray-600">
                        You've applied to all available opportunities. Check
                        back later!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "appointment" && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6">
                  All Appointments
                </h3>
                <div className="space-y-4">
                  {applicant_appointment.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                            <div>
                              <h4 className="text-base sm:text-lg font-semibold text-gray-800">
                                Appointment
                              </h4>
                              <p className="text-gray-600 text-sm">
                                {appointment.description}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium mt-2 sm:mt-0 ${getStatusColor(
                                appointment.status
                              )}`}
                            >
                              {getStatusText(appointment.status)}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="flex items-center text-gray-600">
                              <i className="fas fa-envelope mr-2 text-blue-600"></i>
                              {appointment.customer_email ||
                                "No email provided"}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <i className="fas fa-link mr-2 text-blue-600"></i>
                              <a
                                href={appointment.meeting_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-600"
                              >
                                Meeting Link
                              </a>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <i className="fas fa-calendar mr-2 text-blue-600"></i>
                              Created{" "}
                              {new Date(
                                appointment.created_at
                              ).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <i className="fas fa-sync mr-2 text-blue-600"></i>
                              Updated{" "}
                              {new Date(
                                appointment.updated_at
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <button
                          onClick={() =>
                            window.open(appointment.meeting_link, "_blank")
                          }
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm"
                        >
                          Join Meeting
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "billing" && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                  <h3 className="text-lg md:text-xl font-bold text-gray-800">
                    Billing & Payments
                  </h3>
                  <div className="mt-2 sm:mt-0">
                    <span className="text-lg font-bold text-blue-600">
                      Total Due:{" "}
                      {applicant_billings
                        .reduce((sum, bill) => sum + parseFloat(bill.amount), 0)
                        .toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Current Bills */}
                <div className="mb-8">
                  <h4 className="font-semibold text-gray-800 mb-4">
                    Current Bills
                  </h4>
                  <div className="space-y-4">
                    {applicant_billings.map((bill) => (
                      <div
                        key={bill.id}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                          <div className="flex-1 mb-3 sm:mb-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <h5 className="font-semibold text-gray-800">
                                  {bill.name}
                                </h5>
                                <p className="text-gray-600 text-sm">
                                  Campaign: {bill.campaign}
                                </p>
                              </div>
                              <div className="mt-2 sm:mt-0 text-right">
                                <span className="text-lg font-bold text-gray-800">
                                  {bill.currency} {bill.amount}
                                </span>
                                <div className="flex items-center justify-end mt-1">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                      bill.status
                                    )}`}
                                  >
                                    {getStatusText(bill.status)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mt-2">
                              Charged Amount: {bill.charged_currency}{" "}
                              {bill.charged_amount}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 pt-4 border-t border-gray-200">
                          <div className="text-sm text-gray-600 mb-2 sm:mb-0">
                            Created:{" "}
                            {new Date(bill.created_at).toLocaleDateString()}
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
              </div>
            )}

            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6">
                  My Profile
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  {/* Personal Information */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4">
                      Personal Information
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue={applicant.full_name}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          defaultValue={applicant.email}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          defaultValue={applicant.phone_number}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          defaultValue={applicant.location}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nationality
                        </label>
                        <input
                          type="text"
                          defaultValue={applicant.nationality}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bio
                        </label>
                        <textarea
                          defaultValue={applicant.bio}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
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
                <h2 className="text-xl font-bold text-gray-800">
                  Make Payment
                </h2>
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
                <h3 className="font-semibold text-gray-800 mb-2">
                  {selectedBill.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Campaign: {selectedBill.campaign}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Amount Due:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {selectedBill.currency} {selectedBill.amount}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-700">Charged Amount:</span>
                  <span className="text-lg font-semibold text-gray-800">
                    {selectedBill.charged_currency}{" "}
                    {selectedBill.charged_amount}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Holder Name
                  </label>
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
                  Pay {selectedBill.currency} {selectedBill.amount}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Application #{selectedApplication.application_id}
                </h2>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
                >
                  <i className="fas fa-times text-lg"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">
                    Application Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          selectedApplication.status
                        )}`}
                      >
                        {getStatusText(selectedApplication.status)}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Campaign ID
                      </label>
                      <p className="text-gray-600">
                        {selectedApplication.campaign}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Available Start Date
                      </label>
                      <p className="text-gray-600">
                        {new Date(
                          selectedApplication.available_start_date
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">
                    Documents
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Resume
                      </label>
                      <a
                        href={selectedApplication.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <i className="fas fa-file-pdf mr-2"></i>
                        View Resume
                      </a>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Certification
                      </label>
                      <a
                        href={selectedApplication.certification}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <i className="fas fa-file-pdf mr-2"></i>
                        View Certification
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Cover Letter
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-600 text-sm">
                    {selectedApplication.cover_letter}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Qualification
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-600 text-sm">
                    {selectedApplication.qualification}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setSelectedApplication(null)}
                className="w-full px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicantDashboard;
